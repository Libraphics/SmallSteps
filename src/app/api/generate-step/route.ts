import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { generateStepWithValidation } from '@/lib/llm';
import { createFingerprint } from '@/lib/fingerprint';
import { checkRateLimit } from '@/lib/rate-limit';
import { jaccardSimilarity } from '@/lib/utils';
import { createHash } from 'crypto';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const objectiveId = String(formData.get('objectiveId'));
  const userId = (session.user as any).id as string;

  const userLimit = checkRateLimit(`u:${userId}`, 30, 24 * 60 * 60 * 1000);
  if (!userLimit.allowed) return NextResponse.json({ error: 'Daily limit reached' }, { status: 429 });

  const objectiveLimit = checkRateLimit(`o:${objectiveId}`, 10, 60 * 60 * 1000);
  if (!objectiveLimit.allowed) return NextResponse.json({ error: 'Hourly objective limit reached' }, { status: 429 });

  const objective = await prisma.objective.findFirst({ where: { id: objectiveId, userId }, include: { suggestions: true } });
  if (!objective) return NextResponse.json({ error: 'Objective not found' }, { status: 404 });

  const blockedFingerprints = objective.suggestions.map((s) => s.fingerprint);
  const blockedExamples = objective.suggestions.map((s) => (s.stepJson as any)?.step_title).filter(Boolean);

  const step = await generateStepWithValidation({
    objectiveTitle: objective.title,
    description: objective.description,
    constraints: objective.constraintsJson ? JSON.stringify(objective.constraintsJson) : null,
    privateMode: objective.privateMode,
    blockedFingerprints,
    blockedExamples
  });

  let fingerprint = 'clarification';
  if (!step.needs_clarification && step.fingerprint_parts) {
    fingerprint = createFingerprint(step.fingerprint_parts);
    if (blockedFingerprints.includes(fingerprint)) {
      return NextResponse.json({ error: 'Duplicate step blocked. Regenerate again.' }, { status: 409 });
    }
    const tooSimilar = blockedExamples.some((b) => jaccardSimilarity(b, step.step_title ?? '') > 0.8);
    if (tooSimilar) return NextResponse.json({ error: 'Near-duplicate step blocked. Regenerate again.' }, { status: 409 });
  }

  const promptHash = createHash('sha256').update(objective.title).digest('hex').slice(0, 16);

  await prisma.stepSuggestion.create({
    data: {
      objectiveId,
      model: 'gpt-4o-mini',
      promptHash,
      stepJson: step,
      fingerprint,
      status: 'proposed'
    }
  });

  return NextResponse.redirect(new URL(`/en/objective/${objectiveId}`, req.url));
}
