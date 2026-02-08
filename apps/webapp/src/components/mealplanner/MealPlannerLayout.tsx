import React from 'react';


interface MealPlannerLayoutProps {
    children: React.ReactNode;
}

export const MealPlannerLayout: React.FC<MealPlannerLayoutProps> = ({ children }) => {
    return (
        <div className="fit-meal-page">
            <div className="fit-meal-container">
                {/* Page header */}
                <header className="fit-meal-header">
                    <h1 className="fit-meal-title">Meal Planner</h1>
                    <p className="fit-meal-subtitle">Your personalized nutrition plan with local ingredients</p>
                </header>

                {/* Main content area */}
                <main className="fit-meal-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MealPlannerLayout;