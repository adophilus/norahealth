import { cn } from "@/lib/utils";
import { useWindowSize } from "@/utils";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText";
import { useEffect, useRef } from "react";

export default function Description({
  description,
  className,
}: {
  description: string;
  className?: string;
}) {
  const descContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width === 0) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      if (!descContainerRef.current) return;
      const q = gsap.utils.selector(descContainerRef.current);
      const descText = q(".description-sub-text");
      const splits = SplitText.create(descText, {
        type: "lines, words",
        tag: "span",
        wordsClass: "split-words-desc",
        linesClass: "split-lines-desc",
      });

      gsap.to(splits.words, {
        duration: 0.5,
        y: 0,
        stagger: 0.01,
        scrollTrigger: {
          trigger: descContainerRef.current,
          start: `top +=${width > 1024 ? "80%" : "90%"}%`,
          // markers: true,
        },
      });
    });

    return () => ctx.revert();
  }, [width]);

  return (
    <div ref={descContainerRef}>
      <p
        className={cn(
          "description-sub-text will-change-transform translate-z-0 text-center !text-gray-600 max-w-md text-xs",
          className,
        )}
      >
        {description}
      </p>
    </div>
  );
}
