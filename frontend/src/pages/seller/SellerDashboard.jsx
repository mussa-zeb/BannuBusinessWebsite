import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  PlusCircle,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import api from "../../api/api";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-PK");

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pendingOrders: 0,
    customers: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get("/orders/seller/stats"),
          api.get("/orders/seller"),
        ]);
        setStats(statsRes.data?.stats || stats);
        setRecentOrders((ordersRes.data?.orders || []).slice(0, 5));
      } catch (err) {
        console.error("Failed to load seller dashboard data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    {
      label: "Products",
      value: stats.products,
      icon: Package,
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: ShoppingBag,
    },
    {
      label: "Customers",
      value: stats.customers,
      icon: Users,
    },
    {
      label: "Revenue",
      value: `Rs ${formatPrice(stats.revenue)}`,
      icon: DollarSign,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-[#6B7280] border-[#E5E7EB]";
    }
  };

  return (
    <div className="pb-16 text-[var(--color-text-primary)]">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
          Seller Dashboard
        </h1>
        <p className="mt-1 text-xs text-[#6B7280]">
          Overview of your shop performance
        </p>
      </div>

      {/* METRIC STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-white">
                <Icon size={18} />
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                {c.label}
              </p>
              <p className="mt-0.5 text-2xl font-black text-[#111827]">
                {c.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          to="/seller/products/new"
          className="group flex items-center gap-4 rounded-[16px] border border-[#E5E7EB] bg-white p-5 transition duration-200 hover:border-[#111111] hover:shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
            <PlusCircle size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#111827]">
              Add New Product
            </p>
            <p className="text-xs text-[#6B7280]">
              List a new item for sale
            </p>
          </div>
          <ArrowRight
            size={18}
            className="shrink-0 text-[#9CA3AF] transition group-hover:translate-x-1 group-hover:text-[#111111]"
          />
        </Link>

        <Link
          to="/seller/orders"
          className="group flex items-center gap-4 rounded-[16px] border border-[#E5E7EB] bg-white p-5 transition duration-200 hover:border-[#111111] hover:shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111]">
            <Clock size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#111827]">
              Pending Orders: {stats.pendingOrders}
            </p>
            <p className="text-xs text-[#6B7280]">
              Review and process active customer orders
            </p>
          </div>
          <ArrowRight
            size={18}
            className="shrink-0 text-[#9CA3AF] transition group-hover:translate-x-1 group-hover:text-[#111111]"
          />
        </Link>
      </div>

      {/* RECENT ORDERS TABLE / LIST */}
      <div className="mt-6 rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#111827]">
              Recent Orders
            </h2>
            <p className="text-xs text-[#6B7280]">
              Latest transactions for your shop
            </p>
          </div>
          <Link
            to="/seller/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#111827] transition hover:text-[#6B7280]"
          >
            View all
            <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 py-8 text-xs font-bold text-[#6B7280]">
            <LoaderCircle size={22} className="animate-spin text-[#111111]" />
            <span>Loading recent orders...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="py-10 text-center text-xs text-[#6B7280]">
            No orders received yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div
                key={o._id}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-[#E5E7EB] bg-[#F8F9FA] p-3.5 transition hover:bg-white hover:border-[#111111]"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[#111827]">
                    {o.customer?.name || "Customer"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#6B7280]">
                    #{o._id.slice(-6).toUpperCase()} • {o.items?.length || 0} item(s)
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-[#111111]">
                    Rs {formatPrice(o.sellerTotal || o.totalAmount)}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${getStatusBadge(
                      o.status
                    )}`}
                  >
                    {o.status || "pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}