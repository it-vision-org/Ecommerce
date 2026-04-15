"use client";

import { useEffect, useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CategorySelector from "@/components/main/CategorySelector";
import PageHero from "@/components/main/PageHero";
import { LoginForm } from "@/components/auth/LoginForm";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import {
  getProducts,
  SerializedProductWithCategory,
} from "@/actions/productActions";
import { AuthUser, getCurrentUser } from "@/actions/authActions";

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

// ── Image Carousel ────────────────────────────────────────────────────────────
function ProductImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Package className="w-16 h-16 text-[var(--text-muted)]" />
      </div>
    );
  }

  if (images.length === 1) {
    return <Image src={images[0]} alt="Product" fill className="object-cover" />;
  }

  const goNext = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % images.length);
  };

  const goPrev = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <>
      <Image
        src={images[currentIndex]}
        alt="Product"
        fill
        className="object-cover"
      />

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
        aria-label="Next image"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ProductsSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="bg-gradient-to-br from-[var(--primary-700)] via-[var(--primary-600)] to-[var(--accent-500)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-white/10 rounded w-96 mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center gap-4 mb-8">
          <div className="h-14 w-48 bg-[var(--bg-muted)] rounded-xl animate-pulse" />
          <div className="h-14 w-48 bg-[var(--bg-muted)] rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] rounded-xl p-4 animate-pulse"
            >
              <div className="aspect-square bg-[var(--bg-muted)] rounded-lg mb-4" />
              <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[var(--bg-muted)] rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Login Modal ───────────────────────────────────────────────────────────────
function LoginModal({
  onClose,
  onLoginSuccess,
}: {
  onClose: () => void;
  onLoginSuccess: () => void;
}) {
  const t = useTranslations("ProductsPage.LoginModal");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--bg-card)] rounded-2xl p-8 max-w-md w-full shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {t("Title")}
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {t("Subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg-muted)] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <LoginForm
          onSuccess={onLoginSuccess}
          showSignupLink={true}
          signupLinkHref="/auth/signup?type=restaurant"
          translationKey="ProductsPage.LoginModal"
          showRestaurantNote={true}
          restaurantNoteText={t("RestaurantNote")}
        />
      </motion.div>
    </motion.div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
  product,
  isSelected,
  assignedCount,
  onToggle,
  selectionDisabled,
  isBoxSelected,
  customerType,
}: {
  product: SerializedProductWithCategory;
  isSelected: boolean;
  assignedCount: number;
  onToggle: () => void;
  selectionDisabled: boolean;
  isBoxSelected: boolean;
  customerType: CustomerType;
}) {
  const price =
    customerType === "restaurant"
      ? product.priceRestaurant
      : product.priceIndividual;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => {
        if (!isBoxSelected) return;
        if (selectionDisabled) return;
        onToggle();
      }}
      title={
        !isBoxSelected
          ? "Select a box size first"
          : selectionDisabled
            ? "You already selected the maximum number of flavours"
            : "Click to select / unselect"
      }
      className={`bg-[var(--bg-card)] rounded-xl overflow-hidden border transition-all ${isSelected
        ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
        : "border-[var(--border)]"
        } ${isBoxSelected ? "cursor-pointer" : "cursor-default"} ${selectionDisabled ? "opacity-60" : ""
        }`}
    >
      {/* Product Image with Carousel */}
      <div className="relative aspect-square bg-[var(--bg-muted)]">
        <ProductImageCarousel images={product.images || []} />

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute top-3 right-3 bg-[var(--primary)] text-white min-w-8 h-8 px-2 rounded-full flex items-center justify-center font-bold text-sm z-20 gap-1">
            <Check className="w-4 h-4" />
            <span>{assignedCount}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="text-[var(--primary)] font-bold">
          {price.toFixed(3)} TND / piece
        </div>

        {isBoxSelected && (
          <div className="mt-3">
            <div
              className={`text-xs font-medium ${isSelected ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
                }`}
            >
              {isSelected
                ? `Selected • ${assignedCount} pieces`
                : selectionDisabled
                  ? "Max flavours selected"
                  : "Click to select"}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Cart Preview ──────────────────────────────────────────────────────────────
function CartPreview({
  cart,
  onRemove,
}: {
  cart: CartItem[];
  onRemove: (index: number) => void;
}) {
  const t = useTranslations("ProductsPage.CartPreview");
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
                  {t("Title")} ({totalItems})
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
                          Box of {item.boxSize} pieces
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
                      {t("Total")}
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
                    {t("Checkout")}
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const t = useTranslations("ProductsPage");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<SerializedProductWithCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [user, setUser] = useState<AuthUser | null>(null);

  const [customerType, setCustomerType] = useState<CustomerType>("individual");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  // New: only store which flavours are selected (max 2)
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Fetch user, products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [result, currentUser] = await Promise.all([
          getProducts({
            isActive: true,
            categoryId: selectedCategoryId || undefined,
          }),
          getCurrentUser(),
        ]);

        setProducts(result.data || []);
        setUser(currentUser);

        if (currentUser?.userType === "RESTAURANT") {
          setCustomerType("restaurant");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategoryId]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  const handleLoginSuccess = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    setShowLoginModal(false);

    if (currentUser?.userType === "RESTAURANT") {
      setCustomerType("restaurant");
      setSelectedBox(null);
      setSelectedFlavours([]);
    }

    router.refresh();
  };

  const isRestaurantUser = user?.userType === "RESTAURANT";

  const boxes =
    customerType === "individual" ? INDIVIDUAL_BOXES : RESTAURANT_BOXES;

  const currentBoxConfig = useMemo(() => {
    if (selectedBox === null) return null;
    return boxes.find((b) => b.pieces === selectedBox) ?? null;
  }, [selectedBox, boxes]);

  const selectedTypesCount = selectedFlavours.length;

  // Auto-assign quantities:
  // - 1 flavour => box size
  // - 2 flavours => half/half
  const autoCounts = useMemo(() => {
    if (selectedBox === null) return {} as Record<string, number>;
    if (selectedFlavours.length === 0) return {} as Record<string, number>;

    if (selectedFlavours.length === 1) {
      return { [selectedFlavours[0]]: selectedBox };
    }

    const [a, b] = selectedFlavours;
    const half = Math.floor(selectedBox / 2);
    const remainder = selectedBox - half * 2; // in case box size ever becomes odd
    return {
      [a]: half + remainder,
      [b]: half,
    };
  }, [selectedBox, selectedFlavours]);

  const toggleFlavour = (productId: string) => {
    if (!currentBoxConfig) return;

    setSelectedFlavours((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= currentBoxConfig.maxTypes) return prev; // max 2
      return [...prev, productId];
    });
  };

  const handleCustomerTypeChange = (type: CustomerType) => {
    if (type === "restaurant" && !isRestaurantUser) {
      setShowLoginModal(true);
      return;
    }
    setCustomerType(type);
    setSelectedBox(null);
    setSelectedFlavours([]);
  };

  const handleBoxSelect = (pieces: number) => {
    setSelectedBox(pieces);
    setSelectedFlavours([]);
  };

  const handleAddToCart = () => {
    if (!currentBoxConfig) return;
    if (selectedFlavours.length === 0) return;

    const selections = selectedFlavours.map((productId) => {
      const product = products.find((p) => p.id === productId);
      return {
        productId,
        productName: product?.name || "",
        count: autoCounts[productId] || 0,
      };
    });

    // Keep existing pricing strategy: price is based on the first selected flavour
    const baseProduct = products.find((p) => p.id === selections[0]?.productId);
    const unitPrice = baseProduct
      ? customerType === "restaurant"
        ? baseProduct.priceRestaurant
        : baseProduct.priceIndividual
      : 0;

    const totalPrice = unitPrice * currentBoxConfig.pieces;

    const newItem: CartItem = {
      productId: selections.map((s) => s.productId).join("-"),
      productName: selections
        .map((s) => `${s.productName} (${s.count})`)
        .join(" + "),
      boxSize: currentBoxConfig.pieces,
      quantity: 1,
      selections,
      unitPrice,
      totalPrice,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedFlavours([]);
  };

  if (isLoading) return <ProductsSkeleton />;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <PageHero
        badge={t("Hero.Badge")}
        title={t("Hero.Title")}
        description={t("Hero.Subtitle")}
      />

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Type Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 mb-8"
        >
          <h2 className="text-lg font-medium text-[var(--text-secondary)]">
            {t("CustomerType.Title")}
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => handleCustomerTypeChange("individual")}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${customerType === "individual"
                ? "border-[var(--primary)] bg-[var(--primary-light)]"
                : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
            >
              <User
                className={`w-5 h-5 ${customerType === "individual"
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)]"
                  }`}
              />
              <span
                className={`font-medium ${customerType === "individual"
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-primary)]"
                  }`}
              >
                {t("CustomerType.Individual")}
              </span>
              {customerType === "individual" && (
                <Check className="w-5 h-5 text-[var(--primary)]" />
              )}
            </button>

            <button
              onClick={() => handleCustomerTypeChange("restaurant")}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${customerType === "restaurant"
                ? "border-[var(--primary)] bg-[var(--primary-light)]"
                : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
            >
              <Building2
                className={`w-5 h-5 ${customerType === "restaurant"
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)]"
                  }`}
              />
              <span
                className={`font-medium ${customerType === "restaurant"
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-primary)]"
                  }`}
              >
                {t("CustomerType.Restaurant")}
              </span>
              {customerType === "restaurant" && (
                <Check className="w-5 h-5 text-[var(--primary)]" />
              )}
            </button>
          </div>

          {customerType === "restaurant" && isRestaurantUser && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[var(--success)] flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {t("CustomerType.LoggedInAs")} {user?.name}
            </motion.p>
          )}
        </motion.div>

        {/* Box Size Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 text-center">
            {t("BoxSelection.Title")}
          </h3>

          <div className="flex flex-wrap justify-center gap-4">
            {boxes.map((box) => (
              <button
                key={box.pieces}
                onClick={() => handleBoxSelect(box.pieces)}
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
                  {t("BoxSelection.Pieces")}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {t("BoxSelection.MaxTypes", { count: box.maxTypes })}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid - Shows when box is selected */}
        {selectedBox !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Type Limit Info */}
            {selectedTypesCount >= (currentBoxConfig?.maxTypes || 2) && (
              <div className="bg-[var(--warning-light)] border border-[var(--warning)] rounded-xl p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--warning)]" />
                <p className="text-sm text-[var(--warning)]">
                  {t("Progress.MaxTypesReached", {
                    count: currentBoxConfig?.maxTypes || 2,
                  })}
                </p>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Category Selector - Left Side */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="sticky top-4">
                  <CategorySelector
                    selectedCategoryId={selectedCategoryId}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>
              </div>

              {/* Products Grid - Right Side */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  {t("Flavours.Title")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const isSelected = selectedFlavours.includes(product.id);
                    const assignedCount = autoCounts[product.id] || 0;
                    const maxTypes = currentBoxConfig?.maxTypes ?? 2;

                    const selectionDisabled =
                      selectedBox !== null &&
                      !isSelected &&
                      selectedFlavours.length >= maxTypes;

                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isSelected={isSelected}
                        assignedCount={assignedCount}
                        onToggle={() => toggleFlavour(product.id)}
                        selectionDisabled={selectionDisabled}
                        isBoxSelected={selectedBox !== null}
                        customerType={customerType}
                      />
                    );
                  })}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">
                      {t("Flavours.NoProducts")}
                    </p>
                  </div>
                )}

                {/* Add to Cart Button (available as soon as at least 1 flavour is selected) */}
                {currentBoxConfig && selectedFlavours.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                  >
                    <button
                      onClick={handleAddToCart}
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all hover:scale-105"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                      }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {t("AddToCart")}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Wholesale CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-hover)] rounded-2xl p-8 text-center text-white mt-12"
        >
          <h3 className="text-2xl font-bold mb-3" style={{ color: "white" }}>
            {t("Wholesale.Title")}
          </h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            {t("Wholesale.Description")}
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-white text-[var(--secondary)] font-semibold rounded-xl hover:bg-[var(--bg-muted)] transition-colors"
          >
            {t("Wholesale.ContactUs")}
          </Link>
        </motion.div>
      </section>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>

      {/* Cart Preview */}
      {cart.length > 0 && (
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