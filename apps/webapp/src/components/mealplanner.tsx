import React, { useState } from 'react';
import { MealPlannerLayout } from './mealplanner/MealPlannerLayout';
import { MealOverview, mockMealOverviewData } from './mealplanner/Mealoverview';
import './../styles/mealplanner.css';


type ViewMode = 'today' | 'weekly';

export const MealPlanner: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('today');

    const handleViewChange = (mode: ViewMode) => {
        console.log('📅 View mode changed:', mode);
        setViewMode(mode);
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

            {/* ═══ PLACEHOLDER: Next sections will go here ═══ */}
            <div style={{
                padding: '40px 24px',
                background: 'white',
                borderRadius: '12px',
                border: '2px dashed #dfe6e9',
                textAlign: 'center',
                color: '#95a5a6',
                marginTop: '24px'
            }}>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                    📦 <strong>Next sections (Phase 2):</strong><br />
                    • Meal Cards (Breakfast, Lunch, Dinner, Snacks)<br />
                    • Ingredient Lists (per meal)<br />
                    • Local Market Suggestions<br />
                    • Shopping List Generator<br />
                    • AI Nutrition Panel
                </p>
            </div>
        </MealPlannerLayout>
    );
};

export default MealPlanner;