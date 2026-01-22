import * as ProviderModule from "./provider";
import * as GuardModule from "./guard";
import * as HooksModule from "./hooks";
import * as LibModule from "./lib";

export namespace Auth {
	export const Provider = ProviderModule.Provider;
	export const Guard = GuardModule.Guard;
	export const hooks = HooksModule;
	export const lib = LibModule;
}
