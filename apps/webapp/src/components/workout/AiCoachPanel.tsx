import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// AI COACH PANEL COMPONENT
// 
// Purpose: Dedicated AI interaction area - on-demand fitness coaching
// Psychology: Removes decision paralysis, provides expert guidance
// Data flow: POST /api/ai/coach/message → streams response
// 
// Features:
// - Text input for custom prompts
// - Quick action buttons (common requests)
// - Conversation history (optional, future enhancement)
// - Typing indicator during AI response
// ═══════════════════════════════════════════════════════════════════════════

interface AiCoachPanelProps {
    onSendMessage?: (message: string) => Promise<void>;
    quickActions?: string[];
    isLoading?: boolean;
}

export const AiCoachPanel: React.FC<AiCoachPanelProps> = ({
    onSendMessage,
    quickActions = [
        "Recommend today's workout",
        "Make my workout easier",
        "Suggest a rest day plan",
    ],
    isLoading = false,
}) => {

    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim() || isSending) return;

        setIsSending(true);
        try {
            await onSendMessage?.(inputValue);
            setInputValue(''); // Clear input after successful send
        } catch (error) {
            console.error('AI message error:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleQuickAction = async (action: string) => {
        if (isSending) return;

        setIsSending(true);
        try {
            await onSendMessage?.(action);
        } catch (error) {
            console.error('AI quick action error:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fit-workout-ai">
            {/* Header */}
            <div className="fit-workout-ai__header">
                <div className="fit-workout-ai__header-left">
                    <div className="fit-workout-ai__icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="fit-workout-ai__title">AI Fitness Coach</h3>
                        <p className="fit-workout-ai__subtitle">Ask anything about your training</p>
                    </div>
                </div>

                <span className="fit-workout-ai__badge">AI</span>
            </div>

            {/* Quick actions */}
            <div className="fit-workout-ai__quick-actions">
                <span className="fit-workout-ai__quick-label">Quick actions:</span>
                <div className="fit-workout-ai__quick-buttons">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className="fit-workout-ai__quick-btn"
                            onClick={() => handleQuickAction(action)}
                            disabled={isSending}
                        >
                            {action}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input form */}
            <form className="fit-workout-ai__input-form" onSubmit={handleSubmit}>
                <div className="fit-workout-ai__input-wrapper">
                    <input
                        type="text"
                        className="fit-workout-ai__input"
                        placeholder="Ask your coach... (e.g., 'How do I improve my squat form?')"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        className="fit-workout-ai__send-btn"
                        disabled={!inputValue.trim() || isSending}
                    >
                        {isSending ? (
                            <span className="fit-workout-ai__loading">⏳</span>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 10h14M13 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </form>

            {/* Helper text */}
            <div className="fit-workout-ai__footer">
                <span className="fit-workout-ai__helper-text">
                    💡 Tip: Be specific for better answers (e.g., "I have 20 minutes, what should I do?")
                </span>
            </div>
        </div>
    );
};

export default AiCoachPanel;