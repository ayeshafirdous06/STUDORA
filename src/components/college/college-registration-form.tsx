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
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  collegeName: z.string().min(3, { message: "College name must be at least 3 characters." }),
  adminName: z.string().min(2, { message: "Please enter your name." }),
  adminEmail: z.string().email({ message: "Please enter a valid email." }),
});

type FormData = z.infer<typeof formSchema>;

export function CollegeRegistrationForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Registration Submitted!",
        description: `Thank you, ${data.adminName}. We will review your application for ${data.collegeName} and be in touch.`,
      });
      // a real app would not redirect immediately, but for simulation we will.
      router.push("/");
    }, 1500);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="collegeName">College Name</Label>
            <Input
              id="collegeName"
              placeholder="e.g., State University"
              disabled={isLoading}
              {...register("collegeName")}
            />
            {errors.collegeName && (
              <p className="text-sm text-destructive">{errors.collegeName.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="adminName">Your Name</Label>
            <Input
              id="adminName"
              placeholder="e.g., Jane Doe"
              disabled={isLoading}
              {...register("adminName")}
            />
            {errors.adminName && (
              <p className="text-sm text-destructive">{errors.adminName.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="adminEmail">Administrator Email</Label>
            <Input
              id="adminEmail"
              placeholder="name@university.edu"
              type="email"
              disabled={isLoading}
              {...register("adminEmail")}
            />
            {errors.adminEmail && (
              <p className="text-sm text-destructive">{errors.adminEmail.message}</p>
            )}
          </div>
          <Button disabled={isLoading} className="mt-2 w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
}
