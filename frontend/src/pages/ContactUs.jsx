import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  CheckCircle,
} from "lucide-react";

const contactDetails = [
  {
    icon: Phone,
    title: "Phone Support",
    lines: ["8758770402", "+91 87587 70402"],
    color: "blue",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["support@pharmacymvp.com", "orders@pharmacymvp.com"],
    color: "emerald",
  },
  {
    icon: MapPin,
    title: "Head Office",
    lines: ["PharmacyMVP Pvt. Ltd.", "Mumbai, Maharashtra – 400001"],
    color: "purple",
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon – Sat: 9:00 AM – 8:00 PM", "Sun: 10:00 AM – 5:00 PM"],
    color: "orange",
  },
];

const colorMap = {
  blue:    { card: "bg-blue-50 border-blue-200",   icon: "bg-blue-100 text-blue-600" },
  emerald: { card: "bg-emerald-50 border-emerald-200", icon: "bg-emerald-100 text-emerald-600" },
  purple:  { card: "bg-purple-50 border-purple-200",  icon: "bg-purple-100 text-purple-600" },
  orange:  { card: "bg-orange-50 border-orange-200",  icon: "bg-orange-100 text-orange-600" },
};

const subjects = [
  "Order & Delivery Issue",
  "Prescription Upload Support",
  "Medicine Availability Query",
  "Refund / Return Request",
  "Emergency Medicine Help",
  "Feedback & Suggestions",
  "Other",
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.phone && !/^\+?[0-9\s\-]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.subject) e.subject = "Please select a subject.";
    if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters.";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-500 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur mb-6">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Contact Us</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Have a question about your order, a medicine, or need pharmacy assistance? Our team is ready to help — reach out any time.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {contactDetails.map((d, i) => {
          const c = colorMap[d.color];
          const Icon = d.icon;
          return (
            <div key={i} className={`rounded-2xl border ${c.card} p-6 shadow-sm bg-white flex flex-col gap-3`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.icon}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-bold text-gray-800 text-sm">{d.title}</p>
              {d.lines.map((l, j) => (
                <p key={j} className="text-gray-500 text-sm leading-snug">{l}</p>
              ))}
            </div>
          );
        })}
      </div>

      {/* Main Content: Form + Map */}
      <div className="max-w-5xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send Us a Message</h2>
              <p className="text-sm text-gray-500">We typically respond within 24 hours.</p>
            </div>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
              <p className="text-gray-500 max-w-sm">
                Your message has been received. Our support team will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 87587 70402"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-50 ${
                      errors.subject ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <option value="">Select a subject…</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your query or concern in detail…"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none ${
                    errors.message ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message
                    ? <p className="text-red-500 text-xs">{errors.message}</p>
                    : <span />
                  }
                  <p className="text-gray-400 text-xs">{form.message.length} chars</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-[.98] transition flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <Send className="w-4 h-4" />
                Submit Query
              </button>
            </form>
          )}
        </div>

        {/* Side Panel: FAQ-style quick help */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h3 className="font-bold text-gray-900 text-lg mb-5">Quick Help Topics</h3>
            <div className="space-y-4">
              {[
                { q: "How do I track my order?", a: "After login, go to 'My Orders' from your dashboard to view real-time order status." },
                { q: "Can I upload a prescription?", a: "Yes! Use the 'Prescription Help' option on the pharmacy page to upload your prescription." },
                { q: "What's the refund process?", a: "Eligible refunds are processed within 5–7 business days. Contact us with your order ID for faster resolution." },
                { q: "Are medicines genuine?", a: "All medicines on PharmacyMVP are sourced from licensed distributors and verified pharmacies." },
                { q: "Is there emergency support?", a: "Visit our Emergency Care section or call our toll-free number for urgent medicine assistance." },
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="font-semibold text-gray-800 text-sm mb-1">{item.q}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency strip */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-md">
            <p className="font-bold text-lg mb-1">Need Urgent Help?</p>
            <p className="text-white/80 text-sm mb-4">For medical emergencies, call our 24/7 emergency line.</p>
            <a
              href="tel:+918758770402"
              className="inline-flex items-center gap-2 bg-white text-red-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-red-50 transition"
            >
              <Phone className="w-4 h-4" />
              8758770402
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
