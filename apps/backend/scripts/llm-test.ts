import { generateText } from 'ai'
import { createZhipu } from 'zhipu-ai-provider'

const zhipu = createZhipu({
  baseURL: 'https://api.z.ai/api/coding/paas/v4',
  apiKey: process.env.ZHIPU_API_KEY
})

const { text } = await generateText({
  model: zhipu('glm-4.5'),
  prompt: 'Tell me a dad joke'
})

console.log(text)
