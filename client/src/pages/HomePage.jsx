import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Flame,
  Award,
  Clock,
  MapPin,
  Heart,
} from "lucide-react";
import { productService } from "../services/productService";
import { ProductCard } from "../components/product/ProductCard";

export const HomePage = ({ onQuickView, selectedRegion, onSelectRegion }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, catRes] = await Promise.all([
          productService.getFeatured(),
          productService.getCategories(),
        ]);
        if (featRes.success && featRes.data) {
          setFeaturedProducts(featRes.data.bestsellers || []);
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F9F0] via-white to-[#FAFAF8] pt-10 pb-16 sm:pb-24 border-b border-surface-border">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#70BF4F]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#F79E1B]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#70BF4F]/15 border border-[#70BF4F]/30 text-xs font-bold text-[#356323] tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#70BF4F]" />
                Authentic Maharashtrian Flavors • Delivered Across India
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-[1.1]">
                Heritage Delicacies from{" "}
                <span className="text-[#70BF4F]">Vidarbha, Konkan & Pune</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
                Taste the golden tradition of Maharashtra. Hand-pounded Goda
                masalas, zero-maida millet noodles, stone-crushed Kolhapuri
                thecha, and crispy roasted khakhras made with pure authentic
                ingredients.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/store"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#70BF4F] hover:bg-[#5BA33E] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-brand hover:shadow-lg transition-all transform active:scale-95"
                >
                  <span>Explore The Delicacies Store</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/store?category=spices-and-masalas"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>View Hand-Pounded Masalas</span>
                </Link>
              </div>

              {/* Live Metric Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block text-xl sm:text-2xl font-black font-mono text-neutral-900">
                    100%
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    Handcrafted Spices
                  </span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black font-mono text-[#70BF4F]">
                    0%
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    Refined Maida in Millets
                  </span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black font-mono text-neutral-900">
                    ₹999
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    Free Delivery Across India
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-4 shadow-lift border border-neutral-200">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 relative">
                  <img
                    src="https://res.cloudinary.com/dskzfipt3/image/upload/v1781327380/medusa/1781327380348-pomelli_photoshoot_image_1_1_0612%20%2821%29.png.jpg"
                    alt="Multi Millet Noodles Naik Foods"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#161915] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                    Featured Innovation
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#356323] bg-[#70BF4F]/15 px-2.5 py-0.5 rounded-full">
                      📍 Pune Special
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      ★ 4.9 (38 Reviews)
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-900">
                    Multi Millet Noodles (No Maida, 100% Vegan)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Wholesome blend of Foxtail, Bajra & Little Millets. Cooks in
                    5 minutes with aromatic roasted spices.
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div>
                      <span className="text-xl font-black font-mono text-neutral-900">
                        ₹100
                      </span>
                      <span className="text-xs text-neutral-400 font-mono line-through ml-2">
                        ₹120
                      </span>
                    </div>
                    <Link
                      to="/store?search=Millet"
                      className="px-4 py-2 rounded-xl bg-[#161915] hover:bg-[#70BF4F] text-white text-xs font-bold transition-colors"
                    >
                      Shop Millets
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-surface-border shadow-soft">
          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-[#70BF4F]/10 flex items-center justify-center text-[#70BF4F] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Free Standard Delivery
              </h4>
              <p className="text-xs text-neutral-500">
                On all orders above ₹999
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Hand-Pounded Masalas
              </h4>
              <p className="text-xs text-neutral-500">
                Authentic Vidarbha & Pune heritage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Zero Maida Healthy Range
              </h4>
              <p className="text-xs text-neutral-500">
                100% Millet noodles & roasted khakhras
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Direct from Shukrawar Peth
              </h4>
              <p className="text-xs text-neutral-500">
                Fresh daily dispatch from Pune
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#70BF4F] mb-1">
              Handcrafted Categories
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Explore Our Authentic Specialties
            </h2>
          </div>
          <Link
            to="/store"
            className="text-xs font-bold text-[#356323] hover:text-[#70BF4F] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/store?category=${cat.slug}`}
              className="group bg-white p-4 rounded-2xl border border-surface-border hover:border-[#70BF4F] hover:shadow-lift transition-all text-center flex flex-col items-center justify-between space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F2F9F0] group-hover:bg-[#70BF4F]/15 flex items-center justify-center transition-colors">
                <img
                  src={
                    cat.image ||
                    "https://res.cloudinary.com/dskzfipt3/image/upload/v1775205758/SVG_1_y89cdr.svg"
                  }
                  alt={cat.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#70BF4F] transition-colors leading-snug">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Regional Specialties & Provenance */}
      <section className="bg-surface-sage py-16 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#70BF4F]">
              Provenance & Heritage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Flavors by Maharashtra's Heritage Regions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Each geographic region of Maharashtra boasts distinct culinary
              secrets. Click a region to explore its specialized delicacies.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              {
                id: "all",
                title: "All Maharashtra",
                desc: "Complete Heritage Collection",
              },
              {
                id: "Pune",
                title: "Pune Special",
                desc: "Bakarwadi, Khakhra & Millets",
              },
              {
                id: "Vidarbha",
                title: "Vidarbha Heritage",
                desc: "Hand-Pounded Black Goda Masala",
              },
              {
                id: "Konkan",
                title: "Coastal Konkan",
                desc: "Coastal Curries & Mango Pickles",
              },
              {
                id: "Western Maharashtra",
                title: "Kolhapur & Western",
                desc: "Fiery Thecha & Kulith Shengoli",
              },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => onSelectRegion && onSelectRegion(reg.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  selectedRegion === reg.id
                    ? "bg-[#161915] text-white shadow-md"
                    : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                {reg.title}
              </button>
            ))}
          </div>

          {/* Products Grid filtered by Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {featuredProducts
              .filter(
                (p) => selectedRegion === "all" || p.region === selectedRegion,
              )
              .slice(0, 8)
              .map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to={`/store?region=${selectedRegion}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#70BF4F] hover:bg-[#5BA33E] text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>
                Explore All{" "}
                {selectedRegion === "all" ? "Maharashtra" : selectedRegion}{" "}
                Delicacies
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Snippet */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#161915] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#70BF4F]">
              The Naik Foods Legacy
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Preserving Century-Old Maharashtrian Culinary Traditions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
              Born from our flagship store at Seva Mitra Mandal Chowk in
              Shukrawar Peth, Pune, Naik Foods was founded on a singular
              conviction: genuine Maharashtrian cuisine cannot be
              mass-manufactured with shortcut chemicals. We partner with local
              farmers and regional Mahila Bachat Gats to hand-pound whole
              spices, craft authentic khakhras, and nourish modern families with
              clean millet nutrition.
            </p>
            <div className="pt-2">
              <Link
                to="/store"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#70BF4F] text-white text-xs font-bold hover:bg-[#5BA33E] transition-colors"
              >
                <span>Shop Fresh Delicacies</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
