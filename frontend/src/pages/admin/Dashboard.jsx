import { useEffect, useState } from "react";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import api from "../../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentSellers, setRecentSellers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data?.stats || {});
        setRecentSellers(res.data?.recentSellers || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const cards = [
    { label: "Customers", value: stats.totalUsers, icon: Users },
    { label: "Sellers", value: stats.totalSellers, icon: Store },
    { label: "Products", value: stats.totalProducts, icon: Package },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingBag },
    { label: "Revenue", value: `Rs ${stats.totalRevenue || 0}`, icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">Platform overview</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="rika-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1A1A1A] text-white">
                  <Icon size={20} />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
                  {c.label}
                </p>
                <p className="mt-1 text-2xl font-black">{c.value ?? 0}</p>
              </div>
            );
          })}
        </div>

        <div className="rika-card mt-8 p-7">
          <h2 className="text-lg font-bold">Recent Sellers</h2>
          <p className="text-sm text-[#6B6B6B]">Newest sellers on the platform</p>

          <div className="mt-5 space-y-3">
            {recentSellers.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#6B6B6B]">
                No sellers yet.
              </p>
            ) : (
              recentSellers.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between rounded-2xl border border-[#ECECEC] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] font-bold text-white">
                      {s.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold">{s.shopName || s.name}</p>
                      <p className="text-xs text-[#6B6B6B]">{s.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#6B6B6B]">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}