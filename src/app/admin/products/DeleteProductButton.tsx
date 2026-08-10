"use client";

import { deleteProduct } from "./actions";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export default function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  function confirmDelete(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `Сигурни ли сте, че искате да изтриете „${productName}“? Това ще премахне продукта, снимките и характеристиките му. Действието не може да бъде отменено.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteProduct} onSubmit={confirmDelete}>
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="confirmation_name" value={productName} />

      <button
        type="submit"
        className="rounded-full border border-red-400/25 bg-red-400/[0.08] px-4 py-2 text-xs font-black text-red-200 transition hover:bg-red-400/[0.16]"
      >
        Изтрий продукта
      </button>
    </form>
  );
}
