import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#111111] text-slate-300">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4">
          <Link to="/" className="text-xs font-bold uppercase tracking-wider text-white hover:opacity-80 transition">
            Back to top
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            {/* Inverted Logo for Dark Background */}
            <img 
              src="/logo.webp" 
              alt="Bannu Marketplace Logo" 
              className="h-12 w-auto object-contain invert"
            />
            <div>
              <p className="text-sm font-black text-white">Bannu</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                Marketplace
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Discover and shop from trusted sellers across Bannu. Fast delivery, secure payments, and quality products.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Shop</h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/products" className="hover:text-white transition">All Products</Link></li>
            <li><Link to="/products?category=Electronics" className="hover:text-white transition">Electronics</Link></li>
            <li><Link to="/products?category=Fashion" className="hover:text-white transition">Fashion</Link></li>
            <li><Link to="/products?category=Mobile" className="hover:text-white transition">Mobiles</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Account</h3>
          <ul className="space-y-2 text-xs">
            <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
            <li><Link to="/register" className="hover:text-white transition">Sign Up</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
            <li><Link to="/register?role=seller" className="hover:text-white transition">Become a Seller</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">Contact</h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2"><Mail size={14} className="text-white" /> support@bannu.com</li>
            <li className="flex items-center gap-2"><Phone size={14} className="text-white" /> +92 300 0000000</li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-white" /> Main Bazaar, Bannu, KP</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-[11px] text-slate-500">
        В© {new Date().getFullYear()} Bannu Marketplace. All rights reserved.
      </div>
    </footer>
  );
}