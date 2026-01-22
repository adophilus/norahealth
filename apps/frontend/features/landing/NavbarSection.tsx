import ButtonAction from "@/components/ButtonAction";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { landingPageData } from "@/data/landing.data";

export default function NavbarSection() {
  const { cta, appLink } = landingPageData;

  return (
    <nav className="sticky top-4 left-0 w-full flex items-center justify-between z-50">
      <Link
        href="/"
        className="w-12 h-12 bg-[#212121] rounded-lg flex items-center justify-center overflow-hidden"
      >
        <Image
          src="/icon.png"
          width={100}
          height={100}
          alt="logo"
          className="w-full h-full object-cover"
        />
      </Link>
      <Link href={appLink} target="_blank">
        <ButtonAction btnType="primary" className="w-fit">
          {cta}
        </ButtonAction>
      </Link>
    </nav>
  );
}
