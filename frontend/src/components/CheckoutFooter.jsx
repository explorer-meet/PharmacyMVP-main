import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock3 } from 'lucide-react';

function CheckoutFooter() {
  return (
    <footer className="mt-12 border-t border-cyan-200/60 bg-gradient-to-r from-cyan-50 via-sky-50 to-emerald-50 backdrop-blur-sm">
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-300 px-2.5 py-1 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Secure Checkout
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-100 to-cyan-50 border border-sky-300 px-2.5 py-1 shadow-sm">
              <Truck className="w-3.5 h-3.5 text-sky-700" />
              Fast Delivery
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-50 border border-amber-300 px-2.5 py-1 shadow-sm">
              <Clock3 className="w-3.5 h-3.5 text-amber-700" />
              24x7 Support
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <Link to="/privacy-policy" className="hover:text-cyan-700 transition-colors">Privacy</Link>
            <Link to="/terms-and-conditions" className="hover:text-cyan-700 transition-colors">Terms</Link>
            <span className="text-slate-500 font-medium">© {new Date().getFullYear()} MedVision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default CheckoutFooter;
