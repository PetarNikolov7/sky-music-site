export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  status: "Наличен" | "По заявка" | "Изчерпан";
  description: string;
  imageLabel: string;
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
  },
];