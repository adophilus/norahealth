import {
	createFetchClient,
	createTanstackQueryClient,
} from "@nora-health/api-client";
import { env } from "@/lib/env";

export const client = createFetchClient(env.VITE_SERVER_URL);
export const $api = createTanstackQueryClient(client);

export const catchNetworkError = <T extends (...args: any[]) => any>(
	fn: T,
): ReturnType<T> => {
	try {
		return fn();
	} catch (_) {
		throw new Error("Please check your internet connection");
	}
};
