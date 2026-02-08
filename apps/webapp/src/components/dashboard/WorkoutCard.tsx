import React from 'react';
import { BicepsFlexed, Flame } from 'lucide-react';


interface Workout {
    id: string;
    name: string;
    type: 'strength' | 'cardio' | 'mobility' | 'hiit' | 'yoga';
    duration: number;
    exercises: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    lastUpdated: string;
}

interface WorkoutCardProps {
    workout: Workout | null;
    onGenerateWorkout?: () => void;
    onStartWorkout?: (workoutId: string) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
    workout,
    onGenerateWorkout,
    onStartWorkout
}) => {

    // ── CASE 1: No active workout → Show AI CTA
    if (!workout) {
        return (
            <div className="fit-card fit-workout-card fit-workout-card--empty">
                <div className="fit-workout-card__empty-state">
                    <div className="fit-workout-card__icon fit-workout-card__icon--ai">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
                            <path d="M24 14v20M14 24h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="24" cy="24" r="3" fill="currentColor" />
                        </svg>
                    </div>

                    <h3 className="fit-workout-card__empty-title">
                        No Active Workout
                    </h3>

                    <p className="fit-workout-card__empty-desc">
                        Let our AI Coach create a personalized workout plan based on your goals and fitness level.
                    </p>

                    <button
                        className="fit-workout-card__cta"
                        onClick={onGenerateWorkout}
                    >
                        <span className="fit-workout-card__cta-icon">✨</span>
                        Generate Workout with AI
                    </button>
                </div>
            </div>
        );
    }

    // ── CASE 2: Active workout exists → Show details
    const workoutTypeIcons: Record<Workout['type'], string> = {
        strength: '💪',
        cardio: '🏃',
        mobility: '🧘',
        hiit: '⚡',
        yoga: '🕉️',
    };

    const difficultyColors: Record<Workout['difficulty'], string> = {
        beginner: 'green',
        intermediate: 'orange',
        advanced: 'red',
    };

    return (
        <div className="fit-card fit-workout-card">
            {/* Header */}
            <div className="fit-workout-card__header">
                <span className="fit-workout-card__label">Current Workout</span>
                <span className={`fit-workout-card__badge fit-workout-card__badge--${difficultyColors[workout.difficulty]}`}>
                    {workout.difficulty}
                </span>
            </div>

            {/* Workout details */}
            <div className="fit-workout-card__body">
                <div className="fit-workout-card__icon">
                    <span className="fit-workout-card__type-emoji">
                        {workoutTypeIcons[workout.type]}
                    </span>
                </div>

                <h3 className="fit-workout-card__title">
                    {workout.name}
                </h3>

                <div className="fit-workout-card__meta">
                    <div className="fit-workout-card__meta-item">
                        <span className="fit-workout-card__meta-icon">⏱️</span>
                        <span className="fit-workout-card__meta-text">{workout.duration} min</span>
                    </div>
                    <div className="fit-workout-card__meta-item">
                        <span className="fit-workout-card__meta-icon">📋</span>
                        <span className="fit-workout-card__meta-text">{workout.exercises} exercises</span>
                    </div>
                    <div className="fit-workout-card__meta-item">
                        <span className="fit-workout-card__meta-icon">🔥</span>
                        <span className="fit-workout-card__meta-text">{workout.type}</span>
                    </div>
                </div>
            </div>

            {/* Action button */}
            <button
                className="fit-workout-card__action"
                onClick={() => onStartWorkout?.(workout.id)}
            >
                Start Workout
                <span className="fit-workout-card__action-arrow">→</span>
            </button>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA FOR TESTING
// ═══════════════════════════════════════════════════════════════════════════

export const mockWorkoutData: Workout = {
    id: 'workout_001',
    name: 'Full Body Strength',
    type: 'strength',
    duration: 45,
    exercises: 8,
    difficulty: 'intermediate',
    lastUpdated: new Date().toISOString(),
};

export const mockNoWorkout = null;