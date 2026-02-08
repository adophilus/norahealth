import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// AI COACH MESSAGE COMPONENT
// 
// Purpose: Contextual encouragement and guidance from "AI Coach"
// Psychology: Parasocial relationship + personalized tips = higher engagement
// Data flow: Will pull from /api/ai/coach/daily-message
// Features: Different message types (motivation, tip, celebration, reminder)
// ═══════════════════════════════════════════════════════════════════════════

type MessageType = 'motivation' | 'tip' | 'celebration' | 'reminder' | 'challenge';

interface CoachMessage {
    type: MessageType;
    title: string;
    content: string;
    context?: string;        // e.g. "Based on your 4-day streak"
    actionLabel?: string;    // Optional CTA
    actionUrl?: string;
}

interface AiCoachMessageProps {
    message: CoachMessage;
    onAction?: () => void;
}

export const AiCoachMessage: React.FC<AiCoachMessageProps> = ({ message, onAction }) => {

    // Icon and color per message type
    const typeConfig: Record<MessageType, { icon: string; color: string; bgColor: string }> = {
        motivation: {
            icon: '💪',
            color: 'var(--fit-primary)',
            bgColor: 'var(--fit-primary-light)'
        },
        tip: {
            icon: '💡',
            color: '#f39c12',
            bgColor: 'rgba(243,156,18,0.1)'
        },
        celebration: {
            icon: '🎉',
            color: '#27ae60',
            bgColor: 'rgba(39,174,96,0.1)'
        },
        reminder: {
            icon: '🔔',
            color: '#3498db',
            bgColor: 'rgba(52,152,219,0.1)'
        },
        challenge: {
            icon: '🎯',
            color: '#e74c3c',
            bgColor: 'rgba(231,76,60,0.1)'
        },
    };

    const config = typeConfig[message.type];

    return (
        <div
            className="fit-card fit-coach-message"
            style={{
                borderLeft: `4px solid ${config.color}`,
            }}
        >
            {/* Icon badge */}
            <div
                className="fit-coach-message__icon-badge"
                style={{
                    background: config.bgColor,
                    color: config.color,
                }}
            >
                <span className="fit-coach-message__icon">{config.icon}</span>
            </div>

            {/* Content */}
            <div className="fit-coach-message__content">
                {message.context && (
                    <div className="fit-coach-message__context">
                        {message.context}
                    </div>
                )}

                <h3 className="fit-coach-message__title">
                    {message.title}
                </h3>

                <p className="fit-coach-message__text">
                    {message.content}
                </p>

                {message.actionLabel && (
                    <button
                        className="fit-coach-message__action"
                        onClick={onAction}
                        style={{ color: config.color }}
                    >
                        {message.actionLabel} →
                    </button>
                )}
            </div>

            {/* AI badge */}
            <div className="fit-coach-message__ai-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                    <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                </svg>
                <span>AI Coach</span>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA FOR TESTING
// ═══════════════════════════════════════════════════════════════════════════

export const mockMotivationMessage: CoachMessage = {
    type: 'motivation',
    context: 'Based on your 4-day streak',
    title: "You're building unstoppable momentum! 🔥",
    content: 'Consistency beats intensity every time. Four days in a row shows real commitment. Keep this energy going — your future self will thank you.',
};

export const mockTipMessage: CoachMessage = {
    type: 'tip',
    title: 'Pro Tip: Prioritize protein after strength training',
    content: 'Within 2 hours of your workout, aim for 20-30g of protein to maximize muscle recovery and growth. Your body is primed to use it efficiently.',
    actionLabel: 'View High-Protein Meals',
};

export const mockCelebrationMessage: CoachMessage = {
    type: 'celebration',
    title: 'Week 1 Complete — Amazing Work! 🎉',
    content: 'You hit all 5 workouts this week and stayed within your calorie targets. This is how lasting transformations happen. Ready for week 2?',
    actionLabel: 'See Your Stats',
};

export const mockReminderMessage: CoachMessage = {
    type: 'reminder',
    title: 'Hydration Check',
    content: "You've been crushing your workouts, but don't forget: water is just as important as reps. Aim for 8 glasses today, especially pre-workout.",
};

export const mockChallengeMessage: CoachMessage = {
    type: 'challenge',
    title: 'Challenge: Add 10% more weight this week',
    content: 'Your form on strength exercises has been solid. Time to progressive overload — increase your weights by 5-10% and watch your gains accelerate.',
    actionLabel: 'Update Workout Plan',
};