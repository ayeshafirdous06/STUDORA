
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
    // This is a temporary bypass for development.
    // We will revisit and fix the authentication flow later.
    if (process.env.NODE_ENV === 'development') {
      const mockUserProfile = {
        id: 'dev-user',
        name: 'Dev User',
        username: 'dev.user',
        email: 'dev@example.com',
        collegeId: 'cbit',
        avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=DevUser`,
        accountType: 'provider',
        age: 21,
        pronouns: 'they/them',
        interests: ['web-dev', 'ai-ml'],
        skills: ['React', 'Next.js', 'Firebase'],
        tagline: 'A developer getting things done.',
        rating: 4.8,
        earnings: 1200,
      };
      localStorage.setItem('userProfile', JSON.stringify(mockUserProfile));
      setAuthChecked(true);
      return;
    }

    const authTimeout = setTimeout(() => {
      if (!authChecked) {
        if (!user) {
            router.replace("/");
        }
        setAuthChecked(true); 
      }
    }, 5000); 

    const checkAuthAndProfile = async () => {
      if (isUserLoading) {
        return; 
      }

      if (!user) {
        router.replace("/"); 
        return;
      }
      
      try {
        if (!firestore) {
          console.error("Firestore not available");
          setAuthChecked(true);
          return;
        }
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          router.replace('/profile/create');
        } else {
           const profileData = { id: user.uid, ...userDocSnap.data() } as UserProfile;
           localStorage.setItem('userProfile', JSON.stringify(profileData));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuthAndProfile();

    return () => clearTimeout(authTimeout);

  }, [user, isUserLoading, router, firestore, authChecked]);

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
                    <span className="text-muted-foreground">Loading App...</span>
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
