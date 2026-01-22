import type { FunctionComponent } from "react";

export const IntegrationDetailsCards: FunctionComponent = () => (
	<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
		<div className="bg-card rounded-lg border border-border p-6">
			<p className="text-muted-foreground text-sm mb-1">Connected Accounts</p>
			<p className="text-3xl font-bold text-foreground">
				0<span className="text-lg text-muted-foreground">/4</span>
			</p>
		</div>
		<div className="bg-card rounded-lg border border-border p-6">
			<p className="text-muted-foreground text-sm mb-1">Integration Health</p>
			<div className="flex items-center gap-2">
				<div className="w-3 h-3 rounded-full bg-green-500" />
				<p className="text-lg font-semibold text-foreground">
					All Systems Operational
				</p>
			</div>
		</div>
	</div>
);
