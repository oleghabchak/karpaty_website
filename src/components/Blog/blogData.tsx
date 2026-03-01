import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "Уличне U-19: матч проти Колоса скасовано",
    paragraph:
      "Матч Уличне U-19 – Колос U-19 у рамках Національної ліги U-19 не відбудеться через погодні умови.",
    image: "/images/blog/blog-01.jpg",
    author: { name: "Прес-служба ФК Уличне", image: "/images/blog/author-03.png", designation: "Офіційно" },
    tags: ["U-19"],
    publishDate: "28 лютого 2026",
  },
  {
    id: 2,
    title: "Гравці основи проведуть весняну частину в оренді",
    paragraph:
      "Клуб оголошує про орендні угоди для частини гравців на весняну частину чемпіонату України.",
    image: "/images/blog/blog-02.jpg",
    author: { name: "Прес-служба ФК Уличне", image: "/images/blog/author-02.png", designation: "Офіційно" },
    tags: ["команда"],
    publishDate: "28 лютого 2026",
  },
  {
    id: 3,
    title: "Національна ліга U-19. Уличне – Колос. Прев'ю",
    paragraph:
      "У суботу юнацька команда Уличне U-19 зіграє проти Колосу U-19 у рамках 18-го туру.",
    image: "/images/blog/blog-03.jpg",
    author: { name: "Прес-служба ФК Уличне", image: "/images/blog/author-03.png", designation: "Прев'ю" },
    tags: ["U-19", "матчі"],
    publishDate: "27 лютого 2026",
  },
];
export default blogData;
