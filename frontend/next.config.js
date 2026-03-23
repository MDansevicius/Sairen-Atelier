/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['lt', 'en'],
    defaultLocale: 'lt',
    localeDetection: false,
  },
};

module.exports = nextConfig;
