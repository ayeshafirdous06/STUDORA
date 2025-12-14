
'use client';

import { SiteHeader } from "@/components/common/site-header";
import { useUser, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isUserLoading) {
      return; 
    }

    if (!user) {
      router.replace("/");
      return;
    }

    const checkForProfile = async () => {
      const localProfile = localStorage.getItem('userProfile');
      if (localProfile) {
        const parsedProfile = JSON.parse(localProfile);
        if (parsedProfile.id === user.uid) {
           setAuthChecked(true);
           return;
        }
      }

      try {
        if (!firestore) {
          console.error("Firestore not available");
          setAuthChecked(true); 
          return;
        }
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const profileData = { id: user.uid, ...userDocSnap.data() } as UserProfile;
          localStorage.setItem('userProfile', JSON.stringify(profileData));
        } else {
          router.replace('/profile/create');
          return;
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setAuthChecked(true);
      }
    };

    checkForProfile();

  }, [user, isUserLoading, router, firestore]);

  if (!authChecked || isUserLoading) {
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
