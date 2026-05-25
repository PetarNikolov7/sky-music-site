"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const whatsappNumber = "359884211761";
const messengerUrl = "https://m.me/skymusicbg";
const openChatEventName = "sky-music-open-contact-chat";

type ChatEventDetail = {
  productName?: string;
};

function makeWhatsappLink(productName: string | null) {
  const message = productName
    ? `Здравейте, имам въпрос относно ${productName}. Моля за повече информация.`
    : "Здравейте, имам въпрос относно продуктите на SKY MUSIC BG.";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function FloatingContactChat() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [productName, setProductName] = useState<string | null>(null);

  const whatsappLink = useMemo(
    () => makeWhatsappLink(productName),
    [productName],
  );

  useEffect(() => {
    setPanelOpen(false);
    setProductName(null);
  }, [pathname]);

  useEffect(() => {
    function handleOpenChat(event: Event) {
      const customEvent = event as CustomEvent<ChatEventDetail>;
      const requestedProduct =
        typeof customEvent.detail?.productName === "string"
          ? customEvent.detail.productName.trim()
          : "";

      setProductName(requestedProduct || null);
      setPanelOpen(true);
    }

    window.addEventListener(openChatEventName, handleOpenChat);

    return () => {
      window.removeEventListener(openChatEventName, handleOpenChat);
    };
  }, []);

  useEffect(() => {
    if (!panelOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPanelOpen(false);
        setProductName(null);
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (containerRef.current && !containerRef.current.contains(target)) {
        setPanelOpen(false);
        setProductName(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [panelOpen]);

  function togglePanel() {
    if (panelOpen) {
      setPanelOpen(false);
      setProductName(null);
      return;
    }

    setProductName(null);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setProductName(null);
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-4 sm:bottom-7 sm:right-7"
    >
      {panelOpen && (
        <div className="w-[min(340px,calc(100vw-2.5rem))] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#090e18] shadow-2xl shadow-black/60">
          <div className="border-b border-white/10 bg-gradient-to-br from-slate-900 via-blue-950/50 to-black p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-300">
                  SKY MUSIC BG
                </p>

                <h2 className="mt-3 text-xl font-black text-white">
                  Чат с нас
                </h2>
              </div>

              <button
                type="button"
                onClick={closePanel}
                aria-label="Затворете чата"
                className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <span className="absolute h-0.5 w-4 rotate-45 bg-white" />
                <span className="absolute h-0.5 w-4 -rotate-45 bg-white" />
              </button>
            </div>

            {productName ? (
              <div className="mt-4 rounded-xl border border-sky-400/20 bg-sky-400/10 p-3">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-300">
                  Запитване за продукт
                </p>

                <p className="mt-2 text-sm font-bold leading-5 text-white">
                  {productName}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Изберете удобен начин за директна връзка с нас.
              </p>
            )}
          </div>

          <div className="grid gap-3 p-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              onClick={closePanel}
              className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#25D366] px-5 py-4 text-sm font-black text-white transition hover:brightness-105"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                  ◔
                </span>
                WhatsApp
              </span>

              <span>→</span>
            </a>

            <a
              href={messengerUrl}
              target="_blank"
              rel="noreferrer"
              onClick={closePanel}
              className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#168AFF] px-5 py-4 text-sm font-black text-white transition hover:brightness-110"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                  ✦
                </span>
                Messenger
              </span>

              <span>→</span>
            </a>
          </div>

          <div className="border-t border-white/10 px-5 py-4">
            <p className="text-xs leading-5 text-slate-400">
              За поръчка използвайте формата „Поръчка / доставка“ на сайта.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={togglePanel}
        aria-label={panelOpen ? "Затворете чата" : "Отворете чата"}
        aria-expanded={panelOpen}
        className="group flex cursor-pointer items-center gap-3 rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-4 py-3.5 text-white shadow-2xl shadow-blue-950/60 transition hover:scale-[1.03] sm:px-5"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl">
          💬
        </span>

        <span className="hidden pr-1 text-sm font-black sm:block">
          Чат с нас
        </span>
      </button>
    </div>
  );
}