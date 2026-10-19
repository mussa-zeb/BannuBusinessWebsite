import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Sparkles,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/api";

const TABS = [
  { id: "general", label: "General Settings", icon: SettingsIcon, desc: "Site name, tagline, description" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Email, booking and review alerts" },
  { id: "security", label: "Security", icon: Shield, desc: "Platform security preferences" },
  { id: "website", label: "Website", icon: Globe, desc: "Footer text and social links" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [form, setForm] = useState({
    siteName: "",
    siteTagline: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    emailNotifications: true,
    bookingNotifications: true,
    reviewNotifications: true,
    maintenanceMode: false,
    footerText: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
    socialWhatsapp: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/settings");
        if (res.data?.settings) {
          setForm((f) => ({ ...f, ...res.data.settings }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      const res = await api.put("/settings", form);
      if (res.data?.settings) {
        setForm((f) => ({ ...f, ...res.data.settings }));
      }
      setSavedMsg("Settings saved successfully.");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 animate-spin" size={20} />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 text-[#0F172A] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-700">
            <Sparkles size={14} className="text-[#06B6D4]" />
            Admin Configuration
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl">
            Platform{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#64748B]">
            Manage system preferences, notifications, and platform configuration.
          </p>
        </motion.div>

        <AnimatePresence>
          {savedMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"
            >
              <CheckCircle2 size={18} />
              {savedMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex w-full items-start gap-4 rounded-3xl border p-5 text-left transition ${
                    isActive
                      ? "border-blue-200 bg-white shadow-lg shadow-blue-100"
                      : "border-[#E2E8F0] bg-white hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-[#2563EB]"
                    }`}
                  >
                    <Icon size={19} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-bold ${
                        isActive ? "text-[#2563EB]" : "text-[#0F172A]"
                      }`}
                    >
                      {tab.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">
                      {tab.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </aside>

          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
            {activeTab === "general" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">General Settings</h2>
                <Field label="Site Name">
                  <input
                    name="siteName"
                    value={form.siteName}
                    onChange={handleChange}
                    className="input"
                  />
                </Field>
                <Field label="Tagline">
                  <input
                    name="siteTagline"
                    value={form.siteTagline}
                    onChange={handleChange}
                    className="input"
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    name="siteDescription"
                    rows={4}
                    value={form.siteDescription}
                    onChange={handleChange}
                    className="input resize-none"
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Contact Email">
                    <input
                      name="contactEmail"
                      value={form.contactEmail}
                      onChange={handleChange}
                      className="input"
                    />
                  </Field>
                  <Field label="Contact Phone">
                    <input
                      name="contactPhone"
                      value={form.contactPhone}
                      onChange={handleChange}
                      className="input"
                    />
                  </Field>
                </div>
                <Field label="Contact Address">
                  <input
                    name="contactAddress"
                    value={form.contactAddress}
                    onChange={handleChange}
                    className="input"
                  />
                </Field>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Notifications</h2>
                <Toggle
                  name="emailNotifications"
                  label="Email Notifications"
                  desc="Send emails for important platform events."
                  checked={form.emailNotifications}
                  onChange={handleChange}
                />
                <Toggle
                  name="bookingNotifications"
                  label="Booking Notifications"
                  desc="Notify owners when a new booking is created."
                  checked={form.bookingNotifications}
                  onChange={handleChange}
                />
                <Toggle
                  name="reviewNotifications"
                  label="Review Notifications"
                  desc="Notify owners when a review is posted."
                  checked={form.reviewNotifications}
                  onChange={handleChange}
                />
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Security</h2>
                <Toggle
                  name="maintenanceMode"
                  label="Maintenance Mode"
                  desc="Put the platform into read-only mode for maintenance."
                  checked={form.maintenanceMode}
                  onChange={handleChange}
                />
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                  Admin password change is not exposed in the UI. Use the backend script{" "}
                  <code className="font-mono">npm run create-admin</code> to reset
                  the admin password, or update the user document directly.
                </div>
              </div>
            )}

            {activeTab === "website" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Website</h2>
                <Field label="Footer Text">
                  <input
                    name="footerText"
                    value={form.footerText}
                    onChange={handleChange}
                    className="input"
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Facebook URL">
                    <input
                      name="socialFacebook"
                      value={form.socialFacebook}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="input"
                    />
                  </Field>
                  <Field label="Instagram URL">
                    <input
                      name="socialInstagram"
                      value={form.socialInstagram}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="input"
                    />
                  </Field>
                  <Field label="Twitter URL">
                    <input
                      name="socialTwitter"
                      value={form.socialTwitter}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="input"
                    />
                  </Field>
                  <Field label="WhatsApp URL">
                    <input
                      name="socialWhatsapp"
                      value={form.socialWhatsapp}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="input"
                    />
                  </Field>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end border-t border-[#E2E8F0] pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-[#1D4ED8] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={17} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #2563EB;
          background: white;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#64748B]">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({ name, label, desc, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition hover:border-blue-200 hover:bg-white">
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#0F172A]">{label}</p>
        <p className="mt-1 text-xs text-[#64748B]">{desc}</p>
      </div>
      <span className="relative inline-flex shrink-0 items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-[#2563EB]" />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}