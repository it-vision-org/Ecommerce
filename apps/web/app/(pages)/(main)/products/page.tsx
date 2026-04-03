"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ShoppingCart,
  X,
  Building2,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Plus,
  Minus,
  Check,
  Package,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import {
  SerializedProductWithCategory,
  getProducts,
} from "@/actions/productActions";
import { getCurrentUser, AuthUser } from "@/actions/authActions";

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
    return (
      <Image src={images[0]} alt="Product" fill className="object-cover" />
    );
  }
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % images.length);
  };

  const goPrev = (e: React.MouseEvent) => {
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
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
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
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? "bg-white" : "bg-white/50"
            }`}
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Call success handler which will refetch user and refresh
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
          >
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 bg-[var(--primary-light)] rounded-lg mb-6">
          <Building2 className="w-6 h-6 text-[var(--primary)]" />
          <p className="text-sm text-[var(--primary)]">{t("RestaurantNote")}</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t("EmailLabel")}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("EmailPlaceholder")}
                className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t("PasswordLabel")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("PasswordPlaceholder")}
                className="w-full pl-10 pr-12 py-3 border border-[var(--border)] rounded-xl bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
            }}
          >
            {isLoading ? t("SigningIn") : t("SignIn")}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-sm text-[var(--text-muted)]">{t("Or")}</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <div className="text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            {t("NoAccount")}
          </p>
          <Link
            href="/auth/signup?type=restaurant"
            className="text-[var(--primary)] font-medium hover:underline"
          >
            {t("SignUp")}
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Editable Quantity Input ───────────────────────────────────────────────────
function EditableQuantity({
  value,
  onChange,
  max,
  disabled,
}: {
  value: number;
  onChange: (newValue: number) => void;
  max: number;
  disabled?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= max) {
      onChange(parsed);
    } else {
      setInputValue(value.toString());
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setInputValue(value.toString());
    }
  };
  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        min={0}
        max={max}
        disabled={disabled}
        className="w-16 text-center font-semibold text-[var(--text-primary)] bg-[var(--bg)] border border-[var(--primary)] rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      />
    );
  }
  return (
    <button
      onClick={() => !disabled && setIsEditing(true)}
      disabled={disabled}
      className="flex-1 text-center font-semibold text-[var(--text-primary)] py-1 px-2 rounded-lg hover:bg-[var(--bg-muted)] transition-colors cursor-text disabled:cursor-not-allowed"
      title="Click to edit quantity"
    >
      {value}
    </button>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  selectedCount,
  canAdd,
  maxAddable,
  onAdd,
  onRemove,
  onSetCount,
  isBoxSelected,
  customerType,
}: {
  product: SerializedProductWithCategory;
  selectedCount: number;
  canAdd: boolean;
  maxAddable: number;
  onAdd: () => void;
  onRemove: () => void;
  onSetCount: (count: number) => void;
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
      className={`bg-[var(--bg-card)] rounded-xl overflow-hidden border transition-all ${
        selectedCount > 0
          ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
          : "border-[var(--border)]"
      }`}
    >
      {/* Product Image with Carousel */}
      <div className="relative aspect-square bg-[var(--bg-muted)]">
        <ProductImageCarousel images={product.images || []} />
        {selectedCount > 0 && (
          <div className="absolute top-3 right-3 bg-[var(--primary)] text-white min-w-8 h-8 px-2 rounded-full flex items-center justify-center font-bold text-sm z-20">
            {selectedCount}
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
        <div className="text-[var(--primary)] font-bold mb-3">
          {price.toFixed(3)} TND / piece
        </div>

        {/* Quantity Controls */}
        {isBoxSelected && (
          <div className="flex items-center gap-2">
            <button
              onClick={onRemove}
              disabled={selectedCount === 0}
              className="p-2 rounded-lg bg-[var(--bg-muted)] text-[var(--text-primary)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <EditableQuantity
              value={selectedCount}
              onChange={onSetCount}
              max={selectedCount + maxAddable}
              disabled={!canAdd && selectedCount === 0}
            />
            <button
              onClick={onAdd}
              disabled={!canAdd}
              className="p-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
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
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">{t("Empty")}</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
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
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right font-bold text-[var(--primary)]">
                        {item.totalPrice.toFixed(3)} TND
                      </div>
                    </div>
                  ))
                )}
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
  const [boxSelections, setBoxSelections] = useState<Record<string, number>>(
    {},
  );

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Fetch user and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [result, currentUser] = await Promise.all([
          getProducts({ isActive: true }),
          getCurrentUser(),
        ]);
        setProducts(result.data || []);
        setUser(currentUser);

        // Auto-select restaurant mode if user is restaurant
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
  }, []);

  const handleLoginSuccess = async () => {
    // Refetch user after login
    const currentUser = await getCurrentUser();
    setUser(currentUser);

    // Close modal
    setShowLoginModal(false);

    // If user is restaurant, switch to restaurant mode
    if (currentUser?.userType === "RESTAURANT") {
      setCustomerType("restaurant");
      setSelectedBox(null);
      setBoxSelections({});
    }

    // Refresh the page to update the navbar
    router.refresh();
  };

  const isRestaurantUser = user?.userType === "RESTAURANT";

  const boxes =
    customerType === "individual" ? INDIVIDUAL_BOXES : RESTAURANT_BOXES;

  const currentBoxConfig = useMemo(() => {
    if (selectedBox === null) return null;
    return boxes.find((b) => b.pieces === selectedBox);
  }, [selectedBox, boxes]);

  const totalSelectedPieces = useMemo(
    () => Object.values(boxSelections).reduce((sum, count) => sum + count, 0),
    [boxSelections],
  );

  const selectedTypesCount = useMemo(
    () => Object.values(boxSelections).filter((count) => count > 0).length,
    [boxSelections],
  );

  const remainingPieces = currentBoxConfig
    ? currentBoxConfig.pieces - totalSelectedPieces
    : 0;

  const canAddType = (productId: string) => {
    if (!currentBoxConfig) return false;
    if (remainingPieces <= 0) return false;
    const currentCount = boxSelections[productId] || 0;
    if (currentCount > 0) return true;
    return selectedTypesCount < currentBoxConfig.maxTypes;
  };

  const handleCustomerTypeChange = (type: CustomerType) => {
    if (type === "restaurant" && !isRestaurantUser) {
      setShowLoginModal(true);
      return;
    }
    setCustomerType(type);
    setSelectedBox(null);
    setBoxSelections({});
  };

  const handleBoxSelect = (pieces: number) => {
    setSelectedBox(pieces);
    setBoxSelections({});
  };

  const handleAddPieces = (productId: string) => {
    if (!currentBoxConfig || !canAddType(productId)) return;
    setBoxSelections((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleRemovePieces = (productId: string) => {
    setBoxSelections((prev) => {
      const newCount = (prev[productId] || 0) - 1;
      if (newCount <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newCount };
    });
  };

  const handleSetCount = (productId: string, newCount: number) => {
    if (!currentBoxConfig) return;
    const currentCount = boxSelections[productId] || 0;
    const otherPiecesCount = totalSelectedPieces - currentCount;
    const maxForThisProduct = currentBoxConfig.pieces - otherPiecesCount;
    // Clamp the value
    const clampedCount = Math.max(0, Math.min(newCount, maxForThisProduct));
    // Check if we're adding a new type
    if (currentCount === 0 && clampedCount > 0) {
      if (selectedTypesCount >= currentBoxConfig.maxTypes) {
        return; // Can't add new type
      }
    }
    setBoxSelections((prev) => {
      if (clampedCount <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: clampedCount };
    });
  };

  const handleAddToCart = () => {
    if (!currentBoxConfig || totalSelectedPieces !== currentBoxConfig.pieces)
      return;

    const selections = Object.entries(boxSelections)
      .filter(([_, count]) => count > 0)
      .map(([productId, count]) => {
        const product = products.find((p) => p.id === productId);
        return { productId, productName: product?.name || "", count };
      });

    // Get price based on customer type
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
    setSelectedBox(null);
    setBoxSelections({});
  };

  if (isLoading) return <ProductsSkeleton />;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0ea5e9] text-white">
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--primary)]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-4"
          >
            {t("Hero.Badge")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{color: "white"}}
          >
            {t("Hero.Title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            {t("Hero.Subtitle")}
          </motion.p>
        </div>
      </section>

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
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
                customerType === "individual"
                  ? "border-[var(--primary)] bg-[var(--primary-light)]"
                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
              }`}
            >
              <User
                className={`w-5 h-5 ${
                  customerType === "individual"
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-muted)]"
                }`}
              />
              <span
                className={`font-medium ${
                  customerType === "individual"
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
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
                customerType === "restaurant"
                  ? "border-[var(--primary)] bg-[var(--primary-light)]"
                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
              }`}
            >
              <Building2
                className={`w-5 h-5 ${
                  customerType === "restaurant"
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-muted)]"
                }`}
              />
              <span
                className={`font-medium ${
                  customerType === "restaurant"
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
                className={`px-6 py-4 rounded-xl border-2 transition-all ${
                  selectedBox === box.pieces
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50 bg-[var(--bg-card)]"
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    selectedBox === box.pieces
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
            {/* Progress Bar */}
            <div className="bg-[var(--bg-card)] rounded-xl p-4 mb-6 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  {t("Progress.Selected")}: {totalSelectedPieces} /{" "}
                  {selectedBox}
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {t("Progress.Remaining")}: {remainingPieces}
                </span>
              </div>
              <div className="h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(totalSelectedPieces / selectedBox) * 100}%`,
                  }}
                  className="h-full bg-[var(--primary)] rounded-full"
                />
              </div>
            </div>

            {/* Type Limit Warning */}
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

            {/* Tip for direct quantity input */}
            <div className="bg-[var(--bg-muted)] rounded-xl p-3 mb-6 flex items-center gap-3">
              <span className="text-sm text-[var(--text-secondary)]">
                💡 Tip: Click on the quantity number to type directly instead of
                using +/- buttons
              </span>
            </div>

            {/* Flavour Products */}
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              {t("Flavours.Title")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedCount={boxSelections[product.id] || 0}
                  canAdd={canAddType(product.id)}
                  maxAddable={remainingPieces}
                  onAdd={() => handleAddPieces(product.id)}
                  onRemove={() => handleRemovePieces(product.id)}
                  onSetCount={(count) => handleSetCount(product.id, count)}
                  isBoxSelected={selectedBox !== null}
                  customerType={customerType}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">
                  {t("Flavours.NoProducts")}
                </p>
              </div>
            )}

            {/* Add to Cart Button */}
            {totalSelectedPieces === selectedBox && (
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
