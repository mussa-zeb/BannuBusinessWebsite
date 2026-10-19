import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Layers3,
  ShoppingBag,
  X,
  Package,
} from "lucide-react";
import api from "../api/api";

const FALLBACK_IMAGE = "https://placehold.co/600x400/F3F4F6/111111?text=Category";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [categoryResponse, productResponse] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);
        if (!active) return;
        setCategories(categoryResponse.data?.categories || []);
        setProducts(productResponse.data?.products || []);
      } catch (err) {
        if (active) setError("We couldn't load categories. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const countFor = (name) => {
    const key = (name || "").toLowerCase().trim();
    return products.filter((p) => {
      const cat = typeof p.category === "object" ? p.category?.name : p.category;
      return (cat || "").toLowerCase().trim() === key;
    }).length;
  };

  const filteredCategories = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return categories;
    return categories.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(term) ||
        (c.description || "").toLowerCase().includes(term)
    );
  }, [categories, search]);

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#111111] pb-24">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#111111] text-white">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/45" />
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:py-28">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                <Layers3 size={14} /> Bannu Marketplace
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Find your next favorite
                <span className="block text-gray-300">by category.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
                Browse local collections, discover products from Bannu businesses, and find what you need in one place.
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <Stat label="Categories" value={loading ? "…" : categories.length} />
              <Stat label="Products" value={loading ? "…" : products.length} />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* TOOLBAR */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Discover local products
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
              Explore Categories
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {loading
                ? "Loading categories..."
                : `${filteredCategories.length} ${
                    filteredCategories.length === 1 ? "category" : "categories"
                  } found`}
            </p>
          </div>

          <div className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm transition focus-within:border-black focus-within:ring-2 focus-within:ring-gray-100 lg:max-w-sm">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-black"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-gray-200 bg-white p-4"
              >
                <div className="h-48 rounded-2xl bg-gray-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-5 rounded bg-gray-100" />
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
            <Package size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-black text-black">
              Unable to load categories
            </h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
            >
              Try Again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
            <ShoppingBag size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-black text-black">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search term.
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-6 rounded-full bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCategories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={category.image || FALLBACK_IMAGE}
                    alt={category.name}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                      {countFor(category.name)} Products
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-sm transition group-hover:bg-black group-hover:text-white">
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-black transition group-hover:text-gray-600">
                    {category.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                    {category.description || "Explore this collection"}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black transition group-hover:gap-2.5">
                      Browse Products <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
        {label}
      </p>
    </div>
  );
}