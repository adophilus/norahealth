import { AlertCircleIcon, CheckIcon } from "lucide-react";
import type { FunctionComponent } from "react";

export const IntegrationSecurityCard: FunctionComponent = () => (
	<div className="bg-card rounded-lg border border-primary/20 p-6 bg-primary/5 mb-8">
		<div className="flex gap-4">
			<AlertCircleIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
			<div>
				<h4 className="font-semibold text-foreground mb-2">
					Security & Privacy
				</h4>
				<ul className="text-sm text-muted-foreground space-y-2">
					<li className="flex items-start gap-2">
						<CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
						<span>All credentials are encrypted end-to-end</span>
					</li>
					<li className="flex items-start gap-2">
						<CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
						<span>We never store your passwords or authentication tokens</span>
					</li>
					<li className="flex items-start gap-2">
						<CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
						<span>OAuth tokens are automatically refreshed and rotated</span>
					</li>
					<li className="flex items-start gap-2">
						<CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
						<span>
							You can revoke access anytime without needing to change your
							passwords
						</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
);
