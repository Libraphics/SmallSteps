'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    setDark(root.classList.contains('dark'));
  }, []);

  return (
    <button
      onClick={() => {
        const root = document.documentElement;
        root.classList.toggle('dark');
        setDark(root.classList.contains('dark'));
      }}
      className="rounded-xl border px-3 py-1 text-sm"
    >
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
