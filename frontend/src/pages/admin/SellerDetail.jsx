import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Store, Package, ShoppingBag, Mail, Phone, MapPin, User, LoaderCircle } from "lucide-react";
import api from "../../api/api";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-PK");

export default function AdminSellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ seller: null, products: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/admin/sellers/${id}`);
        setData({
          seller: res.data?.seller || null,
          products: res.data?.products || [],
          orders: res.data?.orders || [],
        });
      } catch (err) {
        console.error("Failed to load seller details:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-xs font-bold text-[#6B7280]">
        <LoaderCircle size={24} className="animate-spin text-[#111111]" />
        <span>Loading seller details...</span>
      </div>
    );
  }

  if (!data.seller) {
    return (
      <div className="rounded-[16px] border border-dashed border-[#E5E7EB] bg-white p-12 text-center shadow-sm">
        <p className="text-sm font-bold text-[#111827]">Seller not found.</p>
      </div>
    );
  }

  const { seller, products, orders } = data;
  const revenue = orders.reduce(
    (s, o) => s + (o.items?.reduce((ss, it) => ss + it.price * it.quantity, 0) || 0),
    0
  );

  const statusColors = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-purple-50 text-purple-700 border-purple-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="mx-auto max-w-7xl pb-16 text-[var(--color-text-primary)]">
      {/* BACK BUTTON */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-bold text-[#111827] transition hover:bg-[#F3F4F6]"
      >
        <ArrowLeft size={14} />
        Back to Sellers
      </button>

      {/* SELLER CARD */}
      <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-[#F3F4F6]">
            {seller.shopLogo ? (
              <img src={seller.shopLogo} alt="Shop Logo" className="h-full w-full object-cover" />
            ) : (
              <Store size={28} className="text-[#111111]" />
            )}
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-2xl font-black tracking-tight text-[#111111]">
              {seller.shopName || seller.name}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1.5 font-bold text-[#111827]">
                <User size={13} className="text-[#9CA3AF]" /> {seller.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-[#9CA3AF]" /> {seller.email}
              </span>
              {seller.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#9CA3AF]" /> {seller.phone}
                </span>
              )}
              {seller.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#9CA3AF]" /> {seller.address}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[12px] border border-[#E5E7EB] bg-[#F8F9FA] p-4">
            <Package size={18} className="text-[#111111]" />
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Products</p>
            <p className="text-xl font-black text-[#111827]">{products.length}</p>
          </div>
          <div className="rounded-[12px] border border-[#E5E7EB] bg-[#F8F9FA] p-4">
            <ShoppingBag size={18} className="text-[#111111]" />
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Orders</p>
            <p className="text-xl font-black text-[#111827]">{orders.length}</p>
          </div>
          <div className="rounded-[12px] border border-[#E5E7EB] bg-[#F8F9FA] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Revenue</p>
            <p className="text-xl font-black text-[#111111]">Rs {formatPrice(revenue)}</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-6 flex gap-1.5 rounded-full border border-[#E5E7EB] bg-white p-1 shadow-sm w-fit">
        <button
          type="button"
          onClick={() => setTab("products")}
          className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
            tab === "products"
              ? "bg-[#111111] text-white shadow-sm"
              : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
          }`}
        >
          Products ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("orders")}
          className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
            tab === "orders"
              ? "bg-[#111111] text-white shadow-sm"
              : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {tab === "products" && (
        <div className="mt-5 overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm">
          {products.length === 0 ? (
            <p className="p-12 text-center text-xs text-[#6B7280]">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E5E7EB] bg-[#F8F9FA] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {products.map((p) => (
                    <tr key={p._id} className="transition hover:bg-[#F8F9FA]">
                      <td className="px-6 py-4">
                        <Link
                          to={`/product/${p._id}`}
                          className="flex items-center gap-3 font-bold text-[#111827] hover:underline"
                        >
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F3F4F6]">
                            <img
                              src={p.image || "https://placehold.co/80x80/F3F4F6/111827?text=Product"}
                              alt="Product"
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/80x80/F3F4F6/111827?text=Product";
                              }}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span>{p.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[#6B7280]">{p.category}</td>
                      <td className="px-6 py-4 font-black text-[#111111]">
                        Rs {formatPrice(p.discountPrice > 0 ? p.discountPrice : p.price)}
                      </td>
                      <td className="px-6 py-4 text-[#6B7280]">{p.stock}</td>
                      <td className="px-6 py-4 text-[#6B7280]">{p.totalSold || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === "orders" && (
        <div className="mt-5 space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-[#E5E7EB] bg-white p-12 text-center shadow-sm">
              <p className="text-xs font-bold text-[#6B7280]">No orders found.</p>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o._id}
                className="rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:border-[#111111]"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Order</p>
                    <p className="font-mono text-xs font-black text-[#111827]">
                      #{o._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Customer</p>
                    <p className="text-xs font-bold text-[#111827]">{o.customer?.name}</p>
                    <p className="text-[11px] text-[#6B7280]">{o.customer?.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Date</p>
                    <p className="text-xs text-[#111827]">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-[10px] font-bold capitalize ${
                        statusColors[o.status] || "bg-gray-100 text-[#6B7280] border-[#E5E7EB]"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {o.items?.map((it, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-2.5 text-xs"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F3F4F6]">
                        <img
                          src={it.image || "https://placehold.co/80x80/F3F4F6/111827?text=Item"}
                          alt="Item"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/80x80/F3F4F6/111827?text=Item";
                          }}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="flex-1 truncate font-bold text-[#111827]">{it.name}</span>
                      <span className="text-[#6B7280]">×{it.quantity}</span>
                      <span className="font-black text-[#111111]">
                        Rs {formatPrice(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {o.shippingAddress && (
                  <div className="mt-4 rounded-[12px] border border-[#E5E7EB] bg-[#F8F9FA] p-3.5 text-xs text-[#6B7280]">
                    <span className="font-bold text-[#111827]">Deliver to:</span> {o.shippingAddress.name} — {o.shippingAddress.address}, {o.shippingAddress.city} — {o.shippingAddress.phone}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}