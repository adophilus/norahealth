import { createFileRoute } from '@tanstack/react-router'
import WorkoutPage from '@/components/workoutpage';

export const Route = createFileRoute('/_dashboard/dashboard/workouts')({
    component: RouteComponent,
})

function RouteComponent() {
    return <WorkoutPage />;
}
