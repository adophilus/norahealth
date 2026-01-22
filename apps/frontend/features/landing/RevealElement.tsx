"use client";
import { useWindowSize } from "@/utils";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { useEffect, useRef } from "react";

export default function RevealElement({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const revealContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width === 0) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      if (!revealContainerRef.current || width === 0) return;
      const q = gsap.utils.selector(revealContainerRef.current);
      const revealElementContainer = q(".reveal-element-container");

      gsap.to(revealElementContainer, {
        duration: 0.4,
        translateY: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: revealContainerRef.current,
          start: `top +=${width > 1024 ? "80%" : "90%"}%`,
        },
      });
    });

    return () => ctx.revert();
  }, [width]);

  return (
    <div className={className} ref={revealContainerRef}>
      <div className="reveal-element-container will-change-transform translate-z-0 translate-y-1/2 opacity-0">
        {children}
      </div>
    </div>
  );
}
