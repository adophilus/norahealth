import { Gauge, Dumbbell, Settings, Soup, LogOut } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";

export default function Sidebar() {
	const navItems = [
		{ link: "/dashboard/overview", label: "Overview", icon: Gauge },
		{ link: "/dashboard/workouts", label: "Workout", icon: Dumbbell },
		{ link: "/dashboard/mealplanner", label: "Meal Planner", icon: Soup },
		{ link: "/dashboard/settings", label: "Settings", icon: Settings },
	];

	return (
		<aside className="w-full md:w-64 bg-card border-r border-border flex flex-col h-full">
			{/* Header */}
			<div className="p-4 md:p-6 border-b border-border">
				<div className="flex items-center gap-2 mb-1">
					{/* <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded flex items-center justify-center">
						<span className="text-xs md:text-sm font-bold text-white">O</span>
					</div> */}
					<img src="/logo-black.png" alt="nora-health image" width={150} />
					{/* <h1 className="text-base md:text-xl font-bold text-foreground">
						nora-health
					</h1> */}
				</div>
				{/* <p className="text-xs text-muted-foreground">User Dashboard</p> */}
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-2 md:px-3 py-4 md:py-6 space-y-2">
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link key={item.link} to={item.link}>
							{({ isActive }) => (
								<button
									type="button"
									key={item.link}
									className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base font-medium ${isActive
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground hover:bg-secondary hover:text-foreground"
										}`}
								>
									<Icon className="w-5 h-5 flex-shrink-0" />
									<span>{item.label}</span>
								</button>
							)}
						</Link>
					);
				})}
			</nav>

			{/* Footer with User Profile and Logout */}
			<div className="p-3 md:p-6 border-t border-border space-y-3 md:space-y-4">
				<div className="flex items-center gap-3 p-2 md:p-3 bg-secondary rounded-lg">
					<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
						JD
					</div>
					<div className="flex-1 min-w-0 hidden md:block">
						<p className="text-sm font-medium text-foreground truncate">
							John Doe
						</p>
						<p className="text-xs text-muted-foreground truncate">
							john@example.com
						</p>
					</div>
				</div>

				<Link to="/auth">
					<button
						type="button"
						className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs md:text-sm font-medium transition-all active:scale-95"
					>
						<LogOut className="w-4 h-4 flex-shrink-0" />
						<span>Sign Out</span>
					</button>
				</Link>
			</div>
		</aside>
	);
}
