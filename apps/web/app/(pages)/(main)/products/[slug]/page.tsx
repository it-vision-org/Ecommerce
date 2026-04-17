"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronLeft,
    Package,
    Tag,
    ShoppingCart,
    Trash2,
    X,
} from "lucide-react";

import PageHero from "@/components/main/PageHero";
import ImageGallery from "@/components/main/ImageGallery";
import ImageCarousel from "@/components/main/ImageCarousel";

import {
    getProductBySlug,
    getProducts,
    type SerializedProductWithCategory,
} from "@/actions/productActions";
import { getCurrentUser, type AuthUser } from "@/actions/authActions";

type CustomerType = "individual" | "restaurant";
const CART_STORAGE_KEY = "seefood_cart";

type BoxConfig = {
    pieces: number;
    maxTypes: number;
};

const INDIVIDUAL_BOXES: BoxConfig[] = [
    { pieces: 6, maxTypes: 2 },
    { pieces: 8, maxTypes: 2 },
    { pieces: 12, maxTypes: 2 },
];

const RESTAURANT_BOXES: BoxConfig[] = [
    { pieces: 300, maxTypes: 2 },
    { pieces: 600, maxTypes: 2 },
    { pieces: 900, maxTypes: 2 },
];

type CartItem = {
    productId: string;
    productName: string;
    boxSize: number;
    quantity: number;
    selections: { productId: string; productName: string; count: number }[];
    unitPrice: number;
    totalPrice: number;
};

// ── Cart Preview (same pattern as products page) ───────────────────────────────
function CartPreview({
    cart,
    onRemove,
}: {
    cart: CartItem[];
    onRemove: (index: number) => void;
}) {
    const tCart = useTranslations("ProductsPage.CartPreview");
    const tOrderReview = useTranslations("CheckoutPage.OrderReview");
    const [isOpen, setIsOpen] = useState(false);

    const totalItems = cart.length;
    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-[var(--primary)] text-white p-4 rounded-full shadow-lg hover:bg-[var(--primary-hover)] transition-all"
                aria-label="Open cart"
            >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[var(--danger)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/30"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--bg-card)] z-50 shadow-xl flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                    {tCart("Title")} ({totalItems})
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full hover:bg-[var(--bg-muted)]"
                                    aria-label="Close cart"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-[var(--bg-muted)] rounded-xl p-4"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="font-medium text-[var(--text-primary)]">
                                                    {tOrderReview("BoxOf", { count: item.boxSize })}
                                                </div>
                                                <div className="text-sm text-[var(--text-secondary)]">
                                                    {item.selections
                                                        .map((s) => `${s.productName} (${s.count})`)
                                                        .join(" + ")}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onRemove(index)}
                                                className="p-1 text-[var(--text-muted)] hover:text-[var(--danger)]"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right font-bold text-[var(--primary)]">
                                            {item.totalPrice.toFixed(3)} TND
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 border-t border-[var(--border)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[var(--text-secondary)]">
                                            {tCart("Total")}
                                        </span>
                                        <span className="text-xl font-bold text-[var(--text-primary)]">
                                            {totalPrice.toFixed(3)} TND
                                        </span>
                                    </div>
                                    <Link
                                        href="/checkout"
                                        className="w-full py-3 rounded-xl font-semibold text-white text-center block transition-all"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                                        }}
                                    >
                                        {tCart("Checkout")}
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default function ProductDetailsPage() {
    const locale = useLocale();
    const isRtl = locale === "ar";
    const routeParams = useParams<{ slug?: string | string[] }>();
    const slug =
        typeof routeParams?.slug === "string"
            ? routeParams.slug
            : Array.isArray(routeParams?.slug)
                ? routeParams.slug[0]
                : undefined;

    const t = useTranslations("ProductDetailPage");
    const tProducts = useTranslations("ProductsPage");

    const [productLoading, setProductLoading] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);
    const [product, setProduct] = useState<SerializedProductWithCategory | null>(
        null,
    );

    const [userLoading, setUserLoading] = useState(true);
    const [user, setUser] = useState<AuthUser | null>(null);

    const isRestaurantUser = user?.userType === "RESTAURANT";

    const [similarLoading, setSimilarLoading] = useState(false);
    const [similar, setSimilar] = useState<SerializedProductWithCategory[]>([]);

    // Images modal
    const [carouselOpen, setCarouselOpen] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Cart (hydration-safe)
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartLoaded, setCartLoaded] = useState(false);

    // Add-to-cart bar state
    const [customerType, setCustomerType] = useState<CustomerType>("individual");
    const [selectedBox, setSelectedBox] = useState<number | null>(null);

    // Load product + current user
    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setProductLoading(true);
            setProductError(null);

            try {
                if (!slug) return;
                const [productRes, currentUser] = await Promise.all([
                    getProductBySlug(slug),
                    getCurrentUser(),
                ]);

                if (cancelled) return;

                setUser(currentUser);
                setUserLoading(false);

                if (!productRes.success || !productRes.data) {
                    setProduct(null);
                    setProductError("NOT_FOUND");
                    setProductLoading(false);
                    return;
                }

                setProduct(productRes.data);
                setProductLoading(false);

                // Default customerType: restaurant users start in restaurant mode
                if (currentUser?.userType === "RESTAURANT") {
                    setCustomerType("restaurant");
                } else {
                    setCustomerType("individual");
                }
            } catch (e) {
                if (cancelled) return;
                setProduct(null);
                setProductError("FAILED");
                setProductLoading(false);
                setUserLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [slug]);

    // Load cart from localStorage after mount (avoid hydration mismatch)
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            const parsed = savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
            setCart(Array.isArray(parsed) ? parsed : []);
        } catch {
            setCart([]);
        } finally {
            setCartLoaded(true);
        }
    }, []);

    // Persist cart after it's been loaded
    useEffect(() => {
        if (!cartLoaded) return;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart, cartLoaded]);

    // Load similar products (same category, excluding current)
    useEffect(() => {
        let cancelled = false;

        const loadSimilar = async () => {
            if (!product?.category?.id) {
                setSimilar([]);
                return;
            }

            setSimilarLoading(true);
            try {
                const res = await getProducts({
                    categoryId: product.category.id,
                    isActive: true,
                    limit: 12,
                    sortBy: "order",
                    sortOrder: "asc",
                });

                if (cancelled) return;

                if (!res.success || !res.data) {
                    setSimilar([]);
                    setSimilarLoading(false);
                    return;
                }

                const next = res.data
                    .filter((p) => p.id !== product.id)
                    .slice(0, 4);

                setSimilar(next);
                setSimilarLoading(false);
            } catch {
                if (cancelled) return;
                setSimilar([]);
                setSimilarLoading(false);
            }
        };

        loadSimilar();
        return () => {
            cancelled = true;
        };
    }, [product?.id, product?.category?.id]);

    const boxes = useMemo(() => {
        if (isRestaurantUser && customerType === "restaurant") return RESTAURANT_BOXES;
        return INDIVIDUAL_BOXES;
    }, [customerType, isRestaurantUser]);

    const canAddToCart = !!product && selectedBox !== null;

    const unitPrice = useMemo(() => {
        if (!product) return 0;
        if (isRestaurantUser && customerType === "restaurant")
            return Number(product.priceRestaurant);
        return Number(product.priceIndividual);
    }, [product, isRestaurantUser, customerType]);

    const handleAddToCart = () => {
        if (!product || selectedBox === null) return;

        const newItem: CartItem = {
            productId: product.id,
            productName: product.name,
            boxSize: selectedBox,
            quantity: 1,
            selections: [
                { productId: product.id, productName: product.name, count: selectedBox },
            ],
            unitPrice,
            totalPrice: unitPrice * selectedBox,
        };

        setCart((prev) => [...prev, newItem]);
    };

    // Basic loading / error UI (no server notFound in client page)
    if (productLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg)]" dir={isRtl ? "rtl" : "ltr"}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 w-64 bg-[var(--bg-muted)] rounded-xl" />
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="aspect-video bg-[var(--bg-muted)] rounded-2xl" />
                            <div className="space-y-4">
                                <div className="h-28 bg-[var(--bg-muted)] rounded-2xl" />
                                <div className="h-28 bg-[var(--bg-muted)] rounded-2xl" />
                                <div className="h-14 bg-[var(--bg-muted)] rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product || productError) {
        return (
            <div className="min-h-screen bg-[var(--bg)]" dir={isRtl ? "rtl" : "ltr"}>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 text-center">
                        <Package className="w-10 h-10 mx-auto text-[var(--text-muted)]" />
                        <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
                            {t("CategoryFallback")}
                        </h1>
                        <p className="mt-2 text-[var(--text-secondary)]">
                            {t("NoDescription")}
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] transition-colors text-[var(--text-primary)] font-semibold"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {t("BackToProducts")}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const images = product.images || [];

    return (
        <div className="min-h-screen bg-[var(--bg)]" dir={isRtl ? "rtl" : "ltr"}>
            <PageHero
                badge={product.category?.name ?? t("CategoryFallback")}
                title={product.name}
                description={product.description ?? t("NoDescription")}
            />

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-6">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] transition-colors text-[var(--text-primary)] font-semibold"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        {t("BackToProducts")}
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Images (clickable) */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm p-4">
                        <ImageGallery
                            images={images}
                            title={product.name}
                            onImageClick={(idx) => {
                                setCarouselIndex(idx);
                                setCarouselOpen(true);
                            }}
                        />
                    </div>

                    {/* Info + Prices + Add-to-cart bar */}
                    <div className="space-y-6">
                        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                                    <Tag className="w-4 h-4" />
                                    {product.category?.name ?? t("CategoryFallback")}
                                </span>

                                {product.category?.slug && (
                                    <Link
                                        href={`/products?category=${encodeURIComponent(
                                            product.category.slug,
                                        )}`}
                                        className="text-xs font-semibold px-3 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] transition-colors text-[var(--text-primary)]"
                                    >
                                        {t("ExploreCategory")}
                                    </Link>
                                )}
                            </div>

                            {product.description ? (
                                <p className="text-[var(--text-secondary)] leading-relaxed">
                                    {product.description}
                                </p>
                            ) : (
                                <p className="text-[var(--text-muted)]">{t("NoDescription")}</p>
                            )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                                <div className="text-sm text-[var(--text-muted)] mb-2">
                                    {t("IndividualPrice")}
                                </div>
                                <div className="text-2xl font-bold text-[var(--primary)]">
                                    {Number(product.priceIndividual).toFixed(3)} TND
                                </div>
                                <div className="text-sm text-[var(--text-secondary)] mt-1">
                                    {t("PerUnit", { unit: product.unit ?? t("UnitFallback") })}
                                </div>
                            </div>

                            {isRestaurantUser && (
                                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                                    <div className="text-sm text-[var(--text-muted)] mb-2">
                                        {t("RestaurantPrice")}
                                    </div>
                                    <div className="text-2xl font-bold text-[var(--primary)]">
                                        {Number(product.priceRestaurant).toFixed(3)} TND
                                    </div>
                                    <div className="text-sm text-[var(--text-secondary)] mt-1">
                                        {t("PerUnit", { unit: product.unit ?? t("UnitFallback") })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isRestaurantUser && (
                            <div className="bg-[var(--warning-light)] border border-[var(--warning)] rounded-2xl p-5">
                                <p className="text-sm text-[var(--text-primary)]">
                                    {t("RestaurantNote")}
                                </p>
                            </div>
                        )}

                        {/* Add-to-cart bar (same logic as products page: box -> add) */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                            {isRestaurantUser && (
                                <div className="flex items-center justify-center gap-2 mb-5">
                                    <button
                                        onClick={() => setCustomerType("individual")}
                                        className={`px-4 py-2 rounded-xl border transition-all font-semibold ${customerType === "individual"
                                            ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                                            : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
                                            }`}
                                    >
                                        Individual
                                    </button>
                                    <button
                                        onClick={() => setCustomerType("restaurant")}
                                        className={`px-4 py-2 rounded-xl border transition-all font-semibold ${customerType === "restaurant"
                                            ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                                            : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
                                            }`}
                                    >
                                        Restaurant
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-wrap justify-center gap-4">
                                {boxes.map((box) => (
                                    <button
                                        key={box.pieces}
                                        onClick={() => setSelectedBox(box.pieces)}
                                        className={`px-6 py-4 rounded-xl border-2 transition-all ${selectedBox === box.pieces
                                            ? "border-[var(--primary)] bg-[var(--primary-light)]"
                                            : "border-[var(--border)] hover:border-[var(--primary)]/50 bg-[var(--bg-card)]"
                                            }`}
                                    >
                                        <div
                                            className={`text-2xl font-bold ${selectedBox === box.pieces
                                                ? "text-[var(--primary)]"
                                                : "text-[var(--text-primary)]"
                                                }`}
                                        >
                                            {box.pieces}
                                        </div>
                                        <div className="text-sm text-[var(--text-secondary)]">
                                            {tProducts("BoxSelection.Pieces")}
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)] mt-1">
                                            {tProducts("BoxSelection.MaxTypes", {
                                                count: box.maxTypes,
                                            })}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={canAddToCart ? handleAddToCart : undefined}
                                    disabled={!canAddToCart}
                                    className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all
                    ${canAddToCart
                                            ? "hover:scale-105 cursor-pointer opacity-100"
                                            : "opacity-60 cursor-not-allowed hover:scale-100 pointer-events-none"
                                        }
                  `}
                                    style={{
                                        background:
                                            "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                                    }}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {tProducts("AddToCart")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar products (same category) */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                        {t("SimilarProducts")}
                    </h2>

                    {similarLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden"
                                >
                                    <div className="aspect-square bg-[var(--bg-muted)]" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-[var(--bg-muted)] rounded" />
                                        <div className="h-4 w-24 bg-[var(--bg-muted)] rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : similar.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {similar.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/products/${p.slug}`}
                                    className="block bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
                                >
                                    <div className="relative aspect-square bg-[var(--bg-muted)]">
                                        {p.images?.[0] ? (
                                            <Image
                                                src={p.images[0]}
                                                alt={p.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Package className="w-10 h-10 text-[var(--text-muted)]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="font-semibold text-lg text-[var(--text-primary)]">
                                            {p.name}
                                        </div>
                                        <div className="text-[var(--text-secondary)] text-sm">
                                            {Number(p.priceIndividual).toFixed(3)} TND
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-[var(--text-muted)] text-sm">
                            {tProducts("Flavours.NoProducts")}
                        </div>
                    )}
                </div>
            </section>

            {/* Image carousel modal */}
            <AnimatePresence>
                {carouselOpen && images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <ImageCarousel
                            images={images}
                            initialIndex={carouselIndex}
                            alt={product.name}
                            onClose={() => setCarouselOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cart preview FAB */}
            {cartLoaded && cart.length > 0 && (
                <CartPreview
                    cart={cart}
                    onRemove={(index) =>
                        setCart((prev) => prev.filter((_, i) => i !== index))
                    }
                />
            )}
        </div>
    );
}