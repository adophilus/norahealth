import { Schema } from 'effect'

export const WeatherCondition = Schema.Literal(
  'CLEAR',
  'CLOUDS',
  'RAIN',
  'SNOW',
  'STORM',
  'FOG',
  'WIND'
)

export default class WeatherData extends Schema.Class<WeatherData>(
  'WeatherData'
)({
  condition: WeatherCondition,
  temperature: Schema.Number,
  humidity: Schema.Number,
  wind_speed: Schema.Number,
  created_at: Schema.Number
}) {}
