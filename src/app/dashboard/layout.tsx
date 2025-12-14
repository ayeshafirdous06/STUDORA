
'use client';

import { SiteHeader } from "@/components/common/site-header";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FirebaseClientProvider, useFirebase, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { doc, getDoc } from "firebase/firestore";


function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [userProfile, setUserProfile] = useLocalStorage('userProfile', null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Don't run auth check until Firebase has determined the user state
    if (isUserLoading) {
      return; 
    }

    // If no user is logged in, redirect to login page
    if (!user) {
      router.replace('/login');
      return;
    }
    
    // If we have a user from Firebase, check for the app profile
    if (user) {
        // 1. Check local storage first. If it's there and matches the current user, we're good.
        if (userProfile && userProfile.id === user.uid) {
            setAuthChecked(true);
            return;
        }

        // 2. If not in local storage (or doesn't match), fetch from Firestore
        const fetchProfile = async () => {
            if (!firestore) return;
            const userDocRef = doc(firestore, 'users', user.uid);
            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const profileData = userDoc.data();
                    setUserProfile({ id: user.uid, ...profileData }); // Save to local storage
                    setAuthChecked(true); // Allow access
                } else {
                    // Profile doesn't exist in the database, so they need to create one.
                    router.replace('/profile/create');
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // On error, redirect to login as a fallback
                router.replace('/login');
            }
        };

        fetchProfile();
    }

  }, [user, isUserLoading, userProfile, router, firestore, setUserProfile]);


  // While we're checking for auth state or profile, show a loading spinner
  if (!authChecked || isUserLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Signing in...</span>
        </div>
      </div>
    );
  }

  // If checks are complete and successful, render the protected content
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
