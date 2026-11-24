/**
 * Content for /club/infrastructure.
 * Copy describes what each place is for; add facility facts (pitch size,
 * capacity, years) only after the club confirms them.
 * Photos: Unsplash, self-hosted in /public/images/infrastructure.
 */

const img = (name: string) => `/images/infrastructure/${name}.jpg`;

export type PlaceId = "pitch" | "training" | "academy" | "u19" | "tribune" | "media";

export type Place = {
  id: PlaceId;
  title: string;
  description: string;
  image: string;
  href: string;
  linkLabel: string;
  /** Position on the route atlas, in % of its width and height. */
  atlas: { x: number; y: number };
};

export const places: Place[] = [
  {
    id: "pitch",
    title: "Головне поле",
    description: "Місце домашніх матчів основної команди. Тут сезон стає результатом.",
    image: img("main-pitch"),
    href: "/matches",
    linkLabel: "Календар матчів",
    atlas: { x: 52, y: 46 },
  },
  {
    id: "training",
    title: "Тренування",
    description: "Щотижнева робота команди: тактика, фізична підготовка та стандарти.",
    image: img("training"),
    href: "/team",
    linkLabel: "Склад команди",
    atlas: { x: 30, y: 24 },
  },
  {
    id: "academy",
    title: "Академія",
    description: "Дитячо-юнацький футбол: команди U-14, U-15, U-16 та U-17.",
    image: img("academy"),
    href: "/academy",
    linkLabel: "Про академію",
    atlas: { x: 16, y: 62 },
  },
  {
    id: "u19",
    title: "Уличне U-19",
    description: "Юнацька команда — міст між академією та основним складом.",
    image: img("u19"),
    href: "/u19",
    linkLabel: "Команда U-19",
    atlas: { x: 34, y: 76 },
  },
  {
    id: "tribune",
    title: "Трибуна Героїв",
    description: "Місце пам'яті легенд клубу та найвідданіших уболівальників.",
    image: img("tunnel"),
    href: "/tribune",
    linkLabel: "Трибуна Героїв",
    atlas: { x: 74, y: 22 },
  },
  {
    id: "media",
    title: "Медіа",
    description: "Відео та фото з матчів — для тих, хто не встиг на стадіон.",
    image: img("media"),
    href: "/video",
    linkLabel: "Дивитися відео",
    atlas: { x: 82, y: 64 },
  },
];

export type AtlasRoute = {
  id: string;
  title: string;
  lead: string;
  description: string;
  stops: PlaceId[];
  href: string;
  linkLabel: string;
};

export const atlasRoutes: AtlasRoute[] = [
  {
    id: "player",
    title: "Шлях гравця",
    lead: "Від перших тренувань в академії — до основного складу.",
    description:
      "Юні футболісти проходять вікові групи U-14 — U-17, далі грають за U-19 і тренуються з першою командою, щоб вийти на головне поле.",
    stops: ["academy", "u19", "training", "pitch"],
    href: "/academy",
    linkLabel: "Академія клубу",
  },
  {
    id: "fan",
    title: "Матчовий день",
    lead: "Прийти, підтримати команду і переглянути гру ще раз.",
    description:
      "Розклад у календарі, підтримка з трибуни під час гри, а після свистка — відео та фото з матчу.",
    stops: ["tribune", "pitch", "media"],
    href: "/matches",
    linkLabel: "Календар матчів",
  },
  {
    id: "parents",
    title: "Батькам",
    lead: "Записати дитину і бачити, як вона росте у футболі.",
    description:
      "Академія підбирає вікову групу, тренування дають регулярність, а медіа клубу показують прогрес команд.",
    stops: ["academy", "training", "media"],
    href: "/contact",
    linkLabel: "Зв'язатися з клубом",
  },
  {
    id: "partner",
    title: "Партнерам",
    lead: "Підтримати футбол в Уличному і бути поруч із командою.",
    description:
      "Партнери клубу допомагають полю, трибуні та медіа розвиватися — і разом із командою проходять увесь сезон.",
    stops: ["media", "tribune", "pitch"],
    href: "/contact",
    linkLabel: "Стати партнером",
  },
];

export type Activity = {
  title: string;
  section: string;
  href: string;
  image: string;
};

export const activities: Activity[] = [
  { title: "Матчі основного складу", section: "Основа", href: "/matches", image: img("main-pitch") },
  { title: "Ігри команди U-19", section: "U-19", href: "/u19", image: img("u19") },
  { title: "Таблиці академії", section: "Академія", href: "/academy/tables", image: img("academy") },
  { title: "Відео матчів", section: "Медіа", href: "/video", image: img("media") },
  { title: "Фото сезону", section: "Медіа", href: "/photo", image: img("corner") },
  { title: "Історія клубу", section: "Клуб", href: "/history", image: img("mountains") },
];

export type Audience = {
  eyebrow: string;
  title: string;
  description: string;
  offer: string;
  href: string;
  linkLabel: string;
  image: string;
};

export const audiences: Audience[] = [
  {
    eyebrow: "Основний склад",
    title: "Гравцям",
    description: "Тренування, матчі ліги та товариські ігри впродовж усього сезону.",
    offer: "Хочете грати за «Уличне»? Напишіть нам — розкажемо про перегляд.",
    href: "/contact",
    linkLabel: "Зв'язатися",
    image: img("players"),
  },
  {
    eyebrow: "Академія",
    title: "Дітям і батькам",
    description: "Команди U-14 — U-17 для юних футболістів села та району.",
    offer: "Підкажемо, яка вікова група підходить дитині.",
    href: "/academy",
    linkLabel: "Про академію",
    image: img("academy"),
  },
  {
    eyebrow: "Трибуна",
    title: "Вболівальникам",
    description: "Розклад, результати й турнірна таблиця — щоб не пропустити жодної гри.",
    offer: "Приходьте на домашні матчі та підтримуйте команду.",
    href: "/matches",
    linkLabel: "Календар матчів",
    image: img("tunnel"),
  },
  {
    eyebrow: "Підтримка",
    title: "Партнерам",
    description: "Компанії та люди, які допомагають футболу в Уличному розвиватися.",
    offer: "Розкажемо, як підтримати команду, поле та академію.",
    href: "/contact",
    linkLabel: "Стати партнером",
    image: img("partners"),
  },
];

export type FaqItem = {
  question: string;
  answer: string;
  href: string;
  linkLabel: string;
};

export const faq: FaqItem[] = [
  {
    question: "Де дізнатися розклад матчів?",
    answer: "У розділі «Матчі» — календар, результати та турнірна таблиця сезону.",
    href: "/matches",
    linkLabel: "Перейти до матчів",
  },
  {
    question: "Як записати дитину до академії?",
    answer: "Напишіть нам через сторінку «Контакти» — підкажемо, яка група U-14 — U-17 підходить дитині.",
    href: "/contact",
    linkLabel: "Контакти",
  },
  {
    question: "Де подивитися відео та фото з матчів?",
    answer: "Відео шукайте в розділі «Відео», а фотографії — у розділі «Фото».",
    href: "/video",
    linkLabel: "Відео",
  },
  {
    question: "Як допомогти клубу або стати партнером?",
    answer: "Зв'яжіться з нами через «Контакти» — розкажемо, чим можна підтримати команду та інфраструктуру.",
    href: "/contact",
    linkLabel: "Контакти",
  },
];

export const heroImage = img("hero");
export const bannerImage = img("pitch-aerial");
export const statementImages = {
  mountains: img("mountains"),
  ball: img("ball"),
  players: img("players"),
};
