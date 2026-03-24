import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div className="h-screen">
      <h1>{t("Title")}</h1>
      <p>{t("Description")}</p>
    </div>
  );
}
