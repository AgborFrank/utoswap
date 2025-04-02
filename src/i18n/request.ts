/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const SUPPORTED_LOCALES = ['en', 'fr', 'de']; // Add more locales if needed
const NAMESPACES = ['common'];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();  
  const locale = SUPPORTED_LOCALES.includes(cookieStore.get('locale')?.value || 'en') 
    ? cookieStore.get('locale')?.value || 'en' 
    : 'en';

  const localeMessages: Record<string, any> = {};

  for (const namespace of NAMESPACES) {
    try {
      const messages = (await import(`../../messages/${locale}/${namespace}.json`)).default;
      localeMessages[namespace] = messages;
    } catch (error) {
      console.warn(`Missing or invalid translation file for namespace: ${namespace}`, error);
      localeMessages[namespace] = {}; // Provide an empty fallback
    }
  }

  return {
    locale,
    messages: localeMessages,
  };
});
