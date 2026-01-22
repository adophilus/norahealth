import { Api } from '@nora-health/api'
import { OpenApi } from '@effect/platform'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import build, { astToString } from 'openapi-typescript'

const spec = OpenApi.fromApi(Api)
const openapiJsonDocs = JSON.stringify(spec)
const ast = await build(openapiJsonDocs)
const res = astToString(ast)

if (!existsSync('./build')) {
  await mkdir('./build')
}

await writeFile('./build/types.ts', res, { encoding: 'utf8' })
console.log('✅ Build successful')
