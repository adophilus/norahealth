import React from 'react';



type ViewMode = 'today' | 'weekly';
type DietType = 'weight_loss' | 'muscle_gain' | 'maintenance';

interface MealOverviewProps {
    viewMode: ViewMode;
    onViewChange: (mode: ViewMode) => void;
    calorieTarget: number;
    currentCalories: number;
    dietType: DietType;
    macros: {
        protein: number;      // grams
        carbs: number;        // grams
        fats: number;         // grams
    };
    targetMacros?: {
        protein: number;
        carbs: number;
        fats: number;
    };
}

export const MealOverview: React.FC<MealOverviewProps> = ({
    viewMode,
    onViewChange,
    calorieTarget,
    currentCalories,
    dietType,
    macros,
    targetMacros,
}) => {

    // Calculate calorie progress
    const calorieProgress = Math.min((currentCalories / calorieTarget) * 100, 100);
    const caloriesRemaining = calorieTarget - currentCalories;
    const isOverTarget = currentCalories > calorieTarget;

    // Diet type labels
    const dietTypeLabels: Record<DietType, { label: string; icon: string; color: string }> = {
        weight_loss: { label: 'Weight Loss', icon: '📉', color: '#e74c3c' },
        muscle_gain: { label: 'Muscle Gain', icon: '💪', color: '#3aab8e' },
        maintenance: { label: 'Maintenance', icon: '⚖️', color: '#3498db' },
    };

    const dietConfig = dietTypeLabels[dietType];

    return (
        <div className="fit-meal-overview">
            {/* Header row: View toggle + Diet type */}
            <div className="fit-meal-overview__header">
                {/* View toggle */}
                <div className="fit-meal-overview__view-toggle">
                    <button
                        className={`fit-meal-overview__view-btn${viewMode === 'today' ? ' fit-meal-overview__view-btn--active' : ''}`}
                        onClick={() => onViewChange('today')}
                    >
                        Today
                    </button>
                    <button
                        className={`fit-meal-overview__view-btn${viewMode === 'weekly' ? ' fit-meal-overview__view-btn--active' : ''}`}
                        onClick={() => onViewChange('weekly')}
                    >
                        Weekly
                    </button>
                </div>

                {/* Diet type badge */}
                <div
                    className="fit-meal-overview__diet-badge"
                    style={{ background: `${dietConfig.color}15`, color: dietConfig.color, borderColor: `${dietConfig.color}40` }}
                >
                    <span className="fit-meal-overview__diet-icon">{dietConfig.icon}</span>
                    <span className="fit-meal-overview__diet-label">{dietConfig.label}</span>
                </div>
            </div>

            {/* Calorie summary */}
            <div className="fit-meal-overview__calories">
                <div className="fit-meal-overview__calories-header">
                    <div className="fit-meal-overview__calories-current">
                        <span className="fit-meal-overview__calories-value">{currentCalories}</span>
                        <span className="fit-meal-overview__calories-unit">cal</span>
                    </div>
                    <div className="fit-meal-overview__calories-target">
                        <span className="fit-meal-overview__calories-separator">/</span>
                        <span className="fit-meal-overview__calories-target-value">{calorieTarget}</span>
                        <span className="fit-meal-overview__calories-unit">cal</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="fit-meal-overview__progress-track">
                    <div
                        className={`fit-meal-overview__progress-fill${isOverTarget ? ' fit-meal-overview__progress-fill--over' : ''}`}
                        style={{ width: `${calorieProgress}%` }}
                    />
                </div>

                {/* Remaining/Over message */}
                <div className="fit-meal-overview__calories-message">
                    {isOverTarget ? (
                        <span className="fit-meal-overview__calories-over">
                            ⚠️ {Math.abs(caloriesRemaining)} cal over target
                        </span>
                    ) : (
                        <span className="fit-meal-overview__calories-remaining">
                            {caloriesRemaining} cal remaining
                        </span>
                    )}
                </div>
            </div>

            {/* Macros breakdown */}
            <div className="fit-meal-overview__macros">
                <div className="fit-meal-overview__macro-item">
                    <div className="fit-meal-overview__macro-icon">🥩</div>
                    <div className="fit-meal-overview__macro-content">
                        <div className="fit-meal-overview__macro-value">
                            {macros.protein}g
                            {targetMacros && (
                                <span className="fit-meal-overview__macro-target"> / {targetMacros.protein}g</span>
                            )}
                        </div>
                        <div className="fit-meal-overview__macro-label">Protein</div>
                    </div>
                </div>

                <div className="fit-meal-overview__macro-item">
                    <div className="fit-meal-overview__macro-icon">🍞</div>
                    <div className="fit-meal-overview__macro-content">
                        <div className="fit-meal-overview__macro-value">
                            {macros.carbs}g
                            {targetMacros && (
                                <span className="fit-meal-overview__macro-target"> / {targetMacros.carbs}g</span>
                            )}
                        </div>
                        <div className="fit-meal-overview__macro-label">Carbs</div>
                    </div>
                </div>

                <div className="fit-meal-overview__macro-item">
                    <div className="fit-meal-overview__macro-icon">🥑</div>
                    <div className="fit-meal-overview__macro-content">
                        <div className="fit-meal-overview__macro-value">
                            {macros.fats}g
                            {targetMacros && (
                                <span className="fit-meal-overview__macro-target"> / {targetMacros.fats}g</span>
                            )}
                        </div>
                        <div className="fit-meal-overview__macro-label">Fats</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockMealOverviewData = {
    viewMode: 'today' as ViewMode,
    calorieTarget: 2000,
    currentCalories: 1750,
    dietType: 'weight_loss' as DietType,
    macros: {
        protein: 120,
        carbs: 180,
        fats: 55,
    },
    targetMacros: {
        protein: 150,
        carbs: 200,
        fats: 60,
    },
};