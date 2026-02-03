import { Effect, Layer, Console } from "effect";
import { DepLayer, LoggerLive } from "@/bootstrap";
import { AppConfigLive, EnvLive } from "@/features/config";

const layer = DepLayer.pipe(
  Layer.provide(LoggerLive),
  Layer.provide(AppConfigLive),
  Layer.provide(EnvLive),
);

// @effect-diagnostics-next-line floatingEffect:off
Effect.gen(function* () {
  yield* Console.log("Hi");
}).pipe(Effect.provide(layer), Effect.runPromise);
