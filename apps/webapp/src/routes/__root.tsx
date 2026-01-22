import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { sdk } from "@farcaster/miniapp-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Auth } from "@/features/auth";
// import { FarcasterAuthProvider } from '@/components/farcaster/farcaster-auth-provider'

// Metadata for Base mini-app
export const metadata = {
	other: {
		"base:app_id": "6961182c8a6eeb04b568d9ce",
	},
};

export const Route = createRootRoute({
	component: () => {
		sdk.actions.ready();

		const queryClient = new QueryClient();

		return (
			<QueryClientProvider client={queryClient}>
				<Auth.Provider>
					{/*<FarcasterAuthProvider>*/}
					<Outlet />
					<Toaster />
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							{
								name: "Tanstack Query",
								render: <ReactQueryDevtoolsPanel />,
							},
						]}
					/>
					{/*</FarcasterAuthProvider>*/}
				</Auth.Provider>
			</QueryClientProvider>
		);
	},
});
