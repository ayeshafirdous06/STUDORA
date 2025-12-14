
'use client';

import { SiteHeader } from "@/components/common/site-header";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FirebaseClientProvider, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";


function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [userProfile] = useLocalStorage('userProfile', null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait for Firebase to determine auth state
    }

    if (user) {
      // User is authenticated with Firebase, now check for our app profile
      if (userProfile && userProfile.id === user.uid) {
         setAuthChecked(true); // Profile exists and matches, allow access
      } else {
        // This could happen if they logged in but didn't finish profile creation.
        // Or if local storage was cleared.
        router.replace('/profile/create');
      }
    } else {
      // No user from Firebase, redirect to login
      router.replace('/login');
    }

  }, [user, isUserLoading, userProfile, router]);


  if (!authChecked || isUserLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Verifying access...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


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
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </FirebaseClientProvider>
  );
}
