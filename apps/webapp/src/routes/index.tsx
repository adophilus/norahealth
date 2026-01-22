import { createFileRoute, Navigate } from "@tanstack/react-router";
import { sdk } from "@farcaster/miniapp-sdk";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	const { status, data } = useQuery({
		queryKey: ["isInMiniApp"],
		queryFn: () => sdk.isInMiniApp(),
	});

	if (status === "success") {
		if (data) return <Navigate to="/dashboard" />;
		return <Navigate to="/auth" />;
	}

	return null;
}
