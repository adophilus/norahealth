import React, { useState } from 'react';
import { MealPlannerLayout } from './mealplanner/MealPlannerLayout';
import { MealOverview, mockMealOverviewData } from './mealplanner/Mealoverview';
import { MealCard, mockMeals } from './mealplanner/MealCard';
import { IngredientList, mockIngredients } from './mealplanner/Ingredientlist ';
import { LocalMarketSuggestions, mockMarkets, mockUserLocation } from './mealplanner/Localmarketsuggestions ';
import { ShoppingList, mockShoppingListItems } from './mealplanner/ShoppingList';
import { AiNutritionPanel } from './mealplanner/AiNutritionPanel'
import './../styles/mealplanner.css';


type ViewMode = 'today' | 'weekly';
type GroupBy = 'market' | 'category';

export const MealPlanner: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('today');
    const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
    const [hasLocation, setHasLocation] = useState(true);
    const [groupBy, setGroupBy] = useState<GroupBy>('market');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleViewChange = (mode: ViewMode) => {
        console.log('📅 View mode changed:', mode);
        setViewMode(mode);
    };

    const handleMealToggle = (mealId: string) => {
        console.log('🍽️ Toggling meal:', mealId);
        setExpandedMealId(expandedMealId === mealId ? null : mealId);
    };

    const handleUpdateLocation = () => {
        console.log('📍 Update location clicked');
        alert('In production, this would open a location picker modal.\n\nUser would select:\n• Country\n• State/Region\n• City\n\nThen: POST /api/user/location');
    };

    const handleGroupByChange = (newGroupBy: GroupBy) => {
        console.log('🏷️ Group by changed:', newGroupBy);
        setGroupBy(newGroupBy);
    };

    const handleAiMessage = async (message: string, context?: any) => {
        console.log('💬 AI message:', message, 'Context:', context);
        setIsAiLoading(true);

        // Simulate AI response delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        alert(`AI Nutrition Response\n\nPOST /api/ai/nutrition/adjust\n\nBody:\n${JSON.stringify({ message, context }, null, 2)}\n\nResponse would:\n• Regenerate meal based on constraints\n• Update ingredient list\n• Suggest local alternatives\n• Recalculate calories/macros`);

        setIsAiLoading(false);
    };



    return (
        <MealPlannerLayout>

            {/* ═══ MEAL OVERVIEW ═══ */}
            <MealOverview
                viewMode={viewMode}
                onViewChange={handleViewChange}
                calorieTarget={mockMealOverviewData.calorieTarget}
                currentCalories={mockMealOverviewData.currentCalories}
                dietType={mockMealOverviewData.dietType}
                macros={mockMealOverviewData.macros}
                targetMacros={mockMealOverviewData.targetMacros}
            />

            {/* ═══ SECTION 2: MEAL CARDS ═══ */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 380px',
                gap: '24px',
                marginTop: '24px'
            }}>

                {/* LEFT COLUMN: Meal Cards */}
                <div>
                    {mockMeals.map((meal) => (
                        <MealCard
                            key={meal.id}
                            meal={meal}
                            isExpanded={expandedMealId === meal.id}
                            onToggle={() => handleMealToggle(meal.id)}
                        >
                            {expandedMealId === meal.id && (
                                <>
                                    <IngredientList ingredients={mockIngredients} />
                                    <LocalMarketSuggestions
                                        markets={hasLocation ? mockMarkets : []}
                                        userLocation={hasLocation ? mockUserLocation : undefined}
                                        onUpdateLocation={handleUpdateLocation}
                                    />
                                </>
                            )}
                        </MealCard>
                    ))}
                </div>

                {/* RIGHT COLUMN: Shopping List (sticky on desktop) */}
                <div>
                    <ShoppingList
                        items={mockShoppingListItems}
                        groupBy={groupBy}
                        onGroupByChange={handleGroupByChange}
                    />
                </div>

            </div>


            {/* ═══ SECTION 3: AI NUTRITION PANEL ═══ */}
            <AiNutritionPanel
                onSendMessage={handleAiMessage}
                quickActions={[
                    'Make this meal cheaper',
                    'Replace with local Nigerian food',
                    'Make this vegetarian',
                    'Reduce calories by 200',
                    'Add more protein',
                    'Suggest meal prep tips',
                ]}
                isLoading={isAiLoading}
                userContext={{
                    location: hasLocation ? mockUserLocation : undefined,
                    dietType: mockMealOverviewData.dietType,
                    budget: 'medium',
                }}
            />

        </MealPlannerLayout>
    );
};

export default MealPlanner;