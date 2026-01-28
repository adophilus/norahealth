import React from 'react';
import './why.css';

export const Why = () => {
    return (
        <div className='why-norahealth'>
            {/* HEADER SECTION */}
            <div className='why-header'>
                <h2>Why choose NoraHealth?</h2>
                <p>NoraHealth is the AI wellness agent that knows you, your goals, and even the weather outside.</p>
            </div>

            {/* FEATURES GRID */}
            <div className='features-grid'>

                <article className='feature-card'>
                    <div className='feature-icon'>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h3>Intelligent Adaptive Planning</h3>
                    <p>
                        Four specialized AI agents work together to create personalized wellness plans that
                        automatically adapt to your environment - adjusting workout routines based on real-time
                        weather conditions for optimal results.
                    </p>
                </article>

                <article className='feature-card'>
                    <div className='feature-icon feature-icon-accent'>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M16 2V6M8 2V6M4 10H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="14" r="2" fill="currentColor" />
                        </svg>
                    </div>
                    <h3>Smart Nutrition</h3>
                    <p>
                        Upload a photo of your fridge for AI-powered recipe generation, then instantly find nearby
                        stores with missing ingredients - from meal planning to shopping in one seamless experience.
                    </p>
                </article>

                <article className='feature-card'>
                    <div className='feature-icon'>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 17V17.01M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h3>Progress Tracking</h3>
                    <p>
                        Monitor your health journey with visual dashboards showing completion rates and streaks,
                        while every recommendation is cross-referenced against your health profile to ensure safety.
                    </p>
                </article>

            </div>
        </div>
    );
};