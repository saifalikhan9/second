import { auth } from '@/lib/auth';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { Button } from '@/components/ui/button';
import { headers } from 'next/headers';
import Link from 'next/link';

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <h1>This is the home page of the second brain app</h1>

        {isAuthenticated ? (
          <>
            <div className="rounded-lg border p-4">
              <p>
                <strong>Name:</strong> {session?.user?.name ?? 'Unknown user'}
              </p>
              <p>
                <strong>Email:</strong>{' '}
                {session?.user?.email ?? 'No email available'}
              </p>
            </div>

            <Link href="/dashboard">
              <Button>dashboard</Button>
            </Link>

            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/signin">
              <Button>signin</Button>
            </Link>

            <Link href="/signup">
              <Button variant="outline">signup</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
