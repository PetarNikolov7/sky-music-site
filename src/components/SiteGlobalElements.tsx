"use client";

import { usePathname } from "next/navigation";
import FloatingContactChat from "@/components/FloatingContactChat";
import SiteFooter from "@/components/SiteFooter";

export default function SiteGlobalElements() {
  const pathname = usePathname();

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <SiteFooter />
      <FloatingContactChat key={pathname} />
    </>
  );
}
