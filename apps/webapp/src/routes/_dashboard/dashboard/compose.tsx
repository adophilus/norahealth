import { createFileRoute } from "@tanstack/react-router";
import ComposeModule from "@/components/compose-module";

export const Route = createFileRoute("/_dashboard/dashboard/compose")({
	component: ComposeDashboardPage,
});

function ComposeDashboardPage() {
	return <ComposeModule />;
}
