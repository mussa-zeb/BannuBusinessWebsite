import { useEffect, useState } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  User,
  Image as ImageIcon,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";

const FALLBACK_LOGO = "https://placehold.co/150x150/F3F4F6/111827?text=Logo";
const FALLBACK_BANNER = "https://placehold.co/800x200/F3F4F6/111827?text=Shop+Banner";

export default function SellerProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shopName: "",
    shopDescription: "",
    shopLogo: "",
    shopBanner: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/me");
        const u = res.data?.user;
        if (u) {
          setForm({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            address: u.address || "",
            shopName: u.shopName || "",
            shopDescription: u.shopDescription || "",
            shopLogo: u.shopLogo || "",
            shopBanner: u.shopBanner || "",
          });
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  // Handle Logo Upload to Cloudinary
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingLogo(true);
    setError("");
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setForm((f) => ({ ...f, shopLogo: res.data.url }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle Banner Upload to Cloudinary
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingBanner(true);
    setError("");
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setForm((f) => ({ ...f, shopBanner: res.data.url }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Banner upload failed.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSavedMsg("");

    try {
      const res = await api.put("/users/profile", {
        name: form.name,
        phone: form.phone,
        address: form.address,
        shopName: form.shopName,
        shopDescription: form.shopDescription,
        shopLogo: form.shopLogo,
        shopBanner: form.shopBanner,
      });

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setSavedMsg("Shop profile updated successfully.");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-xs font-bold text-[#6B7280]">
        <Loader2 className="animate-spin text-[#111111]" size={24} />
        <span>Loading your shop profile...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-16 text-[var(--color-text-primary)]">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
          My Shop Profile
        </h1>
        <p className="mt-1 text-xs text-[#6B7280]">
          Manage your seller information and store front appearance.
        </p>
      </motion.div>

      {/* ALERTS */}
      <AnimatePresence>
        {savedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mb-5 flex items-center gap-3 rounded-[12px] border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-700"
          >
            <CheckCircle2 size={16} /> {savedMsg}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mb-5 rounded-[12px] border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHOP PREVIEW CARD */}
      <div className="mb-6 overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm">
        <div
          className="relative h-32 bg-[#F3F4F6]"
          style={
            form.shopBanner
              ? {
                  backgroundImage: `url(${form.shopBanner})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          {form.shopBanner && <div className="absolute inset-0 bg-black/20" />}
        </div>
        <div className="relative px-6 pb-5">
          <div className="-mt-10 flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[16px] border-4 border-white bg-[#F3F4F6] shadow-md">
              {form.shopLogo ? (
                <img
                  src={form.shopLogo}
                  alt="Shop Logo"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_LOGO;
                  }}
                />
              ) : (
                <Store size={28} className="text-[#111111]" />
              )}
            </div>
            <div className="mb-1">
              <p className="text-base font-black text-[#111827]">
                {form.shopName || form.name || "Your Shop"}
              </p>
              <p className="text-[11px] text-[#6B7280]">Seller Store Preview</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* PERSONAL INFO */}
        <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-white">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#111827]">Personal Information</h2>
              <p className="text-[11px] text-[#6B7280]">Your account details</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name *">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white"
                placeholder="John Doe"
              />
            </Field>

            <Field label="Email (read-only)">
              <input
                name="email"
                value={form.email}
                disabled
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] opacity-60 outline-none cursor-not-allowed"
              />
            </Field>

            <Field label="Phone">
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white"
                placeholder="03XXXXXXXXX"
              />
            </Field>

            <Field label="Address">
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white"
                placeholder="Your personal address"
              />
            </Field>
          </div>
        </div>

        {/* SHOP INFO */}
        <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-white">
              <Store size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#111827]">Shop Information</h2>
              <p className="text-[11px] text-[#6B7280]">
                This info is displayed to customers on your store page
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Field label="Shop Name">
              <input
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                className="w-full rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white"
                placeholder="e.g. Bannu Electronics Hub"
              />
            </Field>

            <Field label="Shop Description">
              <textarea
                name="shopDescription"
                value={form.shopDescription}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-[12px] border border-[#E5E7EB] bg-[#F3F4F6] p-3 text-xs text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#111111] focus:bg-white resize-none"
                placeholder="Tell customers about your shop..."
              />
            </Field>

            {/* SHOP LOGO & BANNER UPLOAD */}
            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#111827]">Shop Logo</label>
                <label className="flex flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-[#E5E7EB] bg-[#F3F4F6] p-4 text-center cursor-pointer transition hover:border-[#111111] hover:bg-white">
                  <Upload size={20} className="text-[#6B7280]" />
                  <span className="text-xs font-bold text-[#111827]">
                    {uploadingLogo ? "Uploading Logo..." : "Upload Logo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                </label>
                {form.shopLogo && (
                  <div className="h-16 w-16 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white p-1">
                    <img
                      src={form.shopLogo}
                      alt="Logo Preview"
                      className="h-full w-full rounded-[6px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_LOGO;
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Banner Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#111827]">Shop Banner</label>
                <label className="flex flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-[#E5E7EB] bg-[#F3F4F6] p-4 text-center cursor-pointer transition hover:border-[#111111] hover:bg-white">
                  <Upload size={20} className="text-[#6B7280]" />
                  <span className="text-xs font-bold text-[#111827]">
                    {uploadingBanner ? "Uploading Banner..." : "Upload Banner"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                    disabled={uploadingBanner}
                  />
                </label>
                {form.shopBanner && (
                  <div className="h-16 w-full overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white p-1">
                    <img
                      src={form.shopBanner}
                      alt="Banner Preview"
                      className="h-full w-full rounded-[6px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_BANNER;
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* VERIFIED BADGE */}
        <div className="flex items-center gap-3 rounded-[16px] border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-700 shadow-sm">
          <ShieldCheck size={18} />
          <span>Verified Seller — your account is active and trusted.</span>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploadingLogo || uploadingBanner}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
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