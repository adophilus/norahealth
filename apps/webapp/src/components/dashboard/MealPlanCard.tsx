import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// MEAL PLAN CARD COMPONENT
// 
// Purpose: Shows today's meal plan overview
// Psychology: Nutrition visibility = 70% of fitness success
// Data flow: Will pull from /api/nutrition/meal-plan/today
// AI integration: CTA triggers /api/ai/generate-meal-plan
// ═══════════════════════════════════════════════════════════════════════════

interface Meal {
    name: string;
    calories: number;
    protein?: number;    // grams
    carbs?: number;      // grams
    fat?: number;        // grams
}

interface MealPlan {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks?: Meal[];
    totalCalories: number;
    targetCalories: number;
}

interface MealPlanCardProps {
    mealPlan: MealPlan | null;
    onGenerateMealPlan?: () => void;
    onViewMealDetails?: () => void;
}

export const MealPlanCard: React.FC<MealPlanCardProps> = ({
    mealPlan,
    onGenerateMealPlan,
    onViewMealDetails
}) => {

    // ── CASE 1: No meal plan → Show AI CTA
    if (!mealPlan) {
        return (
            <div className="fit-card fit-meal-card fit-meal-card--empty">
                <div className="fit-meal-card__empty-state">
                    <div className="fit-meal-card__icon fit-meal-card__icon--plate">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" />
                            <path d="M24 24L24 14M24 24L32 18M24 24L32 30M24 24L16 30M24 24L16 18"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                        </svg>
                    </div>

                    <h3 className="fit-meal-card__empty-title">
                        No Meal Plan
                    </h3>

                    <p className="fit-meal-card__empty-desc">
                        Let AI create a personalized meal plan tailored to your goals, dietary preferences, and calorie needs.
                    </p>

                    <button
                        className="fit-meal-card__cta"
                        onClick={onGenerateMealPlan}
                    >
                        <span className="fit-meal-card__cta-icon">🍽️</span>
                        Generate Meal Plan with AI
                    </button>
                </div>
            </div>
        );
    }

    // ── CASE 2: Meal plan exists → Display summary
    const calorieProgress = (mealPlan.totalCalories / mealPlan.targetCalories) * 100;
    const isOverTarget = calorieProgress > 100;

    const meals = [
        { label: 'Breakfast', emoji: '🍳', data: mealPlan.breakfast },
        { label: 'Lunch', emoji: '🥗', data: mealPlan.lunch },
        { label: 'Dinner', emoji: '🍽️', data: mealPlan.dinner },
    ];

    return (
        <div className="fit-card fit-meal-card">
            {/* Header */}
            <div className="fit-meal-card__header">
                <span className="fit-meal-card__label">Today's Meals</span>
                <button
                    className="fit-meal-card__view-details"
                    onClick={onViewMealDetails}
                >
                    View Details →
                </button>
            </div>

            {/* Calorie summary */}
            <div className="fit-meal-card__calorie-summary">
                <div className="fit-meal-card__calorie-text">
                    <span className="fit-meal-card__calorie-current">{mealPlan.totalCalories}</span>
                    <span className="fit-meal-card__calorie-separator">/</span>
                    <span className="fit-meal-card__calorie-target">{mealPlan.targetCalories}</span>
                    <span className="fit-meal-card__calorie-unit">cal</span>
                </div>

                <div className="fit-meal-card__calorie-bar">
                    <div
                        className={`fit-meal-card__calorie-fill${isOverTarget ? ' fit-meal-card__calorie-fill--over' : ''}`}
                        style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                    />
                </div>

                {isOverTarget && (
                    <div className="fit-meal-card__calorie-warning">
                        ⚠️ Over target by {mealPlan.totalCalories - mealPlan.targetCalories} cal
                    </div>
                )}
            </div>

            {/* Meal list */}
            <div className="fit-meal-card__meals">
                {meals.map((meal, idx) => (
                    <div key={idx} className="fit-meal-card__meal-item">
                        <div className="fit-meal-card__meal-icon">{meal.emoji}</div>
                        <div className="fit-meal-card__meal-info">
                            <div className="fit-meal-card__meal-label">{meal.label}</div>
                            <div className="fit-meal-card__meal-name">{meal.data.name}</div>
                        </div>
                        <div className="fit-meal-card__meal-calories">
                            {meal.data.calories} <span className="fit-meal-card__meal-cal-unit">cal</span>
                        </div>
                    </div>
                ))}

                {mealPlan.snacks && mealPlan.snacks.length > 0 && (
                    <div className="fit-meal-card__snacks">
                        <div className="fit-meal-card__snacks-label">
                            🍎 Snacks ({mealPlan.snacks.length})
                        </div>
                        <div className="fit-meal-card__snacks-calories">
                            {mealPlan.snacks.reduce((sum, s) => sum + s.calories, 0)} cal
                        </div>
                    </div>
                )}
            </div>

            {/* Regenerate option */}
            <button
                className="fit-meal-card__regenerate"
                onClick={onGenerateMealPlan}
            >
                ♻️ Regenerate Meal Plan
            </button>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA FOR TESTING
// ═══════════════════════════════════════════════════════════════════════════

export const mockMealPlan: MealPlan = {
    breakfast: {
        name: 'Oatmeal with Berries & Almonds',
        calories: 380,
        protein: 12,
        carbs: 58,
        fat: 11,
    },
    lunch: {
        name: 'Grilled Chicken Salad',
        calories: 450,
        protein: 42,
        carbs: 28,
        fat: 16,
    },
    dinner: {
        name: 'Salmon with Quinoa & Vegetables',
        calories: 620,
        protein: 45,
        carbs: 52,
        fat: 22,
    },
    snacks: [
        { name: 'Greek Yogurt', calories: 120, protein: 15, carbs: 12, fat: 2 },
        { name: 'Apple with Peanut Butter', calories: 180, protein: 4, carbs: 22, fat: 8 },
    ],
    totalCalories: 1750,
    targetCalories: 2000,
};

export const mockNoMealPlan = null;