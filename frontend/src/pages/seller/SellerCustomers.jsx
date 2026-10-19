import { useEffect, useState } from "react";
import { Users, Mail, Phone, MapPin, ShoppingBag, LoaderCircle } from "lucide-react";
import api from "../../api/api";

export default function SellerCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/orders/seller/customers");
        setCustomers(res.data?.customers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-black text-[#111827]">My Customers</h1>
        <p className="text-xs text-[#6B7280]">{customers.length} customers registered</p>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-xs font-bold text-[#6B7280]">
          <LoaderCircle size={22} className="animate-spin text-[#111111]" />
          <span>Loading customers...</span>
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-[#E5E7EB] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F9FA] text-[#9CA3AF]">
            <Users size={24} />
          </div>
          <p className="mt-4 text-xs font-bold text-[#111827]">No customers yet</p>
          <p className="mt-1 text-[11px] text-[#6B7280]">Customers who order from you will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => (
            <div key={c._id} className="flex flex-col justify-between rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:border-[#111111] hover:shadow-md">
              <div>
                <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs font-black text-white shadow-sm">
                    {c.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-[#111827]">{c.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Customer</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  <p className="flex items-center gap-2.5 text-[#374151]">
                    <Mail size={14} className="shrink-0 text-[#9CA3AF]" />
                    <span className="truncate">{c.email}</span>
                  </p>
                  {c.phone && (
                    <p className="flex items-center gap-2.5 text-[#374151]">
                      <Phone size={14} className="shrink-0 text-[#9CA3AF]" />
                      <span>{c.phone}</span>
                    </p>
                  )}
                  {c.address && (
                    <p className="flex items-start gap-2.5 text-[#374151]">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
                      <span className="line-clamp-2">{c.address}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-[11px] font-bold text-emerald-700">
                <ShoppingBag size={13} />
                <span>{c.orderCount} order{c.orderCount > 1 ? "s" : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}