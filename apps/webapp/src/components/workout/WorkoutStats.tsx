import React from 'react';

interface WorkoutStatsData {
    totalCompleted: number;
    weeklyCount: number;
    weeklyTarget: number;
    averageDuration: number;   // minutes
    currentStreak: number;      // consecutive days
    longestStreak: number;      // personal best
}

interface WorkoutStatsProps {
    stats: WorkoutStatsData;
}

export const WorkoutStats: React.FC<WorkoutStatsProps> = ({ stats }) => {

    const weeklyProgress = Math.min((stats.weeklyCount / stats.weeklyTarget) * 100, 100);
    const weeklyComplete = stats.weeklyCount >= stats.weeklyTarget;
    const isNewRecord = stats.currentStreak > 0 && stats.currentStreak === stats.longestStreak;

    return (
        <div className="fit-workout-stats">
            <div className="fit-workout-stats__header">
                <h3 className="fit-workout-stats__title">Your Stats</h3>
                <span className="fit-workout-stats__subtitle">Keep the momentum</span>
            </div>

            <div className="fit-workout-stats__grid">

                {/* Total workouts */}
                <div className="fit-workout-stats__item">
                    <div className="fit-workout-stats__icon">💪</div>
                    <div className="fit-workout-stats__value">{stats.totalCompleted}</div>
                    <div className="fit-workout-stats__label">Total Workouts</div>
                </div>

                {/* This week (highlighted) */}
                <div className="fit-workout-stats__item fit-workout-stats__item--highlight">
                    <div className="fit-workout-stats__icon">📅</div>
                    <div className="fit-workout-stats__value">
                        {stats.weeklyCount}
                        <span className="fit-workout-stats__value-sub">/{stats.weeklyTarget}</span>
                    </div>
                    <div className="fit-workout-stats__label">This Week</div>

                    <div className="fit-workout-stats__progress-mini">
                        <div
                            className="fit-workout-stats__progress-mini-fill"
                            style={{ width: `${weeklyProgress}%` }}
                        />
                    </div>

                    {weeklyComplete && (
                        <div className="fit-workout-stats__badge">🎯 Target hit!</div>
                    )}
                </div>

                {/* Average duration */}
                <div className="fit-workout-stats__item">
                    <div className="fit-workout-stats__icon">⏱️</div>
                    <div className="fit-workout-stats__value">
                        {stats.averageDuration}
                        <span className="fit-workout-stats__value-unit">min</span>
                    </div>
                    <div className="fit-workout-stats__label">Avg Duration</div>
                </div>

                {/* Current streak */}
                <div className="fit-workout-stats__item">
                    <div className="fit-workout-stats__icon">
                        {stats.currentStreak > 0 ? '🔥' : '💤'}
                    </div>
                    <div className="fit-workout-stats__value">
                        {stats.currentStreak}
                        <span className="fit-workout-stats__value-unit">days</span>
                    </div>
                    <div className="fit-workout-stats__label">Current Streak</div>

                    {isNewRecord && (
                        <div className="fit-workout-stats__badge fit-workout-stats__badge--gold">
                            🏆 New record!
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockWorkoutStats: WorkoutStatsData = {
    totalCompleted: 47,
    weeklyCount: 4,
    weeklyTarget: 5,
    averageDuration: 42,
    currentStreak: 4,
    longestStreak: 12,
};

export const mockWorkoutStatsComplete: WorkoutStatsData = {
    totalCompleted: 52,
    weeklyCount: 5,
    weeklyTarget: 5,
    averageDuration: 38,
    currentStreak: 7,
    longestStreak: 7,  // New personal record
};