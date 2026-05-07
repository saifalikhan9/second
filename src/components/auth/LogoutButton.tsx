'use client';

import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type LogoutButtonProps = {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
};

export const LogoutButton = ({
  className,
  variant = 'outline',
}: LogoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full">
      <Button
        type="button"
        className={className}
        variant={variant}
        disabled={loading}
        onClick={() => logoutAction(setError, setLoading)}
      >
        {loading ? 'Logging out...' : 'Logout'}
      </Button>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};
