export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductStatus = "Наличен" | "По заявка" | "Изчерпан";

export type CatalogCategory = {
  name: string;
  subcategories: string[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  status: ProductStatus;
  description: string;
  imageLabel: string;
  image?: string;
  images?: string[];
  badges?: string[];
  specs?: ProductSpec[];
  featured?: boolean;
};

export const catalogCategories: CatalogCategory[] = [
  {
    name: "Клавишни",
    subcategories: [
      "Дигитални пиана",
      "Професионални аранжори",
      "Преносими клавири",
      "Синтезатори",
      "MIDI клавиатури",
      "Педали",
      "Калъфи",
      "Стойки",
      "Столчета",
      "Слушалки",
    ],
  },
  {
    name: "Струнни",
    subcategories: [
      "Електрически китари",
      "Акустични китари",
      "Класически китари",
      "Китари за деца",
      "Бас китари",
      "Китарни пакети",
      "Цигулки",
      "Усилватели за китара",
      "Ефекти и процесори",
      "Стойки",
    ],
  },
  {
    name: "Озвучаване",
    subcategories: [
      "Тонколони",
      "Озвучителни системи",
      "Смесителни пултове",
      "Усилватели",
      "Стойки за тонколони",
    ],
  },
  {
    name: "Ударни",
    subcategories: [
      "Барабани",
      "Рототоми",
      "Тарамбуки / Перкусии",
      "Тъпани",
      "Електронни барабани",
      "Стойки за барабани и перкусии",
      "Педали за барабани",
      "Столчета за барабани",
      "Палки за барабани",
    ],
  },
  {
    name: "Духови",
    subcategories: [
      "Кларинети",
      "Саксофони",
      "Тромпети",
      "Флейти",
      "Смазки и препарати",
      "Мундщуци",
    ],
  },
  {
    name: "Микрофони",
    subcategories: [
      "Кабелни микрофони",
      "Безжични микрофони",
      "Микрофони за духови инструменти",
      "Студийни микрофони",
    ],
  },
  {
    name: "Студио",
    subcategories: [
      "Аудио интерфейси",
      "Слушалки",
      "Студийни монитори",
      "Студийни микрофони",
    ],
  },
  {
    name: "Аксесоари",
    subcategories: [
      "Кабели и конектори",
      "Стойки",
      "Калъфи и куфари",
    ],
  },
];

export const categories = [
  "Всички",
  ...catalogCategories.map((category) => category.name),
];

export const products: Product[] = [
  {
    id: "yamaha-c40",
    name: "Класическа китара YAMAHA C 40, размер 4/4",
    brand: "Yamaha",
    category: "Струнни",
    subcategory: "Класически китари",
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
      { label: "Размер", value: '4/4 стандартен – 39"' },
      { label: "Челна дъска", value: "Смърч" },
      { label: "Задна дъска и страници", value: "Meranti" },
      { label: "Гриф", value: "Палисандър" },
      { label: "Бридж", value: "Палисандър" },
      { label: "Ширина на нулево прагче", value: "52 mm" },
      { label: "Дълбочина на тялото", value: "43–100 mm" },
      { label: "Скала", value: '650 mm / 25.59"' },
      { label: "Цвят", value: "Натурален" },
      { label: "Струни", value: "Найлонови" },
      { label: "Финиш", value: "Гланц" },
      { label: "Брой струни", value: "6" },
    ],
  },
];