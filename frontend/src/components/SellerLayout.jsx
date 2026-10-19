import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Wallet,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";
import api from "../api/api";

export default function SellerLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/seller", icon: LayoutDashboard, end: true },
    { name: "Products", path: "/seller/products", icon: Package },
    { name: "Orders", path: "/seller/orders", icon: ShoppingBag },
    { name: "Payments", path: "/seller/payments", icon: Wallet },
    { name: "Customers", path: "/seller/customers", icon: Users },
    { name: "My Shop Profile", path: "/seller/profile", icon: Store },
  ];

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch {}
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#ECECEC] bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Store size={20} />
          <span className="font-bold">Seller Panel</span>
        </div>
        <button onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-[#ECECEC] bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center gap-2 border-b border-[#ECECEC] px-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A1A1A] text-white">
              <Store size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Bannu</p>
              <p className="text-[10px] uppercase tracking-widest text-[#6B6B6B]">
                Seller
              </p>
            </div>
          </div>

          <nav className="space-y-1 p-3">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <NavLink
                  key={l.path}
                  to={l.path}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#1A1A1A] text-white"
                        : "text-[#6B6B6B] hover:bg-[#F7F7F7] hover:text-[#1A1A1A]"
                    }`
                  }
                >
                  <Icon size={18} />
                  {l.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-3 right-3 space-y-2">
            <Link
              to="/"
              className="block rounded-xl border border-[#ECECEC] px-3 py-2.5 text-center text-sm font-semibold text-[#1A1A1A] hover:bg-[#FAFAFA]"
            >
              View Storefront
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          />
        )}

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}