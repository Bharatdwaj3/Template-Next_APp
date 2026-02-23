import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUser, clearUser } from '../store/avatarSlice';
import api from '../util/api';

export function useNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.avatar);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (localStorage.getItem('accessToken') || document.cookie.includes('accessToken')) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await api.post('/user/logout');
      dispatch(clearUser());
      setIsMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getInitial = (name) => (name ? name[0].toUpperCase() : 'U');

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleSearch = () => setIsSearchOpen((prev) => !prev);
  const closeSearch = () => setIsSearchOpen(false);

  return {
    user,
    loading,
    isMenuOpen,
    isSearchOpen,
    searchQuery,
    setSearchQuery,
    handleLogout,
    getInitial,
    closeMenu,
    toggleMenu,
    toggleSearch,
    closeSearch,
  };
}