
'use client';

import { SiteHeader } from "@/components/common/site-header";
import { useUser, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Wait until Firebase has finished its initial user loading.
    if (isUserLoading) {
      return; 
    }

    // If there's no user after loading, they are not logged in.
    if (!user) {
      router.replace("/");
      return;
    }

    // At this point, the user is authenticated. Now check for their profile.
    const checkForProfile = async () => {
      // If profile is in local storage, we are good.
      if (userProfile && userProfile.id === user.uid) {
        setAuthChecked(true);
        return;
      }

      // If not, fetch from Firestore.
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const profileData = { id: user.uid, ...userDocSnap.data() } as UserProfile;
          setUserProfile(profileData); // Cache for next time.
        } else {
          // This is a new user, redirect to create their profile.
          router.replace('/profile/create');
          return;
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Optionally, redirect to an error page.
      } finally {
        setAuthChecked(true);
      }
    };

    checkForProfile();

  }, [user, isUserLoading, router, firestore, userProfile, setUserProfile]);

  // Show a loading screen until all authentication and profile checks are complete.
  if (!authChecked) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-20" />
            </div>
        </header>
        <main className="flex-1 p-8">
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
                 <div className="flex items-center space-x-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-muted-foreground">Signing in...</span>
                </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
