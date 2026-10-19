import { useEffect, useState } from "react";
import { ShoppingBag, Mail, Phone, MapPin, LoaderCircle } from "lucide-react";
import api from "../../api/api";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-PK");

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/seller");
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error("Failed to load seller orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status.");
    }
  };

  const filtered =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-[#6B7280] border-[#E5E7EB]";
    }
  };

  return (
    <div className="pb-16 text-[var(--color-text-primary)]">
      {/* HEADER & FILTERS */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            {orders.length} total orders in your shop
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition ${
                  filter === s
                    ? "border-[#111111] bg-[#111111] text-white shadow-sm"
                    : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#111111] hover:text-[#111827]"
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-xs font-bold text-[#6B7280]">
          <LoaderCircle size={24} className="animate-spin text-[#111111]" />
          <span>Loading orders...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-[#E5E7EB] bg-white p-12 text-center shadow-sm">
          <ShoppingBag size={48} className="mx-auto text-[#9CA3AF]" />
          <p className="mt-4 text-sm font-bold text-[#111827]">No orders found</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            Orders from customers matching this filter will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <div
              key={o._id}
              className="rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:border-[#111111]"
            >
              {/* ORDER HEADER INFO */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Order ID
                  </p>
                  <p className="font-mono text-xs font-bold text-[#111827]">
                    #{o._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Date
                  </p>
                  <p className="text-xs font-semibold text-[#111827]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    Your Total
                  </p>
                  <p className="text-sm font-black text-[#111111]">
                    Rs {formatPrice(o.sellerTotal || o.totalAmount)}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-bold capitalize ${getStatusBadge(
                    o.status
                  )}`}
                >
                  {o.status || "pending"}
                </span>
              </div>

              {/* CUSTOMER DETAILS BOX */}
              <div className="mt-4 rounded-[12px] border border-[#E5E7EB] bg-[#F8F9FA] p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Customer Information
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#111827]">
                  <span className="font-bold">{o.customer?.name || "Guest Customer"}</span>
                  {o.customer?.email && (
                    <span className="flex items-center gap-1.5 text-[#6B7280]">
                      <Mail size={13} /> {o.customer.email}
                    </span>
                  )}
                  {o.customer?.phone && (
                    <span className="flex items-center gap-1.5 text-[#6B7280]">
                      <Phone size={13} /> {o.customer.phone}
                    </span>
                  )}
                </div>
                {o.shippingAddress && (
                  <p className="mt-2.5 flex items-start gap-1.5 text-xs text-[#6B7280]">
                    <MapPin size={13} className="mt-0.5 shrink-0 text-[#111111]" />
                    <span>
                      <strong className="text-[#111827]">{o.shippingAddress.name}</strong> — {o.shippingAddress.address}, {o.shippingAddress.city} ({o.shippingAddress.phone})
                    </span>
                  </p>
                )}
              </div>

              {/* ORDER ITEMS LIST */}
              <div className="mt-4 space-y-2.5">
                {o.items?.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-[10px] border border-[#E5E7EB] bg-white p-2.5 text-xs"
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F3F4F6]">
                      <img
                        src={it.image || "https://placehold.co/80x80/F3F4F6/111827?text=Item"}
                        alt={it.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://placehold.co/80x80/F3F4F6/111827?text=Item";
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="min-w-0 flex-1 truncate font-medium text-[#111827]">
                      {it.name}
                    </span>
                    <span className="text-[#6B7280]">×{it.quantity}</span>
                    <span className="font-black text-[#111111]">
                      Rs {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* STATUS UPDATE ACTION BUTTONS */}
              {o.status !== "delivered" && o.status !== "cancelled" && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#E5E7EB] pt-4">
                  {o.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(o._id, "processing")}
                      className="rounded-full bg-[#111111] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-black shadow-sm"
                    >
                      Mark Processing
                    </button>
                  )}
                  {o.status === "processing" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(o._id, "shipped")}
                      className="rounded-full bg-[#111111] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-black shadow-sm"
                    >
                      Mark Shipped
                    </button>
                  )}
                  {o.status === "shipped" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(o._id, "delivered")}
                      className="rounded-full bg-[#111111] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-black shadow-sm"
                    >
                      Mark Delivered
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => updateStatus(o._id, "cancelled")}
                    className="rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}