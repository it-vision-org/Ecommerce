import { getTranslations, getLocale } from "next-intl/server";
import { getFeaturedProducts } from "@/actions/productActions";
import { getCategories } from "@/actions/categoriesAction";
import Link from "next/link";
import Image from "next/image";
import {
  Waves,
  ShoppingBag,
  Truck,
  Shield,
  Award,
  ChefHat,
  Building2,
  ArrowRight,
  Star,
  Sparkles,
  Check,
  Users,
  Package,
  Leaf,
  Flame,
} from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  const isRtl = locale === "ar";

  const [productsResult, categoriesResult] = await Promise.all([
    getFeaturedProducts(8),
    getCategories({ isActive: true, limit: 6 }),
  ]);

  const featuredProducts = productsResult.data || [];
  const categories = categoriesResult.data || [];

  return (
    <div className="min-h-screen" dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero Section with Real Product Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--accent-600)] min-h-[95vh] flex items-center">
        {/* Background Image Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/Crevettes royales panées avec sauces.png"
            alt="Premium Breaded Shrimp"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div
            className={`absolute inset-0 ${isRtl
                ? "bg-gradient-to-l from-[var(--primary-900)]/95 via-[var(--primary-800)]/90 to-[var(--primary-700)]/80"
                : "bg-gradient-to-r from-[var(--primary-900)]/95 via-[var(--primary-800)]/90 to-[var(--primary-700)]/80"
              }`}
          />
        </div>

        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-20 w-72 h-72 bg-[var(--accent-400)]/10 rounded-full blur-3xl animate-drift ${isRtl ? "right-10" : "left-10"
              }`}
          />
          <div
            className={`absolute bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-drift-reverse ${isRtl ? "left-10" : "right-10"
              }`}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div
              className={`text-center lg:text-${isRtl ? "right" : "left"
                } animate-card-in`}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 mb-6">
                <Sparkles className="w-4 h-4 text-[var(--accent-300)]" />
                <span className="text-white/95 text-sm font-medium">
                  {t("hero.badge")}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                {t("hero.title")}
                <span className="block text-[var(--accent-300)] mt-2">
                  {t("hero.titleHighlight")}
                </span>
              </h1>

              <p
                className={`text-lg sm:text-xl text-white/90 mb-4 max-w-xl mx-auto lg:mx-0 ${isRtl ? "lg:mr-0" : "lg:ml-0"
                  }`}
              >
                {t("hero.description")}
              </p>

              <p
                className={`text-base text-white/75 mb-8 max-w-xl mx-auto lg:mx-0 ${isRtl ? "lg:mr-0" : "lg:ml-0"
                  }`}
              >
                {t("hero.subDescription")}
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-${isRtl ? "end" : "start"
                  } mb-8`}
              >
                <Link
                  href="/products"
                  className="btn btn-primary bg-white text-[var(--primary-700)] hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {t("hero.shopNow")}
                </Link>
                <Link
                  href="/about"
                  className="btn btn-outline border-2 border-white/40 text-white hover:bg-white/10 hover:border-white px-8 py-4 text-lg font-semibold"
                >
                  {t("hero.learnMore")}
                  <ArrowRight
                    className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                  />
                </Link>
              </div>

              {/* Key Features */}
              <div
                className={`flex flex-wrap gap-6 justify-center lg:justify-${isRtl ? "end" : "start"
                  }`}
              >
                <div className="flex items-center gap-2 text-white/90">
                  <Check className="w-5 h-5 text-[var(--accent-300)]" />
                  <span className="text-sm font-medium">
                    {t("hero.feature1")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Check className="w-5 h-5 text-[var(--accent-300)]" />
                  <span className="text-sm font-medium">
                    {t("hero.feature2")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Check className="w-5 h-5 text-[var(--accent-300)]" />
                  <span className="text-sm font-medium">
                    {t("hero.feature3")}
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block animate-card-in delay-200">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-400)]/20 to-white/10 rounded-3xl blur-2xl animate-glow" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <Image
                    src="/images/Brochettes de crevettes garnies et sauces.png"
                    alt="Luxurious Breaded Shrimp"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {/* Floating Badge */}
                <div
                  className={`absolute -bottom-4 bg-white rounded-2xl shadow-2xl p-4 animate-float ${isRtl ? "-left-4" : "-right-4"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[var(--primary-100)] rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)] font-medium">
                        {t("hero.badgeLabel")}
                      </div>
                      <div className="text-lg font-bold text-[var(--primary)]">
                        {t("hero.badgeValue")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="var(--bg)"
            />
          </svg>
        </div>
      </section>

      {/* Product Varieties Section */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-[var(--primary-light)] text-[var(--primary)] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              {t("varieties.badge")}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              {t("varieties.title")}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
              {t("varieties.description")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pistache */}
            <div className="card p-6 text-center group hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {t("varieties.pistache.name")}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                {t("varieties.pistache.description")}
              </p>
            </div>

            {/* Amande */}
            <div className="card p-6 text-center group hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {t("varieties.amande.name")}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                {t("varieties.amande.description")}
              </p>
            </div>

            {/* Chaplure Maïs */}
            <div className="card p-6 text-center group hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {t("varieties.chaplure.name")}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                {t("varieties.chaplure.description")}
              </p>
            </div>

            {/* Spicy */}
            <div className="card p-6 text-center group hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {t("varieties.spicy.name")}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                {t("varieties.spicy.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Type Selection */}
      <section className="py-20 bg-gradient-to-br from-[var(--primary-50)] to-[var(--accent-50)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-white text-[var(--primary)] text-sm font-semibold px-4 py-2 rounded-full mb-4 shadow-sm">
              {t("customerType.badge")}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
              {t("customerType.title")}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
              {t("customerType.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Individual */}
            <Link
              href="/products?type=individual"
              className="group relative card p-8 text-center hover:border-[var(--primary)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-600)] ${isRtl ? "rounded-t-2xl" : "rounded-t-2xl"
                  } transform scale-x-0 group-hover:scale-x-100 transition-transform ${isRtl ? "origin-right" : "origin-left"
                  }`}
              />

              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-50)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <ShoppingBag className="w-10 h-10 text-[var(--primary)]" />
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                {t("customerType.individual.title")}
              </h3>

              <p className="text-[var(--text-secondary)] mb-6 min-h-[60px]">
                {t("customerType.individual.description")}
              </p>

              <div className="space-y-2 mb-6">
                <div
                  className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRtl ? "flex-row-reverse text-right" : ""
                    }`}
                >
                  <Check className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                  <span>{t("customerType.individual.feature1")}</span>
                </div>
                <div
                  className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRtl ? "flex-row-reverse text-right" : ""
                    }`}
                >
                  <Check className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                  <span>{t("customerType.individual.feature2")}</span>
                </div>
                <div
                  className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRtl ? "flex-row-reverse text-right" : ""
                    }`}
                >
                  <Check className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                  <span>{t("customerType.individual.feature3")}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold group-hover:gap-3 transition-all">
                {t("customerType.shopNow")}
                <ArrowRight
                  className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                />
              </span>
            </Link>

            {/* Restaurant */}
            <Link
              href="/products?type=restaurant"
              className="group relative card p-8 text-center hover:border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-600)] rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform ${isRtl ? "origin-right" : "origin-left"
                  }`}
              />

              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--accent-100)] to-[var(--accent-50)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <ChefHat className="w-10 h-10 text-[var(--accent)]" />
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                {t("customerType.restaurant.title")}
              </h3>

              <p className="text-[var(--text-secondary)] mb-6 min-h-[60px]">
                {t("customerType.restaurant.description")}
              </p>

              <div className="space-y-2 mb-6">
                <div
                  className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRtl ? "flex-row-reverse text-right" : ""
                    }`}
                >
                  <Check className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  <span>{t("customerType.restaurant.feature1")}</span>
                </div>
                <div
                  className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRtl ? "flex-row-reverse text-right" : ""
                    }`}
                >
                  <Check className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  <span>{t("customerType.restaurant.feature2")}</span>
                </div>
                <div
                  className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRtl ? "flex-row-reverse text-right" : ""
                    }`}
                >
                  <Check className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  <span>{t("customerType.restaurant.feature3")}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold group-hover:gap-3 transition-all">
                {t("customerType.viewPricing")}
                <ArrowRight
                  className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                />
              </span>
            </Link>

            {/* Wholesale */}
            <Link
              href="/contact?subject=wholesale"
              className="group relative card p-8 text-center hover:border-[var(--success)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--success)] to-[var(--success-600)] rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform ${isRtl ? "origin-right" : "origin-left"
                  }`}
              />

              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--success-100)] to-[var(--success-50)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Building2 className="w-10 h-10 text-[var(--success)]" />
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                {t("customerType.wholesale.title")}
              </h3>

              <p className="text-[var(--text-secondary)] mb-6 min-h-[60px]">
                {t("customerType.wholesale.description")}
              </p>

              <div className="space-y-2 mb-6">
                <div
                  className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRtl ? "flex-row-reverse text-right" : ""
                    }`}
                >
                  <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                  <span>{t("customerType.wholesale.feature1")}</span>
                </div>
                <div
                  className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRtl ? "flex-row-reverse text-right" : ""
                    }`}
                >
                  <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                  <span>{t("customerType.wholesale.feature2")}</span>
                </div>
                <div
                  className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${isRtl ? "flex-row-reverse text-right" : ""
                    }`}
                >
                  <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                  <span>{t("customerType.wholesale.feature3")}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 text-[var(--success)] font-semibold group-hover:gap-3 transition-all">
                {t("customerType.contactUs")}
                <ArrowRight
                  className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
                {t("featured.title")}
              </h2>
              <p className="text-lg text-[var(--text-secondary)]">
                {t("featured.description")}
              </p>
            </div>
            <Link
              href="/products"
              className="btn btn-outline flex items-center gap-2 hover:gap-3 transition-all"
            >
              {t("featured.viewAll")}
              <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  t={t}
                  isRtl={isRtl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card">
              <Waves className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-secondary)] mb-4">
                {t("featured.noProducts")}
              </p>
              <Link href="/contact" className="btn btn-primary">
                {t("featured.contactUs")}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--bg-muted)] to-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative animate-card-in">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/Préparation de brochettes de crevettes.png"
                  alt="Premium Shrimp Preparation"
                  width={700}
                  height={700}
                  className="w-full h-auto"
                />
              </div>
              <div
                className={`absolute -bottom-6 bg-white rounded-2xl shadow-xl p-6 animate-float ${isRtl ? "-right-6" : "-left-6"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] border-2 border-white flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--primary)]">
                      {t("whyUs.customerCount")}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {t("whyUs.happyCustomers")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="animate-card-in delay-200">
              <div className="inline-block bg-[var(--primary-light)] text-[var(--primary)] text-sm font-semibold px-4 py-2 rounded-full mb-4">
                {t("whyUs.badge")}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6">
                {t("whyUs.title")}
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8">
                {t("whyUs.description")}
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                      {t("whyUs.quality.title")}
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      {t("whyUs.quality.description")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--accent-light)] rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                      {t("whyUs.delivery.title")}
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      {t("whyUs.delivery.description")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[var(--success-light)] rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[var(--success)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                      {t("whyUs.safety.title")}
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      {t("whyUs.safety.description")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/about" className="btn btn-primary px-8 py-3">
                  {t("whyUs.learnMore")}
                  <ArrowRight
                    className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-[var(--bg)]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                {t("categories.title")}
              </h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                {t("categories.description")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] animate-card-in hover:shadow-2xl transition-all"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-500)]">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover opacity-70 group-hover:scale-110 group-hover:opacity-80 transition-all duration-500"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-white/90 text-sm line-clamp-2 mb-4">
                        {category.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                      {t("categories.explore")}
                      <ArrowRight
                        className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`}
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--primary-700)] via-[var(--primary-600)] to-[var(--accent-600)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/Crevettes royales panées avec sauces.png"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-10">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="btn btn-primary bg-white text-[var(--primary-700)] hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-xl hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                {t("cta.browseProducts")}
              </Link>
              <Link
                href="/contact"
                className="btn btn-outline border-2 border-white/40 text-white hover:bg-white/10 hover:border-white px-8 py-4 text-lg font-semibold"
              >
                {t("cta.contactUs")}
                <ArrowRight
                  className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  index,
  t,
  isRtl,
}: {
  product: any;
  index: number;
  t: any;
  isRtl: boolean;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group card overflow-hidden animate-card-in hover:shadow-xl transition-all hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-muted)]">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Waves className="w-16 h-16 text-[var(--text-muted)]" />
          </div>
        )}

        {/* Badges */}
        <div
          className={`absolute top-3 flex flex-col gap-2 ${isRtl ? "right-3" : "left-3"
            }`}
        >
          {product.isFeatured && (
            <span className="badge badge-new bg-[var(--accent)] text-white shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              {t("product.featured")}
            </span>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
          <span className="btn btn-primary shadow-xl">
            {t("product.viewDetails")}
          </span>
        </div>
      </div>

      <div className="p-5">
        {product.category?.name && (
          <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider font-semibold">
            {product.category.name}
          </div>
        )}
        <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-[var(--primary)]">
              {product.priceIndividual.toFixed(2)} TND
            </span>
            <span
              className={`text-xs text-[var(--text-muted)] ${isRtl ? "mr-1" : "ml-1"
                }`}
            >
              /{product.unit}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-[var(--primary-light)] flex items-center justify-center group-hover:bg-[var(--primary)] transition-colors shadow-sm">
            <ShoppingBag className="w-5 h-5 text-[var(--primary)] group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}