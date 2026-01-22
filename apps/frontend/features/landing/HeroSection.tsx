"use client";

import { useWindowSize } from "@/utils";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { useEffect, useRef, useState } from "react";
import ButtonAction from "@/components/ButtonAction";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { landingPageData } from "@/data/landing.data";

export default function HeroSection() {
  const { cta, hero, appLink } = landingPageData;

  const heroSectionRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowHero(true);
    }, 1500);
  }, []);

  useEffect(() => {
    if (width === 0 || !showHero) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      if (!heroSectionRef.current || width === 0 || !showHero) return;
      const q = gsap.utils.selector(heroSectionRef.current);
      const heroTitle = q(".hero-title");
      const heroDesc = q(".hero-desc");
      const heroCta = q(".hero-cta");
      const heroImg = q(".hero-img");
      const heroTitleSplits = SplitText.create(heroTitle, {
        type: "lines, words",
        tag: "span",
        charsClass: "split-chars-hero-title",
        wordsClass: "split-words-hero-title",
        linesClass: "split-lines-hero-title",
      });
      const descTitleSplits = SplitText.create(heroDesc, {
        type: "words, chars",
        tag: "span",
        charsClass: "split-chars-hero-desc",
        wordsClass: "split-words-hero-desc",
      });

      const tl = gsap.timeline();
      tl.to(heroSectionRef.current, {
        duration: 0.2,
        translateY: 0,
        opacity: 1,
        ease: "none",
      })
        .to(heroTitleSplits.words, {
          duration: 0.4,
          y: 0,
          stagger: 0.1,
          opacity: 1,
        })
        .to(
          descTitleSplits.chars,
          {
            duration: 0.4,
            y: 0,
            stagger: 0.01,
          },
          "-=0.6",
        )
        .to(
          heroCta,
          {
            duration: 0.6,
            translateY: 0,
            opacity: 1,
            ease: "none",
          },
          "-=0.75",
        )
        .to(
          heroImg,
          {
            duration: 0.6,
            translateY: 0,
            opacity: 1,
            ease: "none",
          },
          "-=0.6",
        );
    });

    return () => ctx.revert();
  }, [width, showHero]);

  return (
    <section
      ref={heroSectionRef}
      className="w-full min-h-screen flex items-center justify-center gap-6 flex-col opacity-0"
    >
      <div className="w-full flex items-center justify-center flex-col gap-4 relative z-[2]">
        <h1 className="hero-title font-bold text-4xl md:text-6xl text-center max-w-[50pc]">
          {hero.title}
        </h1>
        <p className="text-center text-gray-600 max-w-sm hero-desc">
          {hero.desc}
        </p>
        <Link
          href={appLink}
          target="_blank"
          className="hero-cta translate-y-16 opacity-0"
        >
          <ButtonAction btnType="primary" className="w-fit">
            {cta}
          </ButtonAction>
        </Link>
      </div>
      <div className="w-full flex items-center justify-center relative hero-img translate-y-40 opacity-0">
        <Image
          src={hero.img}
          alt="nora-health Dashboard"
          className="w-full max-w-72 relative z-[1]"
        />
      </div>
    </section>
  );
}
