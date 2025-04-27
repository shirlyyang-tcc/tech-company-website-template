import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import languageDetector from './languageDetector';
import i18nextConfig from '../../next-i18next.config';

export const useRedirect = (to?: string) => {
  const router = useRouter();
  const targetPath = to || router.asPath;

  useEffect(() => {
    if (!languageDetector) return;

    const detectedLng = languageDetector.detect() || i18nextConfig.i18n.defaultLocale;
    if (targetPath.startsWith('/' + detectedLng) && router.route === '/404') {
      return;
    }

    if (!targetPath.startsWith('/' + detectedLng)) {
        // @ts-expect-error Type definition issue with next-language-detector
        languageDetector.cache(detectedLng);
        router.replace('/' + detectedLng + targetPath);
    }

  }, [router, targetPath]);

  return null;
};

export const Redirect: React.FC = () => {
  useRedirect();
  return null;
};

export const getRedirect = (to?: string): React.FC => () => {
  useRedirect(to);
  return null;
}; 