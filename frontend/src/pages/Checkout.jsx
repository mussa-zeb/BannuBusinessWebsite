import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Check, Wallet, Banknote, Smartphone, LoaderCircle, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../api/api";

const PAYMENTS = [
  { id: "cod", label: "Cash on Delivery", sub: "Pay when you receive", icon: Banknote },
  { id: "easypaisa", label: "EasyPaisa", sub: "Pay via EasyPaisa wallet", icon: Smartphone },
  { id: "jazzcash", label: "JazzCash", sub: "Pay via JazzCash wallet", icon: Wallet },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "", address: user?.address || "",
    city: "Bannu", postalCode: "", paymentMethod: "cod", mobileAccount: "", transactionId: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F9FAFB]">
        <p className="text-lg font-bold text-black">Please login to checkout.</p>
        <Link to="/login" className="mt-6 rounded-full bg-[#111111] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-black">Login</Link>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F9FAFB]">
        <p className="text-lg font-bold text-black">Your cart is empty.</p>
        <Link to="/products" className="mt-6 rounded-full bg-[#111111] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-black">Shop Now</Link>
      </div>
    );
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const isWallet = form.paymentMethod === "easypaisa" || form.paymentMethod === "jazzcash";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (isWallet && !form.mobileAccount.trim()) return setError("Please enter your mobile account number.");

    setLoading(true);
    try {
      await api.post("/orders", {
        items: items.map((it) => ({ product: it._id, quantity: it.quantity })),
        shippingAddress: { name: form.name, phone: form.phone, address: form.address, city: form.city, postalCode: form.postalCode },
        paymentMethod: form.paymentMethod,
        paymentDetails: { mobileAccount: form.mobileAccount, transactionId: form.transactionId },
        notes: form.notes,
      });
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate("/orders"), 1600);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F9FAFB]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#111111] text-white shadow-xl"><Check size={40} /></div>
        <h1 className="mt-8 text-3xl font-black text-black">Order Placed</h1>
        <p className="mt-2 text-sm text-gray-500">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111111] pb-24">
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="mb-10 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-black">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-black">Checkout</h1>
            <p className="text-sm text-gray-500">Complete your order</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_420px]">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-black">Shipping Address</h2>
              <p className="text-sm text-gray-500 mt-1">Where should we deliver?</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Field label="Full Name"><input name="name" value={form.name} onChange={handleChange} required className="input-field" /></Field>
                <Field label="Phone"><input name="phone" value={form.phone} onChange={handleChange} required className="input-field" /></Field>
                <Field label="City"><input name="city" value={form.city} onChange={handleChange} className="input-field" /></Field>
                <Field label="Postal Code"><input name="postalCode" value={form.postalCode} onChange={handleChange} className="input-field" /></Field>
              </div>
              <div className="mt-6"><Field label="Full Address"><textarea name="address" value={form.address} onChange={handleChange} required rows={3} className="input-field resize-none" /></Field></div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-black">Payment Method</h2>
              <p className="text-sm text-gray-500 mt-1">Choose how you want to pay</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {PAYMENTS.map((p) => {
                  const Icon = p.icon;
                  const active = form.paymentMethod === p.id;
                  return (
                    <button type="button" key={p.id} onClick={() => setForm((f) => ({ ...f, paymentMethod: p.id }))} className={`rounded-2xl border p-5 text-left transition-all ${active ? "border-black bg-[#111111] text-white shadow-md" : "border-gray-200 bg-gray-50 hover:border-black"}`}>
                      <Icon size={24} className={active ? "text-white" : "text-gray-500"} />
                      <p className="mt-4 text-sm font-bold">{p.label}</p>
                      <p className={`mt-1 text-xs ${active ? "text-gray-300" : "text-gray-500"}`}>{p.sub}</p>
                    </button>
                  );
                })}
              </div>

              {isWallet && (
                <div className="mt-6 grid gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:grid-cols-2">
                  <Field label={`${form.paymentMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"} Mobile Number`}>
                    <input name="mobileAccount" value={form.mobileAccount} onChange={handleChange} placeholder="03XXXXXXXXX" className="input-field" />
                  </Field>
                  <Field label="Transaction ID (optional)">
                    <input name="transactionId" value={form.transactionId} onChange={handleChange} placeholder="e.g. TXN123456" className="input-field" />
                  </Field>
                  <p className="col-span-full text-xs text-gray-500 leading-relaxed">
                    Send the total amount to our {form.paymentMethod === "easypaisa" ? "EasyPaisa" : "JazzCash"} account <span className="font-bold text-black">0300-0000000</span> and enter your number above.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-black">Order Notes</h2>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any delivery instructions (optional)" className="input-field mt-6 resize-none" />
            </section>
          </div>

          {/* RIGHT SIDE - SUMMARY */}
          <aside className="sticky top-28 h-fit">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-black">Order Summary</h2>
              <div className="mt-6 max-h-80 space-y-4 overflow-y-auto pr-2">
                {items.map((it) => (
                  <div key={it._id} className="flex gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <img src={it.image || "https://placehold.co/100x100/F3F4F6/111111?text=Item"} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-black">{it.name}</p>
                      <p className="mt-1 text-xs text-gray-500">Qty {it.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-black">Rs {(it.price * it.quantity).toLocaleString("en-PK")}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-3 border-t border-gray-100 pt-6">
                <Row label="Subtotal" value={`Rs ${totalAmount.toLocaleString("en-PK")}`} />
                <Row label="Shipping" value="Free" />
                <Row label="Tax" value="Rs 0" />
              </div>
              <div className="mt-6 flex items-baseline justify-between border-t border-gray-100 pt-6">
                <span className="text-base font-black text-black">Total</span>
                <span className="text-3xl font-black text-black">Rs {totalAmount.toLocaleString("en-PK")}</span>
              </div>
              {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-600">{error}</div>}
              <button type="submit" disabled={loading} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60">
                {loading ? <><LoaderCircle size={18} className="animate-spin" /> Placing order...</> : "Place Order"}
              </button>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400"><ShieldCheck size={16} /> Safe and secure checkout</div>
            </div>
          </aside>
        </form>
      </div>
      <style>{` .input-field { width: 100%; border-radius: 0.75rem; border: 1px solid #E5E7EB; background: #F9FAFB; padding: 0.875rem 1rem; font-size: 0.875rem; outline: none; transition: all 0.2s; color: #111111; } .input-field:focus { border-color: #111111; background: white; box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.1); } `}</style>
    </div>
  );
}

function Field({ label, children }) { return <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>{children}</div>; }
function Row({ label, value }) { return <div className="flex justify-between text-sm text-gray-500"><span>{label}</span><span className="font-bold text-black">{value}</span></div>; }