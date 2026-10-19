import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  Tags,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import api from "../api/api";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
    { name: "Sellers", path: "/admin/sellers", icon: Store },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Categories", path: "/admin/categories", icon: Tags },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Settings", path: "/admin/settings", icon: SettingsIcon },
  ];

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#F7F7F7] text-[#111827] lg:flex-row">
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 sm:px-6 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111111] text-white">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <p className="text-sm font-black tracking-tight">Bannu</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
              Admin Panel
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#111827] transition hover:bg-[#F3F4F6] active:scale-95"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] flex-col justify-between border-r border-[#E5E7EB] bg-white p-5 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-30 lg:h-dvh lg:w-64 lg:shrink-0 lg:translate-x-0 lg:p-6 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mb-7 flex items-center justify-between border-b border-[#E5E7EB] px-2 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white">
                <LayoutDashboard size={19} />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight text-[#111827]">
                  Bannu
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Admin Panel
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#111111] lg:hidden"
            >
              <X size={19} />
            </button>
          </div>

          <div className="mb-3 px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9CA3AF]">
              Admin Menu
            </p>
          </div>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-[13px] font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[#111111] text-white shadow-sm"
                        : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.3 : 1.8}
                        className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          isActive
                            ? "text-white"
                            : "text-[#9CA3AF] group-hover:text-[#111111]"
                        }`}
                      />
                      <span className="flex-1">{link.name}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 border-t border-[#E5E7EB] pt-4">
          <button
            type="button"
            onClick={logout}
            className="group flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-600 transition duration-200 hover:border-red-200 hover:bg-red-100 active:scale-[0.98]"
          >
            <LogOut
              size={18}
              className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Logout</span>
          </button>
          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
            Bannu Platform
          </p>
        </div>
      </aside>

      <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mx-auto min-h-full w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}