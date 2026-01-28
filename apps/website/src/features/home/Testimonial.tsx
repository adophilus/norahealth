import React, { useState } from 'react';
import './review.css';
import { FaStar } from "react-icons/fa";

export const NoraTestimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            text: "NoraHealth transformed my fitness journey! The AI agents created a perfect plan for my needs, and the weather-adaptive workouts kept me consistent even during rainy season.",
            name: "Sarah Mitchell",
            role: "Fitness Enthusiast",
            rating: 5,
            image: "/avatars/sarah.jpg"
        },
        {
            id: 2,
            text: "The vision-powered meal planning is incredible. I just snap photos of my fridge and get personalized recipes. Lost 15 pounds in 2 months!",
            name: "James Thompson",
            role: "Busy Professional",
            rating: 5,
            image: "/avatars/james.jpg"
        },
        {
            id: 3,
            text: "As someone with multiple food allergies, finding the right meals was always stressful. Nora's safety-first approach gives me peace of mind every single day.",
            name: "Dr. Emily Rodriguez",
            role: "Medical Professional",
            rating: 5,
            image: "/avatars/emily.jpg"
        },
        {
            id: 4,
            text: "The progress tracking dashboard motivates me to stay on track. Seeing my streaks and achievements visualized makes wellness feel like a game I'm winning!",
            name: "Michael Kim",
            role: "Tech Enthusiast",
            rating: 5,
            image: "/avatars/michael.jpg"
        },
        {
            id: 5,
            text: "I love how the marketplace feature finds ingredients nearby. It's like having a personal wellness assistant that knows exactly what I need and where to get it.",
            name: "Lisa Williams",
            role: "Home Chef",
            rating: 5,
            image: "/avatars/lisa.jpg"
        },
        {
            id: 6,
            text: "Best wellness app I've ever used! The multi-agent system feels like having a nutritionist, personal trainer, and life coach all in one. Absolutely worth it!",
            name: "David Chen",
            role: "Athlete",
            rating: 5,
            image: "/avatars/david.jpg"
        }
    ];

    return (
        <section className='nora-reviews-section'>
            {/* Animated Background Elements */}
            <div className="nora-reviews-bg-pattern"></div>

            <div className="nora-reviews-container-main">
                {/* Header */}
                <div className="nora-reviews-header-block">
                    <div className="nora-reviews-badge-pill">
                        <span>TESTIMONIALS</span>
                    </div>
                    <h2 className="nora-reviews-main-heading">
                        Loved by thousands of users
                    </h2>
                    <p className="nora-reviews-sub-text">
                        Real stories from real people achieving their wellness goals
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="nora-reviews-grid-layout">
                    {testimonials.map((testimonial, index) => (
                        <div
                            className={`nora-review-glass-card ${activeIndex === index ? 'nora-card-active' : ''}`}
                            key={testimonial.id}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            {/* Stars Rating */}
                            <div className="nora-rating-stars">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} className="nora-star-icon" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="nora-review-quote-text">
                                "{testimonial.text}"
                            </p>

                            {/* User Info */}
                            <div className="nora-reviewer-profile">
                                <div className="nora-avatar-circle" style={{
                                    background: `linear-gradient(135deg, ${getGradient(index)})`
                                }}>
                                    <span>{testimonial.name.charAt(0)}</span>
                                </div>
                                <div className="nora-reviewer-details">
                                    <h4 className="nora-reviewer-name">{testimonial.name}</h4>
                                    <p className="nora-reviewer-role">{testimonial.role}</p>
                                </div>
                            </div>

                            {/* Decorative Corner */}
                            <div className="nora-card-corner-accent"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Helper function for gradient colors
const getGradient = (index) => {
    const gradients = [
        '#667eea 0%, #764ba2 100%',
        '#f093fb 0%, #f5576c 100%',
        '#4facfe 0%, #00f2fe 100%',
        '#43e97b 0%, #38f9d7 100%',
        '#fa709a 0%, #fee140 100%',
        '#30cfd0 0%, #330867 100%'
    ];
    return gradients[index % gradients.length];
};