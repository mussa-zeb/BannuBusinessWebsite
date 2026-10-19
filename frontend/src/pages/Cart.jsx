import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";

const formatPrice = (price) => Number(price || 0).toLocaleString("en-PK");
const FALLBACK_IMAGE = "https://placehold.co/300x300/F3F4F6/111111?text=No+Image";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F9FAFB] px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm">
            <ShoppingBag size={40} className="text-black" />
          </div>
          <h1 className="mt-8 text-3xl font-black tracking-tight text-black">Your cart is empty</h1>
          <p className="mt-3 text-sm text-gray-500">Looks like you haven't added anything yet. Explore our collection and find something you'll love.</p>
          <Link to="/products" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-8 py-4 text-sm font-bold text-white transition hover:bg-black">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#111111] pb-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">Shopping Cart</h1>
          <p className="mt-2 text-sm text-gray-500">Review your items before proceeding to checkout.</p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_400px]">
          <section className="min-w-0">
            <div className="space-y-4">
              {items.map((it) => (
                <article key={it._id} className="group flex flex-col sm:flex-row gap-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-black">
                  <Link to={`/product/${it._id}`} className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                    <img src={it.image || FALLBACK_IMAGE} alt={it.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <Link to={`/product/${it._id}`} className="line-clamp-2 text-lg font-bold text-black transition hover:text-gray-600">{it.name}</Link>
                        <button onClick={() => removeFromCart(it._id)} className="shrink-0 rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                      {it.sellerName && <p className="mt-1 text-xs text-gray-500">Sold by <span className="font-bold text-black">{it.sellerName}</span></p>}
                      <p className="mt-3 text-xl font-black text-black">Rs {formatPrice(it.price)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                        <button onClick={() => updateQuantity(it._id, it.quantity - 1)} disabled={it.quantity <= 1} className="flex h-10 w-10 items-center justify-center text-black transition hover:bg-gray-200 disabled:opacity-30"><Minus size={14} /></button>
                        <span className="flex h-10 w-12 items-center justify-center text-sm font-bold text-black">{it.quantity}</span>
                        <button onClick={() => updateQuantity(it._id, it.quantity + 1)} className="flex h-10 w-10 items-center justify-center text-black transition hover:bg-gray-200"><Plus size={14} /></button>
                      </div>
                      <p className="text-lg font-black text-black">Rs {formatPrice(it.price * it.quantity)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 p-6">
                <h2 className="text-lg font-black text-black">Order Summary</h2>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Total Items</span><span className="font-bold text-black">{totalItems}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-bold text-black">Rs {formatPrice(totalAmount)}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="font-bold text-black">Calculated at checkout</span></div>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center justify-between"><span className="text-base font-black text-black">Estimated Total</span><span className="text-2xl font-black text-black">Rs {formatPrice(totalAmount)}</span></div>
                </div>
                <button onClick={() => navigate("/checkout")} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-6 py-4 text-sm font-bold text-white transition hover:bg-black">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
                <Link to="/products" className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-black transition hover:border-black">
                  Continue Shopping
                </Link>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400"><ShieldCheck size={14} /> Safe and secure shopping</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}