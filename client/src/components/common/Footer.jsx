import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full relative text-white pt-16 pb-12 font-sans bg-[#161915] overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#70BF4F] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                Naik<span className="text-[#70BF4F]">Foods</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#70BF4F]/20 text-[#70BF4F] border border-[#70BF4F]/40 uppercase tracking-widest">
                Heritage
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Crafting authentic Maharashtrian flavors from <strong className="text-white">Pune, Vidarbha & Konkan</strong>. Hand-pounded masalas, zero-maida millet noodles, traditional khakhras, and pure staples delivered with trust.
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#70BF4F]" /> 100% Authentic Flavors
              </span>
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <Heart className="w-4 h-4 text-[#EB001B]" /> Handcrafted in Maharashtra
              </span>
            </div>
          </div>

          {/* Quick Categories Col */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black tracking-[0.2em] text-[#70BF4F] uppercase">
              Explore Store
            </h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link to="/store?category=spices-and-masalas" className="hover:text-white transition-colors">
                  Spices & Masalas
                </Link>
              </li>
              <li>
                <Link to="/store?category=dry-instant-grocery" className="hover:text-white transition-colors">
                  Millet Noodles & Staples
                </Link>
              </li>
              <li>
                <Link to="/store?category=snacks-and-namkeen" className="hover:text-white transition-colors">
                  Snacks & Khakhra
                </Link>
              </li>
              <li>
                <Link to="/store?category=mukhvas-and-digestives" className="hover:text-white transition-colors">
                  Mukhvas & Mitha Paan
                </Link>
              </li>
              <li>
                <Link to="/store?category=pickles-and-condiments" className="hover:text-white transition-colors">
                  Pickles & Thecha
                </Link>
              </li>
            </ul>
          </div>

          {/* Regions Col */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black tracking-[0.2em] text-[#70BF4F] uppercase">
              Heritage Regions
            </h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <Link to="/store?region=Pune" className="hover:text-white transition-colors">
                  Pune Heritage
                </Link>
              </li>
              <li>
                <Link to="/store?region=Vidarbha" className="hover:text-white transition-colors">
                  Vidarbha Hand-Pounded
                </Link>
              </li>
              <li>
                <Link to="/store?region=Konkan" className="hover:text-white transition-colors">
                  Konkan Coastal
                </Link>
              </li>
              <li>
                <Link to="/store?region=Western Maharashtra" className="hover:text-white transition-colors">
                  Kolhapur & Western Maha
                </Link>
              </li>
            </ul>
          </div>

          {/* Visit Store Card */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-md">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Visit Our Flagship Store</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#70BF4F]/20 text-[#70BF4F]">
                Open Daily
              </span>
            </h3>

            <div className="space-y-3 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#70BF4F] shrink-0 mt-0.5" />
                <span>
                  Seva Mitra Mandal Chowk, Near Fadgate Police Chowki, Shukrawar Peth, Pune 411002
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#70BF4F] shrink-0" />
                <a href="tel:+919730046247" className="hover:text-white transition-colors font-semibold">
                  +91 9730046247
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#70BF4F] shrink-0" />
                <span>9:00 AM - 10:00 PM (Monday to Sunday)</span>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/place/NAIK+FOODS/@18.5085455,73.8572996,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-[#70BF4F] hover:bg-[#5BA33E] text-white text-xs font-bold transition-all gap-1.5 shadow-sm"
            >
              Get Store Directions <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Bottom Bar with Razorpay & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} Naik Foods. Prototype evolution created for Bits And Volts assessment.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400 font-semibold">100% Safe Payments</span>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-md text-white font-mono text-[10px]">
              <span>UPI</span>
              <span>•</span>
              <span>Cards</span>
              <span>•</span>
              <span>COD Available</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
