import { createFileRoute } from "@tanstack/react-router";
import SettingsPanel from "@/components/settings-panel";

export const Route = createFileRoute("/_dashboard/dashboard/settings")({
	component: SettingsDashbaordPage,
});

function SettingsDashbaordPage() {
	return <SettingsPanel />;
}
