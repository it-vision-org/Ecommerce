import { getTranslations } from "next-intl/server";
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
} from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const [productsResult, categoriesResult] = await Promise.all([
    getFeaturedProducts(8),
    getCategories({ isActive: true, limit: 6 }),
  ]);

  const featuredProducts = productsResult.data || [];
  const categories = categoriesResult.data || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary-700)] via-[var(--primary-600)] to-[var(--accent-500)] min-h-[90vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-drift" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--accent-400)]/10 rounded-full blur-3xl animate-drift-reverse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />

          {/* Floating bubbles */}
          <div className="absolute top-[20%] left-[15%] w-4 h-4 bg-white/20 rounded-full animate-float" />
          <div className="absolute top-[40%] right-[20%] w-6 h-6 bg-white/15 rounded-full animate-float delay-200" />
          <div className="absolute bottom-[30%] left-[25%] w-3 h-3 bg-white/25 rounded-full animate-float delay-300" />
          <div className="absolute top-[60%] right-[30%] w-5 h-5 bg-white/10 rounded-full animate-float delay-100" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-card-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-[var(--accent-300)]" />
                <span className="text-white/90 text-sm font-medium">
                  {t("hero.badge")}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                {t("hero.title")}
                <span className="block text-[var(--accent-300)]">
                  {t("hero.titleHighlight")}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="btn btn-primary bg-white text-[var(--primary-700)] hover:bg-white/90 px-8 py-4 text-lg shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {t("hero.shopNow")}
                </Link>
                <Link
                  href="/about"
                  className="btn btn-outline border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
                >
                  {t("hero.learnMore")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block animate-card-in delay-200">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-glow" />
                <div className="absolute inset-8 bg-gradient-to-br from-[var(--accent-400)]/30 to-transparent rounded-full backdrop-blur-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Waves className="w-48 h-48 text-white/80" />
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

      {/* Customer Type Selection */}
      <section className="py-16 sm:py-20 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              {t("customerType.title")}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t("customerType.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Individual */}
            <Link
              href="/products?type=individual"
              className="group card p-8 text-center hover:border-[var(--primary)] transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                {t("customerType.individual.title")}
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                {t("customerType.individual.description")}
              </p>
              <span className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold group-hover:gap-3 transition-all">
                {t("customerType.shopNow")}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Restaurant */}
            <Link
              href="/products?type=restaurant"
              className="group card p-8 text-center hover:border-[var(--primary)] transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-[var(--accent-light)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChefHat className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                {t("customerType.restaurant.title")}
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                {t("customerType.restaurant.description")}
              </p>
              <span className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold group-hover:gap-3 transition-all">
                {t("customerType.viewPricing")}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Wholesale */}
            <Link
              href="/contact?subject=wholesale"
              className="group card p-8 text-center hover:border-[var(--primary)] transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-[var(--success-light)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-[var(--success)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                {t("customerType.wholesale.title")}
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                {t("customerType.wholesale.description")}
              </p>
              <span className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold group-hover:gap-3 transition-all">
                {t("customerType.contactUs")}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-[var(--bg-muted)]">
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
              className="btn btn-outline flex items-center gap-2"
            >
              {t("featured.viewAll")}
              <ArrowRight className="w-4 h-4" />
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
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Waves className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-secondary)]">
                {t("featured.noProducts")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 sm:py-20 bg-[var(--bg)]">
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
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] animate-card-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-600)] to-[var(--accent-500)]">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-white/80 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-white font-medium mt-4 group-hover:gap-3 transition-all">
                      {t("categories.explore")}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features/Benefits */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[var(--primary-50)] to-[var(--accent-50)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              {t("benefits.title")}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t("benefits.description")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-md flex items-center justify-center">
                <Award className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                {t("benefits.quality.title")}
              </h3>
              <p className="text-[var(--text-secondary)]">
                {t("benefits.quality.description")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-md flex items-center justify-center">
                <Truck className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                {t("benefits.delivery.title")}
              </h3>
              <p className="text-[var(--text-secondary)]">
                {t("benefits.delivery.description")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-md flex items-center justify-center">
                <Shield className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                {t("benefits.safe.title")}
              </h3>
              <p className="text-[var(--text-secondary)]">
                {t("benefits.safe.description")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-md flex items-center justify-center">
                <Star className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                {t("benefits.service.title")}
              </h3>
              <p className="text-[var(--text-secondary)]">
                {t("benefits.service.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-[var(--secondary)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-white/80 mb-8">{t("cta.description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="btn btn-primary px-8 py-4 text-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                {t("cta.browseProducts")}
              </Link>
              <Link
                href="/contact"
                className="btn btn-outline border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                {t("cta.contactUs")}
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
}: {
  product: any;
  index: number;
  t: any;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group card overflow-hidden animate-card-in"
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
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="badge badge-new">
              <Sparkles className="w-3 h-3 mr-1" />
              {t("product.featured")}
            </span>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="btn btn-primary">{t("product.viewDetails")}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wide">
          {product.category?.name}
        </div>
        <h3 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-[var(--primary)]">
              {product.priceIndividual.toFixed(2)} TND
            </span>
            <span className="text-xs text-[var(--text-muted)] ml-1">
              /{product.unit}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center group-hover:bg-[var(--primary)] transition-colors">
            <ShoppingBag className="w-5 h-5 text-[var(--primary)] group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
