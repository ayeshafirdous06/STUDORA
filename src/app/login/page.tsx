
import { Metadata } from 'next';
import Link from 'next/link';
import { UserAuthForm } from '@/components/auth/user-auth-form';
import { BookOpenCheck } from 'lucide-react';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Login - STUDORA',
  description: 'Login to your STUDORA account.',
};

export default function LoginPage() {
  return (
    <FirebaseClientProvider>
      <div className="container relative flex h-screen flex-col items-center justify-center">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <BookOpenCheck className="mx-auto h-8 w-8 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email to sign in to your account
              </p>
            </div>
            <UserAuthForm mode="login" />
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/signup"
                className="hover:text-brand underline underline-offset-4"
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </FirebaseClientProvider>
  );
}
