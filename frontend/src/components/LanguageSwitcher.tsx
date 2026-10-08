import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <Languages size={17} />

      <button
        className={language === "en" ? "active" : ""}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>

      <span>|</span>

      <button
        className={language === "ta" ? "active" : ""}
        onClick={() => setLanguage("ta")}
      >
        தமிழ்
      </button>
    </div>
  );
}