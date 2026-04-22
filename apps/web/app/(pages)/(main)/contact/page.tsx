"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
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

import PageHero from "@/components/main/PageHero";
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

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  country: string;
  products: string[];
  message: string;
};

const INITIAL_FORM_STATE: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  country: "",
  products: [],
  message: "",
};

const WHOLESALE_PRODUCTS = [
  { value: "crevette_pistache", label: "Crevette Panée - Pistache" },
  { value: "crevette_amande", label: "Crevette Panée - Amande" },
  { value: "crevette_chaplure_mais", label: "Crevette Panée - Chapelure Maïs" },
  { value: "crevette_spicy", label: "Crevette Panée - Spicy" },
];

const SUBJECT_QUERY_TO_VALUE: Record<string, string> = {
  wholesale: "wholesale_order",
  wholesale_order: "wholesale_order",
  bulk: "wholesale_order",
  export: "export_inquiry",
  export_inquiry: "export_inquiry",
  order_issue: "order_issue",
  product_inquiry: "product_inquiry",
  restaurant: "restaurant_partnership",
  restaurant_partnership: "restaurant_partnership",
  general: "general",
  other: "other",
};

const WHOLESALE_OR_EXPORT_SUBJECTS = new Set<string>([
  "wholesale_order",
  "export_inquiry",
]);

function joinClassNames(parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function normalizeSubjectFromQuery(rawSubject: string | null): string | null {
  if (!rawSubject) {
    return null;
  }

  const normalized = rawSubject.trim().toLowerCase();
  return SUBJECT_QUERY_TO_VALUE[normalized] || null;
}

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const direction = locale === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  const formSectionRef = useRef<HTMLElement | null>(null);

  const subjectFromQuery = useMemo(() => {
    return normalizeSubjectFromQuery(searchParams.get("subject"));
  }, [searchParams]);

  const heroStats = useMemo(
    () => [
      { value: t("Hero.Pills.FastResponse") },
      { value: t("Hero.Pills.Wholesale") },
      { value: t("Hero.Pills.Quality") },
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

  const [formData, setFormData] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isWholesaleOrExport = WHOLESALE_OR_EXPORT_SUBJECTS.has(formData.subject);

  useEffect(() => {
    if (!subjectFromQuery) {
      return;
    }

    setFormData((prev) => {
      if (prev.subject === subjectFromQuery) {
        return prev;
      }

      if (WHOLESALE_OR_EXPORT_SUBJECTS.has(subjectFromQuery)) {
        return { ...prev, subject: subjectFromQuery };
      }

      return {
        ...prev,
        subject: subjectFromQuery,
        country: "",
        products: [],
      };
    });

    if (subjectFromQuery === "wholesale_order") {
      window.requestAnimationFrame(() => {
        formSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [subjectFromQuery]);

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      const { name, value } = e.target;
      const fieldName = name as keyof ContactFormState;

      setStatus("idle");
      setErrorMessage("");

      setFormData((prev) => {
        if (name === "subject") {
          if (!WHOLESALE_OR_EXPORT_SUBJECTS.has(value)) {
            return {
              ...prev,
              subject: value,
              country: "",
              products: [],
            };
          }

          return {
            ...prev,
            subject: value,
          };
        }

        return {
          ...prev,
          [fieldName]: value,
        } as ContactFormState;
      });
    },
    [],
  );

  const handleProductToggle = useCallback((productValue: string) => {
    setStatus("idle");
    setErrorMessage("");

    setFormData((prev) => ({
      ...prev,
      products: prev.products.includes(productValue)
        ? prev.products.filter((product) => product !== productValue)
        : [...prev.products, productValue],
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (status === "loading") {
        return;
      }

      const normalizedName = formData.name.trim();
      const normalizedEmail = formData.email.trim();
      const normalizedPhone = formData.phone.trim();
      const normalizedSubject = formData.subject.trim();
      const normalizedMessage = formData.message.trim();
      const normalizedCountry = formData.country.trim();

      if (
        !normalizedName ||
        !normalizedEmail ||
        !normalizedPhone ||
        !normalizedSubject ||
        !normalizedMessage
      ) {
        setStatus("error");
        setErrorMessage(t("Form.Errors.Generic"));
        return;
      }

      if (isWholesaleOrExport && !normalizedCountry) {
        setStatus("error");
        setErrorMessage(t("Form.Errors.Generic"));
        return;
      }

      setStatus("loading");
      setErrorMessage("");

      try {
        const selectedProductLabels = formData.products
          .map((value) => {
            const selected = WHOLESALE_PRODUCTS.find(
              (product) => product.value === value,
            );
            return selected ? selected.label : value;
          })
          .join(", ");

        const messageLines = [normalizedMessage];

        if (isWholesaleOrExport) {
          messageLines.push("");
          messageLines.push("--- " + t("Form.AdditionalInfo") + " ---");
          messageLines.push(t("Form.CountryLabel") + ": " + normalizedCountry);
          messageLines.push(
            t("Form.ProductsLabel") + ": " + (selectedProductLabels || "-"),
          );
        }

        const result = await sendContactEmail({
          name: normalizedName,
          email: normalizedEmail,
          phone: normalizedPhone,
          subject: normalizedSubject,
          message: messageLines.join("\n"),
        });

        if (result.success) {
          setStatus("success");
          setFormData({
            ...INITIAL_FORM_STATE,
            subject: subjectFromQuery || "",
          });
          return;
        }

        setStatus("error");
        setErrorMessage(result.error || t("Form.Errors.Generic"));
      } catch {
        setStatus("error");
        setErrorMessage(t("Form.Errors.Generic"));
      }
    },
    [formData, isWholesaleOrExport, status, subjectFromQuery, t],
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={direction}>
      <PageHero
        badge={t("Hero.Badge")}
        badgeIcon={<Store className="w-4 h-4 text-[#d4a853]" />}
        title={t("Hero.Title")}
        highlight={t("Hero.Highlight")}
        description={t("Hero.Description")}
        stats={heroStats}
        accentColor="text-[#d4a853]"
      />

      <section className="py-10 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 shadow-sm"
          >
            <div
              className={joinClassNames([
                "flex items-center gap-3 mb-5",
                isRTL && "flex-row-reverse text-right",
              ])}
            >
              <div className="w-10 h-10 rounded-xl bg-[#d4a853]/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#d4a853]" />
              </div>
              <div>
                <p className="text-sm text-[#475569]">
                  {t("Hero.InfoCard.Overline")}
                </p>
                <p className="text-lg font-semibold text-[#0c4a6e]">
                  {t("Hero.InfoCard.Title")}
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {contactInfo.map((item, idx) => (
                <div
                  key={item.title + "-" + idx}
                  className={joinClassNames([
                    "flex gap-3 p-4 rounded-xl bg-white border border-[#e2e8f0]",
                    isRTL && "flex-row-reverse text-right",
                  ])}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-[#0369a1]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#64748b] mb-0.5">
                      {item.title}
                    </p>
                    {item.details.map((detail, detailIdx) => (
                      <p
                        key={detail + "-" + detailIdx}
                        className="text-[#0f172a] text-sm font-medium"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="py-14 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={joinClassNames(["text-center mb-10", isRTL && "text-right"])}
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
                className={joinClassNames([
                  "p-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:-translate-y-1 hover:shadow-lg hover:border-[#0ea5e9]/30 transition-all group",
                  isRTL && "text-right",
                ])}
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
                  className={joinClassNames([
                    "mt-3 flex flex-wrap gap-2",
                    isRTL && "justify-end",
                  ])}
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

      <section
        ref={formSectionRef}
        id="contact-form"
        className="py-16 bg-[#f8fafc] scroll-mt-24"
      >
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
                  className={joinClassNames([
                    "flex items-center gap-3 mb-3",
                    isRTL && "flex-row-reverse text-right",
                  ])}
                >
                  <MessageSquare className="w-5 h-5 text-[#0369a1]" />
                  <p className="text-sm font-semibold text-[#0c4a6e]">
                    {t("Form.Overline")}
                  </p>
                </div>
                <h2
                  className={joinClassNames([
                    "text-2xl font-bold text-[#0c4a6e]",
                    isRTL && "text-right",
                  ])}
                >
                  {t("Form.Title")}
                </h2>
                <p
                  className={joinClassNames([
                    "text-[#475569] mb-6",
                    isRTL && "text-right",
                  ])}
                >
                  {t("Form.Description")}
                </p>

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    role="status"
                    className={joinClassNames([
                      "mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4",
                      isRTL && "flex-row-reverse text-right",
                    ])}
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
                    role="alert"
                    className={joinClassNames([
                      "mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4",
                      isRTL && "flex-row-reverse text-right",
                    ])}
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

                  {isWholesaleOrExport && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-5 p-5 rounded-2xl bg-[#f0f9ff] border border-[#bae6fd]"
                    >
                      <div
                        className={joinClassNames([
                          "flex items-center gap-2",
                          isRTL && "flex-row-reverse",
                        ])}
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
                          className={joinClassNames([
                            "text-sm font-medium text-[#0c4a6e] mb-3",
                            isRTL && "text-right",
                          ])}
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
                                onClick={() => handleProductToggle(product.value)}
                                className={joinClassNames([
                                  "px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all text-left",
                                  isRTL && "text-right",
                                  isSelected
                                    ? "border-[#0369a1] bg-[#0369a1] text-white shadow-md"
                                    : "border-[#e2e8f0] bg-white text-[#334155] hover:border-[#0ea5e9]/50",
                                ])}
                              >
                                <span
                                  className={joinClassNames([
                                    "flex items-center gap-2",
                                    isRTL && "flex-row-reverse",
                                  ])}
                                >
                                  <span
                                    className={joinClassNames([
                                      "w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0",
                                      isSelected
                                        ? "border-white bg-white/20"
                                        : "border-[#cbd5e1]",
                                    ])}
                                  >
                                    {isSelected ? (
                                      <CheckCircle className="w-3 h-3 text-white" />
                                    ) : null}
                                  </span>
                                  <span>{product.label}</span>
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
                    disabled={status === "loading"}
                  >
                    <Send className="w-5 h-5" />
                    {t("Form.ButtonSend")}
                  </PrimaryButton>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card
                className={joinClassNames([
                  "p-6 rounded-3xl bg-gradient-to-br from-[#0c4a6e] to-[#0369a1] text-white shadow-lg",
                  isRTL && "text-right",
                ])}
              >
                <div
                  className={joinClassNames([
                    "flex items-center gap-3",
                    isRTL && "flex-row-reverse",
                  ])}
                >
                  <ShieldCheck className="w-5 h-5 text-[#d4a853]" />
                  <p className="text-sm font-semibold">{t("Commitments.Title")}</p>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  {pledges.map((pledge) => (
                    <li
                      key={pledge}
                      className={joinClassNames([
                        "flex items-start gap-2",
                        isRTL && "flex-row-reverse text-right",
                      ])}
                    >
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#d4a853] flex-shrink-0" />
                      <span>{pledge}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card
                className={joinClassNames([
                  "p-6 rounded-3xl border border-[#e2e8f0] bg-white",
                  isRTL && "text-right",
                ])}
              >
                <p
                  className={joinClassNames([
                    "text-sm font-semibold text-[#0c4a6e] flex items-center gap-2",
                    isRTL && "flex-row-reverse",
                  ])}
                >
                  <Package className="w-4 h-4 text-[#0369a1]" />
                  {t("WhyContact.Title")}
                </p>
                <p className="mt-3 text-sm text-[#475569]">
                  {t("WhyContact.Description")}
                </p>
              </Card>

              <Card
                className={joinClassNames([
                  "p-6 rounded-3xl border-2 border-[#d4a853]/30 bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]",
                  isRTL && "text-right",
                ])}
              >
                <div
                  className={joinClassNames([
                    "flex items-center gap-2 mb-2",
                    isRTL && "flex-row-reverse",
                  ])}
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

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={joinClassNames(["text-center mb-10", isRTL && "text-right"])}
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
                className={joinClassNames([
                  "p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:border-[#0ea5e9]/30 transition-colors",
                  isRTL && "text-right",
                ])}
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