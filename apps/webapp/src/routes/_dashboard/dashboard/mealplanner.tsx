import { createFileRoute } from '@tanstack/react-router'
import { MealPlanner } from '@/components/mealplanner';

export const Route = createFileRoute('/_dashboard/dashboard/mealplanner')({
    component: RouteComponent,
})

function RouteComponent() {
    return <MealPlanner />;
}
