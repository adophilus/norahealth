import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// SHOPPING LIST COMPONENT
// 
// Purpose: Aggregate ingredients across all meals for efficient shopping
// Psychology: Saves time + money. One trip to Mile 12, not three separate trips
// Data flow: Computed from all meals in current view (today/weekly)
// 
// Features:
// - Combines duplicate ingredients (rice in 2 meals → total quantity)
// - Group by market OR category (user toggle)
// - Shows which meals use each ingredient
// - Export to clipboard
// ═══════════════════════════════════════════════════════════════════════════

type GroupBy = 'market' | 'category';
type IngredientCategory = 'grain' | 'protein' | 'vegetable' | 'fruit' | 'dairy' | 'spice' | 'other';

interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: IngredientCategory;
}

interface MarketSuggestion {
    id: string;
    marketName: string;
    area: string;
}

interface ShoppingListItem {
    ingredient: Ingredient;
    totalQuantity: number;
    totalUnit: string;
    usedInMeals: string[];           // Meal names
    suggestedMarkets: MarketSuggestion[];
}

interface ShoppingListProps {
    items: ShoppingListItem[];
    groupBy?: GroupBy;
    onGroupByChange?: (groupBy: GroupBy) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
    items,
    groupBy = 'market',
    onGroupByChange,
}) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    // Group items by market or category
    const groupedItems = React.useMemo(() => {
        if (groupBy === 'market') {
            // Group by market
            const groups: Record<string, ShoppingListItem[]> = {};

            items.forEach(item => {
                if (item.suggestedMarkets.length > 0) {
                    const marketName = item.suggestedMarkets[0].marketName;
                    if (!groups[marketName]) groups[marketName] = [];
                    groups[marketName].push(item);
                } else {
                    if (!groups['Other']) groups['Other'] = [];
                    groups['Other'].push(item);
                }
            });

            return groups;
        } else {
            // Group by category
            const groups: Record<string, ShoppingListItem[]> = {};

            items.forEach(item => {
                const category = item.ingredient.category;
                if (!groups[category]) groups[category] = [];
                groups[category].push(item);
            });

            return groups;
        }
    }, [items, groupBy]);

    // Export to clipboard
    const handleCopyToClipboard = async () => {
        let text = '🛒 Shopping List\n\n';

        Object.entries(groupedItems).forEach(([groupName, groupItems]) => {
            text += `📍 ${groupName}\n`;
            groupItems.forEach(item => {
                text += `  • ${item.ingredient.name} - ${item.totalQuantity} ${item.totalUnit}\n`;
            });
            text += '\n';
        });

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        }
    };

    return (
        <div className="fit-shopping-list">
            {/* Header */}
            <div className="fit-shopping-list__header">
                <div className="fit-shopping-list__header-left">
                    <h3 className="fit-shopping-list__title">Shopping List</h3>
                    <span className="fit-shopping-list__count">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {/* Toggle expand/collapse on mobile */}
                <button
                    className="fit-shopping-list__toggle-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Hide' : 'Show'}
                </button>
            </div>

            {/* Content (collapsible on mobile) */}
            <div className={`fit-shopping-list__content${isExpanded ? ' fit-shopping-list__content--expanded' : ''}`}>
                {/* Group by toggle */}
                <div className="fit-shopping-list__controls">
                    <div className="fit-shopping-list__group-toggle">
                        <span className="fit-shopping-list__group-label">Group by:</span>
                        <button
                            className={`fit-shopping-list__group-btn${groupBy === 'market' ? ' fit-shopping-list__group-btn--active' : ''}`}
                            onClick={() => onGroupByChange?.('market')}
                        >
                            Market
                        </button>
                        <button
                            className={`fit-shopping-list__group-btn${groupBy === 'category' ? ' fit-shopping-list__group-btn--active' : ''}`}
                            onClick={() => onGroupByChange?.('category')}
                        >
                            Category
                        </button>
                    </div>

                    {/* Export button */}
                    <button
                        className="fit-shopping-list__export-btn"
                        onClick={handleCopyToClipboard}
                    >
                        {copied ? '✓ Copied!' : '📋 Copy List'}
                    </button>
                </div>

                {/* Grouped items */}
                <div className="fit-shopping-list__groups">
                    {Object.entries(groupedItems).map(([groupName, groupItems]) => (
                        <div key={groupName} className="fit-shopping-group">
                            <div className="fit-shopping-group__header">
                                <span className="fit-shopping-group__name">
                                    {groupBy === 'market' ? '📍' : '🏷️'} {groupName}
                                </span>
                                <span className="fit-shopping-group__count">
                                    {groupItems.length}
                                </span>
                            </div>

                            <div className="fit-shopping-group__items">
                                {groupItems.map((item, idx) => (
                                    <div key={idx} className="fit-shopping-item">
                                        <div className="fit-shopping-item__checkbox">
                                            <input type="checkbox" />
                                        </div>

                                        <div className="fit-shopping-item__content">
                                            <div className="fit-shopping-item__name">
                                                {item.ingredient.name}
                                            </div>
                                            <div className="fit-shopping-item__meals">
                                                Used in: {item.usedInMeals.join(', ')}
                                            </div>
                                        </div>

                                        <div className="fit-shopping-item__quantity">
                                            <span className="fit-shopping-item__quantity-value">
                                                {item.totalQuantity}
                                            </span>
                                            <span className="fit-shopping-item__quantity-unit">
                                                {item.totalUnit}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockShoppingListItems: ShoppingListItem[] = [
    {
        ingredient: {
            id: 'ing_001',
            name: 'Long grain rice',
            quantity: 1,
            unit: 'cup',
            category: 'grain',
        },
        totalQuantity: 2.5,
        totalUnit: 'cups',
        usedInMeals: ['Breakfast', 'Lunch'],
        suggestedMarkets: [
            { id: 'market_001', marketName: 'Mile 12 Market', area: 'Kosofe, Lagos' }
        ],
    },
    {
        ingredient: {
            id: 'ing_002',
            name: 'Chicken breast',
            quantity: 150,
            unit: 'g',
            category: 'protein',
        },
        totalQuantity: 450,
        totalUnit: 'g',
        usedInMeals: ['Lunch', 'Dinner'],
        suggestedMarkets: [
            { id: 'market_001', marketName: 'Mile 12 Market', area: 'Kosofe, Lagos' }
        ],
    },
    {
        ingredient: {
            id: 'ing_003',
            name: 'Tomatoes',
            quantity: 3,
            unit: 'pieces',
            category: 'vegetable',
        },
        totalQuantity: 6,
        totalUnit: 'pieces',
        usedInMeals: ['Breakfast', 'Dinner'],
        suggestedMarkets: [
            { id: 'market_001', marketName: 'Mile 12 Market', area: 'Kosofe, Lagos' }
        ],
    },
    {
        ingredient: {
            id: 'ing_004',
            name: 'Bell peppers',
            quantity: 2,
            unit: 'pieces',
            category: 'vegetable',
        },
        totalQuantity: 4,
        totalUnit: 'pieces',
        usedInMeals: ['Breakfast', 'Lunch'],
        suggestedMarkets: [
            { id: 'market_001', marketName: 'Mile 12 Market', area: 'Kosofe, Lagos' }
        ],
    },
    {
        ingredient: {
            id: 'ing_005',
            name: 'Plantain',
            quantity: 2,
            unit: 'pieces',
            category: 'fruit',
        },
        totalQuantity: 2,
        totalUnit: 'pieces',
        usedInMeals: ['Snack'],
        suggestedMarkets: [
            { id: 'market_002', marketName: 'Oke Arin Market', area: 'Lagos Island' }
        ],
    },
    {
        ingredient: {
            id: 'ing_006',
            name: 'Curry powder',
            quantity: 1,
            unit: 'tsp',
            category: 'spice',
        },
        totalQuantity: 2,
        totalUnit: 'tsp',
        usedInMeals: ['Breakfast', 'Dinner'],
        suggestedMarkets: [
            { id: 'market_002', marketName: 'Oke Arin Market', area: 'Lagos Island' }
        ],
    },
];