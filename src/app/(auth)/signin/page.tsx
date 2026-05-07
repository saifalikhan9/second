'use client';

import { signInAction } from '@/app/actions/auth';
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

export default function SigninPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSignIn(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Please enter valid credentials');
      return;
    }

    await signInAction({ email, password }, setError, setLoading);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle>Welcome Back</CardTitle>

          <CardDescription>
            Enter your email and password to sign in.
          </CardDescription>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardHeader>

        <CardContent>
          <form action={handleSignIn} className="space-y-4">
            <Input type="email" name="email" placeholder="Email" />

            <Input type="password" name="password" placeholder="Password" />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?
          </p>

          <Button asChild variant="outline" className="w-full">
            <Link href="/signup">Create Account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
