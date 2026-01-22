"use client";

import { useWindowSize } from "@/utils";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { useEffect, useRef } from "react";

type LandingStatCardProps = {
  title: string;
  value: number;
  currency?: string;
};

export default function LandingStatCard({
  title,
  value,
  currency,
}: LandingStatCardProps) {
  const landingStatContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width === 0) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      if (!landingStatContainerRef.current || width === 0) return;
      const q = gsap.utils.selector(landingStatContainerRef.current);
      const revealElementContainer = q(".reveal-element-container");
      const span = q("span");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: landingStatContainerRef.current,
          start: `top +=${width > 1024 ? "80%" : "90%"}%`,
        },
      });
      let loaderValue = { progress: 0 };

      tl.to(revealElementContainer, {
        duration: 0.4,
        translateY: 0,
        opacity: 1,
      }).to(
        loaderValue,
        {
          progress: value,
          duration: 2,
          ease: "power1.out",
          onUpdate: () => {
            span[0].textContent = `${Math.round(loaderValue.progress)}`;
          },
        },
        "<",
      );
    });

    return () => ctx.revert();
  }, [width]);

  return (
    <div ref={landingStatContainerRef}>
      <div className="reveal-element-container will-change-transform translate-z-0 translate-y-1/2 opacity-0">
        <div className="w-full md:w-48 lg:w-56 xl:w-60 border border-neutral-200 rounded-2xl flex items-center justify-center flex-col gap-1 aspect-square p-4">
          <p className="text-3xl md:text-5xl font-medium">
            {currency}
            <span>0</span>+
          </p>
          <p className="text-sm text-center capitalize md:text-base text-neutral-600">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
