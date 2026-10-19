
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Package,
  LayoutDashboard,
  ChevronDown,
  Briefcase,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../api/api";

// PROFESSIONAL LEFT-TO-RIGHT UNDERLINE
const navLinkClass =
  "relative inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors duration-300 hover:text-black " +
  "after:content-[''] after:absolute after:bottom-1 after:left-3 " +
  "after:h-[2px] after:w-[calc(100%-24px)] after:origin-left " +
  "after:scale-x-0 after:rounded-full after:bg-black " +
  "after:transition-transform after:duration-300 after:ease-in-out " +
  "hover:after:scale-x-100";

const mobileLinkClass =
  "relative block rounded-xl px-3 py-3 text-sm font-semibold text-neutral-800 transition-colors duration-300 hover:text-black " +
  "after:content-[''] after:absolute after:bottom-2 after:left-3 " +
  "after:h-[2px] after:w-[calc(100%-24px)] after:origin-left " +
  "after:scale-x-0 after:rounded-full after:bg-black " +
  "after:transition-transform after:duration-300 after:ease-in-out " +
  "hover:after:scale-x-100";

const dropdownLinkClass =
  "relative block px-4 py-2.5 text-sm text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 hover:text-black " +
  "after:content-[''] after:absolute after:bottom-1 after:left-4 " +
  "after:h-[2px] after:w-[calc(100%-32px)] after:origin-left " +
  "after:scale-x-0 after:rounded-full after:bg-black " +
  "after:transition-transform after:duration-300 after:ease-in-out " +
  "hover:after:scale-x-100";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const [catMenu, setCatMenu] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
  }

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data?.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // CLOSE MENUS AFTER NAVIGATION
  useEffect(() => {
    setOpen(false);
    setUserMenu(false);
    setCatMenu(false);
  }, [location.pathname]);

  // SEARCH PRODUCTS
  const handleSearch = (e) => {
    e.preventDefault();

    const q = query.trim();

    navigate(
      q
        ? `/products?search=${encodeURIComponent(q)}`
        : "/products"
    );

    setOpen(false);
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    localStorage.removeItem("user");
    setOpen(false);
    setUserMenu(false);
    navigate("/login");
  };

  const closeAll = () => {
    setOpen(false);
    setUserMenu(false);
    setCatMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          to="/"
          onClick={closeAll}
          className="flex shrink-0 items-center gap-2"
        >
          <img
            src="/logo.webp"
            alt="Bannu"
            className="h-10 w-auto object-contain"
          />

          <div>
            <p className="text-sm font-black text-[#111111]">
              Bannu
            </p>

            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
              Marketplace
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            onClick={closeAll}
            className={navLinkClass}
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={closeAll}
            className={navLinkClass}
          >
            Products
          </Link>

          {/* ALL CATEGORIES DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCatMenu((v) => !v)}
              className="relative inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors duration-300 hover:bg-neutral-100 hover:text-black after:content-[''] after:absolute after:bottom-1 after:left-3 after:h-[2px] after:w-[calc(100%-24px)] after:origin-left after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
            >
              All Categories

              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${
                  catMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {catMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCatMenu(false)}
                />

                <div className="absolute left-0 z-50 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white py-2 shadow-xl">
                  <Link
                    to="/categories"
                    onClick={closeAll}
                    className={`${dropdownLinkClass} border-b border-neutral-100 font-bold text-black`}
                  >
                    View All Categories
                  </Link>

                  {categories.length === 0 ? (
                    <p className="px-4 py-2 text-xs text-neutral-500">
                      No categories
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/products?category=${encodeURIComponent(
                          cat.name
                        )}`}
                        onClick={closeAll}
                        className={dropdownLinkClass}
                      >
                        {cat.name}
                      </Link>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <Link
            to="/about"
            onClick={closeAll}
            className={navLinkClass}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            onClick={closeAll}
            className={navLinkClass}
          >
            Contact Us
          </Link>

        </nav>

        {/* DESKTOP SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden max-w-[280px] flex-1 items-center justify-end lg:flex"
        >
          <div className="flex h-10 w-full items-center rounded-full border border-neutral-300 bg-neutral-50 px-3 transition-all duration-300 focus-within:border-black focus-within:bg-white">
            <Search size={17} className="text-neutral-400" />

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="h-full w-full bg-transparent px-2 text-xs outline-none"
            />
          </div>
        </form>

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-2">

          {/* SHOPPING CART */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition-all duration-300 hover:border-black hover:bg-neutral-100"
          >
            <ShoppingCart size={19} />

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111111] px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* USER MENU */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setUserMenu((v) => !v)}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-700 transition-all duration-300 hover:bg-neutral-100 hover:text-black hover:underline underline-offset-4 decoration-2"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User size={18} />
              )}

              <span>
                {user ? user.name?.split(" ")[0] : "Login"}
              </span>

              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${
                  userMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {userMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenu(false)}
                />

                <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-neutral-200 bg-white py-2 shadow-xl">
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={closeAll}
                        className={dropdownLinkClass}
                      >
                        Login
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeAll}
                        className={dropdownLinkClass}
                      >
                        Create Account
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="border-b border-neutral-100 px-4 py-2">
                        <p className="truncate text-xs text-neutral-500">
                          {user.email}
                        </p>
                      </div>

                      {user.role === "customer" && (
                        <>
                          <Link
                            to="/orders"
                            onClick={closeAll}
                            className={`${dropdownLinkClass} flex items-center gap-2`}
                          >
                            <Package size={15} />
                            My Orders
                          </Link>

                          <Link
                            to="/profile"
                            onClick={closeAll}
                            className={`${dropdownLinkClass} flex items-center gap-2`}
                          >
                            <User size={15} />
                            My Profile
                          </Link>
                        </>
                      )}

                      {user.role === "seller" && (
                        <Link
                          to="/seller"
                          onClick={closeAll}
                          className={`${dropdownLinkClass} flex items-center gap-2`}
                        >
                          <LayoutDashboard size={15} />
                          Seller Dashboard
                        </Link>
                      )}

                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={closeAll}
                          className={`${dropdownLinkClass} flex items-center gap-2`}
                        >
                          <LayoutDashboard size={15} />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2 border-t border-neutral-100 px-4 py-2.5 text-left text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 hover:underline underline-offset-4 decoration-2"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* BECOME A SELLER */}
          <Link
            to="/register?role=seller"
            onClick={closeAll}
            className="relative hidden items-center gap-1.5 rounded-xl bg-[#111111] px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-neutral-800 hover:underline underline-offset-4 decoration-2 sm:flex"
          >
            <Briefcase size={14} />
            Become a Seller
          </Link>

          {/* MOBILE MENU TOGGLE */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 transition-all duration-300 hover:border-black hover:bg-neutral-100 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-neutral-200 bg-white p-4 lg:hidden">

          {/* MOBILE SEARCH */}
          <form
            onSubmit={handleSearch}
            className="mb-3 flex"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded-l-xl border border-r-0 border-neutral-300 bg-neutral-50 px-3 text-sm outline-none focus:border-black"
            />

            <button
              type="submit"
              aria-label="Search"
              className="flex h-11 items-center rounded-r-xl bg-[#111111] px-4 text-white transition-colors duration-200 hover:bg-neutral-800"
            >
              <Search size={18} />
            </button>
          </form>

          <Link
            to="/"
            onClick={closeAll}
            className={mobileLinkClass}
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={closeAll}
            className={mobileLinkClass}
          >
            Products
          </Link>

          {/* MOBILE CATEGORIES */}
          <button
            type="button"
            onClick={() => setCatMenu((v) => !v)}
            className="relative flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-300 hover:bg-neutral-100 hover:underline underline-offset-4 decoration-2"
          >
            All Categories

            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                catMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {catMenu && (
            <div className="ml-3 border-l-2 border-neutral-100 pl-2">
              <Link
                to="/categories"
                onClick={closeAll}
                className={dropdownLinkClass}
              >
                View All Categories
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${encodeURIComponent(
                    cat.name
                  )}`}
                  onClick={closeAll}
                  className={dropdownLinkClass}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/about"
            onClick={closeAll}
            className={mobileLinkClass}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            onClick={closeAll}
            className={mobileLinkClass}
          >
            Contact Us
          </Link>

          <div className="my-3 border-t border-neutral-200" />

          {/* LOGIN AND ACCOUNT */}
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={closeAll}
                className={mobileLinkClass}
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeAll}
                className={mobileLinkClass}
              >
                Create Account
              </Link>
            </>
          ) : (
            <>
              <div className="mb-2 rounded-xl bg-neutral-50 px-3 py-3">
                <p className="text-xs text-neutral-500">
                  Signed in as
                </p>

                <p className="mt-1 break-all text-sm font-bold">
                  {user.email}
                </p>
              </div>

              {user.role === "customer" && (
                <>
                  <Link
                    to="/orders"
                    onClick={closeAll}
                    className={mobileLinkClass}
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/profile"
                    onClick={closeAll}
                    className={mobileLinkClass}
                  >
                    My Profile
                  </Link>
                </>
              )}

              {user.role === "seller" && (
                <Link
                  to="/seller"
                  onClick={closeAll}
                  className={mobileLinkClass}
                >
                  Seller Dashboard
                </Link>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeAll}
                  className={mobileLinkClass}
                >
                  Admin Panel
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
                className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50 hover:underline underline-offset-4 decoration-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}

          {/* BECOME A SELLER */}
          <Link
            to="/register?role=seller"
            onClick={closeAll}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-neutral-800 hover:underline underline-offset-4 decoration-2"
          >
            <Briefcase size={16} />
            Become a Seller
          </Link>
        </div>
      )}
    </header>
  );
}
