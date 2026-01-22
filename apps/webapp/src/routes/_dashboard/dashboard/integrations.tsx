import { createFileRoute } from "@tanstack/react-router";
import { IntegrationManager } from "@/features/integration/manager";

export const Route = createFileRoute("/_dashboard/dashboard/integrations")({
	component: IntegrationsDashboardPage,
});

function IntegrationsDashboardPage() {
	return <IntegrationManager />;
}
