// components/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, X, ShoppingBasket, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavbar } from '@/hooks/useNavbar';
import { useCartContext } from '@/hooks/useCartContext';

const Navbar = () => {
  const {
    user, loading, isMenuOpen, isSearchOpen, searchQuery,
    setSearchQuery, handleLogout, getInitial,
    closeMenu, toggleMenu, toggleSearch, closeSearch,
  } = useNavbar();
  const { items, setIsOpen: openCart } = useCartContext();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => { setHasMounted(true); }, []);

  const shouldShowAuthenticatedUI = hasMounted && (user || loading);
  const shouldShowGuestUI = hasMounted && !user && !loading;

  const handleLogoutClick = async () => {
    handleLogout();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 group">
          <Sprout className="w-5 h-5 text-primary group-hover:text-cta transition-colors" />
          <span className="text-2xl font-black tracking-tight text-primary group-hover:text-cta transition-colors uppercase italic">
            Nerthus
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Produce', href: '/features/produce' },
            { label: 'Farmers', href: '/features/farmer' },
            { label: 'Sellers', href: '/features/grocer' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[11px] font-black uppercase tracking-widest text-text-green hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
 
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-bg-alt/60 border border-border rounded-xl hover:border-primary/40 transition-colors group">
            <Search size={16} className="text-text-muted group-hover:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce, growers..."
              className="bg-transparent text-sm text-primary placeholder:text-text-placeholder focus:outline-none w-44"
            />
          </div>

          <button
            onClick={toggleSearch}
            className="sm:hidden p-2 hover:bg-primary/5 rounded-lg transition-colors"
          >
            <Search size={18} className="text-text-green" />
          </button>

          <button
            onClick={() => openCart(true)}
            className="relative p-2 hover:bg-primary/5 rounded-lg transition-colors"
          >
            <ShoppingBasket size={20} className="text-text-green" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-cta text-text-inverse text-[9px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {!hasMounted && (
            <div className="h-8 rounded-xl bg-primary/10 animate-pulse" />
          )}

          {shouldShowAuthenticatedUI && (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center gap-2.5 p-1.5 pr-4 rounded-xl hover:bg-primary/5 transition-colors"
                disabled={loading && !user}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-sm text-accent">
                  {loading && !user ? (
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  ) : user?.avatar ? (
                    <Image src={user.avatar} alt={user.userName} width={32} height={32} className="rounded-full object-cover" />
                  ) : (
                    getInitial(user?.userName || 'U')
                  )}
                </div>
                <span className="hidden md:block text-sm font-bold text-primary">
                  {loading && !user ? '...' : user?.userName}
                </span>
              </button>

              <AnimatePresence>
                {isMenuOpen && user && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={closeMenu} />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-bg border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-border bg-primary/5">
                        <p className="font-black text-text-muted uppercase tracking-widest text-[11px]">
                          @{user.userName}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href={user.accountType === 'buyer' ? `/features/buyer/${user.id}` : `/features/${user.accountType}/${user.id}`}
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-green hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogoutClick}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cta hover:bg-cta/5 transition-colors"
                        >
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {shouldShowGuestUI && (
            <div className="flex items-center gap-3">
              <Link
                href="/features/auth/login"
                className="text-[11px] font-black uppercase tracking-widest text-text-green hover:text-primary transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/features/auth/register"
                className="px-5 py-2.5 bg-primary text-accent rounded-xl hover:bg-primary/90 transition-all font-black text-[11px] uppercase tracking-widest shadow-lg"
              >
                Join
              </Link>
            </div>
          )}

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-primary/5 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X size={22} className="text-text-green" />
            ) : (
              <Menu size={22} className="text-text-green" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden pb-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-alt/60 border border-border rounded-xl">
              <Search size={16} className="text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search produce, growers..."
                className="bg-transparent text-sm text-primary placeholder:text-text-placeholder focus:outline-none grow"
                autoFocus
              />
              <button onClick={closeSearch} className="p-1">
                <X size={15} className="text-text-muted" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && !user && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border py-3 overflow-hidden"
          >
            {[
              { label: 'Produce', href: '/features/produce' },
              { label: 'Farmers', href: '/features/farmer' },
              { label: 'Sellers', href: '/features/grocer' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-text-green hover:bg-primary/5 hover:text-primary transition-colors rounded-lg"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;