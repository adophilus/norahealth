import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// MEAL CARD COMPONENT
// 
// Purpose: Display individual meals (Breakfast/Lunch/Dinner/Snack) with expand/collapse
// Psychology: Progressive disclosure → show essentials, hide details until needed
// Data flow: Will pull from /api/meal-plan/today or /api/meal-plan/weekly
// 
// Features:
// - Collapsed: Shows meal type, name, calories, basic macros
// - Expanded: Shows full details + ingredients + market suggestions
// - Click to expand/collapse
// ═══════════════════════════════════════════════════════════════════════════

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Meal {
    id: string;
    type: MealType;
    name: string;
    description?: string;
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fats: number;
    };
    prepTime?: number;
    cookTime?: number;
}

interface MealCardProps {
    meal: Meal;
    isExpanded: boolean;
    onToggle: () => void;
    children?: React.ReactNode;  // For IngredientList and MarketSuggestions
}

export const MealCard: React.FC<MealCardProps> = ({
    meal,
    isExpanded,
    onToggle,
    children,
}) => {

    // Meal type configuration
    const mealTypeConfig: Record<MealType, { icon: string; color: string; label: string }> = {
        breakfast: { icon: '🍳', color: '#f39c12', label: 'Breakfast' },
        lunch: { icon: '🥗', color: '#3aab8e', label: 'Lunch' },
        dinner: { icon: '🍽️', color: '#e74c3c', label: 'Dinner' },
        snack: { icon: '🍎', color: '#9b59b6', label: 'Snack' },
    };

    const config = mealTypeConfig[meal.type];

    return (
        <div className={`fit-meal-card${isExpanded ? ' fit-meal-card--expanded' : ''}`}>
            {/* Clickable header */}
            <div
                className="fit-meal-card__header"
                onClick={onToggle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onToggle()}
            >
                {/* Left: Icon + Info */}
                <div className="fit-meal-card__header-left">
                    <div
                        className="fit-meal-card__icon"
                        style={{ background: `${config.color}15`, color: config.color }}
                    >
                        {config.icon}
                    </div>

                    <div className="fit-meal-card__info">
                        <div className="fit-meal-card__type-label">{config.label}</div>
                        <h3 className="fit-meal-card__name">{meal.name}</h3>
                        {meal.description && !isExpanded && (
                            <p className="fit-meal-card__description">{meal.description}</p>
                        )}
                    </div>
                </div>

                {/* Right: Calories + Expand arrow */}
                <div className="fit-meal-card__header-right">
                    <div className="fit-meal-card__calories">
                        <span className="fit-meal-card__calories-value">{meal.calories}</span>
                        <span className="fit-meal-card__calories-unit">cal</span>
                    </div>

                    <div className={`fit-meal-card__expand-icon${isExpanded ? ' fit-meal-card__expand-icon--open' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Macros summary (always visible) */}
            <div className="fit-meal-card__macros-summary">
                <div className="fit-meal-card__macro">
                    <span className="fit-meal-card__macro-label">Protein</span>
                    <span className="fit-meal-card__macro-value">{meal.macros.protein}g</span>
                </div>
                <div className="fit-meal-card__macro">
                    <span className="fit-meal-card__macro-label">Carbs</span>
                    <span className="fit-meal-card__macro-value">{meal.macros.carbs}g</span>
                </div>
                <div className="fit-meal-card__macro">
                    <span className="fit-meal-card__macro-label">Fats</span>
                    <span className="fit-meal-card__macro-value">{meal.macros.fats}g</span>
                </div>
            </div>

            {/* Expanded content (ingredients + markets) */}
            {isExpanded && (
                <div className="fit-meal-card__expanded-content">
                    {/* Optional time info */}
                    {(meal.prepTime || meal.cookTime) && (
                        <div className="fit-meal-card__time-info">
                            {meal.prepTime && (
                                <span className="fit-meal-card__time-item">
                                    ⏱️ Prep: {meal.prepTime} min
                                </span>
                            )}
                            {meal.cookTime && (
                                <span className="fit-meal-card__time-item">
                                    🔥 Cook: {meal.cookTime} min
                                </span>
                            )}
                        </div>
                    )}

                    {/* Description (if not shown above) */}
                    {meal.description && (
                        <p className="fit-meal-card__description-full">{meal.description}</p>
                    )}

                    {/* Children: IngredientList + LocalMarketSuggestions */}
                    {children}
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockMeals: Meal[] = [
    {
        id: 'meal_001',
        type: 'breakfast',
        name: 'Jollof Rice with Scrambled Eggs',
        description: 'Classic Nigerian breakfast with protein-rich eggs',
        calories: 420,
        macros: { protein: 18, carbs: 52, fats: 14 },
        prepTime: 10,
        cookTime: 25,
    },
    {
        id: 'meal_002',
        type: 'lunch',
        name: 'Grilled Chicken & Vegetable Stir-fry',
        description: 'Lean protein with mixed vegetables and brown rice',
        calories: 580,
        macros: { protein: 45, carbs: 62, fats: 12 },
        prepTime: 15,
        cookTime: 20,
    },
    {
        id: 'meal_003',
        type: 'dinner',
        name: 'Efo Riro with Swallow',
        description: 'Traditional Nigerian spinach stew with pounded yam',
        calories: 650,
        macros: { protein: 35, carbs: 78, fats: 18 },
        prepTime: 20,
        cookTime: 35,
    },
    {
        id: 'meal_004',
        type: 'snack',
        name: 'Plantain Chips & Groundnuts',
        description: 'Healthy local snack with good fats',
        calories: 180,
        macros: { protein: 6, carbs: 22, fats: 8 },
        prepTime: 5,
    },
];