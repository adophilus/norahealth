import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './review.css';
import { BsQuote } from "react-icons/bs";
import { Autoplay, Pagination } from 'swiper/modules';

export const NoraTestimonials = () => {
    const testimonials = [
        {
            id: 1,
            text: "NoraHealth transformed my fitness journey! The AI agents created a perfect plan for my needs, and the weather-adaptive workouts kept me consistent even during rainy season.",
            name: "Sarah M.",
            avatar: "nora-avatar-1"
        },
        {
            id: 2,
            text: "The vision-powered meal planning is incredible. I just snap photos of my fridge and get personalized recipes. Lost 15 pounds in 2 months!",
            name: "James T.",
            avatar: "nora-avatar-2"
        },
        {
            id: 3,
            text: "As someone with multiple food allergies, finding the right meals was always stressful. Nora's safety-first approach gives me peace of mind every single day.",
            name: "Dr. Emily R.",
            avatar: "nora-avatar-3"
        },
        {
            id: 4,
            text: "The progress tracking dashboard motivates me to stay on track. Seeing my streaks and achievements visualized makes wellness feel like a game I'm winning!",
            name: "Michael K.",
            avatar: "nora-avatar-4"
        },
        {
            id: 5,
            text: "I love how the marketplace feature finds ingredients nearby. It's like having a personal wellness assistant that knows exactly what I need and where to get it.",
            name: "Lisa W.",
            avatar: "nora-avatar-5"
        },
        {
            id: 6,
            text: "Best wellness app I've ever used! The multi-agent system feels like having a nutritionist, personal trainer, and life coach all in one. Absolutely worth it!",
            name: "David C.",
            avatar: "nora-avatar-6"
        }
    ];

    return (
        <div className='nora-testimonials-wrapper'>
            <div className="nora-testimonials-container">
                <div className="nora-testimonials-content">
                    <h5 className="nora-testimonials-heading">
                        Hear what our community has to say
                    </h5>
                    <div className="nora-testimonials-slider-wrapper">
                        <div className="nora-testimonials-desktop">
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={3}
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 9000, disableOnInteraction: false }}
                                className='nora-swiper-container'
                                style={{
                                    "--swiper-pagination-color": "#ff4757",
                                    "--swiper-pagination-bullet-inactive-color": "#999999",
                                    "--swiper-pagination-bullet-inactive-opacity": "1",
                                    "--swiper-pagination-bullet-size": "8px",
                                    "--swiper-pagination-bullet-horizontal-gap": "6px",
                                }}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                        spaceBetween: 20
                                    },
                                    768: {
                                        slidesPerView: 2,
                                        spaceBetween: 20
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 20
                                    }
                                }}
                            >
                                {testimonials.map(({ id, text, name, avatar }) => (
                                    <SwiperSlide className='nora-swiper-slide' key={id}>
                                        <div className="nora-testimonial-card">
                                            <div className="nora-quote-icon">
                                                <BsQuote />
                                            </div>
                                            <p className='nora-testimonial-text'>{text}</p>
                                            <span className='nora-reviewer-info'>
                                                <div className={`nora-reviewer-avatar ${avatar}`}></div>
                                                <h5>&nbsp; {name}</h5>
                                            </span>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};