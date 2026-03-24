"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
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

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  const pills = useMemo(
    () => [
      t("Hero.Pills.Response"),
      t("Hero.Pills.Anonymous"),
      t("Hero.Pills.Community"),
    ],
    [t],
  );

  const contactInfo = useMemo(
    () => [
      {
        icon: MapPin,
        title: t("ContactInfo.Rally.Title"),
        details: [t("ContactInfo.Rally.Line1"), t("ContactInfo.Rally.Line2")],
      },
      {
        icon: MessageSquare,
        title: t("ContactInfo.Email.Title"),
        details: [t("ContactInfo.Email.Line1"), t("ContactInfo.Email.Line2")],
      },
      {
        icon: Clock,
        title: t("ContactInfo.Response.Title"),
        details: [
          t("ContactInfo.Response.Line1"),
          t("ContactInfo.Response.Line2"),
        ],
      },
      {
        icon: ShieldCheck,
        title: t("ContactInfo.Privacy.Title"),
        details: [
          t("ContactInfo.Privacy.Line1"),
          t("ContactInfo.Privacy.Line2"),
        ],
      },
    ],
    [t],
  );

  const channels = useMemo(
    () => [
      {
        title: t("Channels.Listening.Title"),
        description: t("Channels.Listening.Description"),
        tags: [
          t("Channels.Listening.Tags.Tag1"),
          t("Channels.Listening.Tags.Tag2"),
          t("Channels.Listening.Tags.Tag3"),
        ],
      },
      {
        title: t("Channels.Parents.Title"),
        description: t("Channels.Parents.Description"),
        tags: [
          t("Channels.Parents.Tags.Tag1"),
          t("Channels.Parents.Tags.Tag2"),
          t("Channels.Parents.Tags.Tag3"),
        ],
      },
      {
        title: t("Channels.Partnerships.Title"),
        description: t("Channels.Partnerships.Description"),
        tags: [
          t("Channels.Partnerships.Tags.Tag1"),
          t("Channels.Partnerships.Tags.Tag2"),
          t("Channels.Partnerships.Tags.Tag3"),
        ],
      },
      {
        title: t("Channels.Technical.Title"),
        description: t("Channels.Technical.Description"),
        tags: [
          t("Channels.Technical.Tags.Tag1"),
          t("Channels.Technical.Tags.Tag2"),
          t("Channels.Technical.Tags.Tag3"),
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
    ],
    [t],
  );

  const subjectOptions = useMemo(
    () => [
      { value: "general", label: t("Form.SubjectOptions.General") },
      {
        value: "student_support",
        label: t("Form.SubjectOptions.StudentSupport"),
      },
      {
        value: "parent_question",
        label: t("Form.SubjectOptions.ParentQuestion"),
      },
      {
        value: "teacher_collaboration",
        label: t("Form.SubjectOptions.TeacherCollaboration"),
      },
      { value: "partnership", label: t("Form.SubjectOptions.Partnership") },
      { value: "event", label: t("Form.SubjectOptions.Event") },
      { value: "technical", label: t("Form.SubjectOptions.Technical") },
      { value: "other", label: t("Form.SubjectOptions.Other") },
    ],
    [t],
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await sendContactEmail(formData);
      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(result.error || t("Form.Errors.Generic"));
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(t("Form.Errors.Generic"));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={direction}>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#38bdf8,transparent_30%),radial-gradient(circle_at_80%_10%,#3b82f6,transparent_30%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur">
                <Sparkles className="w-4 h-4 text-[#bae6fd]" />
                <span className="text-sm font-medium">{t("Hero.Badge")}</span>
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">
                {t("Hero.Title")}{" "}
                <span className="text-[#fbbf24]">{t("Hero.Highlight")}</span>
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
                <HeartHandshake className="w-10 h-10 text-[#bae6fd]" />
                <div>
                  <p className="text-sm text-slate-200">
                    {t("Hero.InfoCard.Overline")}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {t("Hero.InfoCard.Title")}
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                {contactInfo.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  >
                    <item.icon className="w-5 h-5 text-[#bae6fd] mt-1" />
                    <div>
                      <p className="text-sm text-slate-200">{item.title}</p>
                      {item.details.map((d, i) => (
                        <p key={`${d}-${i}`} className="text-white font-medium">
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

      <section className="py-14 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6">
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
                className={`p-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] hover:-translate-y-1 hover:shadow-lg transition-all ${isRTL ? "text-right" : ""}`}
              >
                <h3 className="text-lg font-semibold text-[#0f172a]">
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
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[#e0f2fe] text-[#0ea5e9]"
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

      <section className="py-16">
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
                  <Users className="w-5 h-5 text-[#2563eb]" />
                  <p className="text-sm font-semibold text-[#0f172a]">
                    {t("Form.Overline")}
                  </p>
                </div>
                <h2
                  className={`text-2xl font-bold text-[#0f172a] ${isRTL ? "text-right" : ""}`}
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

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card
                className={`p-6 rounded-3xl bg-[#0f172a] text-white shadow-lg ${isRTL ? "text-right" : ""}`}
              >
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
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
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#38bdf8]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card
                className={`p-6 rounded-3xl border border-[#e2e8f0] bg-white ${isRTL ? "text-right" : ""}`}
              >
                <p className="text-sm font-semibold text-[#0f172a] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2563eb]" />
                  {t("WhyWrite.Title")}
                </p>
                <p className="mt-3 text-sm text-[#475569]">
                  {t("WhyWrite.Description")}
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
            className={`text-center mb-10 ${isRTL ? "text-right" : ""}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e0f2fe] text-[#0ea5e9] text-sm font-semibold">
              {t("FAQ.Badge")}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-[#0f172a]">
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
                className={`p-5 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] ${isRTL ? "text-right" : ""}`}
              >
                <h3 className="text-lg font-semibold text-[#0f172a]">
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
