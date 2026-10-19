import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import api from "../../api/api";

const FALLBACK_IMAGE = "https://placehold.co/100x100/F3F4F6/111827?text=Product";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/seller/my");
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl pb-12">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">My Products</h1>
          <p className="mt-1 text-xs text-[#6B7280]">{products.length} products listed in your shop</p>
        </div>
        <Link
          to="/seller/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-xs font-bold text-white transition hover:bg-black shadow-sm"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm">
        {loading ? (
          <p className="p-10 text-center text-xs font-bold text-[#6B7280]">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-[#9CA3AF]" />
            <p className="mt-4 text-base font-bold text-[#111827]">No products yet</p>
            <p className="mt-1 text-xs text-[#6B7280]">Click "Add Product" to list your first item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-[11px] font-bold uppercase tracking-wider text-[#6B7280] border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Sold</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {products.map((p) => (
                  <tr key={p._id} className="transition hover:bg-[#F9FAFB]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-[#F3F4F6]">
                          <img
                            src={p.image || FALLBACK_IMAGE}
                            alt=""
                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-[#111827]">{p.name}</p>
                          <p className="text-[10px] font-semibold text-[#6B7280]">
                            {p.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[11px] font-bold text-[#111827]">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-black text-[#111111]">
                      Rs {p.discountPrice > 0 ? p.discountPrice : p.price}
                      {p.discountPrice > 0 && (
                        <span className="ml-2 text-[10px] font-normal text-[#9CA3AF] line-through">
                          Rs {p.price}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-[#111827]">{p.stock}</td>
                    <td className="p-4 font-bold text-[#6B7280]">{p.totalSold || 0}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/seller/products/edit/${p._id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white text-[#111827] transition hover:bg-[#F3F4F6]"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => del(p._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}