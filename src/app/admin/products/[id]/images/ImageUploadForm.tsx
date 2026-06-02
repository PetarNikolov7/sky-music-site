"use client";

import { useState } from "react";
import { uploadProductImage } from "./actions";

type ImageUploadFormProps = {
  productId: string;
  productName: string;
  nextSortOrder: number;
  hasImages: boolean;
};

const fieldClassName =
  "w-full rounded-2xl border border-white/10 bg-[#111827] px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-sky-400";

export default function ImageUploadForm({
  productId,
  productName,
  nextSortOrder,
  hasImages,
}: ImageUploadFormProps) {
  const [altText, setAltText] = useState(productName);

  return (
    <form
      action={uploadProductImage.bind(null, productId)}
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
    >
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
          Качване
        </p>

        <h2 className="mt-3 text-3xl font-black">Добави снимка</h2>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          Позволени формати: JPEG, PNG и WebP. Максимален размер: 10 MB.
        </p>
      </div>

      <div className="mt-7 grid gap-5">
        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-bold text-slate-300"
          >
            Файл <span className="text-sky-300">*</span>
          </label>

          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="w-full cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/[0.04] px-5 py-5 text-sm text-slate-300 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-white file:px-5 file:py-3 file:text-sm file:font-black file:text-black hover:bg-white/[0.06]"
          />
        </div>

        <div>
          <label
            htmlFor="alt_text"
            className="mb-2 block text-sm font-bold text-slate-300"
          >
            Описание на снимката
          </label>

          <input
            id="alt_text"
            name="alt_text"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Описание за снимката"
            className={fieldClassName}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="sort_order"
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Ред в галерията
            </label>

            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min="0"
              defaultValue={nextSortOrder}
              className={fieldClassName}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-bold text-slate-200">
            <input
              type="checkbox"
              name="is_primary"
              defaultChecked={!hasImages}
              className="h-5 w-5 accent-sky-400"
            />
            Задай като основна снимка
          </label>
        </div>

        <button
          type="submit"
          className="cursor-pointer rounded-2xl bg-gradient-to-r from-sky-400 to-blue-700 px-6 py-4 text-center font-black text-white shadow-xl shadow-blue-950/30 transition hover:brightness-110"
        >
          Качи снимката
        </button>
      </div>
    </form>
  );
}
