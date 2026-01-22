import React from "react";
import { landingPageData } from "@/data/landing.data";
import Title from "./Title";
import Description from "./Description";
import RevealElement from "./RevealElement";
import LandingStatCard from "./LandingStatCard";

export default function AboutSection() {
  const { about } = landingPageData;

  return (
    <section className="py-4 flex items-center justify-center flex-col gap-6 w-full">
      <div className="flex items-center justify-center flex-col gap-4">
        <Title title={about.title} />
        <Description description={about.desc} />
        {/* <p className="max-w-md text-center">{about.desc}</p> */}
      </div>

      <div className="w-full grid grid-cols-2 md:flex items-center justify-center gap-4">
        {about.stats.map((stat, i) => (
          <LandingStatCard key={i} {...stat} />
        ))}
      </div>
    </section>
  );
}
