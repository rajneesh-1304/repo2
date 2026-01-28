'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/redux/hooks';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const currentUser = useAppSelector(
    (state) => state.users.currentUser
  );

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    if (currentUser.role === 'SELLER') {
      router.replace('/seller');
    }

    if (currentUser.role === 'ADMIN') {
      router.replace('/seller');
    }

    if (currentUser.role === 'CUSTOMER') {
      router.replace('/');
    }
  }, [currentUser, router]);


  return <>{children}</>;
}
