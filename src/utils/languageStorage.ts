const LANGUAGE_KEY = 'languagePreference';

export const saveLanguage = async (language: string) => {
  localStorage.setItem(LANGUAGE_KEY, language);
};

export const loadLanguage = async (): Promise<string> => {
  const language = localStorage.getItem(LANGUAGE_KEY);
  return language ?? 'ro';
};
