import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// NEXT SESSION CARD COMPONENT
// 
// Purpose: Shows upcoming scheduled workout session
// Psychology: Creates anticipation + pre-commitment (scheduled = more likely to do)
// Data flow: Will pull from /api/workouts/schedule/next
// Features: Quick start button, reminder indicator, countdown if today
// ═══════════════════════════════════════════════════════════════════════════

interface WorkoutSession {
    id: string;
    workoutName: string;
    workoutType: 'strength' | 'cardio' | 'mobility' | 'hiit' | 'yoga';
    scheduledAt: string;      // ISO date string
    duration: number;         // minutes
    hasReminder: boolean;
    isCompleted: boolean;
}

interface NextSessionCardProps {
    session: WorkoutSession | null;
    onStartSession?: (sessionId: string) => void;
    onReschedule?: () => void;
}

export const NextSessionCard: React.FC<NextSessionCardProps> = ({
    session,
    onStartSession,
    onReschedule
}) => {

    // ── CASE 1: No upcoming session
    if (!session) {
        return (
            <div className="fit-card fit-session-card fit-session-card--empty">
                <div className="fit-session-card__empty-state">
                    <div className="fit-session-card__icon fit-session-card__icon--calendar">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <rect x="6" y="8" width="28" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
                            <path d="M6 14h28M13 5v6M27 5v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="20" cy="22" r="2" fill="currentColor" />
                        </svg>
                    </div>

                    <h3 className="fit-session-card__empty-title">
                        No Scheduled Sessions
                    </h3>

                    <p className="fit-session-card__empty-desc">
                        Schedule your next workout to stay on track with your fitness goals.
                    </p>

                    <button
                        className="fit-session-card__schedule-btn"
                        onClick={onReschedule}
                    >
                        Schedule Workout
                    </button>
                </div>
            </div>
        );
    }

    // ── CASE 2: Session exists → Parse and display
    const scheduledDate = new Date(session.scheduledAt);
    const now = new Date();
    const isToday = scheduledDate.toDateString() === now.toDateString();
    const isTomorrow = scheduledDate.toDateString() === new Date(now.getTime() + 86400000).toDateString();

    // Format time
    const timeStr = scheduledDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Format day label
    let dayLabel: string;
    if (isToday) {
        dayLabel = 'Today';
    } else if (isTomorrow) {
        dayLabel = 'Tomorrow';
    } else {
        dayLabel = scheduledDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    }

    // Workout type icons
    const typeIcons: Record<WorkoutSession['workoutType'], string> = {
        strength: '💪',
        cardio: '🏃',
        mobility: '🧘',
        hiit: '⚡',
        yoga: '🕉️',
    };

    // Time until session (if today)
    const getTimeUntil = (): string | null => {
        if (!isToday) return null;
        const diffMs = scheduledDate.getTime() - now.getTime();
        if (diffMs < 0) return 'Now';

        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);

        if (hours > 0) return `in ${hours}h ${minutes}m`;
        if (minutes > 0) return `in ${minutes}m`;
        return 'Now';
    };

    const timeUntil = getTimeUntil();

    return (
        <div className="fit-card fit-session-card">
            {/* Header */}
            <div className="fit-session-card__header">
                <span className="fit-session-card__label">Next Session</span>
                {session.hasReminder && (
                    <span className="fit-session-card__reminder-badge">
                        <span className="fit-session-card__reminder-icon">🔔</span>
                        Reminder set
                    </span>
                )}
            </div>

            {/* Session details */}
            <div className="fit-session-card__body">
                <div className="fit-session-card__time-block">
                    <div className="fit-session-card__day-label">
                        {dayLabel}
                        {timeUntil && (
                            <span className="fit-session-card__countdown"> • {timeUntil}</span>
                        )}
                    </div>
                    <div className="fit-session-card__time">{timeStr}</div>
                </div>

                <div className="fit-session-card__workout-info">
                    <div className="fit-session-card__type-icon">
                        {typeIcons[session.workoutType]}
                    </div>
                    <div className="fit-session-card__details">
                        <h3 className="fit-session-card__workout-name">
                            {session.workoutName}
                        </h3>
                        <div className="fit-session-card__meta">
                            <span>{session.duration} min</span>
                            <span>•</span>
                            <span className="fit-session-card__type-label">
                                {session.workoutType}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="fit-session-card__actions">
                <button
                    className="fit-session-card__action fit-session-card__action--primary"
                    onClick={() => onStartSession?.(session.id)}
                >
                    {isToday && timeUntil === 'Now' ? 'Start Now' : 'Start Early'}
                </button>
                <button
                    className="fit-session-card__action fit-session-card__action--secondary"
                    onClick={onReschedule}
                >
                    Reschedule
                </button>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA FOR TESTING
// ═══════════════════════════════════════════════════════════════════════════

// Session scheduled for today at 6 PM
export const mockTodaySession: WorkoutSession = {
    id: 'session_001',
    workoutName: 'Upper Body Strength',
    workoutType: 'strength',
    scheduledAt: new Date(
        new Date().setHours(18, 0, 0, 0)
    ).toISOString(),
    duration: 40,
    hasReminder: true,
    isCompleted: false,
};

// Session scheduled for tomorrow
export const mockTomorrowSession: WorkoutSession = {
    id: 'session_002',
    workoutName: 'Morning Yoga Flow',
    workoutType: 'yoga',
    scheduledAt: new Date(
        new Date().getTime() + 86400000  // +1 day
    ).toISOString(),
    duration: 30,
    hasReminder: false,
    isCompleted: false,
};

export const mockNoSession = null;