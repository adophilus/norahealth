import { Schema } from "effect";
import { isHex } from "viem";

export const HexString = Schema.TemplateLiteral("0x", Schema.String).pipe(
	Schema.filter((v) => (!isHex(v) ? "Invalid hex string" : undefined)),
);

export type HexString = typeof HexString.Type;
