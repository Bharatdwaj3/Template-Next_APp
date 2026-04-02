// components/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface Props {
  children:     React.ReactNode;
  allowedRole?: 'farmer' | 'grocer' | 'buyer';
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const router = useRouter();
  const { user, loading } = useAppSelector((s) => s.avatar);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/features/auth/login');
      return;
    }

    if (allowedRole && user.accountType !== allowedRole) {
      router.replace('/unauthorized');
    }
  }, [user, loading, allowedRole, router]);

  if (loading || !user) return null;
  if (allowedRole && user.accountType !== allowedRole) return null;

  return <>{children}</>;
}