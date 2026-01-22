"use client";

import { cn } from "@/lib/utils";
import { useWindowSize } from "@/utils";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { useEffect, useRef } from "react";

export default function Title({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width === 0) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      if (!titleContainerRef.current || width === 0) return;
      const q = gsap.utils.selector(titleContainerRef.current);
      const titleText = q(".section-title");
      const splits = SplitText.create(titleText, {
        type: "words, chars",
        tag: "span",
        charsClass: "split-chars",
        wordsClass: "split-words",
      });

      gsap.to(splits.chars, {
        duration: 0.4,
        y: 0,
        stagger: 0.02,
        scrollTrigger: {
          trigger: titleContainerRef.current,
          start: `top +=${width > 1024 ? "80%" : "90%"}%`,
          // markers: true,
        },
      });
    });

    return () => ctx.revert();
  }, [width]);

  return (
    <div className="" ref={titleContainerRef}>
      <h1
        className={cn(
          "font-bold text-4xl md:text-5xl text-center will-change-transform translate-z-0 section-title",
          className,
        )}
      >
        {title}
      </h1>
    </div>
  );
}
