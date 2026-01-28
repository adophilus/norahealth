import React, { useState } from 'react';
import './abt.css';

export const Abt = () => {
    const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
    const noraFeaturesList = [
        {
            id: 0,
            title: "AI Wellness Engine",
            description: "A coordinated system of specialized AI agents that designs and adapts your nutrition, fitness, and daily routines around your goals, health profile, and lifestyle — all working together in real time.",
            image: "/1.png"
        },
        {
            id: 1,
            title: "Smart Meal Planning",
            description: "Upload a photo of your fridge and get instant, personalized meal ideas based on available ingredients, dietary needs, and nutrition goals — making healthy eating simple and practical.",
            image: "/2.png"
        },
        {
            id: 2,
            title: "Adaptive Workouts",
            description: "Workout plans that automatically adjust to weather, energy levels, and progress, giving you the right routine whether you’re at home or outdoors.",
            image: "/3.png"
        },
        {
            id: 3,
            title: "Progress & Safety",
            description: "Track streaks, completion, and improvements with clear insights, while every recommendation is checked against allergies, injuries, and health conditions for safe, reliable results.",
            image: "/4.png"
        }
    ];

    return (
        <div className='nora-features-wrapper'>
            <div className="nora-center">

                <div className="nora-features-badge">
                    <span>WHAT MAKES US DIFFERENT</span>
                </div>
                <h2 className="nora-features-heading-main">
                    What does NoraHealth include?
                </h2>
            </div>

            <div className="nora-features-layout-split">

                {/* Left Section - Title & Dynamic Image */}
                <div className="nora-features-left-panel">

                    <div className="nora-features-visual-box">
                        <div
                            className="nora-showcase-display"
                        // style={{ backgroundImage: `url(${noraFeaturesList[activeFeatureIndex].image})` }}
                        >
                            <img src={noraFeaturesList[activeFeatureIndex].image} alt={noraFeaturesList[activeFeatureIndex].title} />
                            {/* Placeholder gradient overlay */}
                            <div className="nora-showcase-overlay"></div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Feature Cards */}
                <div className="nora-features-right-panel">
                    <div className="nora-features-list-stack">
                        {noraFeaturesList.map(({ id, title, description }) => (
                            <div
                                className={`nora-feature-item ${activeFeatureIndex === id ? 'nora-feature-item-selected' : ''}`}
                                key={id}
                                onClick={() => setActiveFeatureIndex(id)}
                            >
                                <div className="nora-feature-text-block">
                                    <h3 className="nora-feature-heading">{title}</h3>
                                    <p className="nora-feature-desc">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};