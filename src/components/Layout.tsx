import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="p-8 bg-zinc-900 text-white min-h-screen flex flex-col gap-4 justify-center items-center">
      {children}
    </main>
  );
}
