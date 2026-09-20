// components/layout/ClientShell/ClientShell.tsx
"use client";

import { CartDrawer } from "@/components/layout/CartDrawer/CartDrawer";
import { ToastContainer } from "@/components/layout/ToastContainer/ToastContainer";

export function ClientShell() {
  return (
    <>
      <CartDrawer />
      <ToastContainer />
    </>
  );
}