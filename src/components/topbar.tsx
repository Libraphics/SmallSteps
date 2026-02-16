import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function TopBar({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
          <Image src="/brand/smallsteps-icon.svg" alt="SmallSteps" width={28} height={28} />
          <span className="font-semibold tracking-tight">SmallSteps</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10" href="/en/dashboard">EN</Link>
          <Link className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10" href="/ar/dashboard">AR</Link>
        </div>
      <ThemeToggle />
        </div>
    </header>
  );
}
