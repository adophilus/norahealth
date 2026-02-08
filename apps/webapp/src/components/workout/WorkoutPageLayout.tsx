import React from 'react';
import './../../styles/workout.css'

interface WorkoutPageLayoutProps {
    children: React.ReactNode;
}

export const WorkoutPageLayout: React.FC<WorkoutPageLayoutProps> = ({ children }) => {
    return (
        <div className="fit-workout-page">
            <div className="fit-workout-container">
                {/* Page header */}
                <header className="fit-workout-header">
                    <h1 className="fit-workout-title">Workouts</h1>
                    <p className="fit-workout-subtitle">Track your progress and train with AI coaching</p>
                </header>

                {/* Main content area */}
                <main className="fit-workout-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default WorkoutPageLayout;