import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Star, SlidersHorizontal, X, Heart, ArrowRight } from "lucide-react";
import api from "../api/api";

const FALLBACK_IMAGE = "https://placehold.co/400x450/F3F4F6/111111?text=No+Image";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "newest";

  const [searchInput, setSearchInput] = useState(search);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Keep search input synced when URL search changes (e.g., back/forward navigation)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    (async () => {
      try {
        const catRes = await api.get("/categories");
        setCategories(catRes.data?.categories || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const q = {};
        if (search) q.search = search;
        if (category) q.category = category;
        if (sort) q.sort = sort;
        if (minPrice) q.minPrice = minPrice;
        if (maxPrice) q.maxPrice = maxPrice;
        const res = await api.get("/products", { params: q });
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [search, category, sort, minPrice, maxPrice]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setMinPrice("");
    setMaxPrice("");
    setParams({});
  };

  const activeFilters = !!(search || category || minPrice || maxPrice);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111111] pb-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-[#111111] text-white shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=80"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/35" />
          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300">
                Bannu Marketplace
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {category || "Discover Products"}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
                Explore products from local shops and find something you'll love.
              </p>
              <p className="mt-4 text-sm font-semibold text-white">
                {products.length} {products.length === 1 ? "product" : "products"} found
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-white/20 lg:hidden"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                aria-label="Sort products"
                className="rounded-full border border-white/30 bg-white px-5 py-2.5 text-sm font-semibold text-black outline-none transition focus:border-black shadow-sm"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </section>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => updateParam("category", "")}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
              !category
                ? "bg-[#111111] text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() =>
                updateParam("category", category === c.name ? "" : c.name)
              }
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                category === c.name
                  ? "bg-[#111111] text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } h-fit space-y-6 lg:sticky lg:top-24 lg:block`}
          >
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 border-b border-gray-100 pb-5">
                <h2 className="text-lg font-black">Refine Results</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Use filters to find what you need.
                </p>
              </div>
              <form onSubmit={submitSearch} className="mb-8">
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-gray-500">
                  Search
                </label>
                <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="bg-[#111111] px-4 text-white hover:bg-black transition-colors"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              <div className="mb-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Categories
                </p>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => updateParam("category", "")}
                    className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                      !category
                        ? "bg-[#111111] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => updateParam("category", c.name)}
                      className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                        category === c.name
                          ? "bg-[#111111] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Price Range (Rs)
                </p>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              {activeFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                  <X size={16} /> Clear All Filters
                </button>
              )}
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
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
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
                <p className="text-lg font-black text-black">No products found</p>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your filters or search term.
                </p>
                {activeFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-6 rounded-full bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const price = Number(
    product.discountPrice > 0 ? product.discountPrice : product.price || 0
  );
  const original =
    Number(product.discountPrice) > 0 ? Number(product.price || 0) : null;
  const off =
    original > 0 && original > price
      ? Math.round(((original - price) / original) * 100)
      : 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
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
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm backdrop-blur transition hover:bg-white hover:text-red-500"
        >
          <Heart size={16} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="line-clamp-2 min-h-[40px] text-sm font-bold text-gray-800 transition group-hover:text-black">
          {product.name}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <Star size={14} className="fill-black text-black" />
          <span className="text-xs font-bold text-gray-500">
            {product.rating ? Number(product.rating).toFixed(1) : "New"}
          </span>
        </div>
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-black text-black">
              Rs {price.toLocaleString("en-PK")}
            </span>
            {original > price && (
              <span className="text-xs line-through text-gray-400">
                Rs {original.toLocaleString("en-PK")}
              </span>
            )}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black transition group-hover:gap-2.5">
              View Product <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}