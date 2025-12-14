
'use client';

import { SiteHeader } from "@/components/common/site-header";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FirebaseClientProvider } from "@/firebase";

type UserProfile = {
  id: string;
  name: string;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authChecked, setAuthChecked] = useState(false);
  const [, setUserProfile] = useLocalStorage('userProfile', null);

  useEffect(() => {
    // This is a temporary bypass for development.
    // We will revisit and fix the authentication flow later.
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
    setUserProfile(mockUserProfile);
    setAuthChecked(true);
  }, [setUserProfile]);

  if (!authChecked) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
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
    <FirebaseClientProvider>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </div>
    </FirebaseClientProvider>
  );
}
