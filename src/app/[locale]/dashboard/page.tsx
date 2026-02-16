import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';

export default async function Dashboard({ params }: { params: { locale: string } }) {
  const t = await getTranslations();
  const session = await auth();
  const objectives = session?.user
    ? await prisma.objective.findMany({ where: { userId: (session.user as any).id }, orderBy: { updatedAt: 'desc' } })
    : [];

  return (
    <div className="space-y-4">
      <section className="card bg-brand-gradient text-white">
        <h1 className="text-2xl font-bold">SmallSteps</h1>
        <p>{t('onboarding')}</p>
      </section>

      <section className="card">
        <h2 className="font-semibold mb-2">Objectives</h2>
        <form action="/api/objectives" method="post" className="grid gap-2 md:grid-cols-4 mb-4">
          <input name="title" required placeholder="Objective title" className="rounded-xl border px-3 py-2 text-black" />
          <input name="description" placeholder="Description" className="rounded-xl border px-3 py-2 text-black" />
          <select name="privateMode" className="rounded-xl border px-3 py-2 text-black">
            <option value="false">Normal</option>
            <option value="true">Private Mode</option>
          </select>
          <button className="rounded-xl bg-brand-600 text-white px-4 py-2">Create</button>
        </form>
        <ul className="space-y-2">
          {objectives.map((o) => (
            <li key={o.id} className="border rounded-xl p-3 flex justify-between">
              <div>
                <p className="font-medium">{o.title}</p>
                <p className="text-sm opacity-70">{o.status}</p>
              </div>
              <Link className="text-brand-600" href={`/${params.locale}/objective/${o.id}`}>Open</Link>
            </li>
          ))}
          {objectives.length === 0 && <li className="text-sm opacity-70">No objectives yet.</li>}
        </ul>
      </section>
    </div>
  );
}
