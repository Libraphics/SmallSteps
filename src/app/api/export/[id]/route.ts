import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function markdownReport(objective: any) {
  const lines = [
    `# SmallSteps Report`,
    ``,
    `## Objective`,
    `**Title:** ${objective.title}`,
    `**Timeframe:** ${new Date(objective.createdAt).toISOString()} → ${new Date().toISOString()}`,
    ``,
    `## Steps`
  ];
  objective.suggestions.forEach((s: any, i: number) => {
    const step = s.stepJson;
    lines.push(`${i + 1}. **${step.step_title || step.question || 'Step'}** - ${s.status} (${new Date(s.createdAt).toISOString()})`);
  });
  lines.push('', '## Summary', `Planned: ${objective.suggestions.filter((s: any) => s.status === 'planned').length}`);
  lines.push(`Done: ${objective.suggestions.filter((s: any) => s.status === 'done').length}`);
  lines.push(`Skipped: ${objective.suggestions.filter((s: any) => s.status === 'skipped').length}`);
  return lines.join('\n');
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const objective = await prisma.objective.findUnique({ where: { id: params.id }, include: { suggestions: true } });
  if (!objective) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const type = req.nextUrl.searchParams.get('type') || 'md';
  const md = markdownReport(objective);

  if (type === 'pdf') {
    return new NextResponse('PDF export is generated client-side in production deployment.\n\n' + md, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="smallsteps-${objective.id}.pdf"`
      }
    });
  }

  return new NextResponse(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="smallsteps-${objective.id}.md"`
    }
  });
}
