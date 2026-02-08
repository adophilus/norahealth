import React from 'react';
import { ArrowRight, Check } from 'lucide-react'

interface CompletedWorkout {
    id: string;
    name: string;
    type: 'strength' | 'cardio' | 'hiit' | 'mobility' | 'yoga';
    completedAt: string;     // ISO date
    duration: number;        // actual duration in minutes
    exercisesCompleted: number;
    totalExercises: number;
    caloriesBurned?: number;
}

interface WorkoutHistoryListProps {
    workouts: CompletedWorkout[];
    onSelectWorkout?: (workoutId: string) => void;
}

interface WorkoutHistoryItemProps {
    workout: CompletedWorkout;
    onClick?: (workoutId: string) => void;
}

// ───────────────────────────────────────────────────────────────────────────
// HISTORY LIST (Container)
// ───────────────────────────────────────────────────────────────────────────

export const WorkoutHistoryList: React.FC<WorkoutHistoryListProps> = ({
    workouts,
    onSelectWorkout
}) => {

    // Empty state
    if (workouts.length === 0) {
        return (
            <div className="fit-workout-history">
                <div className="fit-workout-history__header">
                    <h3 className="fit-workout-history__title">Workout History</h3>
                </div>

                <div className="fit-workout-history__empty">
                    <div className="fit-workout-history__empty-icon">📋</div>
                    <p className="fit-workout-history__empty-text">
                        Your completed workouts will appear here
                    </p>
                    <p className="fit-workout-history__empty-subtext">
                        Start your first workout to begin tracking your progress
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fit-workout-history">
            <div className="fit-workout-history__header">
                <h3 className="fit-workout-history__title">Workout History</h3>
                <span className="fit-workout-history__count">
                    {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'}
                </span>
            </div>

            <div className="fit-workout-history__list">
                {workouts.map((workout) => (
                    <WorkoutHistoryItem
                        key={workout.id}
                        workout={workout}
                        onClick={onSelectWorkout}
                    />
                ))}
            </div>
        </div>
    );
};

// ───────────────────────────────────────────────────────────────────────────
// HISTORY ITEM (Individual workout entry)
// ───────────────────────────────────────────────────────────────────────────

export const WorkoutHistoryItem: React.FC<WorkoutHistoryItemProps> = ({
    workout,
    onClick
}) => {

    const typeConfig: Record<CompletedWorkout['type'], { icon: string; color: string }> = {
        strength: { icon: '💪', color: '#3aab8e' },
        cardio: { icon: '🏃', color: '#e67e22' },
        hiit: { icon: '⚡', color: '#e74c3c' },
        mobility: { icon: '🧘', color: '#9b59b6' },
        yoga: { icon: '🕉️', color: '#16a085' },
    };

    const config = typeConfig[workout.type];

    // Format date
    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const dateLabel = formatDate(workout.completedAt);
    const isComplete = workout.exercisesCompleted === workout.totalExercises;

    return (
        <div
            className="fit-workout-history-item"
            onClick={() => onClick?.(workout.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.(workout.id)}
        >
            {/* Left: Icon */}
            <div
                className="fit-workout-history-item__icon"
                style={{ background: `${config.color}15`, color: config.color }}
            >
                {config.icon}
            </div>

            {/* Center: Info */}
            <div className="fit-workout-history-item__content">
                <div className="fit-workout-history-item__title">{workout.name}</div>

                <div className="fit-workout-history-item__meta">
                    <span className="fit-workout-history-item__date">{dateLabel}</span>
                    <span className="fit-workout-history-item__separator">•</span>
                    <span className="fit-workout-history-item__duration">{workout.duration} min</span>
                    <span className="fit-workout-history-item__separator">•</span>
                    <span className="fit-workout-history-item__exercises">
                        {workout.exercisesCompleted}/{workout.totalExercises} exercises
                    </span>
                </div>
            </div>

            {/* Right: Status + Arrow */}
            <div className="fit-workout-history-item__end">
                {isComplete && (
                    <span className="fit-workout-history-item__badge"><Check size={13} /></span>
                )}
                <span className="fit-workout-history-item__arrow"><ArrowRight size={16} /></span>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockWorkoutHistory: CompletedWorkout[] = [
    {
        id: 'wkt_001',
        name: 'Upper Body Strength',
        type: 'strength',
        completedAt: new Date(Date.now() - 86400000).toISOString(),  // Yesterday
        duration: 42,
        exercisesCompleted: 5,
        totalExercises: 5,
        caloriesBurned: 380,
    },
    {
        id: 'wkt_002',
        name: 'Morning HIIT',
        type: 'hiit',
        completedAt: new Date(Date.now() - 172800000).toISOString(),  // 2 days ago
        duration: 25,
        exercisesCompleted: 6,
        totalExercises: 6,
        caloriesBurned: 320,
    },
    {
        id: 'wkt_003',
        name: 'Full Body Strength',
        type: 'strength',
        completedAt: new Date(Date.now() - 259200000).toISOString(),  // 3 days ago
        duration: 48,
        exercisesCompleted: 7,
        totalExercises: 8,  // Incomplete
        caloriesBurned: 410,
    },
    {
        id: 'wkt_004',
        name: 'Yoga Flow',
        type: 'yoga',
        completedAt: new Date(Date.now() - 432000000).toISOString(),  // 5 days ago
        duration: 35,
        exercisesCompleted: 10,
        totalExercises: 10,
        caloriesBurned: 180,
    },
    {
        id: 'wkt_005',
        name: 'Cardio Run',
        type: 'cardio',
        completedAt: new Date(Date.now() - 518400000).toISOString(),  // 6 days ago
        duration: 30,
        exercisesCompleted: 1,
        totalExercises: 1,
        caloriesBurned: 290,
    },
];

export const mockEmptyHistory: CompletedWorkout[] = [];