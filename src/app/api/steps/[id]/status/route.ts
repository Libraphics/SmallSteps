import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const status = String(formData.get('status') || 'proposed') as 'proposed' | 'planned' | 'done' | 'skipped';
  const reason = String(formData.get('skipReason') || '');
  const step = await prisma.stepSuggestion.update({
    where: { id: params.id },
    data: {
      status,
      skipReason: status === 'skipped' ? reason || 'irrelevant' : null
    }
  });
  return NextResponse.redirect(new URL(`/en/objective/${step.objectiveId}`, req.url));
}
