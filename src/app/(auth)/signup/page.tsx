'use client';
import { signUpAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSignUp(formData: FormData) {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    if (!email || !name || !password) {
      setError('please enter a valid fields');
      return;
    }
    await signUpAction({ name, email, password }, setError, setLoading);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle>Create Account</CardTitle>

          <CardDescription>
            Enter your details below to create your account.
          </CardDescription>
          {error && <p className="text-red-500">{error}</p>}
        </CardHeader>

        <CardContent>
          <form action={handleSignUp} className="space-y-4">
            <Input type="text" name="name" placeholder="Name" />

            <Input type="email" name="email" placeholder="Email" />

            <Input type="password" name="password" placeholder="Password" />

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">
            Already have an account?
          </p>

          <Button asChild variant="outline" className="w-full">
            <Link href="/signin">Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
