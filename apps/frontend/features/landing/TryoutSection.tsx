import ButtonAction from "@/components/ButtonAction";
import Link from "next/link";
import React from "react";
import { landingPageData } from "@/data/landing.data";
import Title from "./Title";
import RevealElement from "./RevealElement";

export default function TryoutSection() {
  const { cta, tryout, appLink } = landingPageData;

  return (
    <section className="w-fit border border-neutral-200 rounded-2xl flex items-center justify-center flex-col gap-4 py-8 px-16">
      <Title title={tryout.title} />
      <RevealElement>
        <p>{tryout.desc}</p>
      </RevealElement>
      <RevealElement>
        <Link href={appLink} target="_blank">
          <ButtonAction btnType="primary" className="w-fit">
            {cta}
          </ButtonAction>
        </Link>
      </RevealElement>
    </section>
  );
}
