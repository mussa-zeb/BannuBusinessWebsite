import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, LoaderCircle } from "lucide-react";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/users/login", { email: form.email.trim().toLowerCase(), password: form.password });
      const user = res.data?.user;
      if (!user) throw new Error();
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "admin") return navigate("/admin", { replace: true });
      if (user.role === "seller") return navigate("/seller", { replace: true });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 py-12 text-[#111111]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-black">Welcome Back</h1>
          <p className="mt-3 text-sm text-gray-500">Sign in to continue to your account</p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl sm:p-10">
          {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-black">Email Address</label>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                <Mail size={18} className="text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="w-full bg-transparent px-3 py-4 text-sm text-black outline-none placeholder:text-gray-400" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-bold text-black">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-gray-500 hover:text-black hover:underline">Forgot Password?</Link>
              </div>
              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 transition focus-within:border-black focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200">
                <Lock size={18} className="text-gray-400" />
                <input type={show ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required className="w-full bg-transparent px-3 py-4 text-sm text-black outline-none placeholder:text-gray-400" />
                <button type="button" onClick={() => setShow((v) => !v)} className="text-gray-400 hover:text-black">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60">
              {loading ? <><LoaderCircle size={18} className="animate-spin" /> Signing in...</> : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="font-bold text-black hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}