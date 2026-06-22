"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Providers } from "@/app/providers";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AuroraBackground
        showRadialGradient
        animationSpeed={15}
        className="pointer-events-none fixed inset-0 z-0 bg-[#FCFCFC] dark:bg-bg-color-dark"
        aria-hidden
      >
        <span className="sr-only" />
      </AuroraBackground>
      <div className="relative z-10 isolate">
        <Header />
        {children}
        <Footer />
      </div>
      <ScrollToTop />
    </Providers>
  );
}
