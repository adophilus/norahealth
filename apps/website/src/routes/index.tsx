import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../features/home/Header";
import { HeroSection } from "../features/home/HeroSection";
import { Why } from "../features/home/Why";
import { Abt } from "../features/home/Abt";
import { Review } from "../features/home/Review";
import { NoraTestimonials } from "@/features/home/Testimonial";
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
			<Why />
			<Abt />
			<TransparencySection />
			{/* <NoraTestimonials /> */}
			<Footer />
		</>
	)
}
