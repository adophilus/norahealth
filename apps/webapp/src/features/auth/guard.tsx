import type { FunctionComponent, ReactNode } from "react";
import { useAuth } from "./hooks";

export const Guard: FunctionComponent<{
	fallback: ReactNode;
	children: ReactNode;
}> = ({ fallback, children }) => {
	const { status } = useAuth();

	if (status !== "authenticated") return fallback;

	return children;
};
