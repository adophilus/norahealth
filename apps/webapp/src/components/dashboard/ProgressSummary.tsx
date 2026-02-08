import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS SUMMARY COMPONENT
// 
// Purpose: Visual snapshot of weekly progress metrics
// Psychology: Evidence of improvement = motivation fuel (dopamine hit)
// Data flow: Will pull from /api/user/progress/weekly
// Features: Trend indicators, simple bar charts, comparison to last week
// ═══════════════════════════════════════════════════════════════════════════

interface ProgressMetrics {
    // Weight tracking
    currentWeight: number;     // kg or lbs
    weightChange: number;      // +/- from last week (negative = loss)
    weightUnit: 'kg' | 'lbs';

    // Activity tracking
    workoutsCompleted: number;
    workoutsTarget: number;

    // Calorie tracking
    caloriesBurned: number;
    caloriesTarget: number;

    // Streak (optional - can also show here)
    currentStreak?: number;
}

interface ProgressSummaryProps {
    metrics: ProgressMetrics;
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({ metrics }) => {

    // Calculate percentages
    const workoutProgress = (metrics.workoutsCompleted / metrics.workoutsTarget) * 100;
    const calorieProgress = (metrics.caloriesBurned / metrics.caloriesTarget) * 100;

    // Weight change indicator
    const weightTrend = metrics.weightChange < 0 ? 'down' : metrics.weightChange > 0 ? 'up' : 'stable';
    const weightChangeAbs = Math.abs(metrics.weightChange);

    // Format weight display
    const formatWeight = (value: number) => value.toFixed(1);

    return (
        <div className="fit-card fit-progress">
            {/* Header */}
            <div className="fit-progress__header">
                <h3 className="fit-progress__title">Weekly Progress</h3>
                <span className="fit-progress__period">Last 7 days</span>
            </div>

            {/* Metrics grid */}
            <div className="fit-progress__metrics">

                {/* Weight metric */}
                <div className="fit-progress__metric">
                    <div className="fit-progress__metric-header">
                        <span className="fit-progress__metric-icon">⚖️</span>
                        <span className="fit-progress__metric-label">Weight</span>
                    </div>

                    <div className="fit-progress__metric-value">
                        {formatWeight(metrics.currentWeight)}
                        <span className="fit-progress__metric-unit">{metrics.weightUnit}</span>
                    </div>

                    <div className={`fit-progress__metric-change fit-progress__metric-change--${weightTrend}`}>
                        {weightTrend === 'down' && '↓'}
                        {weightTrend === 'up' && '↑'}
                        {weightTrend === 'stable' && '→'}
                        {weightTrend !== 'stable' && (
                            <span>
                                {formatWeight(weightChangeAbs)} {metrics.weightUnit}
                            </span>
                        )}
                        {weightTrend === 'stable' && <span>No change</span>}
                    </div>
                </div>

                {/* Workouts completed metric */}
                <div className="fit-progress__metric">
                    <div className="fit-progress__metric-header">
                        <span className="fit-progress__metric-icon">💪</span>
                        <span className="fit-progress__metric-label">Workouts</span>
                    </div>

                    <div className="fit-progress__metric-value">
                        {metrics.workoutsCompleted}
                        <span className="fit-progress__metric-unit">/ {metrics.workoutsTarget}</span>
                    </div>

                    <div className="fit-progress__metric-bar">
                        <div
                            className="fit-progress__metric-bar-fill fit-progress__metric-bar-fill--workouts"
                            style={{ width: `${Math.min(workoutProgress, 100)}%` }}
                        />
                    </div>

                    <div className="fit-progress__metric-subtext">
                        {workoutProgress >= 100
                            ? '🎯 Target achieved!'
                            : `${Math.round(workoutProgress)}% complete`
                        }
                    </div>
                </div>

                {/* Calories burned metric */}
                <div className="fit-progress__metric">
                    <div className="fit-progress__metric-header">
                        <span className="fit-progress__metric-icon">🔥</span>
                        <span className="fit-progress__metric-label">Calories Burned</span>
                    </div>

                    <div className="fit-progress__metric-value">
                        {metrics.caloriesBurned.toLocaleString()}
                        <span className="fit-progress__metric-unit">cal</span>
                    </div>

                    <div className="fit-progress__metric-bar">
                        <div
                            className="fit-progress__metric-bar-fill fit-progress__metric-bar-fill--calories"
                            style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                        />
                    </div>

                    <div className="fit-progress__metric-subtext">
                        Goal: {metrics.caloriesTarget.toLocaleString()} cal
                    </div>
                </div>

            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA FOR TESTING
// ═══════════════════════════════════════════════════════════════════════════

export const mockProgressMetrics: ProgressMetrics = {
    currentWeight: 72.5,
    weightChange: -0.8,      // Lost 0.8 kg
    weightUnit: 'kg',
    workoutsCompleted: 4,
    workoutsTarget: 5,
    caloriesBurned: 2100,
    caloriesTarget: 2500,
    currentStreak: 4,
};

// Alternative: user gained weight
export const mockProgressMetricsGain: ProgressMetrics = {
    currentWeight: 78.2,
    weightChange: 1.2,       // Gained 1.2 kg (muscle building scenario)
    weightUnit: 'kg',
    workoutsCompleted: 6,
    workoutsTarget: 5,       // Exceeded target
    caloriesBurned: 3200,
    caloriesTarget: 2500,
    currentStreak: 12,
};