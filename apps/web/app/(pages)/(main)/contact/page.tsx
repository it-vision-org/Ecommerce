"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Label from "@/components/ui/Label";
import TextInput from "@/components/ui/TextInput";
import TextareaInput from "@/components/ui/TextareaInput";
import SelectInput from "@/components/ui/SelectInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { sendContactEmail } from "@/actions/contactActions";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

type FormStatus = "idle" | "loading" | "success" | "error";

const WHOLESALE_PRODUCTS = [
  { value: "crevette_pistache", label: "Crevette Panée — Pistache" },
  { value: "crevette_amande", label: "Crevette Panée — Amande" },
  { value: "crevette_chaplure_mais", label: "Crevette Panée — Chapelure Maïs" },
  { value: "crevette_spicy", label: "Crevette Panée — Spicy" },
];

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  const pills = useMemo(
    () => [
      t("Hero.Pills.FastResponse"),
      t("Hero.Pills.Wholesale"),
      t("Hero.Pills.Quality"),
    ],
    [t],
  );

  const contactInfo = useMemo(
    () => [
      {
        icon: MapPin,
        title: t("ContactInfo.Address.Title"),
        details: [
          t("ContactInfo.Address.Line1"),
          t("ContactInfo.Address.Line2"),
        ],
      },
      {
        icon: Phone,
        title: t("ContactInfo.Phone.Title"),
        details: [t("ContactInfo.Phone.Line1"), t("ContactInfo.Phone.Line2")],
      },
      {
        icon: Mail,
        title: t("ContactInfo.Email.Title"),
        details: [t("ContactInfo.Email.Line1"), t("ContactInfo.Email.Line2")],
      },
      {
        icon: Clock,
        title: t("ContactInfo.Hours.Title"),
        details: [t("ContactInfo.Hours.Line1"), t("ContactInfo.Hours.Line2")],
      },
    ],
    [t],
  );

  const channels = useMemo(
    () => [
      {
        icon: Package,
        title: t("Channels.Wholesale.Title"),
        description: t("Channels.Wholesale.Description"),
        tags: [
          t("Channels.Wholesale.Tags.Tag1"),
          t("Channels.Wholesale.Tags.Tag2"),
          t("Channels.Wholesale.Tags.Tag3"),
        ],
      },
      {
        icon: UtensilsCrossed,
        title: t("Channels.Restaurant.Title"),
        description: t("Channels.Restaurant.Description"),
        tags: [
          t("Channels.Restaurant.Tags.Tag1"),
          t("Channels.Restaurant.Tags.Tag2"),
          t("Channels.Restaurant.Tags.Tag3"),
        ],
      },
      {
        icon: Truck,
        title: t("Channels.Orders.Title"),
        description: t("Channels.Orders.Description"),
        tags: [
          t("Channels.Orders.Tags.Tag1"),
          t("Channels.Orders.Tags.Tag2"),
          t("Channels.Orders.Tags.Tag3"),
        ],
      },
      {
        icon: Globe,
        title: t("Channels.Export.Title"),
        description: t("Channels.Export.Description"),
        tags: [
          t("Channels.Export.Tags.Tag1"),
          t("Channels.Export.Tags.Tag2"),
          t("Channels.Export.Tags.Tag3"),
        ],
      },
    ],
    [t],
  );

  const pledges = useMemo(
    () => [
      t("Commitments.Pledge1"),
      t("Commitments.Pledge2"),
      t("Commitments.Pledge3"),
    ],
    [t],
  );

  const faqItems = useMemo(
    () => [
      { question: t("FAQ.Item1.Question"), answer: t("FAQ.Item1.Answer") },
      { question: t("FAQ.Item2.Question"), answer: t("FAQ.Item2.Answer") },
      { question: t("FAQ.Item3.Question"), answer: t("FAQ.Item3.Answer") },
      { question: t("FAQ.Item4.Question"), answer: t("FAQ.Item4.Answer") },
    ],
    [t],
  );

  const subjectOptions = useMemo(
    () => [
      {
        value: "wholesale_order",
        label: t("Form.SubjectOptions.WholesaleOrder"),
      },
      { value: "order_issue", label: t("Form.SubjectOptions.OrderIssue") },
      {
        value: "product_inquiry",
        label: t("Form.SubjectOptions.ProductInquiry"),
      },
      {
        value: "restaurant_partnership",
        label: t("Form.SubjectOptions.RestaurantPartnership"),
      },
      {
        value: "export_inquiry",
        label: t("Form.SubjectOptions.ExportInquiry"),
      },
      { value: "general", label: t("Form.SubjectOptions.General") },
      { value: "other", label: t("Form.SubjectOptions.Other") },
    ],
    [t],
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    country: "",
    products: [] as string[],
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isWholesaleOrExport =
    formData.subject === "wholesale_order" ||
    formData.subject === "export_inquiry";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProductToggle = (productValue: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(productValue)
        ? prev.products.filter((p) => p !== productValue)
        : [...prev.products, productValue],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const messageWithExtras = isWholesaleOrExport
        ? `${formData.message}\n\n--- ${t("Form.AdditionalInfo")} ---\n${t("Form.CountryLabel")}: ${formData.country}\n${t("Form.ProductsLabel")}: ${formData.products.map((p) => WHOLESALE_PRODUCTS.find((wp) => wp.value === p)?.label || p).join(", ")}`
        : formData.message;

      const result = await sendContactEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: messageWithExtras,
      });
      if (result.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          country: "",
          products: [],
          message: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(result.error || t("Form.Errors.Generic"));
      }
    } catch {
      setStatus("error");
      setErrorMessage(t("Form.Errors.Generic"));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={direction}>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0ea5e9] text-white">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a853]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0ea5e9]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur">
                <Store className="w-4 h-4 text-[#d4a853]" />
                <span className="text-sm font-medium">{t("Hero.Badge")}</span>
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
                {t("Hero.Title")}{" "}
                <span className="text-[#d4a853]">{t("Hero.Highlight")}</span>
              </h1>
              <p className="mt-4 text-lg text-slate-200 max-w-2xl">
                {t("Hero.Description")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
                {pills.map((pill, idx) => (
                  <span
                    key={`${pill}-${idx}`}
                    className="px-3 py-2 rounded-full bg-white/10 border border-white/15"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>

            <Card
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-lg shadow-xl"
            >
              <div
                className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#d4a853]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#d4a853]" />
                </div>
                <div>
                  <p className="text-sm text-slate-200">
                    {t("Hero.InfoCard.Overline")}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {t("Hero.InfoCard.Title")}
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                {contactInfo.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-[#7dd3fc]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-300 mb-0.5">
                        {item.title}
                      </p>
                      {item.details.map((d, i) => (
                        <p
                          key={`${d}-${i}`}
                          className="text-white text-sm font-medium"
                        >
                          {d}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══ CHANNELS ═══ */}
      <section className="py-14 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center mb-10 ${isRTL ? "text-right" : ""}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f9ff] text-[#0369a1] text-sm font-semibold border border-[#bae6fd]">
              {t("Channels.Badge")}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#0c4a6e]">
              {t("Channels.Title")}
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {channels.map((channel) => (
              <Card
                key={channel.title}
                variants={fadeInUp}
                className={`p-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:-translate-y-1 hover:shadow-lg hover:border-[#0ea5e9]/30 transition-all group ${isRTL ? "text-right" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <channel.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#0c4a6e]">
                  {channel.title}
                </h3>
                <p className="mt-2 text-sm text-[#475569]">
                  {channel.description}
                </p>
                <div
                  className={`mt-3 flex flex-wrap gap-2 ${isRTL ? "justify-end" : ""}`}
                >
                  {channel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[#e0f2fe] text-[#0369a1]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FORM + SIDEBAR ═══ */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-8 rounded-3xl bg-white border border-[#e2e8f0] shadow-sm">
                <div
                  className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <MessageSquare className="w-5 h-5 text-[#0369a1]" />
                  <p className="text-sm font-semibold text-[#0c4a6e]">
                    {t("Form.Overline")}
                  </p>
                </div>
                <h2
                  className={`text-2xl font-bold text-[#0c4a6e] ${isRTL ? "text-right" : ""}`}
                >
                  {t("Form.Title")}
                </h2>
                <p
                  className={`text-[#475569] mb-6 ${isRTL ? "text-right" : ""}`}
                >
                  {t("Form.Description")}
                </p>

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <p className="text-sm text-green-800">
                      {t("Form.StatusSuccess")}
                    </p>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-800">
                      {errorMessage || t("Form.Errors.Generic")}
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Label
                      label={t("Form.NameLabel")}
                      htmlFor="name"
                      isRTL={isRTL}
                    >
                      <TextInput
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t("Form.NamePlaceholder")}
                      />
                    </Label>

                    <Label
                      label={t("Form.EmailLabel")}
                      htmlFor="email"
                      isRTL={isRTL}
                    >
                      <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t("Form.EmailPlaceholder")}
                      />
                    </Label>
                  </div>

                  <Label
                    label={t("Form.PhoneLabel")}
                    htmlFor="phone"
                    isRTL={isRTL}
                  >
                    <TextInput
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder={t("Form.PhonePlaceholder")}
                    />
                  </Label>

                  <Label
                    label={t("Form.SubjectLabel")}
                    htmlFor="subject"
                    isRTL={isRTL}
                  >
                    <SelectInput
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{t("Form.SubjectPlaceholder")}</option>
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </SelectInput>
                  </Label>

                  {/* Conditional: Country + Products for wholesale/export */}
                  {isWholesaleOrExport && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-5 p-5 rounded-2xl bg-[#f0f9ff] border border-[#bae6fd]"
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Globe className="w-4 h-4 text-[#0369a1]" />
                        <p className="text-sm font-semibold text-[#0c4a6e]">
                          {t("Form.WholesaleSection")}
                        </p>
                      </div>

                      <Label
                        label={t("Form.CountryLabel")}
                        htmlFor="country"
                        isRTL={isRTL}
                      >
                        <TextInput
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          placeholder={t("Form.CountryPlaceholder")}
                        />
                      </Label>

                      <div>
                        <p
                          className={`text-sm font-medium text-[#0c4a6e] mb-3 ${isRTL ? "text-right" : ""}`}
                        >
                          {t("Form.ProductsLabel")} *
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {WHOLESALE_PRODUCTS.map((product) => {
                            const isSelected = formData.products.includes(
                              product.value,
                            );
                            return (
                              <button
                                key={product.value}
                                type="button"
                                onClick={() =>
                                  handleProductToggle(product.value)
                                }
                                className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all text-left ${isRTL ? "text-right" : ""} ${
                                  isSelected
                                    ? "border-[#0369a1] bg-[#0369a1] text-white shadow-md"
                                    : "border-[#e2e8f0] bg-white text-[#334155] hover:border-[#0ea5e9]/50"
                                }`}
                              >
                                <span
                                  className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                                >
                                  <span
                                    className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                                      isSelected
                                        ? "border-white bg-white/20"
                                        : "border-[#cbd5e1]"
                                    }`}
                                  >
                                    {isSelected && (
                                      <CheckCircle className="w-3 h-3 text-white" />
                                    )}
                                  </span>
                                  {product.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Label
                    label={t("Form.MessageLabel")}
                    htmlFor="message"
                    isRTL={isRTL}
                  >
                    <TextareaInput
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder={t("Form.MessagePlaceholder")}
                    />
                  </Label>

                  <PrimaryButton
                    type="submit"
                    fullWidth
                    loading={status === "loading"}
                    loadingText={t("Form.ButtonSending")}
                  >
                    <Send className="w-5 h-5" />
                    {t("Form.ButtonSend")}
                  </PrimaryButton>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card
                className={`p-6 rounded-3xl bg-gradient-to-br from-[#0c4a6e] to-[#0369a1] text-white shadow-lg ${isRTL ? "text-right" : ""}`}
              >
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <ShieldCheck className="w-5 h-5 text-[#d4a853]" />
                  <p className="text-sm font-semibold">
                    {t("Commitments.Title")}
                  </p>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  {pledges.map((p) => (
                    <li
                      key={p}
                      className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                    >
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#d4a853] flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card
                className={`p-6 rounded-3xl border border-[#e2e8f0] bg-white ${isRTL ? "text-right" : ""}`}
              >
                <p
                  className={`text-sm font-semibold text-[#0c4a6e] flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Package className="w-4 h-4 text-[#0369a1]" />
                  {t("WhyContact.Title")}
                </p>
                <p className="mt-3 text-sm text-[#475569]">
                  {t("WhyContact.Description")}
                </p>
              </Card>

              {/* Wholesale CTA Card */}
              <Card
                className={`p-6 rounded-3xl border-2 border-[#d4a853]/30 bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] ${isRTL ? "text-right" : ""}`}
              >
                <div
                  className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Globe className="w-4 h-4 text-[#b45309]" />
                  <p className="text-sm font-bold text-[#92400e]">
                    {t("WholesaleCTA.Title")}
                  </p>
                </div>
                <p className="text-sm text-[#78350f]/80">
                  {t("WholesaleCTA.Description")}
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`text-center mb-10 ${isRTL ? "text-right" : ""}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f9ff] text-[#0369a1] text-sm font-semibold border border-[#bae6fd]">
              {t("FAQ.Badge")}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#0c4a6e]">
              {t("FAQ.Title")}
            </h2>
            <p className="mt-2 text-[#475569]">{t("FAQ.Subtitle")}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqItems.map((item) => (
              <Card
                key={item.question}
                variants={fadeInUp}
                className={`p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:border-[#0ea5e9]/30 transition-colors ${isRTL ? "text-right" : ""}`}
              >
                <h3 className="text-lg font-semibold text-[#0c4a6e]">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm text-[#475569]">{item.answer}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
