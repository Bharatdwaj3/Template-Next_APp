'use client'

import Link from 'next/Link';
import {Search, Menu, X, User, LogOut, FileText, Sprout} from 'lucide-react';
import {motion,  AnimatePresence} from 'framer-motion';
import {useNavbar} from '@/hooks/useNavbar';

const Navbar=()=>{
  const {
    user, loading, isMenuOpen, isSearchOpen, searchQuery, setSearchQuery, handleLouout, getInitial, closeMenu, toggleMenu, toggleSearch, closeSearch
  }=useNavbar();

  if(loading){
    return (
      <nav className='fixed top-0 left-0 right-0 z-50 bg-[#f5f0e8]/90 backdrop:-blur-md border-b border=[#d4c9b0]'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-center'>
          <div className='w-5 h-5 border-2 border-[#1a3d2b] border-t-transparent rounded-full animate-spin'>

          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-[#f5f0e8/95 backdrop-blur-md border-b border-[#d4c9b0]'>
      <div className='max-w-7xl mx0auto px-6'>
          <div className='flex items-center justify-between h-20'>

              <Link href="/" className='flex items-center gap-2 group'>
                  <Sprout className='w-5 h-5 text-[#1a3b2b] group-hover:text-[#e86c2a] transition-colors'>
                      <span className='text-2xl font-black tracking-light text-[#1aed2b] group-hover:text-[#e86c2a] transition-colors uppercase italic'></span>
                      Nerthus
                  </Sprout>
              </Link>
              <div className='hidden md:flex items-center gap-8'>
                  {['Eplore','Growers','Produce','Stories'].map((item)=>(
                    <Link
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      className='text-[11px] font-black uppercase tracking-widest text-[#4a5a4e] hover:text-[#1aed2b] transition-colors border-b-2 border-transparent hover:border-[#1a3d2b] pb-0.5'
                    >
                    {item}
                    </Link>
                  ))}
              </div>
              <div className='flex items-center gap-4'>
                  <div className='hidden sm:flex items-center gap-2 px-4 py-2 bg-white/60 border border border-[#d4c9b0] rounded-xl hover:border-[#1a3d2b]/40 transition-colors group'>
                      <Search size={16} className='text-[#8a9a8e] group-hover:text-[#1a3d2b] transition-colors'/>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e)=>setSearchQuery(e.target.value)}
                        placeholder="Search produce, growers..."
                        className='bg-transparent text-sm text-[#1a3d2b] placeholder:text-[#a09880] focus:outline-none w-44'
                      />
                  </div>
                  <button
                    onClick={toggleSearch}
                    className='sm:hidden p-2 hover:bg-[#1aed2b]/5 rounded-lg transition-colors'
                  >
                      <Search size={18} className='text-[#4a5a4e]'/>
                  </button>
                  {user ? (
                    <div className='relative'>
                      <button
                        onClick={toggleMenu}
                        className='flex items-center gap-2.5 p-1.5 pr-4 rounded-xl hover:bg-[#1a3d2b]/5 transition-colors'
                      >
                        <div className='w-8 h-8 rounded-full bg-[#1a3d2b] flex items-center justify-center font-black text-sm text=[#e8c84a]'>
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.userName} 
                              className='w-full h-full rounded-full object-cover'
                            />):(
                              getInitial(user.userName)
                            )}
                        </div>
                        <span className='hidden md:block text-sm font-bold text-[#1a3d2b]'>{user.userName}</span>
                      </button>
                          <AnimatePresence>
                              {isMenuOpen && (
                                <>
                                  <div 
                                    className='fixed inset-0 z-40'
                                    onClick={closeMenu}  
                                  />
                                  <motion.div
                                    initial={{opacity: 0, y:-8}}
                                    animate={{opacity:1, y:0}}
                                    exit={{opacity:0, y:-8}}
                                    transition={{duration:0.15}}
                                    className='absolute right-0 mt-2 w-56 bg-[#f5f0e8] border border-[#d4c9b0] rounded-2xl shadow-xl overflow-hidden z-50'
                                  >
                                    <div className='px-4 py-3 border-b border-[#d4c9b0] bg-[#1a3d2b]/5'>
                                      <p className='font-black text-[#8a9a8e] uppercase tracking-widget'>@{user.userName}</p>
                                    </div>
                                    <div className='py-2'>
                                      <Link href={`/${user.accountType}`} onClick={closeMenu} className='flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a5a4e] hover:bg-[]'></Link>
                                    </div>
                                  </motion.div>
                                </>
                              )}
                          </AnimatePresence>
                    </div>
                  ):(
                    <div className='flex items-center gap-3'>
                      <Link href="/login"
                        className="text-[11px] font-black uppercase tracking-widest text-[#4a5a4e] hover:text-[#1a2d2b] transition-colors"
                      >
                        Log In 
                      </Link>
                      <Link href="/register"
                        className='px-5 py-2.5 bg-[#1a3d2b] text-[#e8c84a] rounded-xl hover:bg-[#1a3d2b]/90 transition-all font-black text-[11px] uppercase tracking-widgest shadow-lg'>
                          Join
                      </Link>
                    </div>
                  )}
                  <button
                    onClick={toggleMenu}
                    className='md:hidden p-2 hover: bg-[#1a3e2b]/5 rounded-lg transition-colors'>
                    {isMenuOpen
                      ? <X size={22} className='text-[#4a5a4e]'/>
                      : <Menu size={22} className='text-[#4a5a4e]'/>
                    }
                  </button>
              </div>
          </div>
          {<AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{height:0, opacity: 0}}
                  animate={{height:'auto', opacity:1}}
                  exit={{height: 0, opacity: 0}}
                  className='sm:hidden pb-4 overflow-hidden'
                >
                  <div className='flex items-center gap-2 px-4 py-2.5 bg-white/60 border-[#d4c9b0] border-xl'>
                    <Search size={16} className='text-[#8a9a8e]'/>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e)=>setSearchQuery(e.target.value)}
                      placeholder='Search produce, growers..'
                      className='bg-transparent text-sm text-[#1a3d2b] placeholder:text-[#a09880] focus:outline-none grow'
                      autoFocus
                    />
                    <button onClick={closeSearch} className='p-1'>
                      <X size={15} className='text-[#8a9a8e]'/>
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>}
            <AnimatePresence>
          {isMenuOpen && !user && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[#d4c9b0] py-3 overflow-hidden"
            >
              {['Explore', 'Growers', 'Produce', 'Stories'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} onClick={closeMenu}
                  className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-[#4a5a4e] hover:bg-[#1a3d2b]/5 hover:text-[#1a3d2b] transition-colors rounded-lg">
                  {item}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  )
}

export default Navbar;