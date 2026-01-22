"use client";

import React from "react";
import HeroSection from "@/features/landing/HeroSection";
import AboutSection from "@/features/landing/AboutSection";
import TryoutSection from "@/features/landing/TryoutSection";
import NavbarSection from "@/features/landing/NavbarSection";

export default function Landing() {
  return (
    <main className="text-black p-4 md:p-8 w-full flex items-center justify-center flex-col gap-16 max-w-7xl mx-auto">
      <NavbarSection />
      <HeroSection />
      <AboutSection />
      <TryoutSection />
      <footer>
        © {new Date().getFullYear()} nora-health. All rights reserved.
      </footer>
    </main>
  );
}
