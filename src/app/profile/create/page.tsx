
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BackButton } from '@/components/common/back-button';
import { cn } from '@/lib/utils';
import { placeholderImages } from '@/lib/placeholder-images';
import { useLocalStorage } from '@/hooks/use-local-storage';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  username: z.string().min(3, 'Username must be at least 3 characters.').regex(/^[a-z0-9_.]+$/, 'Username can only contain lowercase letters, numbers, underscores, and dots.'),
  avatarUrl: z.string().url('Please select an avatar.'),
});

type ProfileForm = z.infer<typeof profileSchema>;

const avatars = placeholderImages.filter(p => p.id.startsWith('avatar-'));

export default function CreateProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useLocalStorage('userProfile', {});
  const [signupData, setSignupData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      username: '',
    }
  });
  
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('signupData') || '{}');
      setSignupData(data);
      if (data.name) {
        setValue('name', data.name);
      }
      if (data.username) {
        setValue('username', data.username);
      }
    } catch (e) {
      console.error("Could not parse signup data from local storage");
    }
  }, [setValue]);


  const selectedAvatar = watch('avatarUrl');

  const onSubmit = async (data: ProfileForm) => {
    setIsSubmitting(true);

    // Simulate saving the profile
    setTimeout(() => {
        try {
            // In a real app, this would save to a database.
            // We'll use local storage to persist the user's created profile data.
            const fullProfile = { 
              ...signupData, 
              ...data, 
              id: signupData?.uid || 'user-1', 
              rating: 4.8, 
              earnings: 1250.00 
            }; 
            setUserProfile(fullProfile);

            localStorage.removeItem('signupData'); // Clean up
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
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xl lg:p-8">
        <BackButton />
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Create Your Profile</CardTitle>
            <CardDescription>Just one more step. Let's get your profile ready.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="e.g., Jane Doe" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="e.g., jane.doe" {...register('username')} />
                {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
              </div>

               <div className="space-y-2">
                  <Label>Choose your Avatar</Label>
                  <input type="hidden" {...register('avatarUrl')} />
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                    {avatars.map((avatar) => (
                      <button
                        type="button"
                        key={avatar.id}
                        onClick={() => setValue('avatarUrl', avatar.imageUrl, { shouldValidate: true })}
                        className={cn(
                          'rounded-full overflow-hidden aspect-square border-4 border-transparent transition-all',
                          selectedAvatar === avatar.imageUrl ? 'border-primary' : 'hover:border-primary/50'
                        )}
                      >
                        <Image
                          src={avatar.imageUrl}
                          alt={avatar.description}
                          data-ai-hint={avatar.imageHint}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                  {errors.avatarUrl && <p className="text-sm text-destructive">{errors.avatarUrl.message}</p>}
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
