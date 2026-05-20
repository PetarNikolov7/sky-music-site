export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  status: "Наличен" | "По заявка" | "Изчерпан";
  description: string;
  imageLabel: string;

  image?: string;
  images?: string[];
  badges?: string[];
  specs?: ProductSpec[];
  featured?: boolean;
};

export const categories = [
  "Всички",
  "Струнни инструменти",
  "Клавишни инструменти",
  "Ударни инструменти",
  "Микрофони",
  "Студио оборудване",
  "Аксесоари",
];

export const products: Product[] = [
  {
    id: "yamaha-c40",
    name: "Класическа китара YAMAHA C 40, размер 4/4",
    brand: "YAMAHA",
    category: "Струнни инструменти",
    price: "150,00 € / 293,37 лв.",
    status: "Наличен",
    description:
      "Класическа китара YAMAHA C 40, размер 4/4, подходяща за обучение, домашно свирене и начинаещи китаристи. Моделът е с натурален цвят, гланцов финиш и найлонови струни.",
    imageLabel: "Classical Guitar",
    image: "/products/yamaha-c40-01.webp",
    images: [
      "/products/yamaha-c40-01.webp",
      "/products/yamaha-c40-02.webp",
      "/products/yamaha-c40-03.webp",
      "/products/yamaha-c40-04.webp",
    ],
    badges: ["YAMAHA", "4/4", "Класическа китара", "Наличен"],
    featured: true,
    specs: [
      { label: "Размер", value: "4/4 стандартен – 39&quot;" },
      { label: "Челна дъска", value: "Смърч" },
      { label: "Задна дъска и страници", value: "Meranti" },
      { label: "Гриф", value: "Палисандър" },
      { label: "Бридж", value: "Палисандър" },
      { label: "Ширина на нулево прагче", value: "52 mm" },
      { label: "Дълбочина на тялото", value: "43–100 mm" },
      { label: "Скала", value: "650 mm / 25.59&quot;" },
      { label: "Цвят", value: "Натурален" },
      { label: "Струни", value: "Найлонови" },
      { label: "Финиш", value: "Гланц" },
      { label: "Брой струни", value: "6" },
    ],
  },
  {
    id: "fender-cd-60",
    name: "Fender CD-60",
    brand: "Fender",
    category: "Струнни инструменти",
    price: "420 лв.",
    status: "Наличен",
    description:
      "Акустична китара с балансиран тон и удобен гриф. Подходяща за уроци и домашно свирене.",
    imageLabel: "Acoustic Guitar",
    image: "",
    badges: ["Акустична", "За обучение", "Наличен"],
    featured: true,
    specs: [
      { label: "Тип", value: "Акустична китара" },
      { label: "Подходяща за", value: "уроци и домашно свирене" },
      { label: "Марка", value: "Fender" },
      { label: "Категория", value: "Струнни инструменти" },
    ],
  },
  {
    id: "yamaha-psr-e373",
    name: "Yamaha PSR-E373",
    brand: "Yamaha",
    category: "Клавишни инструменти",
    price: "489 лв.",
    status: "По заявка",
    description:
      "Клавир с богата звукова библиотека, ритми и функции за обучение.",
    imageLabel: "Keyboard",
    image: "",
    badges: ["Клавир", "За обучение", "По заявка"],
    featured: true,
    specs: [
      { label: "Тип", value: "Клавишен инструмент" },
      { label: "Подходящ за", value: "обучение, домашно свирене и упражнения" },
      { label: "Марка", value: "Yamaha" },
      { label: "Категория", value: "Клавишни инструменти" },
    ],
  },
  {
    id: "shure-sm58",
    name: "Shure SM58",
    brand: "Shure",
    category: "Микрофони",
    price: "250 лв.",
    status: "Наличен",
    description:
      "Професионален вокален микрофон за сцена, репетиции и студио.",
    imageLabel: "Microphone",
    image: "",
    badges: ["Топ избор", "Вокал", "Сцена"],
    featured: true,
    specs: [
      { label: "Тип", value: "Динамичен вокален микрофон" },
      { label: "Подходящ за", value: "сцена, репетиции и вокали" },
      { label: "Марка", value: "Shure" },
      { label: "Категория", value: "Микрофони" },
    ],
  },
  {
    id: "focusrite-scarlett-solo",
    name: "Focusrite Scarlett Solo",
    brand: "Focusrite",
    category: "Студио оборудване",
    price: "315 лв.",
    status: "Наличен",
    description:
      "Компактен аудио интерфейс за запис на вокали, китара, подкаст и домашно студио.",
    imageLabel: "Audio Interface",
    image: "",
    badges: ["Домашно студио", "Запис", "Интерфейс"],
    featured: true,
    specs: [
      { label: "Тип", value: "Аудио интерфейс" },
      { label: "Подходящ за", value: "вокали, китара, подкаст и домашно студио" },
      { label: "Марка", value: "Focusrite" },
      { label: "Категория", value: "Студио оборудване" },
    ],
  },
  {
    id: "guitar-cable-3m",
    name: "Инструментален кабел 3 м",
    brand: "SKY MUSIC BG",
    category: "Аксесоари",
    price: "24 лв.",
    status: "Наличен",
    description:
      "Качествен кабел за китара, бас китара, клавир и сценична употреба.",
    imageLabel: "Cable",
    image: "",
    badges: ["Аксесоар", "Кабел", "Наличен"],
    featured: false,
    specs: [
      { label: "Тип", value: "Инструментален кабел" },
      { label: "Дължина", value: "3 м" },
      { label: "Подходящ за", value: "китара, бас китара, клавир и сцена" },
      { label: "Категория", value: "Аксесоари" },
    ],
  },
];