import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../features/home/Header";
import { HeroSection } from "../features/home/HeroSection";
import { TransparencySection } from "../features/home/TransparencySection";
import { Footer } from "../features/home/Footer";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	return (
		<>
			<Header />
			<HeroSection />
			<TransparencySection />
			<Footer />
		</>
	)
}
