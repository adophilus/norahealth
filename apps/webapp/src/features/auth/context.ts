import { User } from "@nora-health/domain";
import { createContext } from "react";
import { Schema } from "effect";

export const AuthenticatedContextData = Schema.Struct({
	status: Schema.Literal("authenticated"),
	user: User,
	token: Schema.String,
});

export type AuthenticatedContextData = typeof AuthenticatedContextData.Type;

export const UnauthenticatedContextData = Schema.Struct({
	status: Schema.Literal("unauthenticated"),
});

export type UnauthenticatedContextData = typeof UnauthenticatedContextData.Type;

export const ContextData = Schema.Union(
	AuthenticatedContextData,
	UnauthenticatedContextData,
);

export type ContextData = typeof ContextData.Type;

export type ContextFns = {
	set: (state: ContextData) => void;
};

export type Context = ContextData & ContextFns;

export const context = createContext<Context>(null as unknown as Context);
