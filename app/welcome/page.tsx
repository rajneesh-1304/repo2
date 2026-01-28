'use client';

import { useAppSelector } from '@/app/redux/hooks';

const Page = () => {
  const currentUser = useAppSelector(
    (state) => state.users.currentUser
  );

  return (
    <div>
      Welcome, <strong>{currentUser?.name}</strong> 👋
    </div>
  );
};

export default Page;
