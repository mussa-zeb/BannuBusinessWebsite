import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, Truck, CheckCircle2, XCircle, ArrowRight, LoaderCircle } from "lucide-react";
import api from "../api/api";

const FALLBACK_IMAGE = "https://placehold.co/100x100/F3F4F6/111111?text=Item";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data?.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusBadge = (s) => {
    const map = {
      pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: Clock },
      processing: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: Package },
      shipped: { bg: "bg-purple-50 border-purple-200", text: "text-purple-700", icon: Truck },
      delivered: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", icon: CheckCircle2 },
      cancelled: { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: XCircle },
    };
    const cfg = map[s] || map.pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border ${cfg.bg} ${cfg.text} px-3 py-1 text-[11px] font-bold capitalize`}>
        <Icon size={12} /> {s}
      </span>
    );
  };

  const filteredOrders = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#F9FAFB]">
        <LoaderCircle size={36} className="animate-spin text-[#111111]" />
        <p className="text-sm font-bold text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111111] pb-24">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">My Orders</h1>
          <p className="mt-2 text-sm text-gray-500">Track status, view items, and check delivery details</p>
        </div>

        {/* TABS */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {["all", "processing", "shipped", "delivered", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-bold capitalize transition ${
                activeTab === tab
                  ? "bg-[#111111] text-white shadow-md"
                  : "border border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Package size={36} className="text-gray-400" />
            </div>
            <h2 className="mt-6 text-xl font-black text-black">
              {activeTab === "all" ? "No orders placed yet" : `No ${activeTab} orders`}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {activeTab === "all" ? "Your active and past orders will appear here once you shop." : `You currently have no orders in the '${activeTab}' state.`}
            </p>
            <Link to="/products" className="mt-8 inline-flex rounded-full bg-[#111111] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-black">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((o) => (
              <div key={o._id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:border-black">
                <div className="flex flex-wrap items-center justify-between gap-6 border-b border-gray-200 bg-gray-50 p-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Order ID</p>
                    <p className="mt-1 font-mono text-sm font-bold text-black">#{o._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Placed On</p>
                    <p className="mt-1 text-sm font-bold text-black">{new Date(o.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Amount</p>
                    <p className="mt-1 text-lg font-black text-black">Rs {Number(o.totalAmount || 0).toLocaleString("en-PK")}</p>
                  </div>
                  {statusBadge(o.status)}
                </div>

                <div className="p-6 space-y-4">
                  {o.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        <img src={it.image || FALLBACK_IMAGE} alt={it.name} onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-black">{it.name}</p>
                        <p className="mt-1 text-xs text-gray-500">Qty: {it.quantity} Г— Rs {Number(it.price || 0).toLocaleString("en-PK")}</p>
                      </div>
                      <p className="text-sm font-black text-black">Rs {Number((it.price || 0) * (it.quantity || 1)).toLocaleString("en-PK")}</p>
                    </div>
                  ))}
                </div>

                {o.shippingAddress && (
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-xs text-gray-500">
                    <span className="font-bold text-black">Ship to: </span>
                    {o.shippingAddress?.name} вЂ” {o.shippingAddress?.address}, {o.shippingAddress?.city}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}