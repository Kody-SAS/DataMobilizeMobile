import {NativeModules, Platform} from 'react-native'
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./fr.json";
import en from "./en.json";
import AsyncStorage from '@react-native-async-storage/async-storage'


const resources = {
    en: en,
    fr: fr
}


const getDeviceLang = () => {
  const appLanguage =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier;

  return appLanguage.search(/-|_/g) !== -1
    ? appLanguage.slice(0, 2)
    : appLanguage;
}


const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: any) => {
        //get any previously stored language or using the device language
        if (Platform.OS == "ios" || Platform.OS == "android") {

            const value = await AsyncStorage.getItem('language');
    
            if (value == null) {
                const deviceLang = getDeviceLang();
                callback(deviceLang);
                return
            }
    
            callback(value);
        }
        else {
            callback("fr");
        }

    },
    init: () => {},
    cacheUserLanguage: () => {}
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(languageDetector)
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
})

export default i18n