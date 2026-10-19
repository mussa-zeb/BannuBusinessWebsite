import { useEffect, useState } from "react";
import { ShoppingBag, LoaderCircle } from "lucide-react";
import api from "../../api/api";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-PK");

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const METHOD_LABEL = {
  cod: "Cash on Delivery",
  easypaisa: "EasyPaisa",
  jazzcash: "JazzCash",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/orders");
        setOrders(res.data?.orders || []);
      } catch (err) {
        console.error("Failed to load admin orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-7xl pb-16 text-[var(--color-text-primary)]">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
          All Orders
        </h1>
        <p className="mt-1 text-xs text-[#6B7280]">
          Monitor every order placed on the platform
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-[16px] border border-[#E5E7EB] bg-white p-12 text-xs font-bold text-[#6B7280] shadow-sm">
          <LoaderCircle size={24} className="animate-spin text-[#111111]" />
          <span>Loading orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-[#E5E7EB] bg-white p-16 text-center shadow-sm">
          <ShoppingBag size={42} className="mx-auto text-[#9CA3AF]" />
          <p className="mt-4 text-sm font-bold text-[#111827]">No orders yet</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            Platform orders will appear here once placed by users.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E5E7EB] bg-[#F8F9FA] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {orders.map((o) => (
                  <tr key={o._id} className="transition hover:bg-[#F8F9FA]">
                    <td className="px-6 py-4 font-mono font-bold text-[#111827]">
                      #{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#111827]">
                        {o.customer?.name || "Customer"}
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        {o.customer?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#111827]">
                        {METHOD_LABEL[o.paymentMethod] || "COD"}
                      </p>
                      <p className="text-[11px] capitalize text-[#6B7280]">
                        {o.paymentStatus}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-black text-[#111111]">
                      Rs {formatPrice(o.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold capitalize ${
                          STATUS_STYLE[o.status] || STATUS_STYLE.pending
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6B7280]">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}