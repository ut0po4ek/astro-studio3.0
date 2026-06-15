import type { ImageMetadata } from 'astro';

import photographerCover from '../assets/portfolio/photographer.png';
import photographerImg1 from '../assets/portfolio/photographer/image1.png';
import photographerImg2 from '../assets/portfolio/photographer/image2.png';
import photographerImg3 from '../assets/portfolio/photographer/image3.png';
import photographerImg4 from '../assets/portfolio/photographer/image4.png';

import piccolinoCover from '../assets/portfolio/piccolino.png';
import restrauntDark1 from '../assets/portfolio/restraunt/darkTheme/image1.png';
import restrauntDark2 from '../assets/portfolio/restraunt/darkTheme/image2.png';
import restrauntDark3 from '../assets/portfolio/restraunt/darkTheme/image3.png';
import restrauntDark4 from '../assets/portfolio/restraunt/darkTheme/image4.png';
import restrauntDark5 from '../assets/portfolio/restraunt/darkTheme/image5.png';
import restrauntDark6 from '../assets/portfolio/restraunt/darkTheme/image6.png';
import restrauntLight1 from '../assets/portfolio/restraunt/lightTheme/image1.png';
import restrauntLight2 from '../assets/portfolio/restraunt/lightTheme/image2.png';
import restrauntLight3 from '../assets/portfolio/restraunt/lightTheme/image3.png';
import restrauntLight4 from '../assets/portfolio/restraunt/lightTheme/image4.png';
import restrauntLight5 from '../assets/portfolio/restraunt/lightTheme/image5.png';
import restrauntLight6 from '../assets/portfolio/restraunt/lightTheme/image6.png';

import flowersCover from '../assets/portfolio/flowers.png';
import flowersDark1 from '../assets/portfolio/flowers/darkTheme/image1.png';
import flowersDark2 from '../assets/portfolio/flowers/darkTheme/image2.png';
import flowersDark3 from '../assets/portfolio/flowers/darkTheme/image3.png';
import flowersDark4 from '../assets/portfolio/flowers/darkTheme/image4.png';
import flowersDark5 from '../assets/portfolio/flowers/darkTheme/image5.png';
import flowersDark6 from '../assets/portfolio/flowers/darkTheme/image6.png';
import flowersLight1 from '../assets/portfolio/flowers/lightTheme/image1.png';
import flowersLight2 from '../assets/portfolio/flowers/lightTheme/image2.png';
import flowersLight3 from '../assets/portfolio/flowers/lightTheme/image3.png';
import flowersLight4 from '../assets/portfolio/flowers/lightTheme/image4.png';
import flowersLight5 from '../assets/portfolio/flowers/lightTheme/image5.png';
import flowersLight6 from '../assets/portfolio/flowers/lightTheme/image6.png';

import formLightCover from '../assets/portfolio/form-light.png';
import formLightDark1 from '../assets/portfolio/form-light/darkTheme/image1.png';
import formLightDark2 from '../assets/portfolio/form-light/darkTheme/image2.png';
import formLightDark3 from '../assets/portfolio/form-light/darkTheme/image3.png';
import formLightDark4 from '../assets/portfolio/form-light/darkTheme/image4.png';
import formLightDark5 from '../assets/portfolio/form-light/darkTheme/image5.png';
import formLightDark6 from '../assets/portfolio/form-light/darkTheme/image6.png';
import formLightLight1 from '../assets/portfolio/form-light/lightTheme/image1.png';
import formLightLight2 from '../assets/portfolio/form-light/lightTheme/image2.png';
import formLightLight3 from '../assets/portfolio/form-light/lightTheme/image3.png';
import formLightLight4 from '../assets/portfolio/form-light/lightTheme/image4.png';
import formLightLight5 from '../assets/portfolio/form-light/lightTheme/image5.png';
import formLightLight6 from '../assets/portfolio/form-light/lightTheme/image6.png';

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  tags: string[];
  category: 'landing' | 'ecommerce' | 'horeca' | 'corporate' | '3d' | 'uiux';
  image: ImageMetadata;
  liveUrl?: string;
  featured: boolean;
  goal: string;
  solution: string;
  features: string[];
  whatWeDid: string[];
  result: string;
  gallery: ImageMetadata[];
  galleryDark?: ImageMetadata[];
  galleryLight?: ImageMetadata[];
  colors?: string[];
  colorsDark?: string[];
  colorsLight?: string[];
  nextSlug?: string;
}

export const portfolio: Project[] = [
  {
    slug: 'photographer',
    title: 'Photographer Site',
    shortDescription: 'Премиальный сайт-визитка для фотографа с атмосферной подачей и формой записи.',
    description: 'Сайт-визитка для фотографа с акцентом на визуальную атмосферу, портфолио работ и удобную форму записи на съёмку. Тёмная тема подчёркивает работы фотографа и создаёт нужное настроение.',
    tags: ['Landing', 'UI/UX'],
    category: 'landing',
    image: photographerCover,
    liveUrl: 'https://phot0grapher-site.netlify.app/',
    featured: true,
    goal: 'Создать современный сайт-визитку, который передаёт атмосферу работ фотографа и помогает привлекать новых клиентов через красивую подачу портфолио и удобную форму записи.',
    solution: 'Разработали лаконичный одностраничный сайт с тёмной темой, крупными фото и минимальным текстом — чтобы работы говорили сами за себя. Плавные анимации при скролле создают ощущение погружения.',
    features: [
      'Тёмная атмосферная тема',
      'Анимации при скролле (fade, slide)',
      'Форма обратной связи с валидацией',
      'Адаптивная вёрстка (mobile-first)',
      'Галерея портфолио с hover-эффектами',
      'Оптимизация изображений',
    ],
    whatWeDid: [
      'UI/UX дизайн в Figma',
      'Адаптивная вёрстка',
      'Форма обратной связи',
      'Scroll-анимации',
      'Оптимизация под SEO',
    ],
    result: 'Проект получил современный визуальный образ, понятную структуру и готовую основу для привлечения заявок. Тёмная тема и анимации создают premium-впечатление с первого экрана.',
    gallery: [photographerImg1, photographerImg2, photographerImg3, photographerImg4],
    galleryDark: [photographerImg1, photographerImg2, photographerImg3, photographerImg4],
    colorsDark: ['#0a0a0a', '#c9a96e', '#f5f0e8', '#1a1410'],
    colors: ['#0a0a0a', '#c9a96e', '#f5f0e8', '#1a1410'],
    nextSlug: 'piccolino',
  },
  {
    slug: 'piccolino',
    title: 'Piccolino Restaurant',
    shortDescription: 'Сайт ресторана с тёплой атмосферой, разделом меню и формой бронирования.',
    description: 'Лендинг для итальянского ресторана Piccolino с двумя темами (светлой и тёмной), тёплой цветовой палитрой, блоком меню и формой бронирования столика. Сайт создаёт атмосферу итальянского ресторана и побуждает гостей сделать бронь.',
    tags: ['Landing', 'HoReCa'],
    category: 'horeca',
    image: piccolinoCover,
    liveUrl: 'https://restraunt-site-portofino.netlify.app/',
    featured: true,
    goal: 'Создать сайт, который передаёт уровень заведения, создаёт нужное настроение и помогает гостям быстро сделать бронирование без лишних шагов.',
    solution: 'Разработали лендинг с тёплой тёмной и светлой палитрами, разделами меню, галереей и встроенной формой бронирования. Прогресс-бар в меню создаёт интерактивный эффект присутствия.',
    features: [
      'Светлая и тёмная тема (переключение)',
      'Прогресс-бар в шапке при скролле',
      'Форма бронирования с выбором даты',
      'Анимации при скролле',
      'Раздел меню с категориями',
      'Фотогалерея ресторана',
      'Адаптивная вёрстка',
      'Интеграция с мессенджерами',
    ],
    whatWeDid: [
      'Web Design (светлая + тёмная тема)',
      'Адаптивная вёрстка',
      'Форма бронирования',
      'Галерея интерьера',
      'Анимации и scroll-эффекты',
      'Прогресс-бар навигации',
    ],
    result: 'Ресторан получил современный digital-образ, соответствующий уровню заведения, и инструмент привлечения гостей онлайн. Две темы дают гибкость для разного настроения и времени суток.',
    gallery: [restrauntDark1, restrauntDark2, restrauntDark3, restrauntDark4, restrauntDark5],
    galleryDark: [restrauntDark1, restrauntDark2, restrauntDark3, restrauntDark4, restrauntDark5, restrauntDark6],
    galleryLight: [restrauntLight1, restrauntLight2, restrauntLight3, restrauntLight4, restrauntLight5, restrauntLight6],
    colorsDark: ['#1a0a00', '#c9a96e', '#3d2b1a', '#f5ece0'],
    colorsLight: ['#fdf8f0', '#c9963a', '#8b6532', '#2a1a0a'],
    colors: ['#1a0a00', '#c9a96e', '#f5ece0'],
    nextSlug: 'flowers',
  },
  {
    slug: 'flowers',
    title: 'Flowers Boutique',
    shortDescription: 'Сайт цветочного бутика с нежным дизайном и каталогом букетов.',
    description: 'Сайт для цветочного бутика: каталог букетов, удобная корзина и форма оформления заказа с доставкой. Доступны светлая и тёмная темы — сайт одинаково красиво выглядит в любом режиме.',
    tags: ['Landing', 'UI/UX'],
    category: 'landing',
    image: flowersCover,
    liveUrl: 'https://flovers-site.netlify.app/',
    featured: true,
    goal: 'Создать сайт, который передаёт нежность бренда и делает покупку букета простой и приятной — от каталога до оформления заказа.',
    solution: 'Разработали сайт с тёплой цветовой палитрой, каталогом с фильтрами, корзиной и формой доставки. Светлая и тёмная темы делают сайт универсальным.',
    features: [
      'Светлая и тёмная тема',
      'Каталог товаров с карточками',
      'Фильтрация по категориям',
      'Корзина с управлением заказом',
      'Форма оформления доставки',
      'Анимации появления элементов',
      'Hover-эффекты на карточках',
      'Адаптивная вёрстка',
    ],
    whatWeDid: [
      'Дизайн (2 темы)',
      'Каталог товаров',
      'Корзина',
      'Форма заказа с доставкой',
      'Адаптивная вёрстка',
      'Анимации и hover-эффекты',
    ],
    result: 'Бутик получил современный образ и понятный сценарий заказа. Две темы расширяют аудиторию и делают сайт удобным в любое время суток.',
    gallery: [flowersDark1, flowersDark2, flowersDark3, flowersLight1, flowersLight2],
    galleryDark: [flowersDark1, flowersDark2, flowersDark3, flowersDark4, flowersDark5, flowersDark6],
    galleryLight: [flowersLight1, flowersLight2, flowersLight3, flowersLight4, flowersLight5, flowersLight6],
    colorsDark: ['#120a08', '#d4956a', '#f5ece8', '#2a1510'],
    colorsLight: ['#fdf6f0', '#d4956a', '#1a1412', '#f0e0d8'],
    colors: ['#fdf6f0', '#1a1a1a', '#d4956a'],
    nextSlug: 'form-light',
  },
  {
    slug: 'form-light',
    title: 'Form Light',
    shortDescription: 'Лаконичный лендинг со светлым дизайном и фокусом на форму захвата лидов.',
    description: 'Светлый минималистичный лендинг с чёткой структурой, акцентом на конверсию и удобной формой обратной связи. Включает тёмную тему, анимации и многошаговую форму с валидацией — всё направлено на одно целевое действие.',
    tags: ['Landing', 'UI/UX'],
    category: 'landing',
    image: formLightCover,
    liveUrl: 'https://form-light-site.netlify.app/',
    featured: true,
    goal: 'Создать лаконичный лендинг, который фокусирует посетителя на одном целевом действии — заполнении формы обратной связи.',
    solution: 'Разработали минималистичный светлый сайт с чёткой структурой и продуманным UX, ведущим к заполнению формы. Тёмная тема добавляет гибкость, анимации оживляют интерфейс.',
    features: [
      'Светлая и тёмная тема',
      'Многошаговая форма с валидацией',
      'Анимации при скролле',
      'Минималистичный UI-дизайн',
      'Высокий conversion potential',
      'Адаптивная вёрстка',
      'Micro-interactions в форме',
    ],
    whatWeDid: [
      'UI/UX дизайн (2 темы)',
      'Адаптивная вёрстка',
      'Форма с валидацией',
      'Scroll-анимации',
      'Micro-interactions',
    ],
    result: 'Лендинг получил высокий conversion potential благодаря чистой структуре и фокусу на одном действии. Светлая тема и тёмная тема охватывают все предпочтения аудитории.',
    gallery: [formLightDark1, formLightDark2, formLightDark3, formLightLight1, formLightLight2],
    galleryDark: [formLightDark1, formLightDark2, formLightDark3, formLightDark4, formLightDark5, formLightDark6],
    galleryLight: [formLightLight1, formLightLight2, formLightLight3, formLightLight4, formLightLight5, formLightLight6],
    colorsDark: ['#0f0f14', '#6366f1', '#f0f0ff', '#1e1e2e'],
    colorsLight: ['#fafafa', '#6366f1', '#1a1a2e', '#e8e8ff'],
    colors: ['#ffffff', '#1a1a1a', '#6366f1'],
    nextSlug: 'photographer',
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return portfolio.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return portfolio.filter((p) => p.featured);
}

export function getAllSlugs(): string[] {
  return portfolio.map((p) => p.slug);
}
