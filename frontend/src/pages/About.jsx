
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Target,
  CheckCircle2,
  Sparkles,
  Users,
  Store,
  Search,
  ArrowRight,
  MapPin,
  Star,
  BriefcaseBusiness,
  BadgeCheck,
  Globe2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

/* STATS */
const stats = [
  {
    value: 500,
    suffix: "+",
    label: "Local Businesses",
    icon: Store,
  },
  {
    value: 20,
    suffix: "+",
    label: "Categories",
    icon: BriefcaseBusiness,
  },
  {
    value: 10,
    suffix: "K+",
    label: "Monthly Visitors",
    icon: Users,
  },
  {
    value: 99,
    suffix: "%",
    label: "Verified Listings",
    icon: BadgeCheck,
  },
];

/* FEATURES */
const features = [
  {
    icon: Search,
    title: "Easy Business Search",
    desc: "Find local businesses, shops, and services quickly using our advanced search.",
  },
  {
    icon: MapPin,
    title: "Local Discovery",
    desc: "Discover businesses around Bannu with accurate location and contact information.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Listings",
    desc: "We review and manage business information to ensure data accuracy.",
  },
  {
    icon: Store,
    title: "Owner Dashboard",
    desc: "Business owners get a powerful dashboard to manage profiles and bookings.",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    desc: "Customers can share their genuine experiences through reviews and ratings.",
  },
  {
    icon: Globe2,
    title: "Digital Visibility",
    desc: "We give local businesses a modern online presence to reach more customers.",
  },
];

/* HOW IT WORKS */
const steps = [
  {
    number: "01",
    title: "Create an Account",
    desc: "Register as a customer or business owner and create your secure account.",
  },
  {
    number: "02",
    title: "Discover Businesses",
    desc: "Search businesses, products, and services using categories and keywords.",
  },
  {
    number: "03",
    title: "Connect & Book",
    desc: "Contact businesses, explore products, and make service bookings instantly.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white text-[#111111]">

      {/* HERO SECTION - ORIGINAL DESIGN */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2000&q=80"
            alt="About Bannu Business Platform"
            className="h-full w-full object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
              <Sparkles size={14} />
              About Bannu Marketplace
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Connecting
              <br />
              <span className="text-gray-400">
                Bannu Businesses
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Bannu Business Platform is designed to bring
              local businesses, products, services, and customers
              together through one modern digital marketplace.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-black transition hover:bg-gray-200"
              >
                Explore Products
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-black"
              >
                Register Your Business
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROFESSIONAL STATS */}
      <section className="relative z-20 mx-auto -mt-12 max-w-7xl px-6">
        <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group border-b border-gray-200 p-6 text-center transition duration-300 hover:bg-gray-50 sm:p-8 lg:border-b-0 lg:border-r last:lg:border-r-0"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-black transition duration-300 group-hover:bg-black group-hover:text-white">
                  <Icon size={24} strokeWidth={1.8} />
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-tight text-[#111111] sm:text-4xl">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                  />
                </h2>

                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 sm:text-xs">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:py-28">
        <div className="mb-12 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-600">
            <Sparkles size={14} />
            Who We Are
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-[#111111] sm:text-5xl">
            Empowering Local Business.
            <span className="block text-gray-400">
              Connecting Our Community.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            We help Bannu businesses build their digital presence
            and make it easier for customers to discover local
            products, services, and trusted businesses.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group rounded-3xl border border-gray-200 bg-gray-50 p-8 transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:bg-white hover:shadow-xl sm:p-10"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <Target size={26} />
              </div>

              <span className="text-5xl font-black text-gray-200">
                01
              </span>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Our Mission
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
              Making Local Discovery Easier
            </h3>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              Our mission is to bring local businesses and customers
              together through a simple digital platform where
              people can explore business profiles, find useful
              services, and connect with local providers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="group rounded-3xl border border-gray-200 bg-gray-50 p-8 transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:bg-white hover:shadow-xl sm:p-10"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <ShieldCheck size={26} />
              </div>

              <span className="text-5xl font-black text-gray-200">
                02
              </span>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Our Vision
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
              A Stronger Digital Community
            </h3>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              Our vision is to create a connected local marketplace
              where businesses can improve their online visibility
              and customers can find local products and services
              with greater convenience and confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PROFESSIONAL FEATURES */}
      <section className="border-y border-gray-200 bg-gray-50 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-600">
              <CheckCircle2 size={14} />
              Platform Features
            </span>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-[#111111] sm:text-5xl">
              Everything in One Place
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
              Powerful and convenient features designed to connect
              customers, business owners, and the Bannu community.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.4,
                    delay: (i % 3) * 0.08,
                  }}
                  className="group rounded-2xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-[#111111] transition duration-300 group-hover:bg-[#111111] group-hover:text-white">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-6 text-lg font-extrabold tracking-tight text-[#111111]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {feature.desc}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-gray-500 transition group-hover:text-black">
                    Built for local business
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-600">
            <CheckCircle2 size={14} />
            Simple Process
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#111111] sm:text-5xl">
            How the Platform Works
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
            Get started in a few simple steps and connect with
            the local business community.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl font-black tracking-tight text-gray-200">
                  {step.number}
                </span>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black">
                  <ArrowRight size={18} />
                </div>
              </div>

              <h3 className="mt-8 text-xl font-black tracking-tight">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {step.desc}
              </p>

              <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROFESSIONAL CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] bg-[#111111] px-6 py-16 text-center text-white sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black shadow-lg">
              <Store size={28} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              For Business Owners
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Grow Your Business Online
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
              Register your business and showcase your products,
              services, and business information to customers
              through the Bannu Business Platform.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-black transition hover:bg-gray-200"
              >
                Add Your Business
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/categories"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-black"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
