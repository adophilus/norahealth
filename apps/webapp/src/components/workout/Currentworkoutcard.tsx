import React from 'react';

interface Exercise {
    id: string;
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;    // seconds for cardio/timed
    completed: boolean;
}

interface ActiveWorkout {
    id: string;
    name: string;
    type: 'strength' | 'cardio' | 'hiit' | 'mobility' | 'yoga';
    duration: number;         // total estimated minutes
    exercises: Exercise[];
    completedExercises: number;
    progress: number;         // 0-100 percentage
    startedAt: string;        // ISO date
    lastActivityAt: string;   // ISO date
}

interface CurrentWorkoutCardProps {
    workout: ActiveWorkout | null;
    onContinue?: (workoutId: string) => void;
    onRestart?: (workoutId: string) => void;
    onGenerateAI?: () => void;
}

export const CurrentWorkoutCard: React.FC<CurrentWorkoutCardProps> = ({
    workout,
    onContinue,
    onRestart,
    onGenerateAI,
}) => {

    // ── CASE 1: No active workout
    if (!workout) {
        return (
            <div className="fit-workout-current fit-workout-current--empty">
                <div className="fit-workout-current__empty-content">
                    <div className="fit-workout-current__empty-icon">
                        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                            <circle cx="36" cy="36" r="32" stroke="currentColor" strokeWidth="2.5" opacity="0.15" />
                            <path d="M36 20v32M20 36h32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="36" cy="36" r="5" fill="currentColor" />
                        </svg>
                    </div>

                    <h2 className="fit-workout-current__empty-title">No Active Workout</h2>

                    <p className="fit-workout-current__empty-text">
                        Ready to train? Let our AI Coach create a personalized workout based on your goals, fitness level, and available time.
                    </p>

                    <button
                        className="fit-workout-current__cta-ai"
                        onClick={onGenerateAI}
                    >
                        <span className="fit-workout-current__cta-icon">✨</span>
                        Generate Workout with AI Coach
                    </button>
                </div>
            </div>
        );
    }

    // ── CASE 2: Active workout exists
    const typeConfig: Record<ActiveWorkout['type'], { icon: string; color: string; label: string }> = {
        strength: { icon: '💪', color: '#3aab8e', label: 'Strength Training' },
        cardio: { icon: '🏃', color: '#e67e22', label: 'Cardio' },
        hiit: { icon: '⚡', color: '#e74c3c', label: 'HIIT' },
        mobility: { icon: '🧘', color: '#9b59b6', label: 'Mobility' },
        yoga: { icon: '🕉️', color: '#16a085', label: 'Yoga' },
    };

    const config = typeConfig[workout.type];

    // Time since last activity
    const getTimeSince = (isoDate: string): string => {
        const diffMs = Date.now() - new Date(isoDate).getTime();
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);

        if (hours > 24) return `${Math.floor(hours / 24)}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const lastActivity = getTimeSince(workout.lastActivityAt);
    const isPaused = Date.now() - new Date(workout.lastActivityAt).getTime() > 600000; // >10min

    return (
        <div className="fit-workout-current">
            {/* Header: Status badge */}
            <div className="fit-workout-current__header">
                <span className="fit-workout-current__label">Active Workout</span>
                <span className={`fit-workout-current__status${isPaused ? ' fit-workout-current__status--paused' : ''}`}>
                    {isPaused ? '⏸️ Paused' : '▶️ In Progress'}
                </span>
            </div>

            {/* Workout details */}
            <div className="fit-workout-current__body">
                {/* Type badge */}
                <div
                    className="fit-workout-current__type"
                    style={{
                        background: `${config.color}15`,
                        color: config.color,
                        borderColor: `${config.color}40`
                    }}
                >
                    <span className="fit-workout-current__type-icon">{config.icon}</span>
                    <span className="fit-workout-current__type-text">{config.label}</span>
                </div>

                {/* Title */}
                <h2 className="fit-workout-current__title">{workout.name}</h2>

                {/* Metadata */}
                <div className="fit-workout-current__meta">
                    <div className="fit-workout-current__meta-item">
                        <span className="fit-workout-current__meta-icon">⏱️</span>
                        <span>{workout.duration} min</span>
                    </div>
                    <div className="fit-workout-current__meta-item">
                        <span className="fit-workout-current__meta-icon">📋</span>
                        <span>{workout.exercises.length} exercises</span>
                    </div>
                    <div className="fit-workout-current__meta-item">
                        <span className="fit-workout-current__meta-icon">🕐</span>
                        <span>Last: {lastActivity}</span>
                    </div>
                </div>

                {/* Progress */}
                <div className="fit-workout-current__progress-section">
                    <div className="fit-workout-current__progress-info">
                        <span className="fit-workout-current__progress-label">
                            {workout.completedExercises}/{workout.exercises.length} exercises
                        </span>
                        <span className="fit-workout-current__progress-percent">
                            {Math.round(workout.progress)}%
                        </span>
                    </div>

                    <div className="fit-workout-current__progress-track">
                        <div
                            className="fit-workout-current__progress-fill"
                            style={{ width: `${workout.progress}%`, background: config.color }}
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="fit-workout-current__actions">
                <button
                    className="fit-workout-current__btn fit-workout-current__btn--primary"
                    onClick={() => onContinue?.(workout.id)}
                >
                    {isPaused ? 'Resume Workout' : 'Continue Workout'}
                    <span className="fit-workout-current__btn-arrow">→</span>
                </button>
                <button
                    className="fit-workout-current__btn fit-workout-current__btn--secondary"
                    onClick={() => onRestart?.(workout.id)}
                >
                    Restart from Beginning
                </button>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockActiveWorkout: ActiveWorkout = {
    id: 'wkt_active_001',
    name: 'Full Body Strength',
    type: 'strength',
    duration: 45,
    exercises: [
        { id: 'ex1', name: 'Squats', sets: 4, reps: 12, completed: true },
        { id: 'ex2', name: 'Bench Press', sets: 4, reps: 10, completed: true },
        { id: 'ex3', name: 'Deadlifts', sets: 3, reps: 8, completed: false },
        { id: 'ex4', name: 'Pull-ups', sets: 3, reps: 10, completed: false },
        { id: 'ex5', name: 'Overhead Press', sets: 3, reps: 10, completed: false },
    ],
    completedExercises: 2,
    progress: 40,
    startedAt: new Date(Date.now() - 3600000).toISOString(),      // 1h ago
    lastActivityAt: new Date(Date.now() - 900000).toISOString(),  // 15min ago (paused)
};

export const mockNoWorkout = null;