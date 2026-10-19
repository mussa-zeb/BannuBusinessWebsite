import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Sparkles, MessageSquare, ArrowRight, ShieldCheck, Headphones, ChevronRight, LoaderCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

const contactDetails = [
  { icon: Phone, label: "Phone / WhatsApp", value: "+92 300 0000000", desc: "Available for instant support", href: "tel:+923000000000" },
  { icon: Mail, label: "Email Support", value: "support@bannulocal.com", desc: "Send us your questions anytime", href: "mailto:support@bannulocal.com" },
];

const inputClass = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-[#111111] outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-gray-200";

function Field({ id, label, required = false, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-[#111111]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData(initialForm);
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-24">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80" alt="Contact Us" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
              <Sparkles size={14} /> We're Here to Help
            </span>
            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Let's <span className="text-gray-400">Connect</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300">
              Have a question, need support, or want to list your business? Contact the Bannu Business Platform team. We're here to help local businesses grow online.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          {/* CONTACT INFO SIDEBAR */}
          <motion.aside initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6 lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="bg-[#111111] p-8 text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/20">
                  <MessageSquare size={26} />
                </div>
                <h2 className="mt-6 text-2xl font-black">Contact Details</h2>
                <p className="mt-2 text-sm text-gray-300">Choose your preferred way to get in touch with our team.</p>
              </div>
              <div className="space-y-4 p-6">
                {contactDetails.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <a key={i} href={item.href} className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:border-black hover:bg-white hover:shadow-md">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white transition group-hover:bg-black">
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{item.label}</p>
                        <p className="mt-1 break-words text-sm font-bold text-black">{item.value}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <ChevronRight size={18} className="mt-2 shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-black" />
                    </a>
                  );
                })}
                <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Office Location</p>
                    <p className="mt-1 text-sm font-bold leading-relaxed text-black">Main Bazaar Road,<br />City Center, Bannu, KP, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Business Hours</p>
                    <p className="mt-1 text-sm font-bold text-black">Monday вЂ“ Saturday</p>
                    <p className="mt-1 text-xs text-gray-500">09:00 AM вЂ“ 06:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-black">
                  <Headphones size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold">Local Support Team</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">Need help with your account, business listing, or platform? Send us your question and we'll be happy to assist.</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm font-bold text-black">
                <ShieldCheck size={18} /> Here to help local businesses grow
              </div>
            </div>
          </motion.aside>

          {/* CONTACT FORM */}
          <motion.section initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-7">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm lg:p-12">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-black">
                  <Send size={14} /> Send a Message
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight">How Can We Help?</h2>
                <p className="mt-2 text-sm text-gray-500">Complete the form below. Fields marked with * are required.</p>
              </div>

              <AnimatePresence>
                {submitted && (
                  <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} className="mb-8 overflow-hidden">
                    <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Demo submission completed</p>
                        <p className="mt-1 text-xs leading-relaxed text-emerald-700">The form interaction worked, but your message has not been sent to a server.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="contact-name" label="Your Name" required>
                    <input id="contact-name" type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your full name" className={inputClass} />
                  </Field>
                  <Field id="contact-email" label="Email Address" required>
                    <input id="contact-email" type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" className={inputClass} />
                  </Field>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="contact-phone" label="Phone Number">
                    <input id="contact-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0300 1234567" className={inputClass} />
                  </Field>
                  <Field id="contact-subject" label="Subject" required>
                    <input id="contact-subject" type="text" name="subject" required value={formData.subject} onChange={handleChange} placeholder="How can we help?" className={inputClass} />
                  </Field>
                </div>
                <Field id="contact-message" label="Your Message" required>
                  <textarea id="contact-message" name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Tell us how we can help..." className={`${inputClass} resize-y min-h-[150px]`} />
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span>Please don't include passwords or sensitive details.</span>
                    <span>{formData.message.length}/3000</span>
                  </div>
                </Field>
                <button type="submit" disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] px-8 py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60">
                  {loading ? <><LoaderCircle size={18} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message <ArrowRight size={16} /></>}
                </button>
                <p className="text-center text-xs text-gray-400">Thank you for getting in touch with the Bannu Business Platform.</p>
              </form>
            </div>
          </motion.section>
        </div>
      </main>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-[2rem] bg-[#111111] px-8 py-16 text-white sm:px-12">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Sparkles size={14} /> For Business Owners
              </div>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Ready to grow your business online?</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300">Create your account and start showcasing your business, products, and services to the local community.</p>
            </div>
            <Link to="/register" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-black transition hover:bg-gray-200">
              Register Now <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}