import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/")({
	component: DashboardPage,
});

function DashboardPage() {
	return <Navigate to="/dashboard/compose" />;
}
