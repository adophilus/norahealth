import React from 'react';
import { BicepsFlexed, Flame } from 'lucide-react';


interface UserSnapshotProps {
    user: {
        firstName: string;
        goals: string[];        // e.g. ["Weight Loss", "Muscle Gain"]
        streak: number;         // Consecutive days active
        lastWorkout?: string;   // ISO date string or null
    };
}

export const UserSnapshot: React.FC<UserSnapshotProps> = ({ user }) => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Determine streak message
    const getStreakMessage = (days: number): string => {
        if (days === 0) return "Start your streak today!";
        if (days === 1) return "1-day streak keep going!";
        if (days < 7) return `${days}-day streak`;
        if (days < 30) return `${days}-day streak on fire!`;
        return `${days}-day streak incredible!`;
    };

    const streakMessage = getStreakMessage(user.streak);
    const hasActiveStreak = user.streak > 0;

    return (
        <div className="fit-snapshot">
            {/* Header row: Greeting + Date */}
            <div className="fit-snapshot__header">
                <h1 className="fit-snapshot__greeting">
                    Hi, {user.firstName} <span className="fit-snapshot__wave">👋</span>
                </h1>
                <p className="fit-snapshot__date">
                    {dayName}, {dateStr}
                </p>
            </div>

            {/* Goals + Streak row */}
            <div className="fit-snapshot__status">
                {/* Goals tags */}
                <div className="fit-snapshot__goals">
                    {user.goals.map((goal, idx) => (
                        <span key={idx} className="fit-snapshot__goal-tag">
                            {goal}
                        </span>
                    ))}
                </div>

                {/* Streak indicator */}
                <div className={`fit-snapshot__streak${hasActiveStreak ? ' fit-snapshot__streak--active' : ''}`}>
                    <span className="fit-snapshot__streak-icon">
                        {/* {hasActiveStreak ? <Flame /> : <BicepsFlexed />} */}
                        {hasActiveStreak ? '🔥' : '💪'}
                    </span>
                    <span className="fit-snapshot__streak-text">
                        {streakMessage}
                    </span>
                </div>
            </div>
        </div>
    );
};

// MOCK DATA FOR TESTING

export const mockUserData = {
    firstName: "Divine",
    goals: ["Weight Loss", "Endurance"],
    streak: 4,
    lastWorkout: new Date(Date.now() - 86400000).toISOString(), // Yesterday
};