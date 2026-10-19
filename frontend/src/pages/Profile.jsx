import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Save, Camera, LoaderCircle } from "lucide-react";
import api from "../api/api";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      const user = response.data?.user || response.data;
      setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", address: user?.address || "" });
    } catch (error) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", address: user?.address || "" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await api.put("/users/profile", form);
      const updatedUser = response.data?.user || response.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#F9FAFB]">
        <LoaderCircle size={36} className="animate-spin text-[#111111]" />
        <p className="text-sm font-bold text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 py-12 text-[#111111] pb-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">My Profile</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your personal information and delivery preferences</p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl sm:p-10">
          <div className="mb-10 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#111111] text-3xl font-black text-white shadow-lg">
                {form.name?.[0]?.toUpperCase() || <User size={36} />}
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 rounded-full bg-white border border-gray-200 text-black shadow-md hover:bg-gray-50 transition">
                <Camera size={16} />
              </button>
            </div>
            <p className="mt-4 text-lg font-black text-black">{form.name || "User Profile"}</p>
            <p className="text-sm text-gray-500">{form.email}</p>
          </div>

          {message.text && (
            <div className={`mb-8 rounded-xl border px-5 py-4 text-sm font-bold ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-black">Full Name</label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                <User size={18} className="text-gray-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full bg-transparent px-3 py-4 text-sm text-black outline-none placeholder:text-gray-400" placeholder="Your full name" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-black">Email Address</label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-100 px-4 opacity-70">
                <Mail size={18} className="text-gray-400" />
                <input type="email" name="email" value={form.email} readOnly className="w-full bg-transparent px-3 py-4 text-sm text-gray-500 outline-none cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-black">Phone Number</label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                <Phone size={18} className="text-gray-400" />
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full bg-transparent px-3 py-4 text-sm text-black outline-none placeholder:text-gray-400" placeholder="03XXXXXXXXX" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-black">Delivery Address</label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                <MapPin size={18} className="text-gray-400" />
                <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full bg-transparent px-3 py-4 text-sm text-black outline-none placeholder:text-gray-400" placeholder="Your full shipping address" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60">
              {saving ? <><LoaderCircle size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Profile</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}