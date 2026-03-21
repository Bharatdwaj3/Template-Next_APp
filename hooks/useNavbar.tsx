'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUser, clearUser } from '@/store/avatarSlice';

export function useNavbar() {
  const dispatch = useAppDispatch();
  const router   = useRouter();

  const { user, loading } = useAppSelector((state) => state.avatar);
  const hasFetched = useRef(false);

  const [isMenuOpen,   setIsMenuOpen]   = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');

  useEffect(() => {

    if (!user && !loading && !hasFetched.current) {
        hasFetched.current = true;
        dispatch(fetchUser());
    }
  }, [dispatch, user, loading]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(clearUser());
      hasFetched.current = false;
      setIsMenuOpen(false);
      router.push('/features/auth/login');
    } catch {
      console.error('Logout failed');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/features/produce?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const getInitial = (name: string) => (name ? name[0].toUpperCase() : 'U');

  return {
    user,
    loading,
    isMenuOpen,
    isSearchOpen,
    searchQuery,
    setSearchQuery,
    handleLogout,
    handleSearch,
    getInitial,
    closeMenu:    () => setIsMenuOpen(false),
    toggleMenu:   () => setIsMenuOpen((p) => !p),
    toggleSearch: () => setIsSearchOpen((p) => !p),
    closeSearch:  () => setIsSearchOpen(false),
  };
}