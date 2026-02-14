import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// INGREDIENT LIST COMPONENT
// 
// Purpose: Show detailed ingredient breakdown for a meal
// Psychology: Specificity = higher adherence ("1 cup rice" vs "some rice")
// Data flow: Nested within Meal object from API
// 
// Features:
// - Ingredient name with local name (if applicable)
// - Quantity + unit (standardized measurements)
// - Category badges (grain, protein, vegetable, etc.)
// - Dietary notes (gluten-free, high fiber, etc.)
// ═══════════════════════════════════════════════════════════════════════════

type IngredientCategory = 'grain' | 'protein' | 'vegetable' | 'fruit' | 'dairy' | 'spice' | 'other';

interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;              // "cup", "g", "ml", "tbsp", "piece", etc.
    category: IngredientCategory;
    calories?: number;
    dietaryNotes?: string;
    localName?: string;        // e.g., "Basmati rice" → "Local rice"
}

interface IngredientListProps {
    ingredients: Ingredient[];
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {

    // Category color mapping
    const categoryColors: Record<IngredientCategory, string> = {
        grain: '#f39c12',
        protein: '#e74c3c',
        vegetable: '#27ae60',
        fruit: '#e67e22',
        dairy: '#3498db',
        spice: '#9b59b6',
        other: '#95a5a6',
    };

    return (
        <div className="fit-ingredient-list">
            <div className="fit-ingredient-list__header">
                <h4 className="fit-ingredient-list__title">Ingredients</h4>
                <span className="fit-ingredient-list__count">
                    {ingredients.length} {ingredients.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            <div className="fit-ingredient-list__items">
                {ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="fit-ingredient-item">
                        {/* Left: Category badge */}
                        <div
                            className="fit-ingredient-item__category"
                            style={{
                                background: `${categoryColors[ingredient.category]}20`,
                                color: categoryColors[ingredient.category]
                            }}
                        >
                            {ingredient.category.charAt(0).toUpperCase()}
                        </div>

                        {/* Center: Name + Notes */}
                        <div className="fit-ingredient-item__content">
                            <div className="fit-ingredient-item__name">
                                {ingredient.name}
                                {ingredient.localName && (
                                    <span className="fit-ingredient-item__local-name">
                                        ({ingredient.localName})
                                    </span>
                                )}
                            </div>

                            {ingredient.dietaryNotes && (
                                <div className="fit-ingredient-item__notes">
                                    {ingredient.dietaryNotes}
                                </div>
                            )}
                        </div>

                        {/* Right: Quantity */}
                        <div className="fit-ingredient-item__quantity">
                            <span className="fit-ingredient-item__quantity-value">
                                {ingredient.quantity}
                            </span>
                            <span className="fit-ingredient-item__quantity-unit">
                                {ingredient.unit}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockIngredients: Ingredient[] = [
    {
        id: 'ing_001',
        name: 'Long grain rice',
        quantity: 1,
        unit: 'cup',
        category: 'grain',
        calories: 200,
        localName: 'Local rice',
    },
    {
        id: 'ing_002',
        name: 'Chicken breast',
        quantity: 150,
        unit: 'g',
        category: 'protein',
        calories: 165,
        dietaryNotes: 'High protein, lean',
    },
    {
        id: 'ing_003',
        name: 'Bell peppers',
        quantity: 2,
        unit: 'pieces',
        category: 'vegetable',
        calories: 50,
        dietaryNotes: 'Rich in Vitamin C',
    },
    {
        id: 'ing_004',
        name: 'Tomatoes',
        quantity: 3,
        unit: 'pieces',
        category: 'vegetable',
        calories: 60,
    },
    {
        id: 'ing_005',
        name: 'Onions',
        quantity: 1,
        unit: 'piece',
        category: 'vegetable',
        calories: 40,
    },
    {
        id: 'ing_006',
        name: 'Vegetable oil',
        quantity: 2,
        unit: 'tbsp',
        category: 'other',
        calories: 240,
    },
    {
        id: 'ing_007',
        name: 'Curry powder',
        quantity: 1,
        unit: 'tsp',
        category: 'spice',
        calories: 5,
    },
    {
        id: 'ing_008',
        name: 'Salt',
        quantity: 0.5,
        unit: 'tsp',
        category: 'spice',
        calories: 0,
        dietaryNotes: 'To taste',
    },
];