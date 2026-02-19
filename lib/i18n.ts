import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en/common.json";
import si from "../locales/si/common.json";
import ta from "../locales/ta/common.json";
import aboutUsEn from "../locales/en/aboutUs.json";

const resources = {
  en: { translation: en, aboutUs: aboutUsEn },
  si: { translation: si, aboutUs: {} },
  ta: { translation: ta, aboutUs: {} },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
