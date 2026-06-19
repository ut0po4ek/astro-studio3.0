export const siteConfig = {
  name: 'Astro Studio',
  shortName: 'Astro Studio',
  description: 'Создаём сайты, лендинги и digital-дизайн для бизнеса.',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: (import.meta.env.PUBLIC_SITE_URL ?? 'https://astro-studio.netlify.app').replace(/\/$/, ''),
  year: new Date().getFullYear(),

  contacts: {
    email: 'Mooneeb@yandex.ru',
    phone: '',
    address: '',
    addressMapsHref: '',
    telegram: 'https://t.me/ceoyandexspecial',
    // Disabled — no real account yet. Leave blank to hide in UI; do not point at placeholder links.
    whatsapp: '',
    instagram: '',
    vk: '',
    max: '',
  },

  // Telegram channels where we publish our work — shown only on the contacts page,
  // not in the footer or the main contact section.
  showcaseChannels: [
    { label: 'Yandex Special', href: 'https://t.me/yandexspecial' },
    { label: 'Yandex Resort', href: 'https://t.me/yandexresort' },
  ],

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
    legal: [
      { label: 'Политика конфиденциальности', href: '/privacy' },
      { label: 'Политика cookies',            href: '/cookies' },
    ],
  },

  forms: {
    contactEndpoint: '/api/contact',
    source: 'Astro Studio',
  },

  seo: {
    ogImage: '/og-image.jpg',
  },
};
