import * as clientModule from "./client";

export namespace Api {
	export const $api = clientModule.$api;
	export const client = clientModule.client;
	export const catchNetworkError = clientModule.catchNetworkError;
}
