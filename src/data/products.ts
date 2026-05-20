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

  // Нови полета за по-професионални карти и продуктови страници.
  image?: string;
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
    id: "yamaha-pacifica-112v",
    name: "Yamaha Pacifica 112V",
    brand: "Yamaha",
    category: "Струнни инструменти",
    price: "680 лв.",
    status: "Наличен",
    description:
      "Електрическа китара с универсален звук, подходяща за начинаещи, репетиции и сцена.",
    imageLabel: "Electric Guitar",
    image: "",
    badges: ["Препоръчан", "За начинаещи", "Електрическа китара"],
    featured: true,
    specs: [
      { label: "Тип", value: "Електрическа китара" },
      { label: "Подходяща за", value: "начинаещи, репетиции и сцена" },
      { label: "Марка", value: "Yamaha" },
      { label: "Категория", value: "Струнни инструменти" },
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