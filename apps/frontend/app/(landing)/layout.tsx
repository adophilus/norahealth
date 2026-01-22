import { generateMetadata } from "@/data/generateMetadata.data";
import { viewport } from "@/data/viewport.data";
import { fonts } from "@/data/fonts.data";
import "@coinbase/onchainkit/styles.css";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ReactLenis } from "lenis/react";

export { generateMetadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-neutral-100 ${fonts}`}>
        <ReactLenis root />
        <Toaster richColors theme="light" />
        <div className="w-full mx-auto">{children}</div>
      </body>
    </html>
  );
}
