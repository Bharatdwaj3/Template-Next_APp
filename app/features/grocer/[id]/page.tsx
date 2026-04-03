// features/grocer/[id]/page.tsx
'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  MapPin, Navigation, Phone, ArrowLeft, Package, Loader2, LogOut,
  Eye, Trash2, TrendingUp, Sparkles, Package as PackageIcon,
  Leaf, ShoppingBasket, Truck, Star, Clock,
  CheckCircle, Apple, Carrot, Store, Heart, Users,
  ChevronLeft, ChevronRight, Sprout, Flower2, Award
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser } from '@/store/avatarSlice';
import { clearFollowing } from '@/store/followSlice';
import ProtectedRoute from '@/components/ProtectedRoute';
import { clearSavedProduce, markProduceVisited } from '@/store/contentSlice';
import { useFollow } from '@/hooks/useFollow';
import { useVisitedProduce } from '@/hooks/useVisitedProduce';
import { api } from '@/lib/api';

const LocationMap = dynamic(() => import('@/components/LocationMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-100 bg-bg rounded-xl">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  ),
});

interface GrocerProfile {
  _id: string;
  bio: string;
  shopName: string;
  location: { address?: string; coordinates?: number[] };
  savedProduce: string[];
  likedProduce: string[];
  followers: string[];
  following: string[];
  mediaUrl: string;
  createdAt: string;
  cloudinaryId: string;
  updatedAt: string;
  userId: {
    _id: string;
    userName: string;
    fullName: string;
    email: string;
    avatar: string;
    accountType: string;
  };
}

interface ProduceItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
  img: string;
  isOrganic: boolean;
  rating: number;
  farmerId: { 
    _id: string;
    fullName: string;
  };
}

interface Farmer {
  _id: string;
  bio: string;
  interests: string[];
  farmType: string[];
  produce: string[];
  location: { address?: string };
  followers: string[];
  following: string[];
  userId: {
    _id: string;
    userName: string;
    fullName: string;
    avatar: string;
  };
}

export default function GrocerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.avatar.user);
  const { id } = use(params);
  const [grocer, setGrocer] = useState<GrocerProfile | null>(null);
  const [allProduce, setAllProduce] = useState<ProduceItem[]>([]);
  const [allFarmers, setAllFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [produceLoading, setProduceLoading] = useState(true);
  const [farmersLoading, setFarmersLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [produceSlide, setProduceSlide] = useState(0);
  const [farmersSlide, setFarmersSlide] = useState(0);
  const { isFollowing, toggle } = useFollow(id);
  const isOwner = currentUser?.id === id;

  const { visitedProduce, loading: visitedLoading, clearHistory, visitedCount } = useVisitedProduce();
  const localFollowing = useAppSelector((state) => state.follow.following);

  const displayFollowerCount = isOwner 
    ? (grocer?.followers?.length ?? 0)  
    : (grocer?.followers?.length ?? 0);

  const displayFollowingCount = isOwner 
    ? localFollowing.length 
    : (grocer?.following?.length ?? 0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/grocer/profile/${id}`);
        const data = await res.json();
        if (res.status === 401) { router.push('/features/auth/login'); return; }
        if (res.status === 403) { router.push('/unauthorized'); return; }
        if (!data.success) { setGrocer(null); return; }
        setGrocer(data.grocer);
      } catch (err) {
        console.error(err);
        setGrocer(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  useEffect(() => {
    const loadAllProduce = async () => {
      try {
        setProduceLoading(true);
        const response = await api.get('/produce/details/');
        if (response.success && response.produce && response.produce.length > 0) {
          setAllProduce(response.produce);
        } else {
          setAllProduce([]);
        }
      } catch (error) {
        console.error('Failed to load produce:', error);
        setAllProduce([]);
      } finally {
        setProduceLoading(false);
      }
    };
    loadAllProduce();
  }, []);

  useEffect(() => {
    const loadAllFarmers = async () => {
      try {
        setFarmersLoading(true);
        const response = await api.get('/farmer/profile/');
        
        let farmersList = [];
        if (response.success && response.farmers) {
          farmersList = response.farmers;
        } else if (response.success && response.data) {
          farmersList = response.data;
        } else if (Array.isArray(response)) {
          farmersList = response;
        } else if (response.farmers && Array.isArray(response.farmers)) {
          farmersList = response.farmers;
        }
        
        if (farmersList.length > 0) {
          setAllFarmers(farmersList);
        } else {
          setAllFarmers([]);
        }
      } catch (error) {
        console.error('Failed to load farmers:', error);
        setAllFarmers([]);
      } finally {
        setFarmersLoading(false);
      }
    };
    loadAllFarmers();
  }, []);

  const nextProduceSlide = () => {
    setProduceSlide((prev) => (prev + 1) % Math.ceil(allProduce.length / 3));
  };

  const prevProduceSlide = () => {
    setProduceSlide((prev) => (prev - 1 + Math.ceil(allProduce.length / 3)) % Math.ceil(allProduce.length / 3));
  };

  const nextFarmersSlide = () => {
    setFarmersSlide((prev) => (prev + 1) % Math.ceil(allFarmers.length / 3));
  };

  const prevFarmersSlide = () => {
    setFarmersSlide((prev) => (prev - 1 + Math.ceil(allFarmers.length / 3)) % Math.ceil(allFarmers.length / 3));
  };

  const totalProduceSlides = Math.ceil(allProduce.length / 3);
  const totalFarmersSlides = Math.ceil(allFarmers.length / 3);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      dispatch(clearUser());
      dispatch(clearFollowing());
      dispatch(clearSavedProduce());
      router.push('/features/auth/login');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!grocer) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <p className="text-text-muted mb-4">Seller not found.</p>
        <Link href="/features/grocer" className="flex items-center justify-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> All Sellers
        </Link>
      </div>
    </div>
  );

  const avatar = grocer.userId?.avatar || '';
  const fullName = grocer.userId?.fullName || '';
  const userName = grocer.userId?.userName || '';
  const location = grocer.location?.address || '';
  const savedCount = grocer.savedProduce?.length || 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg">
        
        <div className="relative bg-linear-to-r from-primary via-primary-hover to-primary py-16 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2215%22 fill=%22white%22/%3E%3Ccircle cx=%2280%22 cy=%2280%22 r=%2215%22 fill=%22white%22/%3E%3C/svg%3E')] bg-repeat"></div>
          </div>
          
          <div className="max-w-6xl mx-auto relative">
            <div className="flex justify-between items-start mb-8">
              <Link
                href="/features/grocer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft size={13} /> Back to Marketplace
              </Link>

              {isOwner && (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-4 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {loggingOut ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                  {loggingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl bg-white/10 backdrop-blur-sm">
                  {avatar ? (
                    <Image src={avatar} alt={fullName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl">
                      <Store size={48} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-1.5 shadow-lg">
                  <Leaf size={14} className="text-primary" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent bg-accent/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    🌱 FRESH PRODUCE SELLER
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
                    @{userName}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                  {grocer.shopName}
                </h1>
                <p className="text-white/80 text-sm max-w-2xl">{grocer.bio}</p>
                {location && (
                  <div className="flex items-center gap-2 mt-3 text-white/60">
                    <MapPin size={14} className="text-accent" />
                    <span className="text-sm">{location}</span>
                  </div>
                )}
              </div>

              {!isOwner && (
                <div className="flex gap-3">
                  <button onClick={toggle}
                    className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all ${
                      isFollowing
                        ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                        : 'bg-accent text-primary hover:bg-accent/90 shadow-lg'
                    }`}
                  >
                    {isFollowing ? '✓ Following' : '+ Follow Store'}
                  </button>
                  <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-[11px] font-black uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30">
                    <Phone size={14} /> Contact
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="bg-bg-alt backdrop-blur-sm rounded-2xl px-6 py-5 text-center border border-border shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Users size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-black text-primary">{displayFollowerCount}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mt-1">STORE FOLLOWERS</p>
            </div>
            <div className="bg-bg-alt backdrop-blur-sm rounded-2xl px-6 py-5 text-center border border-border shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Heart size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-black text-primary">{displayFollowingCount}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mt-1">FOLLOWING</p>
            </div>
            <div className="bg-bg-alt backdrop-blur-sm rounded-2xl px-6 py-5 text-center border border-border shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <ShoppingBasket size={20} className="text-primary" />
              </div>
              <p className="text-3xl font-black text-primary">{savedCount}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted mt-1">SAVED ITEMS</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={18} className="text-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">OUR STORY</h2>
              </div>
              <p className="text-text-green leading-relaxed">
                {grocer.bio || 'We are passionate about bringing the freshest, highest-quality produce directly from local farms to your table.'}
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  <span className="text-xs text-text-green">Farm Fresh Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-primary" />
                  <span className="text-xs text-text-green">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-accent" />
                  <span className="text-xs text-text-green">Top Rated</span>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-primary to-primary-hover rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-accent" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent/80">STORE HOURS</span>
              </div>
              <p className="text-sm font-bold">Mon - Sat: 8:00 AM - 8:00 PM</p>
              <p className="text-xs text-white/60 mt-1">Sunday: Closed</p>
              <div className="mt-4 pt-3 border-t border-white/20">
                <p className="text-[10px] font-bold uppercase tracking-wider">📍 Pickup Available</p>
              </div>
            </div>
          </div>

          {produceLoading ? (
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <Apple size={18} className="text-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">FEATURED PRODUCE</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-bg-alt rounded-xl border border-border p-4 animate-pulse">
                    <div className="h-40 bg-bg rounded-lg mb-3"></div>
                    <div className="h-4 bg-bg rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-bg rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : allProduce.length > 0 ? (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Apple size={18} className="text-primary" />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">FEATURED PRODUCE</h2>
                  </div>
                  <p className="text-xs text-text-muted">Fresh from local farms to your table</p>
                </div>
                <Link href="/features/produce" className="text-[10px] font-bold text-cta hover:underline">
                  Browse All →
                </Link>
              </div>

              <div className="relative">
                {allProduce.length > 3 && (
                  <>
                    <button onClick={prevProduceSlide} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-bg-alt border border-border rounded-full p-2 shadow-md hover:bg-primary hover:text-accent transition-all">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextProduceSlide} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-bg-alt border border-border rounded-full p-2 shadow-md hover:bg-primary hover:text-accent transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${produceSlide * 100}%)` }}>
                    {Array.from({ length: totalProduceSlides }).map((_, slideIndex) => (
                      <div key={slideIndex} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {allProduce.slice(slideIndex * 3, slideIndex * 3 + 3).map((item) => (
                            <Link key={item._id} href={`/features/produce/${item._id}`} className="group bg-bg-alt rounded-xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all">
                              <div className="relative h-40 bg-bg overflow-hidden">
                                {item.img ? (
                                  <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center"><Carrot size={48} className="text-text-muted" /></div>
                                )}
                                {item.isOrganic && <span className="absolute top-3 left-3 bg-primary text-accent text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1"><Leaf size={8} /> ORGANIC</span>}
                              </div>
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[9px] font-black uppercase tracking-wider text-cta">{item.category || 'PRODUCE'}</span>
                                  <div className="flex items-center gap-0.5"><Star size={10} className="fill-accent text-accent" /><span className="text-[9px] font-bold text-primary">{item.rating || 0}</span></div>
                                </div>
                                <h3 className="font-bold text-primary group-hover:text-cta transition-colors text-sm">{item.name}</h3>
                                <p className="text-[10px] text-text-muted mt-1">by {item.farmerId?.fullName || 'Local Farm'}</p>
                                <div className="flex justify-between items-center mt-3">
                                  <span className="text-lg font-black text-cta">₹{item.price}<span className="text-[9px]">/{item.unit}</span></span>
                                  <span className="text-[10px] font-bold text-primary group-hover:underline">View →</span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {allProduce.length > 3 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalProduceSlides }).map((_, index) => (
                      <button key={index} onClick={() => setProduceSlide(index)} className={`h-2 rounded-full transition-all ${produceSlide === index ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-text-muted'}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-16 text-center py-8"><p className="text-text-muted">No produce available at the moment.</p></div>
          )}

          {farmersLoading ? (
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <Sprout size={18} className="text-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">PARTNERED FARMS</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-bg-alt rounded-xl border border-border p-4 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-bg mx-auto mb-3"></div>
                    <div className="h-4 bg-bg rounded w-2/3 mx-auto mb-2"></div>
                    <div className="h-3 bg-bg rounded w-1/2 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : allFarmers.length > 0 ? (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sprout size={18} className="text-primary" />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">PARTNERED FARMS</h2>
                  </div>
                  <p className="text-xs text-text-muted">Local farms we source our fresh produce from</p>
                </div>
                <Link href="/features/farmer" className="text-[10px] font-bold text-cta hover:underline">
                  View All Farms →
                </Link>
              </div>

              <div className="relative">
                {allFarmers.length > 3 && (
                  <>
                    <button onClick={prevFarmersSlide} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-bg-alt border border-border rounded-full p-2 shadow-md hover:bg-primary hover:text-accent transition-all">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextFarmersSlide} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-bg-alt border border-border rounded-full p-2 shadow-md hover:bg-primary hover:text-accent transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${farmersSlide * 100}%)` }}>
                    {Array.from({ length: totalFarmersSlides }).map((_, slideIndex) => (
                      <div key={slideIndex} className="w-full shrink-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {allFarmers.slice(slideIndex * 3, slideIndex * 3 + 3).map((farmer) => (
                            <Link key={farmer._id} href={`/features/farmer/${farmer._id}`} className="group bg-bg-alt rounded-xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all text-center p-6">
                              <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-primary/10">
                                {farmer.userId?.avatar ? (
                                  <Image src={farmer.userId.avatar} alt={farmer.userId.fullName} fill className="object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center"><Flower2 size={32} className="text-primary" /></div>
                                )}
                              </div>
                              <h3 className="font-bold text-primary group-hover:text-cta transition-colors">{farmer.userId?.fullName || 'Local Farmer'}</h3>
                              <p className="text-[10px] text-text-muted mt-1">@{farmer.userId?.userName || 'farmer'}</p>
                              {farmer.location?.address && (
                                <div className="flex items-center justify-center gap-1 mt-2 text-text-muted">
                                  <MapPin size={10} />
                                  <span className="text-[9px]">{farmer.location.address.split(',')[0]}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-center gap-4 mt-3 text-[9px] font-bold">
                                <span>{farmer.followers?.length || 0} followers</span>
                                <span className="text-primary">•</span>
                                <span>{farmer.produce?.length || 0} products</span>
                              </div>
                              <div className="mt-4">
                                <span className="text-[10px] font-bold text-primary group-hover:underline">View Farm →</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {allFarmers.length > 3 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalFarmersSlides }).map((_, index) => (
                      <button key={index} onClick={() => setFarmersSlide(index)} className={`h-2 rounded-full transition-all ${farmersSlide === index ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-text-muted'}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-16 text-center py-8"><p className="text-text-muted">No partnered farms yet.</p></div>
          )}

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={18} className="text-primary" />
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">RECENTLY VIEWED</h2>
                </div>
                <p className="text-xs text-text-muted">Produce you&apos;ve browsed recently</p>
              </div>
              {visitedCount > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-[10px] text-text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} /> Clear History
                </button>
              )}
            </div>

            {visitedLoading ? (
              <div className="flex items-center justify-center py-12 bg-bg-alt rounded-xl border border-border">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : visitedProduce.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visitedProduce.slice(0, 6).map((item, index) => (
                  <Link
                    key={item._id}
                    href={`/features/produce/${item._id}`}
                    className="flex items-center gap-4 p-4 bg-bg-alt rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-bg overflow-hidden relative shrink-0">
                      {item.img ? (
                        <Image src={item.img} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PackageIcon size={24} className="text-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-primary text-sm">{item.name}</h3>
                        {item.isOrganic && (
                          <span className="text-[8px] bg-primary text-accent px-1.5 py-0.5 rounded-full">ORGANIC</span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-muted">by {item.farmerId?.fullName || 'Local Farmer'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-cta">₹{item.price}</span>
                        <span className="text-[9px] text-text-muted">per {item.unit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Clock size={12} className="text-text-muted mx-auto mb-1" />
                      <p className="text-[9px] font-bold text-primary">#{index + 1}</p>
                    </div>
                    <ChevronRight size={16} className="text-text-muted group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-bg-alt rounded-xl border border-border p-8 text-center">
                <Eye size={40} className="mx-auto text-text-muted mb-3" />
                <p className="text-text-muted text-sm">No recent activity</p>
                <p className="text-xs text-text-muted mt-1">Browse produce to see your history here</p>
                <Link
                  href="/features/produce"
                  className="inline-block mt-4 text-[10px] font-bold text-cta hover:underline"
                >
                  Start Exploring →
                </Link>
              </div>
            )}
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={18} className="text-primary" />
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">STORE LOCATION</h2>
                </div>
                <p className="text-xs text-text-muted">Find us on the map</p>
              </div>
              {isOwner && (
                <Link 
                  href={`/features/grocer/${grocer._id}/edit-location`}
                  className="text-[10px] font-bold text-cta hover:underline flex items-center gap-1"
                >
                  <Navigation size={12} /> Update Location
                </Link>
              )}
            </div>

            {grocer.location?.coordinates && grocer.location.coordinates.length === 2 ? (
              <>
                <LocationMap 
                  singleLocation={{
                    id: grocer._id,
                    type: 'grocer',
                    name: grocer.shopName || fullName,
                    shopName: grocer.shopName,
                    address: grocer.location?.address || 'Address not available',
                    coordinates: grocer.location.coordinates as [number, number],
                    avatar: avatar,
                  }}
                  zoom={15}
                  height="350px"
                  showAllLocations={false}
                />
                <div className="mt-4 p-4 bg-bg rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-cta" />
                    <h3 className="text-sm font-bold text-primary">📍 Address</h3>
                  </div>
                  <p className="text-sm text-text-green">{grocer.location?.address || 'Address not available'}</p>
                </div>
              </>
            ) : (
              <div className="bg-bg-alt border border-border rounded-xl p-8 text-center">
                <MapPin size={48} className="mx-auto text-text-muted mb-4" />
                <p className="text-text-muted mb-2">No location added yet</p>
                {isOwner && (
                  <Link 
                    href={`/features/grocer/${grocer._id}/edit-location`}
                    className="inline-block mt-2 text-sm font-bold text-cta hover:underline"
                  >
                    Add Store Location →
                  </Link>
                )}
              </div>
            )}
          </div>

          {savedCount > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBasket size={18} className="text-primary" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">SAVED PRODUCE</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {grocer.savedProduce.slice(0, 6).map((produceId) => (
                  <Link key={produceId} href={`/features/produce/${produceId}`} onClick={() => dispatch(markProduceVisited(produceId))} className="flex items-center gap-2 bg-bg-alt border border-border rounded-xl px-5 py-3 hover:border-primary/40 hover:shadow-md transition-all group">
                    <Package size={14} className="text-text-muted group-hover:text-primary" />
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wide">View Produce</span>
                  </Link>
                ))}
                {savedCount > 6 && (
                  <Link href="/features/produce" className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-5 py-3 hover:bg-primary/20 transition-all">
                    <span className="text-[11px] font-bold text-primary">+{savedCount - 6} more</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}