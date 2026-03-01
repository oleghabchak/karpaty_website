"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Providers } from "@/app/providers";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="isolate">
        <Header />
        {children}
        <Footer />
      </div>
      <ScrollToTop />
    </Providers>
  );
}
