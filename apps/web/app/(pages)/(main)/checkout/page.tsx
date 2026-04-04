"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Truck,
  ChevronLeft,
  Check,
  AlertCircle,
  Loader2,
  Package,
  Trash2,
  FileText,
  Building2,
  Banknote,
} from "lucide-react";
import { getCurrentUser, AuthUser } from "@/actions/authActions";
import { createOrder, CreateOrderInput } from "@/actions/ordersActions";
import toast from "react-hot-toast";

const CART_STORAGE_KEY = "seefood_cart";

type CartItem = {
  productId: string;
  productName: string;
  boxSize: number;
  quantity: number;
  selections: { productId: string; productName: string; count: number }[];
  unitPrice: number;
  totalPrice: number;
};

type PaymentMethod = "CASH_ON_DELIVERY" | "BANK_TRANSFER";

type FormData = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod;
};

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg)] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[var(--bg-muted)] rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-[var(--bg-muted)] rounded-xl" />
              <div className="h-48 bg-[var(--bg-muted)] rounded-xl" />
            </div>
            <div className="h-96 bg-[var(--bg-muted)] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const t = useTranslations("CheckoutPage");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    notes: "",
    paymentMethod: "CASH_ON_DELIVERY",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  // Load cart and user data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load cart from localStorage
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        const cartData = savedCart ? JSON.parse(savedCart) : [];
        setCart(cartData);

        // Load user
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Pre-fill form with user data including phone and address
        if (currentUser) {
          setFormData((prev) => ({
            ...prev,
            customerName: currentUser.name || "",
            customerEmail: currentUser.email || "",
            customerPhone: currentUser.phoneNumber || "",
            address: currentUser.address || "",
          }));
        }
      } catch (error) {
        console.error("Error loading checkout data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.totalPrice, 0),
    [cart],
  );

  const shippingCost = useMemo(() => {
    // Free shipping over 100 TND, otherwise 7 TND
    return subtotal >= 100 ? 0 : 7;
  }, [subtotal]);

  const total = subtotal + shippingCost;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = t("Errors.NameRequired");
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = t("Errors.PhoneRequired");
    } else if (!/^[\d\s+()-]{8,}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = t("Errors.PhoneInvalid");
    }

    if (
      formData.customerEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)
    ) {
      newErrors.customerEmail = t("Errors.EmailInvalid");
    }

    if (!formData.address.trim()) {
      newErrors.address = t("Errors.AddressRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("Errors.FixErrors"));
      return;
    }

    if (cart.length === 0) {
      toast.error(t("Errors.EmptyCart"));
      return;
    }

    setIsSubmitting(true);

    try {
      const orderInput: CreateOrderInput = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        address: formData.address,
        notes: formData.notes || undefined,
        paymentMethod: formData.paymentMethod,
        items: cart.map((item) => ({
          productId: item.selections[0]?.productId || item.productId,
          productName: item.productName,
          quantity: item.boxSize,
          unitPrice: item.unitPrice,
        })),
        userId: user?.id,
      };

      const result = await createOrder(orderInput);

      if (result.success && result.data) {
        setIsRedirecting(true);

        // Clear cart
        localStorage.removeItem(CART_STORAGE_KEY);
        setCart([]);

        toast.success(t("Success.OrderPlaced"));

        // Redirect to order confirmation
        router.push(`/orders/${result.data.id}?success=true`);
      } else {
        toast.error(result.error || t("Errors.OrderFailed"));
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(t("Errors.OrderFailed"));
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));

    if (newCart.length === 0) {
      router.push("/products");
    }
  };

  if (isLoading) return <CheckoutSkeleton />;

  if (cart.length === 0 && !isRedirecting) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-[var(--bg-muted)] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-[var(--text-muted)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            {t("EmptyCart.Title")}
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            {t("EmptyCart.Description")}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
            }}
          >
            <Package className="w-5 h-5" />
            {t("EmptyCart.BrowseProducts")}
          </Link>
        </motion.div>
      </div>
    );
  }
  if (isRedirecting) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Header - Updated to match contact page style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0ea5e9] text-white">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a853]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0ea5e9]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/products"
              className={`inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <ChevronLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
              {t("BackToProducts")}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">{t("Title")}</h1>
            <p className="text-white/80 mt-2">{t("Subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: t("Steps.Review") },
              { num: 2, label: t("Steps.Shipping") },
              { num: 3, label: t("Steps.Payment") },
            ].map((step, index) => (
              <div
                key={step.num}
                className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <button
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    currentStep === step.num
                      ? "bg-[var(--primary)] text-white"
                      : currentStep > step.num
                        ? "bg-[var(--success-light)] text-[var(--success)]"
                        : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                  }`}
                >
                  {currentStep > step.num ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="w-5 h-5 flex items-center justify-center text-sm font-semibold">
                      {step.num}
                    </span>
                  )}
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.label}
                  </span>
                </button>
                {index < 2 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.num
                        ? "bg-[var(--success)]"
                        : "bg-[var(--border)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Order Review */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden"
                  >
                    <div className="p-6 border-b border-[var(--border)]">
                      <h2
                        className={`text-xl font-bold text-[var(--text-primary)] flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <ShoppingBag className="w-6 h-6 text-[var(--primary)]" />
                        {t("OrderReview.Title")}
                      </h2>
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                      {cart.map((item, index) => (
                        <div
                          key={index}
                          className={`p-4 flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <div className="w-16 h-16 bg-[var(--bg-muted)] rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package className="w-8 h-8 text-[var(--text-muted)]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-[var(--text-primary)]">
                                  {t("OrderReview.BoxOf", {
                                    count: item.boxSize,
                                  })}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">
                                  {item.selections
                                    .map((s) => `${s.productName} (${s.count})`)
                                    .join(" + ")}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-sm text-[var(--text-muted)]">
                                {item.unitPrice.toFixed(3)} TND × {item.boxSize}
                              </span>
                              <span className="font-bold text-[var(--primary)]">
                                {item.totalPrice.toFixed(3)} TND
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 bg-[var(--bg-muted)]">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                        }}
                      >
                        {t("OrderReview.Continue")}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Shipping Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden"
                  >
                    <div className="p-6 border-b border-[var(--border)]">
                      <h2
                        className={`text-xl font-bold text-[var(--text-primary)] flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Truck className="w-6 h-6 text-[var(--primary)]" />
                        {t("Shipping.Title")}
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      {/* Name */}
                      <div>
                        <label
                          className={`block text-sm font-medium text-[var(--text-primary)] mb-1.5 ${isRTL ? "text-right" : ""}`}
                        >
                          {t("Shipping.Name")} *
                        </label>
                        <div className="relative">
                          <User
                            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] ${isRTL ? "right-3" : "left-3"}`}
                          />
                          <input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customerName: e.target.value,
                              })
                            }
                            className={`w-full py-3 border rounded-xl bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"} ${errors.customerName ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
                            placeholder={t("Shipping.NamePlaceholder")}
                          />
                        </div>
                        {errors.customerName && (
                          <p className="mt-1 text-sm text-[var(--danger)]">
                            {errors.customerName}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          className={`block text-sm font-medium text-[var(--text-primary)] mb-1.5 ${isRTL ? "text-right" : ""}`}
                        >
                          {t("Shipping.Phone")} *
                        </label>
                        <div className="relative">
                          <Phone
                            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] ${isRTL ? "right-3" : "left-3"}`}
                          />
                          <input
                            type="tel"
                            value={formData.customerPhone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customerPhone: e.target.value,
                              })
                            }
                            className={`w-full py-3 border rounded-xl bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"} ${errors.customerPhone ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
                            placeholder={t("Shipping.PhonePlaceholder")}
                          />
                        </div>
                        {errors.customerPhone && (
                          <p className="mt-1 text-sm text-[var(--danger)]">
                            {errors.customerPhone}
                          </p>
                        )}
                      </div>

                      {/* Email (Optional) */}
                      <div>
                        <label
                          className={`block text-sm font-medium text-[var(--text-primary)] mb-1.5 ${isRTL ? "text-right" : ""}`}
                        >
                          {t("Shipping.Email")}{" "}
                          <span className="text-[var(--text-muted)]">
                            ({t("Shipping.Optional")})
                          </span>
                        </label>
                        <div className="relative">
                          <Mail
                            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] ${isRTL ? "right-3" : "left-3"}`}
                          />
                          <input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customerEmail: e.target.value,
                              })
                            }
                            className={`w-full py-3 border rounded-xl bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"} ${errors.customerEmail ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
                            placeholder={t("Shipping.EmailPlaceholder")}
                          />
                        </div>
                        {errors.customerEmail && (
                          <p className="mt-1 text-sm text-[var(--danger)]">
                            {errors.customerEmail}
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div>
                        <label
                          className={`block text-sm font-medium text-[var(--text-primary)] mb-1.5 ${isRTL ? "text-right" : ""}`}
                        >
                          {t("Shipping.Address")} *
                        </label>
                        <div className="relative">
                          <MapPin
                            className={`absolute top-3 w-5 h-5 text-[var(--text-muted)] ${isRTL ? "right-3" : "left-3"}`}
                          />
                          <textarea
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: e.target.value,
                              })
                            }
                            rows={3}
                            className={`w-full py-3 border rounded-xl bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"} ${errors.address ? "border-[var(--danger)]" : "border-[var(--border)]"}`}
                            placeholder={t("Shipping.AddressPlaceholder")}
                          />
                        </div>
                        {errors.address && (
                          <p className="mt-1 text-sm text-[var(--danger)]">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Notes */}
                      <div>
                        <label
                          className={`block text-sm font-medium text-[var(--text-primary)] mb-1.5 ${isRTL ? "text-right" : ""}`}
                        >
                          {t("Shipping.Notes")}{" "}
                          <span className="text-[var(--text-muted)]">
                            ({t("Shipping.Optional")})
                          </span>
                        </label>
                        <div className="relative">
                          <FileText
                            className={`absolute top-3 w-5 h-5 text-[var(--text-muted)] ${isRTL ? "right-3" : "left-3"}`}
                          />
                          <textarea
                            value={formData.notes}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                notes: e.target.value,
                              })
                            }
                            rows={2}
                            className={`w-full py-3 border border-[var(--border)] rounded-xl bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"}`}
                            placeholder={t("Shipping.NotesPlaceholder")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-[var(--bg-muted)] flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 py-3 rounded-xl font-semibold border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg)] transition-colors"
                      >
                        {t("Back")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (validateForm()) {
                            setCurrentStep(3);
                          }
                        }}
                        className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                        }}
                      >
                        {t("Continue")}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden"
                  >
                    <div className="p-6 border-b border-[var(--border)]">
                      <h2
                        className={`text-xl font-bold text-[var(--text-primary)] flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <CreditCard className="w-6 h-6 text-[var(--primary)]" />
                        {t("Payment.Title")}
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      {/* Payment Methods */}
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              paymentMethod: "CASH_ON_DELIVERY",
                            })
                          }
                          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${isRTL ? "flex-row-reverse text-right" : ""} ${
                            formData.paymentMethod === "CASH_ON_DELIVERY"
                              ? "border-[var(--primary)] bg-[var(--primary-light)]"
                              : "border-[var(--border)] hover:border-[var(--primary)]/50"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              formData.paymentMethod === "CASH_ON_DELIVERY"
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                            }`}
                          >
                            <Banknote className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-[var(--text-primary)]">
                              {t("Payment.CashOnDelivery")}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {t("Payment.CashOnDeliveryDesc")}
                            </p>
                          </div>
                          {formData.paymentMethod === "CASH_ON_DELIVERY" && (
                            <Check className="w-5 h-5 text-[var(--primary)]" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              paymentMethod: "BANK_TRANSFER",
                            })
                          }
                          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${isRTL ? "flex-row-reverse text-right" : ""} ${
                            formData.paymentMethod === "BANK_TRANSFER"
                              ? "border-[var(--primary)] bg-[var(--primary-light)]"
                              : "border-[var(--border)] hover:border-[var(--primary)]/50"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              formData.paymentMethod === "BANK_TRANSFER"
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                            }`}
                          >
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-[var(--text-primary)]">
                              {t("Payment.BankTransfer")}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {t("Payment.BankTransferDesc")}
                            </p>
                          </div>
                          {formData.paymentMethod === "BANK_TRANSFER" && (
                            <Check className="w-5 h-5 text-[var(--primary)]" />
                          )}
                        </button>
                      </div>

                      {/* Info Banner */}
                      <div
                        className={`flex items-start gap-3 p-4 bg-[var(--primary-light)] border border-[var(--primary)]/20 rounded-xl ${isRTL ? "flex-row-reverse text-right" : ""}`}
                      >
                        <AlertCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[var(--primary)]">
                          {t("Payment.InfoNote")}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 bg-[var(--bg-muted)] flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 py-3 rounded-xl font-semibold border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg)] transition-colors"
                      >
                        {t("Back")}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t("Processing")}
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            {t("PlaceOrder")}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] sticky top-24 overflow-hidden">
                <div className="p-6 border-b border-[var(--border)]">
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    {t("Summary.Title")}
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Items Summary */}
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-[var(--text-secondary)]">
                          {t("Summary.BoxOf", { count: item.boxSize })}
                        </span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {item.totalPrice.toFixed(3)} TND
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[var(--border)] pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">
                        {t("Summary.Subtotal")}
                      </span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {subtotal.toFixed(3)} TND
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">
                        {t("Summary.Shipping")}
                      </span>
                      <span
                        className={`font-medium ${shippingCost === 0 ? "text-[var(--success)]" : "text-[var(--text-primary)]"}`}
                      >
                        {shippingCost === 0
                          ? t("Summary.Free")
                          : `${shippingCost.toFixed(3)} TND`}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-[var(--text-muted)]">
                        {t("Summary.FreeShippingNote")}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[var(--border)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[var(--text-primary)]">
                        {t("Summary.Total")}
                      </span>
                      <span className="text-xl font-bold text-[var(--primary)]">
                        {total.toFixed(3)} TND
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="p-6 bg-[var(--bg-muted)] border-t border-[var(--border)]">
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-3 text-sm text-[var(--text-secondary)] ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Truck className="w-4 h-4 text-[var(--success)]" />
                      {t("Summary.FastDelivery")}
                    </div>
                    <div
                      className={`flex items-center gap-3 text-sm text-[var(--text-secondary)] ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Package className="w-4 h-4 text-[var(--success)]" />
                      {t("Summary.FreshProducts")}
                    </div>
                    <div
                      className={`flex items-center gap-3 text-sm text-[var(--text-secondary)] ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <Check className="w-4 h-4 text-[var(--success)]" />
                      {t("Summary.SecurePayment")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
