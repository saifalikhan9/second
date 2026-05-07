import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

interface SignInData {
  email: string;
  password: string;
}
interface SignUpData {
  email: string;
  password: string;
  name: string;
}
export async function signUpAction(
  fields: SignUpData,
  setError: (e: string | null) => void,
  setloading: (e: boolean) => void,
) {
  const { email, name, password } = fields;
  const { data, error } = await authClient.signUp.email(
    {
      email, // user email address
      password, // user password -> min 8 characters by default
      name, // user display name

      callbackURL: '/', // A URL to redirect to after the user verifies their email (optional)
    },
    {
      onRequest: (ctx) => {
        //show loading
        setloading(true);
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
        setError(null);
        setloading(false);
        redirect('/');
      },
      onError: (ctx) => {
        // display the error message
        setError(ctx.error.message);
        setloading(false);
      },
    },
  );
}
export async function signInAction(
  fields: SignInData,
  setError: (e: string | null) => void,
  setloading: (e: boolean) => void,
) {
  const { email, password } = fields;
  const { data, error } = await authClient.signIn.email(
    {
      email, // user email address
      password, // user password -> min 8 characters by default

      callbackURL: '/', // A URL to redirect to after the user verifies their email (optional)
    },
    {
      onRequest: (ctx) => {
        //show loading
        setloading(true);
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
        setError(null);
        setloading(false);
        redirect('/');
      },
      onError: (ctx) => {
        // display the error message
        setError(ctx.error.message);
        setloading(false);
      },
    },
  );
}

export async function logoutAction(
  setError: (e: string | null) => void,
  setloading: (e: boolean) => void,
) {
  await authClient.signOut({
    fetchOptions: {
      onRequest: () => {
        setloading(true);
      },
      onSuccess: () => {
        setError(null);
        setloading(false);
        localStorage.removeItem('sb_content_store_v1');
        window.location.href = '/';
      },
      onError: (ctx) => {
        setError(ctx.error.message);
        setloading(false);
      },
    },
  });
}
