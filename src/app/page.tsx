'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function AccountTypeSelectionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-2 text-center text-3xl font-bold font-headline">
          Welcome to STUDORA
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          How would you like to join?
        </p>
        <div className="grid grid-cols-1 gap-6">
          <Link href="/signup?accountType=provider" passHref>
             <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-lg font-medium">
                   I want to offer services
                 </CardTitle>
                 <Briefcase className="h-6 w-6 text-primary" />
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground">
                   Create a provider account to showcase your skills, find projects, and start earning.
                 </p>
               </CardContent>
             </Card>
           </Link>
          
           <Link href="/signup?accountType=seeker" passHref>
             <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-lg font-medium">
                   I need a service
                 </CardTitle>
                 <UserPlus className="h-6 w-6 text-primary" />
               </CardHeader>
               <CardContent>
                 <p className="text-sm text-muted-foreground">
                   Create a service seeker account to post requests and hire talented students from your campus.
                 </p>
               </CardContent>
             </Card>
           </Link>
        </div>
         <p className="mt-8 px-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Log In
            </Link>
            .
          </p>
      </div>
    </div>
  );
}
