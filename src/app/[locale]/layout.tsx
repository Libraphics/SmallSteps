import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { TopBar } from '@/components/topbar';

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = await getMessages();
  const dir = params.locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <NextIntlClientProvider messages={messages}>
      <div dir={dir} className="min-h-screen bg-gradient-to-b from-white to-brand-50 dark:from-slate-950 dark:to-slate-900">
        <TopBar locale={params.locale} />
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
