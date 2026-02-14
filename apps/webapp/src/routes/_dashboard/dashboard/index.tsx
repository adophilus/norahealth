import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react';
import { UserSnapshot, mockUserData } from './../../../components/dashboard/UserSnapshot';
import { WorkoutCard, mockWorkoutData, mockNoWorkout } from './../../../components/dashboard/WorkoutCard';
import { NextSessionCard, mockTodaySession, mockNoSession } from './../../../components/dashboard/Nextsessioncard';
import { MealPlanCard, mockMealPlan, mockNoMealPlan } from './../../../components/dashboard/MealPlanCard';
import { ProgressSummary, mockProgressMetrics } from './../../../components/dashboard/ProgressSummary';
import { AiCoachMessage, mockMotivationMessage } from './../../../components/dashboard/AiCoachMessage';
import './../../../styles/overview.css';


export const OverviewPageComplete: React.FC = () => {
	// State toggles for demo purposes
	const [hasWorkout, setHasWorkout] = useState(true);
	const [hasSession, setHasSession] = useState(true);
	const [hasMealPlan, setHasMealPlan] = useState(true);

	// Handlers (in production, these call your API)
	const handleGenerateWorkout = () => {
		console.log('🤖 Generating AI workout...');
		alert('AI Workout Generation\n\nWill call: POST /api/ai/generate-workout\n\nBased on:\n• User goals\n• Fitness level\n• Available equipment\n• Injury constraints');
	}

	const handleStartWorkout = (workoutId: string) => {
		console.log('▶️ Starting workout:', workoutId);
		alert(`Navigate to: /workout/${workoutId}/start`);
	}

	const handleStartSession = (sessionId: string) => {
		console.log('▶️ Starting session:', sessionId);
		alert(`Navigate to: /session/${sessionId}/start`);
	}

	const handleReschedule = () => {
		console.log('📅 Opening scheduler...');
		alert('Navigate to: /schedule/workouts');
	}

	const handleGenerateMealPlan = () => {
		console.log('🍽️ Generating AI meal plan...');
		alert('AI Meal Plan Generation\n\nWill call: POST /api/ai/generate-meal-plan\n\nBased on:\n• Calorie targets\n• Dietary preferences\n• Allergies\n• Macro goals');
	}

	const handleViewMealDetails = () => {
		console.log('📋 Viewing meal details...');
		alert('Navigate to: /nutrition/meal-plan');
	}

	const handleCoachAction = () => {
		console.log('💬 Coach action clicked');
		alert('Action based on message type');
	}

	return (
		<div className="fit-overview-page">
			<div className="fit-overview-container">

				{/* ═══ SECTION 1: USER SNAPSHOT ═══ */}
				<UserSnapshot user={mockUserData} />

				{/* ═══ SECTION 2: CURRENT WORKOUT ═══ */}
				<WorkoutCard
					workout={hasWorkout ? mockWorkoutData : mockNoWorkout}
					onGenerateWorkout={handleGenerateWorkout}
					onStartWorkout={handleStartWorkout}
				/>

				{/* ═══ SECTION 3: NEXT SESSION ═══ */}
				<NextSessionCard
					session={hasSession ? mockTodaySession : mockNoSession}
					onStartSession={handleStartSession}
					onReschedule={handleReschedule}
				/>

				{/* ═══ SECTION 4: MEAL PLAN ═══ */}
				<MealPlanCard
					mealPlan={hasMealPlan ? mockMealPlan : mockNoMealPlan}
					onGenerateMealPlan={handleGenerateMealPlan}
					onViewMealDetails={handleViewMealDetails}
				/>

				{/* ═══ SECTION 5: PROGRESS SUMMARY ═══ */}
				<ProgressSummary metrics={mockProgressMetrics} />

				{/* ═══ SECTION 6: AI COACH MESSAGE ═══ */}
				<AiCoachMessage
					message={mockMotivationMessage}
					onAction={handleCoachAction}
				/>

			</div>
		</div>
	)
};

export default OverviewPageComplete;


export const Route = createFileRoute("/_dashboard/dashboard/")({
	component: DashboardPage,
});

function DashboardPage() {
	// return <Navigate to="/dashboard/compose" />;
	// return <div>Dashboard Home</div>;
	return <OverviewPageComplete />;
}