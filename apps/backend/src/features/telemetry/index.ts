import { NodeSdk } from '@effect/opentelemetry'
import {
  BatchSpanProcessor,
  type SpanExporter,
  type SpanProcessor
} from '@opentelemetry/sdk-trace-base'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { OpikExporter } from 'opik-vercel'
import { Opik } from 'opik'
import { Effect, Layer } from 'effect'
import { AppConfig } from '../config'

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG)

export const TelemetryLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const config = yield* AppConfig

    const opikClient = new Opik({
      apiKey: config.opik.apiKey,
      apiUrl: config.opik.apiUrl,
      projectName: config.opik.projectName,
      workspaceName: config.opik.workspaceName
    })

    return NodeSdk.layer(() => ({
      resource: { serviceName: 'norahealth' },
      spanProcessor: [
        // new BatchSpanProcessor(
        //   new OTLPTraceExporter({
        //     url: 'http://localhost:5080/api/default/v1/traces',
        //     headers: {
        //       Authorization: 'Basic ' + process.env.OTEL_API_KEY
        //     }
        //   })
        // ),
        new OpikExporter({
          client: opikClient
        }) as unknown as SpanProcessor
      ]
    }))
  })
)
