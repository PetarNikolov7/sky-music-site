"use client";

import { useMemo, useState } from "react";
import { createProduct, updateProduct } from "./actions";

type ProductFormCategory = {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
};

type ProductFormBrand = {
  id: string;
  name: string;
};

export type ProductFormInitialValues = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  brandId: string;
  categoryId: string;
  subcategoryId: string;
  shortDescription: string;
  description: string;
  priceAmount: string;
  currency: string;
  stockStatus: string;
  badges: string[];
  isPublished: boolean;
  isFeatured: boolean;
};

type ProductFormProps = {
  mode?: "create" | "edit";
  categories: ProductFormCategory[];
  brands: ProductFormBrand[];
  initialValues?: ProductFormInitialValues;
};

const stockStatuses = [
  {
    value: "available",
    label: "Наличен",
  },
  {
    value: "on_request",
    label: "По заявка",
  },
  {
    value: "out_of_stock",
    label: "Изчерпан",
  },
];

const fieldClassName =
  "w-full rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400";

function slugify(input: string) {
  const basicMap: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sht",
    ъ: "a",
    ь: "",
    ю: "yu",
    я: "ya",
  };

  return input
    .toLowerCase()
    .split("")
    .map((character) => basicMap[character] ?? character)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function getDefaultValues(
  categories: ProductFormCategory[],
  initialValues?: ProductFormInitialValues,
): ProductFormInitialValues {
  const firstCategory = categories[0];
  const firstSubcategory = firstCategory?.subcategories[0];

  return {
    id: initialValues?.id,
    name: initialValues?.name ?? "",
    slug: initialValues?.slug ?? "",
    sku: initialValues?.sku ?? "",
    brandId: initialValues?.brandId ?? "",
    categoryId: initialValues?.categoryId ?? firstCategory?.id ?? "",
    subcategoryId: initialValues?.subcategoryId ?? firstSubcategory?.id ?? "",
    shortDescription: initialValues?.shortDescription ?? "",
    description: initialValues?.description ?? "",
    priceAmount: initialValues?.priceAmount ?? "",
    currency: initialValues?.currency ?? "EUR",
    stockStatus: initialValues?.stockStatus ?? "available",
    badges: initialValues?.badges ?? [],
    isPublished: initialValues?.isPublished ?? false,
    isFeatured: initialValues?.isFeatured ?? false,
  };
}

export default function ProductForm({
  mode = "create",
  categories,
  brands,
  initialValues,
}: ProductFormProps) {
  const defaults = getDefaultValues(categories, initialValues);
  const [name, setName] = useState(defaults.name);
  const [slug, setSlug] = useState(defaults.slug);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [categoryId, setCategoryId] = useState(defaults.categoryId);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId) ?? null,
    [categories, categoryId],
  );

  const availableSubcategories = selectedCategory?.subcategories ?? [];
  const selectedSubcategoryId =
    availableSubcategories.find(
      (subcategory) => subcategory.id === defaults.subcategoryId,
    )?.id ?? availableSubcategories[0]?.id ?? "";

  function handleNameChange(value: string) {
    setName(value);

    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  const isEditMode = mode === "edit";
  const formAction = isEditMode ? updateProduct : createProduct;

  return (
    <form action={formAction} className="grid gap-8">
      {isEditMode && defaults.id && (
        <input type="hidden" name="product_id" value={defaults.id} />
      )}

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            Основна информация
          </p>

          <h2 className="mt-3 text-3xl font-black">Данни за продукта</h2>
        </div>

        <div className="mt-7 grid gap-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Име на продукта <span className="text-sky-300">*</span>
            </label>

            <input
              id="name"
              name="name"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Напр. Класическа китара YAMAHA C 40, размер 4/4"
              className={fieldClassName}
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-bold text-slate-300"
              >
                Slug <span className="text-sky-300">*</span>
              </label>

              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                placeholder="yamaha-c40"
                className={fieldClassName}
                required
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Използва се за бъдещия адрес на продукта. Само малки латински
                букви, цифри и тирета.
              </p>
            </div>

            <div>
              <label
                htmlFor="sku"
                className="mb-2 block text-sm font-bold text-slate-300"
              >
                SKU / вътрешен код
              </label>

              <input
                id="sku"
                name="sku"
                placeholder="По желание"
                defaultValue={defaults.sku}
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="brand_id"
                className="mb-2 block text-sm font-bold text-slate-300"
              >
                Марка
              </label>

              <select
                id="brand_id"
                name="brand_id"
                className={fieldClassName}
                defaultValue={defaults.brandId}
              >
                <option value="">Изберете марка</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="new_brand_name"
                className="mb-2 block text-sm font-bold text-slate-300"
              >
                Нова марка
              </label>

              <input
                id="new_brand_name"
                name="new_brand_name"
                placeholder="Попълнете само ако марката липсва"
                className={fieldClassName}
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Ако въведете нова марка, тя ще бъде създадена автоматично и ще
                се използва за продукта.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
          Категоризация
        </p>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="category_id"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Категория <span className="text-sky-300">*</span>
            </label>

            <select
              id="category_id"
              name="category_id"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={fieldClassName}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subcategory_id"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Подкатегория <span className="text-sky-300">*</span>
            </label>

            <select
              key={categoryId}
              id="subcategory_id"
              name="subcategory_id"
              defaultValue={selectedSubcategoryId}
              className={fieldClassName}
              required
            >
              {availableSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
          Описание и цена
        </p>

        <div className="mt-7 grid gap-5">
          <div>
            <label
              htmlFor="short_description"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Кратко описание
            </label>

            <textarea
              id="short_description"
              name="short_description"
              rows={3}
              placeholder="Кратък текст за продуктовите карти."
              defaultValue={defaults.shortDescription}
              className={fieldClassName}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Пълно описание
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="По-подробно описание за продуктовата страница."
              defaultValue={defaults.description}
              className={fieldClassName}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-[1fr_180px_220px]">
            <div>
              <label
                htmlFor="price_amount"
                className="mb-2 block text-sm font-bold text-slate-300"
              >
                Цена <span className="text-sky-300">*</span>
              </label>

              <input
                id="price_amount"
                name="price_amount"
                inputMode="decimal"
                placeholder="150,00"
                defaultValue={defaults.priceAmount}
                className={fieldClassName}
                required
              />
            </div>

            <div>
              <label
                htmlFor="currency"
                className="mb-2 block text-sm font-bold text-slate-300"
              >
                Валута
              </label>

              <select
                id="currency"
                name="currency"
                defaultValue={defaults.currency}
                className={fieldClassName}
              >
                <option value="EUR">EUR</option>
                <option value="BGN">BGN</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="stock_status"
                className="mb-2 block text-sm font-bold text-slate-300"
              >
                Наличност
              </label>

              <select
                id="stock_status"
                name="stock_status"
                defaultValue={defaults.stockStatus}
                className={fieldClassName}
              >
                {stockStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
          Публикуване
        </p>

        <div className="mt-7 grid gap-5">
          <div>
            <label
              htmlFor="badges"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Етикети / badges
            </label>

            <input
              id="badges"
              name="badges"
              placeholder="YAMAHA, 4/4, Класическа китара"
              defaultValue={defaults.badges.join(", ")}
              className={fieldClassName}
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Разделяйте с comma: YAMAHA, 4/4, Класическа китара
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
              <input
                name="is_published"
                type="checkbox"
                defaultChecked={defaults.isPublished}
                className="mt-1 h-5 w-5 accent-sky-400"
              />
              <span>
                <span className="block font-black text-white">Публикуван</span>
                <span className="mt-1 block text-sm leading-6 text-slate-400">
                  Продуктът ще бъде видим за клиентите, когато публичният сайт
                  започне да чете от Supabase.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
              <input
                name="is_featured"
                type="checkbox"
                defaultChecked={defaults.isFeatured}
                className="mt-1 h-5 w-5 accent-sky-400"
              />
              <span>
                <span className="block font-black text-white">Избран продукт</span>
                <span className="mt-1 block text-sm leading-6 text-slate-400">
                  Подготвя продукта за секцията „Избрани продукти“.
                </span>
              </span>
            </label>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <a
          href="/admin/products"
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-center text-sm font-black text-white transition hover:bg-white/[0.09]"
        >
          Отказ
        </a>

        <button
          type="submit"
          className="cursor-pointer rounded-2xl bg-gradient-to-r from-sky-400 to-blue-700 px-7 py-4 text-center text-sm font-black text-white shadow-xl shadow-blue-950/40 transition hover:brightness-110"
        >
          {isEditMode ? "Запази промените" : "Създай продукта"}
        </button>
      </div>
    </form>
  );
}
