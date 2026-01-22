import { IntegrationsGridLoader } from './loader'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { IntegrationsErrorFallback } from './error-fallback'
import { IntegrationsGridContent } from './content'

export const IntegrationsGrid = () => {
  console.log('Here?')
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={(props) => <IntegrationsErrorFallback {...props} />}
        >
          <Suspense fallback={<IntegrationsGridLoader />}>
            <IntegrationsGridContent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
