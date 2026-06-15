export const siteConfig = {
  name: 'Astro Studio',
  shortName: 'Astro Studio',
  description: 'Создаём сайты, лендинги и digital-дизайн для бизнеса.',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: (import.meta.env.PUBLIC_SITE_URL ?? 'https://astro-studio.netlify.app').replace(/\/$/, ''),
  year: new Date().getFullYear(),

  contacts: {
    email: 'hello@astro-studio.ru',
    phone: '',
    address: '',
    addressMapsHref: '',
    telegram: 'https://t.me/astrostudio',
    whatsapp: 'about:blank',
    instagram: 'about:blank',
    vk: 'about:blank',
    max: '',
  },

  nav: [
    { label: 'Главная',    href: '/' },
    { label: 'Портфолио',  href: '/portfolio' },
    { label: 'Услуги',     href: '/services' },
    { label: 'О студии',   href: '/about' },
    { label: 'Контакты',   href: '/contacts' },
  ],

  cta: {
    label: 'Обсудить проект',
    href: '/contacts',
  },

  footer: {
    tagline: 'Создаём сайты, которые выглядят дорого и помогают продавать.',
    ctaText: 'Расскажите о проекте — предложим формат, сроки и следующий шаг.',
    privacyHref: 'about:blank',
  },

  forms: {
    contactEndpoint: '/.netlify/functions/contact',
    source: 'Astro Studio',
  },

  seo: {
    ogImage: '/og-image.jpg',
  },
};
