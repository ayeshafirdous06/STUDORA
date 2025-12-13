'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '@/components/common/back-button';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function CreateProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsSubmitting(true);

    // Simulate saving the profile
    setTimeout(() => {
        try {
            // In a real app, you'd save this to local storage or a mock user object
            localStorage.removeItem('collegeId'); // Clean up simulation
        } catch (e) {
            console.error("Local storage is unavailable.");
        }

        toast({
            title: 'Profile Created!',
            description: 'Your profile has been successfully created.',
        });
        router.push('/dashboard');
        setIsSubmitting(false);

    }, 1000);
  };

  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <div className="lg:p-8">
        <BackButton />
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create Your Profile</CardTitle>
            <CardDescription>Just one more step. Let's get your name.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="e.g., Jane Doe" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save and Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
