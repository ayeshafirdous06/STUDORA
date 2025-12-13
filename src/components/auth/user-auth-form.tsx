
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { colleges } from "@/lib/data";
import { useLocalStorage } from "@/hooks/use-local-storage";


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: "login" | "signup";
  accountType?: 'provider' | 'seeker';
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  collegeId: z.string({ required_error: "Please select your college." }).min(1, "Please select your college."),
  accountType: z.enum(['provider', 'seeker']),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export function UserAuthForm({ className, mode, accountType = 'seeker', ...props }: UserAuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [, setUserProfile] = useLocalStorage('userProfile', {});


  const approvedColleges = colleges.filter(c => c.approvalStatus);

  const schema = mode === 'login' ? loginSchema : signupSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: mode === 'signup' ? { accountType } : {},
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signup') {
        // Store signup data temporarily to pass to the next step
        try {
            localStorage.setItem('signupData', JSON.stringify(data));
        } catch (e) {
            console.error("Local storage is unavailable.");
        }
        toast({
          title: "Account Created",
          description: "One more step to set up your profile."
        });
        router.push("/profile/create");
      } else { // Login mode
        // For login, we'll check if a profile exists in local storage
         try {
            const storedProfile = localStorage.getItem('userProfile');
            if (storedProfile && Object.keys(JSON.parse(storedProfile)).length > 0) {
                 toast({
                    title: "Signed In",
                    description: "Welcome back!"
                });
                router.push("/dashboard");
            } else {
                 toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "No profile found for this user. Please sign up."
                });
            }
        } catch (e) {
             toast({
                variant: "destructive",
                title: "Login Error",
                description: "Could not access user profile."
            });
        }
      }
    }, 1500);
  }


  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {String(form.formState.errors.email?.message)}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {String(form.formState.errors.password?.message)}
              </p>
            )}
          </div>
          {mode === "signup" && (
            <>
              <input type="hidden" {...form.register("accountType")} />
              <div className="grid gap-2">
                <Label htmlFor="college">College</Label>
                <Select onValueChange={(value) => form.setValue('collegeId', value, { shouldValidate: true })} disabled={isLoading}>
                  <SelectTrigger id="college">
                    <SelectValue placeholder={"Select your college"} />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedColleges.length > 0 ? (
                      approvedColleges.map((college) => (
                        <SelectItem key={college.id} value={college.id}>
                          {college.name}
                        </SelectItem>
                      ))
                    ) : (
                        <SelectItem value="no-colleges" disabled>No approved colleges available.</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.collegeId && (
                  <p className="text-sm text-destructive">
                    {String(form.formState.errors.collegeId?.message)}
                  </p>
                )}
              </div>
            </>
          )}
          <Button disabled={isLoading} className="mt-2">
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </div>
      </form>
    </div>
  );
}
