import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// AI NUTRITION PANEL COMPONENT
// 
// Purpose: AI assistant for meal plan adjustments and dietary modifications
// Psychology: Removes decision paralysis, provides expert guidance on-demand
// Data flow: POST /api/ai/nutrition/adjust
// 
// Features:
// - Quick action buttons (common requests)
// - Custom prompt input
// - Context-aware responses (knows user location, diet type, budget)
// - Meal regeneration based on constraints
// ═══════════════════════════════════════════════════════════════════════════

interface AiNutritionPanelProps {
    onSendMessage?: (message: string, context?: any) => Promise<void>;
    quickActions?: string[];
    isLoading?: boolean;
    userContext?: {
        location?: { city: string; country: string };
        dietType?: string;
        budget?: 'low' | 'medium' | 'high';
    };
}

export const AiNutritionPanel: React.FC<AiNutritionPanelProps> = ({
    onSendMessage,
    quickActions = [
        'Make this meal cheaper',
        'Replace with local Nigerian food',
        'Make this vegetarian',
        'Reduce calories by 200',
        'Add more protein',
        'Suggest meal prep tips',
    ],
    isLoading = false,
    userContext,
}) => {

    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim() || isSending) return;

        setIsSending(true);
        try {
            await onSendMessage?.(inputValue, userContext);
            setInputValue(''); // Clear input after successful send
        } catch (error) {
            console.error('AI nutrition error:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleQuickAction = async (action: string) => {
        if (isSending) return;

        setIsSending(true);
        try {
            await onSendMessage?.(action, userContext);
        } catch (error) {
            console.error('AI quick action error:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fit-ai-nutrition">
            {/* Header */}
            <div className="fit-ai-nutrition__header">
                <div className="fit-ai-nutrition__header-left">
                    <div className="fit-ai-nutrition__icon">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
                            <path d="M9 14h10M14 9v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="14" cy="14" r="3" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="fit-ai-nutrition__title">AI Nutrition Assistant</h3>
                        <p className="fit-ai-nutrition__subtitle">
                            Adjust meals based on budget, preferences, and local availability
                        </p>
                    </div>
                </div>

                <span className="fit-ai-nutrition__badge">AI</span>
            </div>

            {/* User context display (if available) */}
            {userContext && (
                <div className="fit-ai-nutrition__context">
                    {userContext.location && (
                        <span className="fit-ai-nutrition__context-tag">
                            📍 {userContext.location.city}
                        </span>
                    )}
                    {userContext.dietType && (
                        <span className="fit-ai-nutrition__context-tag">
                            🎯 {userContext.dietType.replace('_', ' ')}
                        </span>
                    )}
                    {userContext.budget && (
                        <span className="fit-ai-nutrition__context-tag">
                            💰 {userContext.budget} budget
                        </span>
                    )}
                </div>
            )}

            {/* Quick actions */}
            <div className="fit-ai-nutrition__quick-actions">
                <span className="fit-ai-nutrition__quick-label">Quick actions:</span>
                <div className="fit-ai-nutrition__quick-buttons">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className="fit-ai-nutrition__quick-btn"
                            onClick={() => handleQuickAction(action)}
                            disabled={isSending}
                        >
                            {action}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom prompt input */}
            <form className="fit-ai-nutrition__input-form" onSubmit={handleSubmit}>
                <div className="fit-ai-nutrition__input-wrapper">
                    <input
                        type="text"
                        className="fit-ai-nutrition__input"
                        placeholder="Ask your nutrition assistant... (e.g., 'Can I substitute chicken with fish?')"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        className="fit-ai-nutrition__send-btn"
                        disabled={!inputValue.trim() || isSending}
                    >
                        {isSending ? (
                            <span className="fit-ai-nutrition__loading">⏳</span>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 10h14M13 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </form>

            {/* Helper text */}
            <div className="fit-ai-nutrition__footer">
                <div className="fit-ai-nutrition__examples">
                    <span className="fit-ai-nutrition__examples-label">💡 Try asking:</span>
                    <ul className="fit-ai-nutrition__examples-list">
                        <li>"What can I buy at Mile 12 Market for this week?"</li>
                        <li>"Make my dinner plan dairy-free"</li>
                        <li>"Suggest a Nigerian alternative to pasta"</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AiNutritionPanel;