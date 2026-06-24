import type { GlobalPDFData } from "@/types/pdf";

declare global {
  interface Window {
    __PDF_DATA__?: GlobalPDFData;
  }
}

export {};