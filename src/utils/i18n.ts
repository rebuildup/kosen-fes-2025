export type Language = "en" | "ja";

export interface Translations {
  [key: string]: string | Translations;
}

// Function to load translations for a language
export const loadTranslations = async (
  language: Language
): Promise<Translations> => {
  try {
    // Load translations from the JSON file
    const response = await fetch(`/locales/${language}/common.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${language}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading translations:", error);
    return {} as Translations;
  }
};

// Function to get a nested value from translations using dot notation
export const getTranslationValue = (
  translations: Translations,
  key: string
): string => {
  const keys = key.split(".");
  let result: Translations | string = translations;

  for (const k of keys) {
    if (typeof result === "object" && result !== null) {
      const value: string | Translations | undefined = (result as Translations)[k];
      if (value === undefined) {
        return key; // Return the key if the translation is not found
      }
      result = value;
    } else {
      return key; // Return the key if the translation is not found
    }
  }

  return typeof result === "string" ? result : key;
};
