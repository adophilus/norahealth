---
layout: false
---

<script setup>
import { env } from "../src/env.ts"
import '@scalar/api-reference/style.css'
import { ApiReference } from '@scalar/api-reference'
import { Api } from "@nora-health/api"
import { OpenApi } from "@effect/platform"

const capitalize = (val) => String(val).charAt(0).toUpperCase() + String(val).slice(1)

const spec = OpenApi.fromApi(Api)
const openapiJsonDocs = JSON.stringify(spec)

const configuration = {
  content: openapiJsonDocs,
  spec: {
    servers: [
      {
        url: env.VITE_SERVER_URL,
        description: capitalize(env.VITE_NODE_ENV)
      },
    ]
  },
}
</script>

<ApiReference 
  :configuration="configuration"
/>
