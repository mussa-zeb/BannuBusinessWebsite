import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Store, MapPin, Star, ArrowLeft, Package, ShoppingBag, ShieldCheck, AlertCircle, LoaderCircle, Heart, ArrowRight } from "lucide-react";
import api from "../api/api";

const FALLBACK_IMAGE = "https://placehold.co/600x600/F3F4F6/111111?text=No+Image";

export default function SellerProfile() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadSellerProducts() {
      setLoading(true); setError("");
      try {
        const [prodRes] = await Promise.all([api.get("/products", { params: { seller: id } })]);
        if (active) setProducts(prodRes.data?.products || []);
      } catch (err) {
        if (active) setError(err.response?.data?.message || "Unable to load this seller's products. Please try again.");
      } finally { if (active) setLoading(false); }
    }
    loadSellerProducts();
    return () => { active = false; };
  }, [id]);

  // Note: If your API returns seller details, you can fetch them here.
  // For now, we derive the name from the products or use a generic title.
  const sellerName = products[0]?.seller?.shopName || products[0]?.seller?.name || "Seller Store";

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center bg-[#F9FAFB]"><LoaderCircle size={36} className="animate-spin text-[#111111]" /></div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111111] pb-24">
      {/* SELLER BANNER */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-400 transition hover:text-white"><ArrowLeft size={16} /> Back to home</Link>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-white shadow-xl">
              {products[0]?.seller?.shopLogo ? <img src={products[0].seller.shopLogo} alt="Logo" className="h-full w-full object-cover" /> : <Store size={40} className="text-black" />}
            </div>
            <div className="min-w-0 flex-1 text-white">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-gray-200"><ShieldCheck size={14} /> Verified Seller Store</div>
              <h1 className="break-words text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">{sellerName}<span className="text-gray-400">.</span></h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300">{products[0]?.seller?.shopDescription || "Discover quality products available directly from this seller store."}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <span className="inline-flex items-center gap-2"><Package size={16} /> {products.length} {products.length === 1 ? "product" : "products"}</span>
                {products[0]?.seller?.city && <span className="inline-flex items-center gap-2"><MapPin size={16} /> {products[0].seller.city}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Explore the collection</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-black">Products from this seller</h2>
          <p className="mt-2 text-sm text-gray-500">Browse available items and select what you need.</p>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center">
            <AlertCircle size={40} className="mx-auto text-red-500" />
            <h3 className="mt-4 text-lg font-black text-red-700">Unable to load products</h3>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700">Try again</button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100"><ShoppingBag size={36} className="text-gray-400" /></div>
            <h3 className="mt-6 text-xl font-black text-black">No products listed yet</h3>
            <p className="mt-2 text-sm text-gray-500">This seller hasn't added any products yet. Please check back later.</p>
            <Link to="/" className="mt-8 inline-flex rounded-full bg-[#111111] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-black">Continue shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {products.map((p) => {
              const price = Number(p.discountPrice > 0 ? p.discountPrice : p.price || 0);
              const original = Number(p.discountPrice) > 0 ? Number(p.price || 0) : null;
              const off = original > 0 && original > price ? Math.round(((original - price) / original) * 100) : 0;
              return (
                <Link key={p._id} to={`/product/${p._id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img src={p.image || FALLBACK_IMAGE} alt={p.name} onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm backdrop-blur transition hover:bg-white hover:text-red-500"><Heart size={16} /></button>
                    {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-[#111111] px-3 py-1 text-[10px] font-bold text-white shadow-md">-{off}% OFF</span>}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="line-clamp-2 min-h-[40px] text-sm font-bold text-gray-800 transition group-hover:text-black">{p.name}</p>
                    <div className="mt-2 flex items-center gap-1.5"><Star size={14} className="fill-black text-black" /><span className="text-xs font-bold text-gray-500">{p.rating ? Number(p.rating).toFixed(1) : "New"}</span></div>
                    <div className="mt-auto pt-4">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-lg font-black text-black">Rs {price.toLocaleString("en-PK")}</span>
                        {original > price && <span className="text-xs line-through text-gray-400">Rs {original.toLocaleString("en-PK")}</span>}
                      </div>
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black transition group-hover:gap-2.5">View Details <ArrowRight size={14} /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}