import type { Post } from "@/types/post";

const postSeedData: Post[] = [
  {
    id: "ulychne-u19-match-cancelled",
    slug: "ulychne-u19-match-cancelled",
    title: "Уличне U-19: матч проти Колоса скасовано",
    excerpt:
      "Матч Уличне U-19 - Колос U-19 у рамках Національної ліги U-19 не відбудеться через погодні умови.",
    image: "/images/blog/blog-01.jpg",
    bodyMarkdown: `Матч **Уличне U-19** проти **Колоса U-19** скасовано через несприятливі погодні умови.\n\nКлуб додатково повідомить про подальші зміни у розкладі та нову інформацію щодо найближчих матчів команди.`,
    author: {
      name: "Прес-служба ФК Уличне",
      image: "/images/blog/author-03.png",
      designation: "Офіційно",
    },
    tags: ["U-19"],
    publishDate: "28 лютого 2026",
    publishedAt: "2026-02-28T09:00:00.000Z",
  },
  {
    id: "spring-loan-deals",
    slug: "spring-loan-deals",
    title: "Гравці основи проведуть весняну частину в оренді",
    excerpt:
      "Клуб оголошує про орендні угоди для частини гравців на весняну частину чемпіонату України.",
    image: "/images/blog/blog-02.jpg",
    bodyMarkdown: `ФК «Уличне» погодив орендні угоди для кількох гравців основного складу.\n\nМета клубу - дати футболістам більше ігрової практики та створити кращі умови для розвитку протягом весняної частини сезону.`,
    author: {
      name: "Прес-служба ФК Уличне",
      image: "/images/blog/author-02.png",
      designation: "Офіційно",
    },
    tags: ["Команда"],
    publishDate: "28 лютого 2026",
    publishedAt: "2026-02-28T07:30:00.000Z",
  },
  {
    id: "u19-kolos-preview",
    slug: "u19-kolos-preview",
    title: "Національна ліга U-19. Уличне - Колос. Прев'ю",
    excerpt:
      "У суботу юнацька команда Уличне U-19 зіграє проти Колосу U-19 у рамках 18-го туру.",
    image: "/images/blog/blog-03.jpg",
    bodyMarkdown: `У черговому турі Національної ліги U-19 команда **Уличне U-19** готується до матчу проти **Колоса U-19**.\n\nУ матеріалі - коротке прев'ю гри, стан команди та головні акценти перед поєдинком.`,
    author: {
      name: "Прес-служба ФК Уличне",
      image: "/images/blog/author-03.png",
      designation: "Прев'ю",
    },
    tags: ["U-19", "Матчі"],
    publishDate: "27 лютого 2026",
    publishedAt: "2026-02-27T12:00:00.000Z",
  },
];

export default postSeedData;
