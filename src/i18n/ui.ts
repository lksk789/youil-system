export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const siteName: Record<Locale, string> = {
  en: 'YOUIL SYSTEM',
  ko: '유일시스템',
};

export const ogLocale: Record<Locale, string> = {
  en: 'en_US',
  ko: 'ko_KR',
};

/** 로케일 접두사를 뗀 기준 경로. '/ko/about' → '/about', '/ko' → '/' */
export function basePath(pathname: string): string {
  const clean =
    pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/';
  const stripped = clean.replace(/^\/ko(?=\/|$)/, '');
  return stripped || '/';
}

/** 기준 경로를 해당 로케일 경로로. trailingSlash: 'never' 규칙. */
export function localePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}
