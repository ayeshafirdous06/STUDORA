
'use client';

import { SiteHeader } from "@/components/common/site-header";
import { FirebaseClientProvider } from "@/firebase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </FirebaseClientProvider>
  );
}
