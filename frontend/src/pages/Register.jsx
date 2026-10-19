import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, Mail, Lock, Phone, Eye, EyeOff, Store, ShoppingBag, LoaderCircle } from "lucide-react";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = params.get("role") === "seller" ? "seller" : "customer";

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: initialRole });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const res = await api.post("/users/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.trim(),
        role: form.role,
      });
      setSuccess(res.data?.message || "Registration successful.");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 py-12 text-[#111111]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-black">Create Account</h1>
          <p className="mt-3 text-sm text-gray-500">Join the Bannu Marketplace today</p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl sm:p-10">
          <div className="mb-8 grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setForm((f) => ({ ...f, role: "customer" }))} className={`flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all ${form.role === "customer" ? "border-black bg-[#111111] text-white shadow-md" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"}`}>
              <ShoppingBag size={24} className={form.role === "customer" ? "text-white" : "text-gray-400"} />
              <span className="text-sm font-bold">Customer</span>
            </button>
            <button type="button" onClick={() => setForm((f) => ({ ...f, role: "seller" }))} className={`flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all ${form.role === "seller" ? "border-black bg-[#111111] text-white shadow-md" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"}`}>
              <Store size={24} className={form.role === "seller" ? "text-white" : "text-gray-400"} />
              <span className="text-sm font-bold">Seller</span>
            </button>
          </div>

          {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}
          {success && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-black">Full Name</label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                <User size={18} className="text-gray-400" />
                <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className="w-full bg-transparent px-3 py-4 text-sm text-black outline-none placeholder:text-gray-400" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-black">Email Address</label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                <Mail size={18} className="text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="w-full bg-transparent px-3 py-4 text-sm text-black outline-none placeholder:text-gray-400" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-black">Phone Number</label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                <Phone size={18} className="text-gray-400" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="03XXXXXXXXX" className="w-full bg-transparent px-3 py-4 text-sm text-black outline-none placeholder:text-gray-400" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-black">Password</label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                <Lock size={18} className="text-gray-400" />
                <input type={show ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="At least 6 characters" className="w-full bg-transparent px-3 py-4 text-sm text-black outline-none placeholder:text-gray-400" />
                <button type="button" onClick={() => setShow((v) => !v)} className="text-gray-400 hover:text-black">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60">
              {loading ? <><LoaderCircle size={18} className="animate-spin" /> Creating...</> : `Create ${form.role === "seller" ? "Seller" : ""} Account`}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="font-bold text-black hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}