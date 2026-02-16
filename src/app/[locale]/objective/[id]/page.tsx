import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';

export default async function ObjectivePage({ params }: { params: { id: string; locale: string } }) {
  const t = await getTranslations();
  const session = await auth();
  if (!session?.user) return <div className="card">Please login first.</div>;

  const objective = await prisma.objective.findFirst({
    where: { id: params.id, userId: (session.user as any).id },
    include: { suggestions: { orderBy: { createdAt: 'desc' } } }
  });
  if (!objective) return <div className="card">Objective not found.</div>;

  const done = objective.suggestions.filter((s) => s.status === 'done').length;
  const planned = objective.suggestions.filter((s) => s.status === 'planned').length;
  const skipped = objective.suggestions.filter((s) => s.status === 'skipped').length;

  return (
    <div className="space-y-4">
      <section className="card">
        <h1 className="text-xl font-semibold">{objective.title}</h1>
        {objective.privateMode && <p className="text-sm text-amber-500">Private mode enabled: model receives redacted context only.</p>}
        <form action="/api/generate-step" method="post" className="mt-3 flex gap-2 items-center">
          <input type="hidden" name="objectiveId" value={objective.id} />
          <button className="rounded-xl bg-brand-600 text-white px-4 py-2">{t('generate')}</button>
        </form>
      </section>

      <section className="card">
        <h2 className="font-semibold mb-2">Progress</h2>
        <p>Planned: {planned} | Done: {done} | Skipped: {skipped}</p>
      </section>

      <section className="card">
        <h2 className="font-semibold mb-2">Suggestions</h2>
        <div className="space-y-3">
          {objective.suggestions.map((s) => {
            const step = s.stepJson as any;
            return (
              <article key={s.id} className="border rounded-xl p-4">
                {step.needs_clarification ? (
                  <p className="font-medium">❓ {step.question}</p>
                ) : (
                  <>
                    <h3 className="font-medium">{step.step_title}</h3>
                    <p className="text-sm opacity-80">{step.expected_outcome}</p>
                    <p className="text-sm">{step.estimated_minutes} min • {step.dependency}</p>
                  </>
                )}
                <form action={`/api/steps/${s.id}/status`} method="post" className="flex flex-wrap gap-2 mt-3">
                  <button name="status" value="planned" className="px-3 py-1 rounded bg-indigo-100 text-indigo-700">{t('planned')}</button>
                  <button name="status" value="done" className="px-3 py-1 rounded bg-emerald-100 text-emerald-700">{t('done')}</button>
                  <button name="status" value="skipped" className="px-3 py-1 rounded bg-rose-100 text-rose-700">{t('notApplicable')}</button>
                </form>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card">
        <form action={`/api/export/${objective.id}`} method="get" className="flex gap-2">
          <button name="type" value="md" className="rounded-xl bg-slate-900 text-white px-4 py-2">Export Markdown</button>
          <button name="type" value="pdf" className="rounded-xl bg-slate-900 text-white px-4 py-2">Export PDF</button>
        </form>
      </section>
    </div>
  );
}
