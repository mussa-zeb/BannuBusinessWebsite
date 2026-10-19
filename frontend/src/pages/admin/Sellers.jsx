import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store, Package, ShoppingBag, ArrowRight } from "lucide-react";
import api from "../../api/api";

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/sellers");
        setSellers(res.data?.sellers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const t = search.toLowerCase().trim();
  const filtered = sellers.filter((s) => {
    if (!t) return true;
    return (
      s.name?.toLowerCase().includes(t) ||
      s.email?.toLowerCase().includes(t) ||
      s.shopName?.toLowerCase().includes(t)
    );
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sellers</h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              {sellers.length} registered sellers
            </p>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sellers..."
            className="rika-input max-w-xs"
          />
        </div>

        {loading ? (
          <div className="rika-card p-12 text-center text-sm text-[#6B6B6B]">
            Loading sellers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rika-card p-16 text-center">
            <Store size={42} className="mx-auto text-[#CFCFCF]" />
            <p className="mt-4 font-bold">No sellers found</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <Link
                key={s._id}
                to={`/admin/sellers/${s._id}`}
                className="rika-card group p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F0F0F0]">
                    {s.shopLogo ? (
                      <img
                        src={s.shopLogo}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Store size={22} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold">
                      {s.shopName || s.name}
                    </p>
                    <p className="truncate text-xs text-[#6B6B6B]">
                      {s.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-[#F7F7F7] p-3 text-center">
                    <Package size={16} className="mx-auto" />
                    <p className="mt-1 text-xs text-[#6B6B6B]">Products</p>
                    <p className="font-black">{s.productCount}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F7F7] p-3 text-center">
                    <ShoppingBag size={16} className="mx-auto" />
                    <p className="mt-1 text-xs text-[#6B6B6B]">Orders</p>
                    <p className="font-black">{s.orderCount}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#ECECEC] pt-3 text-sm font-bold">
                  <span>View Details</span>
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}