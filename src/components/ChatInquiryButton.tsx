"use client";

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

const openChatEventName = "sky-music-open-contact-chat";

type ChatInquiryButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick"
> & {
  productName?: string;
  children?: ReactNode;
};

export default function ChatInquiryButton({
  productName,
  children = "Запитване",
  className,
  ...buttonProps
}: ChatInquiryButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    window.dispatchEvent(
      new CustomEvent(openChatEventName, {
        detail: {
          productName,
        },
      }),
    );
  }

  return (
    <button
      {...buttonProps}
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}