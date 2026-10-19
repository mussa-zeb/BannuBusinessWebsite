import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Star, ShoppingCart, Zap, Truck, ShieldCheck, RefreshCw, Store, ArrowLeft, Plus, Minus, Check, Heart, LoaderCircle } from "lucide-react";
import api from "../api/api";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE = "https://placehold.co/700x700/F3F4F6/111111?text=No+Image";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data?.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#F9FAFB]">
        <LoaderCircle size={36} className="animate-spin text-[#111111]" />
        <p className="text-sm font-bold text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center bg-[#F9FAFB]">
        <p className="text-lg font-black text-black">Product not found</p>
        <Link to="/products" className="mt-6 rounded-full bg-[#111111] px-6 py-3 text-sm font-bold text-white transition hover:bg-black">
          Back to products
        </Link>
      </div>
    );
  }

  const price = Number(product.discountPrice > 0 ? product.discountPrice : product.price || 0);
  const original = Number(product.discountPrice) > 0 ? Number(product.price || 0) : null;
  const off = original > 0 && original > price ? Math.round(((original - price) / original) * 100) : 0;
  const inStock = product.stock > 0;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111111] pb-24">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-black">
          <ArrowLeft size={18} /> Back to products
        </button>

        <div className="grid gap-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-2 lg:gap-16">
          {/* IMAGE CONTAINER */}
          <div className="relative overflow-hidden rounded-3xl bg-[#F9FAFB] flex items-center justify-center p-4 min-h-[350px] sm:min-h-[500px] border border-gray-100">
            <img
              src={product.image || FALLBACK_IMAGE}
              alt={product.name}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
              className="h-full max-h-[550px] w-full object-contain"
            />
            <button className="absolute top-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition hover:text-red-500">
              <Heart size={20} />
            </button>
            {off > 0 && <span className="absolute left-5 top-5 rounded-full bg-[#111111] px-4 py-1.5 text-xs font-bold text-white shadow-md">-{off}% OFF</span>}
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col justify-between space-y-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">{product.name}</h1>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(product.rating || 0) ? "fill-black text-black" : "text-gray-200"} />
                  ))}
                </div>
                <span className="text-sm font-bold text-black">{product.rating ? Number(product.rating).toFixed(1) : "0.0"}</span>
                <span className="text-sm text-gray-400">({product.totalReviews || 0} reviews)</span>
              </div>

              <div className="mt-6 flex items-baseline gap-4">
                <span className="text-4xl font-black text-black">Rs {price.toLocaleString("en-PK")}</span>
                {original > price && <span className="text-lg text-gray-400 line-through">Rs {original.toLocaleString("en-PK")}</span>}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-gray-600">{product.description || "No description provided for this product."}</p>

              {product.seller && (
                <Link to={`/seller/${product.seller._id}`} className="mt-8 flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:border-black hover:bg-white">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white border border-gray-200">
                    {product.seller.shopLogo ? <img src={product.seller.shopLogo} alt="" className="h-full w-full object-cover" /> : <Store size={24} className="text-black" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Sold by</p>
                    <p className="truncate text-base font-black text-black">{product.seller.shopName || product.seller.name}</p>
                  </div>
                  <span className="text-xs font-bold text-black underline underline-offset-4">Visit Store</span>
                </Link>
              )}

              <div className="mt-6">
                <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold ${inStock ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
                </span>
              </div>

              {inStock && (
                <div className="mt-8 flex items-center gap-6">
                  <span className="text-sm font-bold text-black">Quantity:</span>
                  <div className="flex items-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-12 w-12 items-center justify-center text-black transition hover:bg-gray-100"><Minus size={16} /></button>
                    <span className="flex h-12 w-16 items-center justify-center text-base font-black text-black">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="flex h-12 w-12 items-center justify-center text-black transition hover:bg-gray-100"><Plus size={16} /></button>
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  disabled={!inStock}
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#111111] bg-white px-6 py-4 text-sm font-bold text-[#111111] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {added ? <><Check size={18} className="text-emerald-600" /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
                </button>
                <button
                  disabled={!inStock}
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#111111] px-6 py-4 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Zap size={18} /> Buy Now
                </button>
              </div>

              {/* BENEFITS */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 mt-8">
                {[{ icon: Truck, label: "Fast Delivery" }, { icon: ShieldCheck, label: "Secure Payment" }, { icon: RefreshCw, label: "7-Day Returns" }].map((b, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-black border border-gray-200"><b.icon size={20} /></div>
                    <p className="mt-3 text-xs font-bold text-gray-600">{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}