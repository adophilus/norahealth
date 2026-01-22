import { createFileRoute } from "@tanstack/react-router";
import AnalyticsDashboard from "@/components/analytics-dashboard";

export const Route = createFileRoute("/_dashboard/dashboard/analytics")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AnalyticsDashboard />;
}
