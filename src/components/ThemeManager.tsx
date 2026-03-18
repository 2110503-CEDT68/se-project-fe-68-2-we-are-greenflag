'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ThemeManager() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isAdmin]);

  return null;
}
