import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ_RESPONSES = [
  {
    patterns: ['hello', 'hi', 'hey', 'namaste', 'hola', 'greet'],
    answer: "Hello! Welcome to MedVision Pharmacy. I can help you with medicine information, orders, prescriptions, store locations, and more. What do you need help with?",
  },
  {
    patterns: ['order', 'track', 'tracking', 'delivery', 'delivered', 'status'],
    answer: "To track your order, go to Dashboard → Orders section. You'll see real-time tracking for all active orders. You can also click the tracking link in your order confirmation.",
  },
  {
    patterns: ['prescription', 'upload', 'doctor', 'rx'],
    answer: "You can upload your prescription in the Online Pharmacy page. Click 'Upload Prescription', choose your file (PDF, JPG, PNG), and our system will extract medicines automatically for easy ordering.",
  },
  {
    patterns: ['medicine', 'drug', 'tablet', 'capsule', 'syrup', 'dosage', 'dose'],
    answer: "Browse thousands of medicines in our Online Pharmacy. Use search filters to find by brand, manufacturer, or composition. Always consult your doctor before changing dosage.",
  },
  {
    patterns: ['price', 'cost', 'cheap', 'discount', 'offer', 'coupon', 'rate'],
    answer: "Prices are displayed on each medicine card. We offer competitive prices. Check the Notifications Hub for active discount offers and promotional alerts.",
  },
  {
    patterns: ['store', 'location', 'nearby', 'branch', 'address', 'pincode'],
    answer: "We auto-detect the nearest pharmacy store based on your registered pincode. You can also manually select a store from the store dropdown in the Online Pharmacy page.",
  },
  {
    patterns: ['refund', 'return', 'cancel', 'cancell'],
    answer: "For returns or refunds, go to Dashboard → Orders and click on the order. Reach out via the Contact Us page or call our support line. Cold-chain and prescription medicines have restricted return policies.",
  },
  {
    patterns: ['vaccine', 'vaccination', 'immunization', 'shot'],
    answer: "Track your vaccination records in Dashboard → My Vaccinations. You can log past vaccines and set reminders for upcoming doses.",
  },
  {
    patterns: ['account', 'profile', 'setting', 'password', 'login', 'signup'],
    answer: "Manage your account in the Patient Profile section. Update personal info, address, and medical history. For password issues, use the Reset Password option on the login page.",
  },
  {
    patterns: ['emergency', 'urgent', 'help', 'sos', 'ambulance', 'critical'],
    answer: "🚨 For medical emergencies, call 108 (Ambulance) immediately. You can also refer to our Emergency Care Guidelines for first-aid tips.",
  },
  {
    patterns: ['payment', 'pay', 'upi', 'card', 'cash', 'wallet'],
    answer: "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. Payments are secured with SSL encryption. Go to the Payment page during checkout.",
  },
  {
    patterns: ['dark', 'theme', 'light', 'mode', 'night'],
    answer: "Toggle Dark Mode from the Navbar using the moon/sun icon. Your preference is saved automatically for future visits.",
  },
  {
    patterns: ['language', 'hindi', 'tamil', 'telugu', 'kannada', 'bengali', 'marathi'],
    answer: "Change the app language using the language selector in the Navbar. We support English, Hindi, Tamil, Telugu, Kannada, Bengali, and Marathi.",
  },
  {
    patterns: ['notification', 'alert', 'reminder', 'sms', 'email', 'push'],
    answer: "Manage all notification preferences in the Notifications Hub (accessible from the Navbar). Toggle push, email, and SMS alerts for orders, prescriptions, health reminders, and offers.",
  },
  {
    patterns: ['contact', 'support', 'help', 'issue', 'problem'],
    answer: "You can reach us via the Contact Us page. Fill in the query form and our support team will respond within 24 hours. You can also chat with us here anytime!",
  },
];

const SUGGESTED_QUESTIONS = [
  { label: "Track my order", text: "How do I track my order?" },
  { label: "Upload prescription", text: "How to upload a prescription?" },
  { label: "Payment methods", text: "What payment methods are accepted?" },
  { label: "Nearest store", text: "Find nearest pharmacy store" },
  { label: "Discount & coupons", text: "How to get discount offers?" },
  { label: "Refund / Return", text: "Can I return or get a refund?" },
  { label: "Vaccination records", text: "How do I track my vaccinations?" },
  { label: "Change language", text: "How do I change the app language?" },
  { label: "Cancel order", text: "How do I cancel an order?" },
  { label: "Prescription medicines", text: "Which medicines require a prescription?" },
  { label: "Notifications / Alerts", text: "How to manage notifications and alerts?" },
  { label: "Emergency help", text: "I need emergency medical help" },
  { label: "Contact support", text: "How do I contact customer support?" },
  { label: "Account / Profile", text: "How do I update my account profile?" },
  { label: "Dark mode", text: "How do I switch to dark mode?" },
];

const findBestAnswer = (input) => {
  const lower = input.toLowerCase();
  for (const faq of FAQ_RESPONSES) {
    if (faq.patterns.some((p) => lower.includes(p))) {
      return faq.answer;
    }
  }
  return "I'm not sure about that yet. Please visit our Contact Us page or call our support for detailed assistance. Is there anything else I can help you with?";
};

const ChatBot = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: t.chatbot.greeting, time: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = (text) => {
    const userText = (text || input).trim();
    if (!userText) return;

    const userMsg = { from: 'user', text: userText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const answer = findBestAnswer(userText);
      setMessages((prev) => [...prev, { from: 'bot', text: answer, time: new Date() }]);
      setTyping(false);
      if (!open) setUnread((n) => n + 1);
    }, 900 + Math.random() * 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (d) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        className="fixed bottom-24 right-6 z-[9998] group flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 shadow-[0_8px_32px_rgba(6,182,212,0.45)] hover:shadow-[0_12px_40px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
        style={{ borderRadius: '1.25rem' }}
      >
        {/* Shimmer ring */}
        <span className="absolute inset-0 rounded-[1.25rem] ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />

        {open ? (
          <X className="w-6 h-6 text-white drop-shadow" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-0.5">
            {/* Custom pill chat icon */}
            <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="26" height="18" rx="9" fill="white" fillOpacity="0.18" stroke="white" strokeWidth="1.5"/>
              <circle cx="8.5" cy="10" r="2" fill="white"/>
              <circle cx="14" cy="10" r="2" fill="white"/>
              <circle cx="19.5" cy="10" r="2" fill="white"/>
              <path d="M7 19L4 24" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] font-bold text-white/90 leading-none tracking-wide">ASK ME</span>
          </div>
        )}

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white shadow-md">
            {unread}
          </span>
        )}

        {/* Idle pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-[1.25rem] animate-ping opacity-20 bg-cyan-400 pointer-events-none" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-40 right-6 z-[9997] w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl border border-cyan-100 overflow-hidden bg-white dark:bg-slate-900 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-4 left-8 w-12 h-12 rounded-full bg-emerald-300/20 blur-lg pointer-events-none" />
            <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5 text-white drop-shadow" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate drop-shadow">{t.chatbot.title}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shadow shadow-emerald-300/50"></span>
                <p className="text-xs text-cyan-100 font-medium">Online · Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50 dark:bg-slate-800" style={{ maxHeight: '320px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.from === 'bot' ? (
                  <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-900 flex-shrink-0 flex items-center justify-center mt-1">
                    <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center mt-1">
                    <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                  </div>
                )}
                <div className={`max-w-[80%] flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-gradient-to-br from-cyan-600 to-emerald-600 text-white rounded-tr-md'
                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-600 rounded-tl-md shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 px-1">{formatTime(msg.time)}</p>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2 items-end">
                <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-900 flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300" />
                </div>
                <div className="bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions — always visible, collapsible */}
          <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setShowSuggestions((v) => !v)}
              className="w-full flex items-center justify-between px-3 pt-2 pb-1 group"
            >
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold group-hover:text-cyan-600 transition-colors">Quick Questions</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showSuggestions ? 'max-h-24 opacity-100 pb-2' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="overflow-x-auto px-3 scrollbar-hide">
                <div className="flex gap-1.5 w-max">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q.text}
                      onClick={() => sendMessage(q.text)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 hover:border-cyan-300 transition-all duration-150 whitespace-nowrap"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chatbot.placeholder}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-emerald-600 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
