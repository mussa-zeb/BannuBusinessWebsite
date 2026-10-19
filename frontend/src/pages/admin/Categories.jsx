import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Tags, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import api from "../../api/api";

const EMPTY_FORM = { name: "", description: "", icon: "", image: "" };
const FALLBACK_IMAGE = "https://placehold.co/150x150/F3F4F6/111827?text=Category";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data?.categories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      icon: cat.icon || "",
      image: cat.image || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Handle Category Image Upload to Cloudinary
  const handleImageUpload = async (e) => {
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Category name is required.");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post("/categories", form);
      }
      setModalOpen(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Add, edit or remove business categories
            </p>
          </div>
          <button onClick={openAdd} className="btn-rika">
            <Plus size={18} /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="rika-card p-12 text-center text-sm text-[#6B6B6B]">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="rika-card p-16 text-center">
            <Tags size={42} className="mx-auto text-[#CFCFCF]" />
            <p className="mt-4 text-lg font-bold">No Categories Yet</p>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Create your first category to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div
                key={c._id}
                className="rika-card group flex flex-col justify-between p-6 transition hover:shadow-lg bg-white rounded-2xl border border-[#ECECEC]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F0F0F0] border border-[#ECECEC]">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    ) : (
                      <Tags size={20} className="text-[#6B6B6B]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">{c.name}</h3>
                    {c.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-[#6B6B6B]">
                        {c.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-2 border-t border-[#ECECEC] pt-4">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ECECEC] text-[#1A1A1A] hover:bg-[#FAFAFA]"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ECECEC] p-5">
              <h2 className="text-lg font-bold">
                {editingId ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ECECEC] text-[#6B6B6B] hover:bg-[#FAFAFA]"
              >
                <X size={17} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#6B6B6B]">
                  Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="rika-input w-full p-3 text-xs border border-[#ECECEC] rounded-xl bg-[#F7F7F7] outline-none"
                  placeholder="e.g. Restaurants"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#6B6B6B]">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="rika-input resize-none w-full p-3 text-xs border border-[#ECECEC] rounded-xl bg-[#F7F7F7] outline-none"
                  placeholder="Short description..."
                />
              </div>

              {/* Category Image Upload */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#6B6B6B]">
                  Category Image
                </label>
                <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#ECECEC] bg-[#F7F7F7] p-4 text-center cursor-pointer transition hover:border-[#1A1A1A] hover:bg-white">
                  <Upload size={20} className="text-[#6B6B6B]" />
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    {uploadingImg ? "Uploading Image..." : "Click to upload image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImg}
                  />
                </label>

                {form.image && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#ECECEC] bg-[#F7F7F7] p-2">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-white border border-[#ECECEC]">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <span className="text-xs text-[#6B6B6B] truncate flex-1">Image uploaded successfully</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-[#ECECEC] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-rika-outline px-5 py-2.5 rounded-xl border border-[#ECECEC] text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploadingImg} className="btn-rika flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{saving ? "Saving..." : editingId ? "Update" : "Create"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}