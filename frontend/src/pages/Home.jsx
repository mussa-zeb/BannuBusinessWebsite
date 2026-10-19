
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowRight,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Zap,
  Search,
  Store,
  Users,
  ShoppingBag,
  Award,
} from "lucide-react";

import api from "../api/api";

const FALLBACK_IMAGE =
  "https://placehold.co/400x450/F3F4F6/111111?text=No+Image";

/* ANIMATED COUNTER */
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return;

    let frameId;
    let started = false;
    let startTime = null;
    const duration = 1800;

    const animate = (time) => {
      if (startTime === null) startTime = time;

      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          frameId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [element, target]);

  return (
    <span ref={setElement}>
      {count.toLocaleString("en-PK")}
      {suffix}
    </span>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        if (active) {
          setProducts(prodRes.data?.products || []);
          setCategories(catRes.data?.categories || []);
        }
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(
        `/products?search=${encodeURIComponent(searchQuery)}`
      );
    }
  };

  const featured = products.slice(0, 8);

  const deals = products
    .filter((p) => Number(p.discountPrice) > 0)
    .slice(0, 4);

  const features = [
    {
      icon: Truck,
      title: "Fast Local Delivery",
      sub: "Same-day delivery across Bannu",
    },
    {
      icon: ShieldCheck,
      title: "100% Verified Sellers",
      sub: "Authentic local shopkeepers",
    },
    {
      icon: RefreshCw,
      title: "Easy Return Policy",
      sub: "Hassle-free 7-day returns",
    },
    {
      icon: Headphones,
      title: "24/7 Dedicated Support",
      sub: "Always here to help you",
    },
  ];

  /* STATS */
  const stats = [
    {
      icon: Store,
      value: 50,
      suffix: "+",
      label: "Local Bannu Shops",
    },
    {
      icon: ShoppingBag,
      value: 1000,
      suffix: "+",
      label: "Listed Products",
    },
    {
      icon: Users,
      value: 5000,
      suffix: "+",
      label: "Happy Customers",
    },
    {
      icon: Award,
      value: 100,
      suffix: "%",
      label: "Satisfaction Rate",
    },
  ];

  const testimonials = [
    {
      initials: "AH",
      name: "Ahmad Hassan",
      role: "Verified Buyer",
      comment:
        "Bannu local shops se online khareedari bohot asan ho gayi hai. Delivery bilkul time par milti hai!",
    },
    {
      initials: "ZK",
      name: "Zahir Khan",
      role: "Shop Owner",
      comment:
        "Mera mobile shop hai Bannu mein, yahan seller register karne ke baad meri sales double ho gayi hain.",
    },
    {
      initials: "US",
      name: "Usman Shah",
      role: "Verified Buyer",
      comment:
        "Clean design, fast checkout, aur sab se achi baat ke Cash on Delivery option hassle-free hai.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] text-[#111111]">
      <main className="flex-1">

        {/* HERO SECTION */}

        <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[#111111] text-white">
          <div className="absolute inset-0 z-0">
            <video
              className="h-full w-full object-cover opacity-90"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source
                src="/hero-video.mp4"
                type="video/mp4"
              />
            </video>

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-md">
                <Zap size={14} className="text-yellow-400" />
                Bannu's Premier Digital Marketplace
              </span>

              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Experience Local Shopping
                <br />
                <span className="text-gray-400">
                  At Its Finest
                </span>
              </h1>

              <p className="mt-6 text-sm font-normal leading-relaxed text-gray-300 sm:text-base">
                Connecting Bannu's top local boutique and shop
                owners directly to your doorstep with guaranteed
                quality and swift delivery.
              </p>

              {/* SEARCH BAR */}

              <form
                onSubmit={handleSearch}
                className="mt-8 flex max-w-xl items-center rounded-full bg-white p-2 shadow-2xl"
              >
                <div className="flex flex-1 items-center gap-3 px-4 text-gray-400">
                  <Search size={18} className="text-black" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="Search products, brands, or local shops..."
                    className="w-full bg-transparent text-xs font-medium text-[#111111] outline-none placeholder:text-gray-400 sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-full bg-[#111111] px-7 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-neutral-800"
                >
                  Search
                </button>
              </form>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-black text-black shadow-lg transition hover:bg-gray-100"
                >
                  Explore Catalog
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/register?role=seller"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-4 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
                >
                  Register Your Shop
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ANIMATED STATS */}

        <section className="border-t border-gray-800 bg-[#111111] py-12 text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
            {stats.map((s, idx) => {
              const Icon = s.icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.1,
                  }}
                  className="flex flex-col items-center rounded-2xl border border-gray-800/60 bg-neutral-900/50 p-4 transition duration-300 hover:-translate-y-1 hover:border-gray-600 hover:bg-neutral-900"
                >
                  <Icon
                    size={22}
                    className="mb-2 text-gray-400"
                  />

                  <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                    <AnimatedCounter
                      target={s.value}
                      suffix={s.suffix}
                    />
                  </h3>

                  <p className="mt-1 text-xs font-medium text-gray-400">
                    {s.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FEATURES */}

        <section className="border-b border-gray-200 bg-white py-4">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-6 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon;

              return (
                <div
                  key={i}
                  className="flex items-center gap-4 p-2"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-black transition hover:bg-black hover:text-white">
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#111111]">
                      {f.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {f.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CATEGORIES */}

        {categories.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Browse Collections
                </p>

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Shop by Category
                </h2>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-1 text-sm font-bold text-black underline-offset-4 hover:underline"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-black hover:shadow-lg"
                >
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-50 transition group-hover:bg-black group-hover:text-white">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black">
                        {cat.name?.[0]}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#111111]">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* TODAY'S DEALS */}

        {deals.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 pb-16">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-[#111111] p-8 text-white shadow-xl lg:p-12">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <Zap size={14} className="text-yellow-400" />
                    Special Offers
                  </span>

                  <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    Today's Hot Deals
                  </h2>
                </div>

                <Link
                  to="/products"
                  className="rounded-full border border-white/30 px-6 py-2.5 text-xs font-bold transition hover:bg-white hover:text-black"
                >
                  Explore All Deals
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {deals.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    dark
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FEATURED PRODUCTS */}

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:pb-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                Handpicked items
              </p>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-bold text-black underline-offset-4 hover:underline"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
                >
                  <div className="aspect-square rounded-xl bg-gray-100" />

                  <div className="mt-4 space-y-3">
                    <div className="h-4 rounded bg-gray-100" />
                    <div className="h-3 w-2/3 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* TESTIMONIALS */}

        <section className="border-t border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Community Trust
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                What People Say About Us
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {testimonials.map((t, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-[#F9FAFB] p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex gap-1 text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className="fill-black text-black"
                      />
                    ))}
                  </div>

                  <p className="flex-1 text-xs leading-relaxed text-gray-600">
                    "{t.comment}"
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-gray-200 pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-black text-white">
                      {t.initials}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#111111]">
                        {t.name}
                      </h4>

                      <p className="text-[10px] font-medium text-gray-400">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SELLER CTA */}

        <section className="bg-[#111111] py-16 text-white">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Are You a Shop Owner in Bannu?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-400">
              Expand your business beyond your physical shop.
              Register as a seller today on Bannu Marketplace
              and start selling to thousands of local customers.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/register?role=seller"
                className="rounded-full bg-white px-8 py-3.5 text-xs font-black text-black shadow-lg transition hover:bg-gray-100"
              >
                Start Selling Today
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

/* PRODUCT CARD */

function ProductCard({ product, dark = false }) {
  const price = Number(
    product.discountPrice > 0
      ? product.discountPrice
      : product.price || 0
  );

  const original =
    Number(product.discountPrice) > 0
      ? Number(product.price || 0)
      : null;

  const off =
    original > 0 && original > price
      ? Math.round(
          ((original - price) / original) * 100
        )
      : 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        dark
          ? "border-gray-800 bg-[#1A1A1A] text-white"
          : "border-gray-200 bg-white text-black"
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#111111] px-3 py-1 text-[10px] font-bold text-white shadow-md">
            -{off}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p
          className={`line-clamp-2 min-h-[40px] text-sm font-bold transition ${
            dark
              ? "text-gray-300 group-hover:text-white"
              : "text-gray-800 group-hover:text-black"
          }`}
        >
          {product.name}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <Star
            size={14}
            className={
              dark
                ? "fill-white text-white"
                : "fill-black text-black"
            }
          />

          <span
            className={`text-xs font-bold ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {product.rating
              ? Number(product.rating).toFixed(1)
              : "New"}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <span
              className={`text-lg font-black ${
                dark ? "text-white" : "text-black"
              }`}
            >
              Rs {price.toLocaleString("en-PK")}
            </span>

            {original > price && (
              <span
                className={`text-xs line-through ${
                  dark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Rs {original.toLocaleString("en-PK")}
              </span>
            )}
          </div>

          <div
            className={`mt-4 border-t pt-4 ${
              dark ? "border-gray-800" : "border-gray-100"
            }`}
          >
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold transition group-hover:gap-2.5 ${
                dark ? "text-white" : "text-black"
              }`}
            >
              View Product
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
