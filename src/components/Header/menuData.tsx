import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  { id: 1, title: "Головна", path: "/", newTab: false },
  { id: 2, title: "Команда", path: "/team", newTab: false },
  {
    id: 3,
    title: "Уличне U-19",
    newTab: false,
    submenu: [
      { id: 31, title: "Команда", path: "/u19/team", newTab: false },
      { id: 32, title: "Фото", path: "/u19/photo", newTab: false },
      { id: 33, title: "Новини", path: "/u19/news", newTab: false },
      { id: 34, title: "Турнірна таблиця", path: "/u19/table", newTab: false },
    ],
  },
  { id: 5, title: "Новини", path: "/news", newTab: false },
  {
    id: 6,
    title: "Клуб",
    newTab: false,
    submenu: [
      { id: 61, title: "Менеджмент", path: "/club/management", newTab: false },
      { id: 62, title: "Інфраструктура", path: "/club/infrastructure", newTab: false },
      { id: 63, title: "Звітність", path: "/club/reports", newTab: false },
      { id: 64, title: "Медіацентр", path: "/club/media", newTab: false },
      { id: 65, title: "Партнери", path: "/club/partners", newTab: false },
    ],
  },
  { id: 7, title: "Матчі", path: "/matches", newTab: false },
  { id: 9, title: "Фото", path: "/photo", newTab: false },
  { id: 11, title: "Фаншоп", path: "/shop", newTab: false },
  { id: 12, title: "Контакти", path: "/contact", newTab: false },
];

export default menuData;
