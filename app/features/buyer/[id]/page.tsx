// features/buyer/[id]/page.tsx
"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ArrowLeft,
  Package,
  Loader2,
  LogOut,
  Users,
  Heart,
  ShoppingBasket,
  Eye,
  Calendar,
  Leaf,
  Truck,
  Award,
  TrendingUp,
  Clock,
  ChevronRight,
  Sparkles,
  Compass,
  Star,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser } from "@/store/avatarSlice";
import { clearFollowing } from "@/store/followSlice";
import ProtectedRoute from "@/components/ProtectedRoute";
import { clearSavedProduce, markProduceVisited } from "@/store/contentSlice";
import { useFollow } from "@/hooks/useFollow";
import { api } from "@/lib/api";

interface BuyerProfile {
  _id: string;
  bio: string;
  location: { address?: string; coordinates?: [number, number] };
  followers: string[];
  following: string[];
  savedProduce: string[];
  likedProduce: string[];
  mediaUrl: string;
  cloudinaryId: string;
  createdAt: string;
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

interface Order {
  _id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    _id: string;
    name: string;
    quantity: number;
    price: number;
    img?: string;
  }>;
}

interface RecommendedProduce {
  _id: string;
  name: string;
  price: number;
  unit: string;
  img: string;
  isOrganic: boolean;
  farmerId: { fullName: string };
}

// Interface for saved produce details
interface SavedProduceDetails {
  _id: string;
  name: string;
  price: number;
  unit: string;
  img: string;
  isOrganic: boolean;
  farmerId: { fullName: string };
}

export default function BuyerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.avatar.user);
  const { id } = use(params);
  const [buyer, setBuyer] = useState<BuyerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommended, setRecommended] = useState<RecommendedProduce[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const { isFollowing, toggle } = useFollow(id);
  const isOwner = currentUser?.id === id;


  const localFollowing = useAppSelector((state) => state.follow.following);

  const [savedProduceIds, setSavedProduceIds] = useState<string[]>([]);
  const [savedProduceDetails, setSavedProduceDetails] = useState<
    SavedProduceDetails[]
  >([]);
  const [savedProduceLoading, setSavedProduceLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 1) {
      loadSavedProduceFromLocalStorage();
    }
  }, [activeTab]);

  const loadSavedProduceFromLocalStorage = async () => {
    try {
      setSavedProduceLoading(true);

      const saved = localStorage.getItem("nerthus_savedProduce");
      const ids: string[] = saved ? JSON.parse(saved) : [];
      setSavedProduceIds(ids);

      if (ids.length > 0) {
        const produceDetails = await Promise.all(
          ids.map(async (produceId) => {
            try {
              const data = await api.get(`/produce/details/${produceId}`);
              if (data.success && data.produce) {
                return {
                  _id: data.produce._id,
                  name: data.produce.name,
                  price: data.produce.price,
                  unit: data.produce.unit,
                  img: data.produce.img,
                  isOrganic: data.produce.isOrganic,
                  farmerId: data.produce.farmerId || {
                    fullName: "Unknown Farmer",
                  },
                };
              }
              return null;
            } catch {
              return null;
            }
          })
        );
        setSavedProduceDetails(
          produceDetails.filter((p) => p !== null) as SavedProduceDetails[]
        );
      } else {
        setSavedProduceDetails([]);
      }
    } catch (error) {
      console.error("Error loading saved produce:", error);
      setSavedProduceDetails([]);
    } finally {
      setSavedProduceLoading(false);
    }
  };

  const impactMetrics = {
    farmsSupported: new Set(orders.flatMap((o) => o.items.map((i) => i._id)))
      .size,
    totalOrders: orders.length,
    seasonalProduce: ["Tomatoes", "Spinach", "Strawberries", "Asparagus"],
    seasonProgress: 65,
    seasonName: "Spring Harvest",
  };

  useEffect(() => {
    const loadBuyer = async () => {
      try {
        const data = await api.get(`/buyer/profile/${id}`);
        if (!data.success) {
          setBuyer(null);
          return;
        }
        setBuyer(data.buyer);
      } catch {
        router.replace("/features/buyer");
      } finally {
        setLoading(false);
      }
    };
    loadBuyer();
  }, [id, router]);

  useEffect(() => {
    if (activeTab === 0 && isOwner) {
      const loadOrders = async () => {
        try {
          setOrdersLoading(true);
          const data = await api.get("/payments/orders");
          if (data.success) setOrders(data.orders);
        } catch {
          console.error("Failed to fetch orders");
        } finally {
          setOrdersLoading(false);
        }
      };
      loadOrders();
    }
  }, [activeTab, isOwner]);

  useEffect(() => {
    const loadRandomProducts = async () => {
      try {
        setRecommendedLoading(true);
        const response = await api.get("/produce/details/");

        if (
          response.success &&
          response.produce &&
          response.produce.length > 0
        ) {
          const shuffled = [...response.produce];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          const randomThree = shuffled.slice(0, 3);
          setRecommended(randomThree);
        } else {
          setRecommended([]);
        }
      } catch (error) {
        console.error("Failed to load produce:", error);
        setRecommended([]);
      } finally {
        setRecommendedLoading(false);
      }
    };

    loadRandomProducts();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } finally {
      dispatch(clearUser());
      dispatch(clearFollowing());
      dispatch(clearSavedProduce());
      router.push("/features/auth/login");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <Loader2 className="animate-spin text-[#1a3d2b]" size={40} />
      </div>
    );

  if (!buyer)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="text-center">
          <p className="text-[#8a9a8e] mb-4">Buyer not found.</p>
          <Link
            href="/features/buyer"
            className="flex items-center justify-center gap-2 text-[#1a3d2b] hover:underline"
          >
            <ArrowLeft size={16} /> All Buyers
          </Link>
        </div>
      </div>
    );

  const avatar = buyer.userId?.avatar || "";
  const fullName = buyer.userId?.fullName || "";
  const userName = buyer.userId?.userName || "";
  const location = buyer.location?.address || "";
  const savedCount = savedProduceIds.length;

  // Get following list from Redux (localStorage)
  
  // For your own profile, show counts from localStorage
  // For others' profiles, show from API
  const displayFollowerCount = isOwner ? localFollowing.length : (buyer?.followers?.length ?? 0);
  const displayFollowingCount = isOwner ? localFollowing.length : (buyer?.following?.length ?? 0);

  return (
    <ProtectedRoute>
      <div className="bg-[#f5f0e8] min-h-screen relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -right-20 top-1/4 text-[15rem] font-black text-[#1a3d2b]/3 select-none whitespace-nowrap"
            style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
          >
            NERTHUS
          </div>
          <div
            className="absolute -left-40 bottom-1/4 text-[20rem] font-black text-[#e86c2a]/2 select-none whitespace-nowrap"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          >
            ORGANIC
          </div>
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]"></div>
        </div>

        {/* Header with larger presence */}
        <div className="bg-linear-to-br from-[#1a3d2b] via-[#1a3d2b] to-[#0e2a1d] py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/farm-pattern.svg')] opacity-5 bg-repeat"></div>

          <div className="max-w-7xl mx-auto relative">
            <div className="flex justify-between items-start mb-8">
              <Link
                href="/features/buyer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                <ArrowLeft size={13} /> Back to Marketplace
              </Link>

              {isOwner && (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white border border-white/20 hover:border-white/40 px-4 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {loggingOut ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <LogOut size={12} />
                  )}
                  {loggingOut ? "Signing out..." : "Sign Out"}
                </button>
              )}
            </div>

            <div className="flex items-start gap-6">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-[#1a3d2b]/20">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl">
                    {fullName?.[0] ?? "B"}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e8c84a] bg-[#e8c84a]/10 px-3 py-1 rounded-full">
                    Verified Buyer
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    @{userName}
                  </span>
                </div>
                <h1 className="text-6xl font-black text-white uppercase tracking-tight mb-3">
                  {fullName}
                </h1>
                {location && (
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin size={14} className="text-[#e8c84a]" />
                    <span className="text-sm">{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="space-y-4 mb-8">
                {/* Stats Card - Using localStorage counts for own profile */}
                <div className="bg-white border border-[#d4c9b0] rounded-2xl p-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <Users size={20} className="mx-auto text-[#e86c2a] mb-2" />
                      <p className="text-2xl font-black text-[#1a3d2b]">{displayFollowerCount}</p>
                      <p className="text-[8px] font-black uppercase tracking-wider text-[#8a9a8e]">FOLLOWERS</p>
                    </div>
                    <div className="text-center">
                      <Heart size={20} className="mx-auto text-[#e86c2a] mb-2" />
                      <p className="text-2xl font-black text-[#1a3d2b]">{displayFollowingCount}</p>
                      <p className="text-[8px] font-black uppercase tracking-wider text-[#8a9a8e]">FOLLOWING</p>
                    </div>
                    <div className="text-center">
                      <ShoppingBasket size={20} className="mx-auto text-[#e86c2a] mb-2" />
                      <p className="text-2xl font-black text-[#1a3d2b]">{impactMetrics.totalOrders}</p>
                      <p className="text-[8px] font-black uppercase tracking-wider text-[#8a9a8e]">ORDERS</p>
                    </div>
                  </div>
                </div>

                {/* Local Impact Widget */}
                <div className="bg-linear-to-br from-[#1a3d2b] to-[#0e2a1d] rounded-2xl p-5 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8c84a]/5 rounded-full blur-3xl"></div>
                  <div className="flex items-center gap-2 mb-4">
                    <Truck size={18} className="text-[#e8c84a]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#e8c84a]/80">
                      Your Local Impact
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-black">
                        {impactMetrics.farmsSupported || 0}
                      </p>
                      <p className="text-[10px] text-white/60">
                        Farms Supported
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>{impactMetrics.seasonName}</span>
                        <span>{impactMetrics.seasonProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#e8c84a] rounded-full"
                          style={{ width: `${impactMetrics.seasonProgress}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-white/40 mt-2">
                        Seasonal peak in 2 weeks
                      </p>
                    </div>
                  </div>
                </div>

                {/* Member Since Card */}
                <div className="bg-white border border-[#d4c9b0] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={14} className="text-[#e86c2a]" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#8a9a8e]">
                      Member Since
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#1a3d2b]">
                    {new Date(buyer.createdAt).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {buyer.bio && (
                    <>
                      <div className="h-px bg-[#d4c9b0] my-3" />
                      <p className="text-xs text-[#4a5a4e] leading-relaxed">
                        {buyer.bio}
                      </p>
                    </>
                  )}
                </div>

                {!isOwner && (
                  <button
                    onClick={toggle}
                    className={`w-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest px-5 py-3 rounded-xl transition-all ${
                      isFollowing
                        ? "bg-[#f5f0e8] text-[#1a3d2b] border-2 border-[#1a3d2b]/20 hover:border-[#1a3d2b]/40"
                        : "bg-[#1a3d2b] text-[#e8c84a] hover:bg-[#2a5a3b] shadow-lg"
                    }`}
                  >
                    {isFollowing ? "✓ Following" : "+ Follow This Buyer"}
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-1 mb-8 bg-white rounded-xl p-1.5 border border-[#d4c9b0] w-fit">
                {[
                  { label: "Order History", icon: Package },
                  { label: "Saved Produce", icon: Heart },
                  { label: "Activity Feed", icon: Sparkles },
                  { label: "Discover", icon: Compass },
                ].map(({ label, icon: Icon }, i) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                      activeTab === i
                        ? "bg-[#1a3d2b] text-[#e8c84a] shadow-sm"
                        : "text-[#4a5a4e] hover:text-[#1a3d2b] hover:bg-[#f5f0e8]"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab 0: Orders */}
              {activeTab === 0 && (
                <div>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2
                        className="animate-spin text-[#1a3d2b]"
                        size={40}
                      />
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div
                          key={order._id}
                          className="bg-white border border-[#d4c9b0] rounded-xl p-5 hover:border-[#1a3d2b]/40 hover:shadow-md transition-all"
                        >
                          <div className="flex flex-wrap justify-between items-start mb-4">
                            <div>
                              <p className="text-sm font-bold text-[#1a3d2b]">
                                Order #{order.orderId.slice(-8)}
                              </p>
                              <p className="text-xs text-[#8a9a8e] mt-1">
                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="border-t border-[#d4c9b0] pt-4 mb-4">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 mb-2"
                              >
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f5f0e8] relative">
                                  {item.img ? (
                                    <Image
                                      src={item.img}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <Package
                                      size={16}
                                      className="absolute inset-0 m-auto text-[#8a9a8e]"
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-[#1a3d2b]">
                                    {item.name}
                                  </p>
                                  <p className="text-[10px] text-[#8a9a8e]">
                                    {item.quantity} × ₹{item.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-xs text-[#8a9a8e] mt-2">
                                + {order.items.length - 2} more items
                              </p>
                            )}
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-xl font-black text-[#e86c2a]">
                              ₹{order.totalAmount.toFixed(0)}
                            </p>
                            <Link
                              href={`/features/orders/${order.orderId}`}
                              className="flex items-center gap-2 text-[10px] font-bold text-[#1a3d2b] hover:underline"
                            >
                              <Eye size={12} /> View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                      {orders.length > 5 && (
                        <Link
                          href="/features/orders"
                          className="flex items-center justify-center gap-2 text-center w-full py-3 text-[11px] font-bold text-[#1a3d2b] hover:underline"
                        >
                          View All {orders.length} Orders{" "}
                          <ChevronRight size={12} />
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#d4c9b0] rounded-2xl p-12 text-center">
                      <Package
                        size={56}
                        className="mx-auto text-[#8a9a8e] mb-4"
                      />
                      <p className="text-xl text-[#1a3d2b] font-black mb-2">
                        No orders yet
                      </p>
                      <p className="text-sm text-[#8a9a8e] mb-8">
                        Ready to taste the freshest organic produce?
                      </p>
                      <Link
                        href="/features/produce"
                        className="inline-flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] px-6 py-3 rounded-xl hover:bg-[#2a5a3b] transition-colors font-bold text-sm"
                      >
                        <ShoppingBasket size={16} /> Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 1: Saved Produce */}
              {activeTab === 1 && (
                <div>
                  {savedProduceLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2
                        className="animate-spin text-[#1a3d2b]"
                        size={40}
                      />
                    </div>
                  ) : savedProduceDetails.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedProduceDetails.map((produce) => (
                        <Link
                          key={produce._id}
                          href={`/features/produce/${produce._id}`}
                          onClick={() =>
                            dispatch(markProduceVisited(produce._id))
                          }
                          className="bg-white border border-[#d4c9b0] rounded-xl overflow-hidden hover:border-[#1a3d2b]/40 hover:shadow-md transition-all group"
                        >
                          <div className="relative w-full h-36 bg-[#f5f0e8] overflow-hidden">
                            {produce.img ? (
                              <Image
                                src={produce.img}
                                alt={produce.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={32} className="text-[#8a9a8e]" />
                              </div>
                            )}
                            {produce.isOrganic && (
                              <span className="absolute top-2 left-2 bg-[#1a3d2b] text-[#e8c84a] text-[8px] font-black px-2 py-0.5 rounded-full">
                                ORGANIC
                              </span>
                            )}
                            <button
                              className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                const updated = savedProduceIds.filter(
                                  (id) => id !== produce._id
                                );
                                localStorage.setItem(
                                  "nerthus_savedProduce",
                                  JSON.stringify(updated)
                                );
                                loadSavedProduceFromLocalStorage();
                              }}
                            >
                              <Heart
                                size={12}
                                className="fill-red-500 text-red-500"
                              />
                            </button>
                          </div>
                          <div className="p-3">
                            <h4 className="font-bold text-[#1a3d2b] text-sm">
                              {produce.name}
                            </h4>
                            <p className="text-[10px] text-[#8a9a8e]">
                              by {produce.farmerId.fullName}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-base font-black text-[#e86c2a]">
                                ₹{produce.price}/{produce.unit}
                              </span>
                              <span className="text-[10px] text-[#1a3d2b] font-bold">
                                View →
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="bg-white border border-[#d4c9b0] rounded-2xl p-12 text-center">
                        <Heart
                          size={56}
                          className="mx-auto text-[#8a9a8e] mb-4"
                        />
                        <p className="text-xl text-[#1a3d2b] font-black mb-2">
                          Your saved list is empty
                        </p>
                        <p className="text-sm text-[#8a9a8e] mb-8">
                          Save products you love to see them here
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-black text-[#1a3d2b] uppercase tracking-tight">
                              ✨ Featured for You
                            </h3>
                            <p className="text-xs text-[#8a9a8e] mt-1">
                              Based on seasonal freshness
                            </p>
                          </div>
                          <Link
                            href="/features/produce"
                            className="text-[10px] font-bold text-[#e86c2a] hover:underline"
                          >
                            Browse All →
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {recommendedLoading
                            ? Array(3)
                                .fill(0)
                                .map((_, i) => (
                                  <div
                                    key={i}
                                    className="bg-white border border-[#d4c9b0] rounded-xl p-4 animate-pulse"
                                  >
                                    <div className="w-full h-32 bg-[#f5f0e8] rounded-lg mb-3"></div>
                                    <div className="h-4 bg-[#f5f0e8] rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-[#f5f0e8] rounded w-1/2"></div>
                                  </div>
                                ))
                            : recommended.map((item) => (
                                <Link
                                  key={item._id}
                                  href={`/features/produce/${item._id}`}
                                  className="bg-white border border-[#d4c9b0] rounded-xl overflow-hidden hover:border-[#1a3d2b]/40 hover:shadow-md transition-all group"
                                >
                                  <div className="relative w-full h-36 bg-[#f5f0e8] overflow-hidden">
                                    {item.img ? (
                                      <Image
                                        src={item.img}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Leaf
                                          size={32}
                                          className="text-[#8a9a8e]"
                                        />
                                      </div>
                                    )}
                                    {item.isOrganic && (
                                      <span className="absolute top-2 left-2 bg-[#1a3d2b] text-[#e8c84a] text-[8px] font-black px-2 py-0.5 rounded-full">
                                        ORGANIC
                                      </span>
                                    )}
                                  </div>
                                  <div className="p-3">
                                    <h4 className="font-bold text-[#1a3d2b] text-sm">
                                      {item.name}
                                    </h4>
                                    <p className="text-[10px] text-[#8a9a8e]">
                                      by {item.farmerId.fullName}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                      <span className="text-base font-black text-[#e86c2a]">
                                        ₹{item.price}/{item.unit}
                                      </span>
                                      <span className="text-[10px] text-[#1a3d2b] font-bold">
                                        Save →
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Activity Feed */}
              {activeTab === 2 && (
                <div>
                  <div className="bg-white border border-[#d4c9b0] rounded-2xl p-8">
                    {orders.length > 0 ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-[#d4c9b0]">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Award size={20} className="text-[#1a3d2b]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1a3d2b]">
                              First Purchase Unlocked!
                            </p>
                            <p className="text-[10px] text-[#8a9a8e]">
                              {new Date(
                                orders[0]?.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Truck size={20} className="text-[#e86c2a]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1a3d2b]">
                              {impactMetrics.farmsSupported} Farms Supported
                            </p>
                            <p className="text-[10px] text-[#8a9a8e]">
                              You're making a difference in local agriculture
                            </p>
                          </div>
                        </div>
                        <div className="pt-4">
                          <Link
                            href="/features/produce"
                            className="inline-flex items-center gap-2 text-[11px] font-bold text-[#1a3d2b] hover:underline"
                          >
                            Continue your journey <TrendingUp size={14} />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Sparkles
                          size={48}
                          className="mx-auto text-[#8a9a8e] mb-4"
                        />
                        <p className="text-lg text-[#1a3d2b] font-semibold mb-2">
                          Your activity feed
                        </p>
                        <p className="text-sm text-[#8a9a8e]">
                          Make your first purchase to start tracking your impact
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Discover */}
              {activeTab === 3 && (
                <div className="space-y-8">
                  <div className="bg-linear-to-r from-[#e8c84a]/20 to-transparent rounded-2xl p-6 border border-[#e8c84a]/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#e86c2a] mb-2">
                          Season's Best
                        </p>
                        <h3 className="text-2xl font-black text-[#1a3d2b] mb-2">
                          Spring Harvest is Here!
                        </h3>
                        <p className="text-sm text-[#4a5a4e] mb-4">
                          Fresh asparagus, strawberries, and early tomatoes
                        </p>
                        <Link
                          href="/features/produce?season=spring"
                          className="inline-flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] px-4 py-2 rounded-xl text-[10px] font-bold"
                        >
                          Explore Seasonal <ChevronRight size={12} />
                        </Link>
                      </div>
                      <Leaf size={48} className="text-[#e8c84a]/30" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-[#1a3d2b] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Compass size={16} className="text-[#e86c2a]" />
                      Top Rated This Week
                    </h3>

                    {recommendedLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="bg-white border border-[#d4c9b0] rounded-xl p-4 animate-pulse"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-[#f5f0e8] rounded-xl"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-[#f5f0e8] rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-[#f5f0e8] rounded w-1/4"></div>
                              </div>
                              <div className="w-12 h-6 bg-[#f5f0e8] rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : recommended.length > 0 ? (
                      <div className="space-y-3">
                        {recommended.slice(0, 3).map((item, index) => (
                          <Link
                            key={item._id}
                            href={`/features/produce/${item._id}`}
                            className="flex items-center gap-4 bg-white border border-[#d4c9b0] rounded-xl p-4 hover:border-[#1a3d2b]/40 hover:shadow-md transition-all group"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                                index === 0
                                  ? "bg-[#e8c84a] text-[#1a3d2b]"
                                  : index === 1
                                  ? "bg-[#d4c9b0] text-[#1a3d2b]"
                                  : "bg-[#f5f0e8] text-[#8a9a8e]"
                              }`}
                            >
                              #{index + 1}
                            </div>

                            <div className="w-16 h-16 rounded-xl bg-[#f5f0e8] flex items-center justify-center relative overflow-hidden">
                              {item.img ? (
                                <Image
                                  src={item.img}
                                  alt={item.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <Package size={24} className="text-[#8a9a8e]" />
                              )}
                              {item.isOrganic && (
                                <div className="absolute top-0 right-0 bg-[#1a3d2b] text-[#e8c84a] text-[6px] font-black px-1 py-0.5 rounded-bl-lg">
                                  ORG
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-[#1a3d2b] group-hover:text-[#e86c2a] transition-colors">
                                  {item.name}
                                </h4>
                              </div>
                              <p className="text-[10px] text-[#8a9a8e]">
                                by {item.farmerId?.fullName || "Local Farmer"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-0.5">
                                  <Star
                                    size={10}
                                    className="fill-[#e8c84a] text-[#e8c84a]"
                                  />
                                  <span className="text-[10px] font-bold text-[#1a3d2b]">
                                    4.8
                                  </span>
                                </div>
                                <span className="text-[9px] text-[#8a9a8e]">
                                  (124 reviews)
                                </span>
                                {item.isOrganic && (
                                  <>
                                    <span className="text-[9px] text-[#8a9a8e]">
                                      •
                                    </span>
                                    <Leaf size={9} className="text-[#1a3d2b]" />
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-lg font-black text-[#e86c2a]">
                                ₹{item.price}
                              </span>
                              <p className="text-[9px] text-[#8a9a8e]">
                                per {item.unit}
                              </p>
                            </div>

                            <ChevronRight
                              size={16}
                              className="text-[#8a9a8e] group-hover:text-[#1a3d2b] transition-colors"
                            />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white border border-[#d4c9b0] rounded-2xl p-8 text-center">
                        <Package
                          size={40}
                          className="mx-auto text-[#8a9a8e] mb-3"
                        />
                        <p className="text-sm text-[#1a3d2b] font-semibold mb-1">
                          No products yet
                        </p>
                        <p className="text-xs text-[#8a9a8e]">
                          Check back soon for fresh produce!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}