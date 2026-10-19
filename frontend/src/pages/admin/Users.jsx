import { useEffect, useState } from "react";
import { Trash2, Search, Users as UsersIcon, LoaderCircle } from "lucide-react";
import api from "../../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data.users || res.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete user.");
    }
  };

  const t = search.toLowerCase().trim();
  const filtered = users.filter((u) => {
    const name = u.name?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    return name.includes(t) || email.includes(t);
  });

  return (
    <div className="mx-auto max-w-7xl pb-16 text-[var(--color-text-primary)]">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
          Platform Users
        </h1>
        <p className="mt-1 text-xs text-[#6B7280]">
          Manage all registered user accounts
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 max-w-md">
        <div className="flex items-center rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 transition focus-within:border-[#111111] focus-within:bg-white">
          <Search size={16} className="text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-transparent px-3 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E7EB] bg-[#F8F9FA] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-xs font-bold text-[#6B7280]">
                      <LoaderCircle size={24} className="animate-spin text-[#111111]" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-16 text-center">
                    <UsersIcon size={42} className="mx-auto text-[#9CA3AF]" />
                    <p className="mt-4 text-sm font-bold text-[#111827]">No Users Found</p>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      Try searching for a different name or email.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const role = u.role || "user";
                  return (
                    <tr key={u._id} className="transition hover:bg-[#F8F9FA]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-xs font-black text-white">
                            {u.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="font-bold text-[#111827]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6B7280]">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[10px] font-bold uppercase text-[#111827]">
                          {role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteUser(u._id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}