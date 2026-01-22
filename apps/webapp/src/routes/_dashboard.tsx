import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Auth } from "@/features/auth";

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<Auth.Guard fallback={<Navigate to="/auth" />}>
			<div className="flex h-screen bg-background flex-col md:flex-row">
				{/* Mobile Menu Button */}
				<div className="md:hidden flex items-center justify-between bg-card border-b border-border p-4">
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded flex items-center justify-center">
							<span className="text-xs font-bold text-white">O</span>
						</div>
						<h1 className="text-sm font-bold text-foreground">nora-health</h1>
					</div>
					<button
						type="button"
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 hover:bg-secondary rounded-lg transition"
					>
						{sidebarOpen ? (
							<X className="w-5 h-5" />
						) : (
							<Menu className="w-5 h-5" />
						)}
					</button>
				</div>

				{/* Sidebar */}
				<div
					className={`${
						sidebarOpen ? "fixed inset-0 z-40 md:static" : "hidden md:flex"
					} md:flex`}
				>
					<Sidebar />
				</div>

				{/* Mobile overlay when sidebar is open */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-black/50 md:hidden z-30"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Main Content */}
				<main className="flex-1 overflow-hidden">
					<div className="h-full overflow-auto bg-background p-8">
						<div className="max-w-5xl">
							<Outlet />
						</div>
					</div>
				</main>
			</div>
		</Auth.Guard>
	);
}
