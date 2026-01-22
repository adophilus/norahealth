import { exhaustive } from "exhaustive";
import { Api } from "../api";
import {
	AuthenticatedContextData,
	type ContextData,
	UnauthenticatedContextData,
} from "./context";
import { Schema } from "effect";

const STORAGE_KEY = "nora-health-auth";

export const persistAuth = (data: ContextData) => {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const retrieveAuth = async (): Promise<ContextData> => {
	const rawData = window.localStorage.getItem(STORAGE_KEY);

	if (!rawData)
		return UnauthenticatedContextData.make({ status: "unauthenticated" });

	const s = Schema.standardSchemaV1(AuthenticatedContextData);

	try {
		const res = await s["~standard"].validate(JSON.parse(rawData));
		if (res.issues) {
			return UnauthenticatedContextData.make({ status: "unauthenticated" });
		}

		return AuthenticatedContextData.make(res.value);
	} catch (err) {
		console.warn(`Failed to retrieve auth: ${err}`);
		return UnauthenticatedContextData.make({ status: "unauthenticated" });
	}
};

export const sendSignInOtp = (email: string) =>
	Api.catchNetworkError(async () => {
		const res = await Api.client.request(
			"post",
			"/auth/sign-in/strategy/email",
			{
				body: {
					email,
				},
			},
		);

		if (res.error) {
			exhaustive.tag(res.error, "_tag", {
				HttpApiDecodeError: (error) => {
					throw new Error(error.message || "Sorry an error occurred");
				},
				UnexpectedError: (error) => {
					throw new Error(error.message || "Sorry an error occurred");
				},
				TokenNotExpiredError: () => {
					throw new Error("Token not expired");
				},
				BadRequestError: () => {
					throw new Error("Invalid request");
				},
			});
		}
	});

export const verifyOtp = (email: string, otp: string) =>
	Api.catchNetworkError(async () => {
		const res = await Api.client.request("post", "/auth/verification", {
			body: {
				email,
				otp,
			},
		});

		if (res.error) {
			exhaustive.tag(res.error, "_tag", {
				UnexpectedError: (error) => {
					throw new Error(error.message || "Sorry an error occurred");
				},
				HttpApiDecodeError: (error) => {
					throw new Error(error.message || "Sorry an error occurred");
				},
				InvalidOrExpiredTokenError: () => {
					throw new Error("Invalid or expired token");
				},
			});
			throw new Error("unreachable");
		}

		return res.data;
	});

export const getSignInWithFarcasterUrl = () =>
	Api.catchNetworkError(async () => {
		const res = await Api.client.request(
			"get",
			"/auth/sign-in/strategy/farcaster/url/initiate",
		);

		if (res.error) {
			exhaustive.tag(res.error, "_tag", {
				HttpApiDecodeError: (error) => {
					throw new Error(error.message || "Failed to initiate SIWF");
				},
				UnexpectedError: (error) => {
					throw new Error(error.message || "Failed to initiate SIWF");
				},
				BadRequestError: () => {
					throw new Error("Invalid request");
				},
			});

			throw new Error("unreachable");
		}

		return res.data;
	});

export const verifySignInWithFarcasterUrl = (token: string) =>
	Api.catchNetworkError(async () => {
		const res = await Api.client.request(
			"post",
			"/auth/sign-in/strategy/farcaster/url/verify",
			{
				body: { token },
			},
		);

		if (res.error) {
			exhaustive.tag(res.error, "_tag", {
				HttpApiDecodeError: (error) => {
					throw new Error(error.message || "Failed to initiate SIWF");
				},
				UnexpectedError: (error) => {
					throw new Error(error.message || "Failed to initiate SIWF");
				},
				BadRequestError: () => {
					throw new Error("Invalid request");
				},
				InvalidOrExpiredTokenError: () => {
					throw new Error("Auth failed");
				},
			});

			throw new Error("unreachable");
		}

		return res.data;
	});
