import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Language = "en" | "ta";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  isTamil: boolean;
};

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(
      "carepath-language"
    );

    return savedLanguage === "ta" ? "ta" : "en";
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);

    localStorage.setItem(
      "carepath-language",
      newLanguage
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isTamil: language === "ta",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}