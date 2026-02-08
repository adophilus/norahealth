import React, { useState } from 'react';
import { WorkoutPageLayout } from './workout/WorkoutPageLayout';
import { CurrentWorkoutCard, mockActiveWorkout, mockNoWorkout } from './workout/Currentworkoutcard';
import { WorkoutStats, mockWorkoutStats } from './workout/WorkoutStats';
import { WorkoutHistoryList, mockWorkoutHistory, mockEmptyHistory } from './workout/WorkoutHistoryList';
import { AiCoachPanel } from './workout/AiCoachPanel';


export const WorkoutPage: React.FC = () => {
    const [hasActiveWorkout, setHasActiveWorkout] = useState(true);
    const [hasHistory, setHasHistory] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleContinue = (workoutId: string) => {
        console.log('▶️ Continue workout:', workoutId);
        alert(`Navigate to: /workout/${workoutId}/continue`);
    };

    const handleRestart = (workoutId: string) => {
        console.log('🔄 Restart workout:', workoutId);
        if (confirm('Are you sure you want to restart this workout? All progress will be lost.')) {
            alert(`Restarting workout: ${workoutId}`);
        }
    };

    const handleGenerateAI = () => {
        console.log('✨ Generate AI workout');
        alert('AI Workout Generation\n\nWill call: POST /api/ai/generate-workout\n\nBased on:\n• User goals\n• Fitness level\n• Available equipment\n• Time available\n• Recovery status');
    };

    const handleSelectWorkout = (workoutId: string) => {
        console.log('📋 View workout details:', workoutId);
        alert(`Navigate to: /workout/${workoutId}/details\n\nShow:\n• Full exercise list\n• Sets/reps/weights used\n• Duration breakdown\n• Calories burned\n• Notes\n• Option to repeat workout`);
    };

    const handleAiMessage = async (message: string) => {
        console.log('💬 AI message:', message);
        setIsAiLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        alert(`AI Coach Response\n\nPOST /api/ai/coach/message\n\nBody: { message: "${message}" }\n\nResponse would stream back:\n• Personalized advice\n• Workout recommendations\n• Form tips\n• Recovery suggestions`);

        setIsAiLoading(false);
    };

    return (
        <WorkoutPageLayout>

            {/* ═══ SECTION 1: CURRENT WORKOUT ═══ */}
            <CurrentWorkoutCard
                workout={hasActiveWorkout ? mockActiveWorkout : mockNoWorkout}
                onContinue={handleContinue}
                onRestart={handleRestart}
                onGenerateAI={handleGenerateAI}
            />

            {/* ═══ SECTION 2: STATS SUMMARY ═══ */}
            <WorkoutStats stats={mockWorkoutStats} />

            {/* ═══ SECTION 3: WORKOUT HISTORY ═══ */}
            <WorkoutHistoryList
                workouts={hasHistory ? mockWorkoutHistory : mockEmptyHistory}
                onSelectWorkout={handleSelectWorkout}
            />

            {/* ═══ SECTION 4: AI COACH PANEL ═══ */}
            <AiCoachPanel
                onSendMessage={handleAiMessage}
                quickActions={[
                    "Recommend today's workout",
                    'Make my workout easier',
                    'Suggest a rest day plan',
                ]}
                isLoading={isAiLoading}
            />

        </WorkoutPageLayout>
    );
};

export default WorkoutPage;