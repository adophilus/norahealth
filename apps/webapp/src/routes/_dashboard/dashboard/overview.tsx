import { createFileRoute } from '@tanstack/react-router'
import { OverviewPageComplete } from './index'

export const Route = createFileRoute('/_dashboard/dashboard/overview')({
    component: RouteComponent,
})

function RouteComponent() {
    //   return <div>Hello "/_dashboard/dashboard/overview"!</div>
    return <OverviewPageComplete />;
}
