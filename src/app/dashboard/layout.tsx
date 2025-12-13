
'use client';

import { SiteHeader } from "@/components/common/site-header";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "@/hooks/use-local-storage";

// Define a simple type for the profile for this check
type UserProfile = {
  id?: string;
  name?: string;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [userProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait until the initial Firebase auth check is complete.
    if (isUserLoading) {
      return;
    }

    // If auth check is done and there's no user, redirect to login.
    if (!user) {
      router.replace("/");
      return;
    }

    // If there IS a user, check if their profile is set up.
    // A simple check for `id` or `name` is sufficient here.
    if (!userProfile || !userProfile.id) {
      // If profile is incomplete, redirect to the creation page.
      router.replace("/profile/create");
    } else {
      // If user exists and profile is set up, we're good to go.
      setIsChecking(false);
    }
  }, [user, isUserLoading, userProfile, router]);

  // While loading or checking, show a skeleton screen.
  if (isUserLoading || isChecking) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-20" />
            </div>
        </header>
        <main className="flex-1 p-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
        </main>
      </div>
    );
  }

  // If everything is loaded and checked, render the full dashboard.
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
