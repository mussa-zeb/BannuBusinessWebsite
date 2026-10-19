import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, LoaderCircle, Image as ImageIcon, Upload } from "lucide-react";
import api from "../../api/api";

const FALLBACK_IMAGE = "https://placehold.co/200x200/F3F4F6/111827?text=Invalid+Image";

export default function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    image: "",
    isActive: true,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    (async () => {
      try {
        const catRes = await api.get("/categories");
        setCategories(catRes.data?.categories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }

      if (isEdit) {
        try {
          const res = await api.get(`/products/${id}`);
          const p = res.data?.product;
          if (p) {
            setForm({
              name: p.name || "",
              description: p.description || "",
              category: p.category || "",
              price: p.price ?? "",
              discountPrice: p.discountPrice ?? "",
              stock: p.stock ?? "",
              image: p.image || "",
              isActive: p.isActive ?? true,
            });
          }
        } catch (err) {
          console.error("Failed to load product details:", err);
        } finally {
          setFetching(false);
        }
      }
    })();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Handle direct file upload to Cloudinary via backend
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImg(true);
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setForm((f) => ({ ...f, image: res.data.url }));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock) || 0,
      };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/seller/products");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-xs font-bold text-[#6B7280]">
        <LoaderCircle size={24} className="animate-spin text-[#111111]" />
        <span>Loading product details...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-16">
      {/* BACK BUTTON */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-bold text-[#111827] transition hover:bg-[#F3F4F6]"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* FORM CARD */}
      <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-black tracking-tight text-[#111111]">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="mt-1 text-xs text-[#6B7280]">
          {isEdit ? "Update your product details" : "Fill in the details to list your product"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Field label="Product Name *">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white"
              placeholder="e.g. Wireless Bluetooth Headphones"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category *">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] outline-none transition-colors focus:border-[#111111] focus:bg-white"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Stock Quantity">
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white"
                placeholder="0"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price (Rs) *">
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white"
                placeholder="0"
              />
            </Field>

            <Field label="Discount Price (Rs)">
              <input
                type="number"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white"
                placeholder="0"
              />
            </Field>
          </div>

          {/* CLOUDINARY FILE UPLOAD SECTION (URL INPUT REMOVED) */}
          <Field label="Product Image *">
            <div className="space-y-3">
              <label className="flex flex-col items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-[#E5E7EB] bg-[#F3F4F6] p-6 text-center cursor-pointer transition hover:border-[#111111] hover:bg-white">
                <Upload size={24} className="text-[#6B7280]" />
                <div className="text-xs">
                  <span className="font-bold text-[#111827]">Click to upload image</span>
                  <span className="text-[#6B7280]"> from your device</span>
                </div>
                <p className="text-[10px] text-[#9CA3AF]">Supports: JPG, PNG, WEBP</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingImg}
                />
              </label>

              {uploadingImg && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280]">
                  <LoaderCircle size={16} className="animate-spin text-[#111111]" />
                  <span>Uploading image to Cloudinary...</span>
                </div>
              )}
            </div>
          </Field>

          {/* IMAGE PREVIEW */}
          {form.image && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                Uploaded Image Preview
              </p>
              <div className="h-36 w-36 overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-[#F3F4F6] p-1">
                <img
                  src={form.image}
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full rounded-[8px] object-cover"
                />
              </div>
            </div>
          )}

          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-[12px] border border-[#E5E7EB] bg-[#F3F4F6] p-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white resize-none"
              placeholder="Describe your product..."
            />
          </Field>

          {/* IS ACTIVE TOGGLE */}
          {isEdit && (
            <div className="rounded-[12px] border border-[#E5E7EB] bg-[#F8F9FA] p-3.5">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#111827]">
                    Product Status
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    Make this product visible to customers on the platform
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-[#E5E7EB] text-[#111111] focus:ring-[#111111]"
                />
              </label>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-3 border-t border-[#E5E7EB] pt-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto rounded-full border border-[#E5E7EB] bg-white px-6 py-3.5 text-xs font-bold text-[#111827] transition hover:bg-[#F3F4F6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImg}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
            >
              {loading ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>{isEdit ? "Update Product" : "Add Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-[#111827]">
        {label}
      </label>
      {children}
    </div>
  );
}