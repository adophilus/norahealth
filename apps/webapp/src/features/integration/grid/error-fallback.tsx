import type { FunctionComponent } from 'react'
import type { FallbackProps } from 'react-error-boundary'

export const IntegrationsErrorFallback: FunctionComponent<FallbackProps> = ({
  error
}) => (error instanceof Error ? error.message : 'Unknown error')
