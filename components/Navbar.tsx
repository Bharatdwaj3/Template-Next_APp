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
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setHasMounted(true); }, []);

  const shouldShowAuthenticatedUI = hasMounted && (user || loading);
  const shouldShowGuestUI         = hasMounted && !user && !loading;

  return (
    <nav className="sticky top-0 z-50 bg-[#f5f0e8]/95 backdrop-blur-md border-b border-[#d4c9b0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-2 group">
            <Sprout className="w-5 h-5 text-[#1a3d2b] group-hover:text-[#e86c2a] transition-colors" />
            <span className="text-2xl font-black tracking-tight text-[#1a3d2b] group-hover:text-[#e86c2a] transition-colors uppercase italic">
              Nerthus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Produce', href: '/features/produce' },
              { label: 'Farmers', href: '/features/farmer' },
              { label: 'Sellers', href: '/features/grocer' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[11px] font-black uppercase tracking-widest text-[#4a5a4e] hover:text-[#1a3d2b] transition-colors border-b-2 border-transparent hover:border-[#1a3d2b] pb-0.5"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/60 border border-[#d4c9b0] rounded-xl hover:border-[#1a3d2b]/40 transition-colors group">
              <Search size={16} className="text-[#8a9a8e] group-hover:text-[#1a3d2b] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search produce, growers..."
                className="bg-transparent text-sm text-[#1a3d2b] placeholder:text-[#a09880] focus:outline-none w-44"
              />
            </div>

            <button
              onClick={toggleSearch}
              className="sm:hidden p-2 hover:bg-[#1a3d2b]/5 rounded-lg transition-colors"
            >
              <Search size={18} className="text-[#4a5a4e]" />
            </button>

            <button
              onClick={() => openCart(true)}
              className="relative p-2 hover:bg-[#1a3d2b]/5 rounded-lg transition-colors"
            >
              <ShoppingBasket size={20} className="text-[#4a5a4e]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e86c2a] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {!hasMounted && (
              <div className="h-8 rounded-xl bg-[#1a3d2b]/10 animate-pulse" />
            )}

            {shouldShowAuthenticatedUI ? (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="flex items-center gap-2.5 p-1.5 pr-4 rounded-xl hover:bg-[#1a3d2b]/5 transition-colors"
                  disabled={loading && !user} 
                >
                  <div className="w-8 h-8 rounded-full bg-[#1a3d2b] flex items-center justify-center font-black text-sm text-[#e8c84a]">
                    {loading && !user ? (
                      <div className="w-4 h-4 border-2 border-[#e8c84a] border-t-transparent rounded-full animate-spin" />
                    ) : user?.avatar ? (
                      <Image src={user.avatar} alt={user.userName} width={32} height={32} className="rounded-full object-cover" />
                    ) : (
                      getInitial(user?.userName || 'U')
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-bold text-[#1a3d2b]">
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
                        className="absolute right-0 mt-2 w-56 bg-[#f5f0e8] border border-[#d4c9b0] rounded-2xl shadow-xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-[#d4c9b0] bg-[#1a3d2b]/5">
                          <p className="font-black text-[#8a9a8e] uppercase tracking-widest text-[11px]">@{user.userName}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href={user.accountType === 'buyer' ? `/features/buyer/${user.id}` : `/features/${user.accountType}/${user.id}`}
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a5a4e] hover:bg-[#1a3d2b]/5 hover:text-[#1a3d2b] transition-colors"
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#e86c2a] hover:bg-[#e86c2a]/5 transition-colors"
                          >
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : shouldShowGuestUI ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/features/auth/login"
                  className="text-[11px] font-black uppercase tracking-widest text-[#4a5a4e] hover:text-[#1a3d2b] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/features/auth/register"
                  className="px-5 py-2.5 bg-[#1a3d2b] text-[#e8c84a] rounded-xl hover:bg-[#1a3d2b]/90 transition-all font-black text-[11px] uppercase tracking-widest shadow-lg"
                >
                  Join
                </Link>
              </div>
            ) : null}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-[#1a3d2b]/5 rounded-lg transition-colors"
            >
              {isMenuOpen
                ? <X size={22} className="text-[#4a5a4e]" />
                : <Menu size={22} className="text-[#4a5a4e]" />
              }
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
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/60 border border-[#d4c9b0] rounded-xl">
                <Search size={16} className="text-[#8a9a8e]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search produce, growers..."
                  className="bg-transparent text-sm text-[#1a3d2b] placeholder:text-[#a09880] focus:outline-none grow"
                  autoFocus
                />
                <button onClick={closeSearch} className="p-1">
                  <X size={15} className="text-[#8a9a8e]" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && !user && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[#d4c9b0] py-3 overflow-hidden"
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
                  className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#4a5a4e] hover:bg-[#1a3d2b]/5 hover:text-[#1a3d2b] transition-colors rounded-lg"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;