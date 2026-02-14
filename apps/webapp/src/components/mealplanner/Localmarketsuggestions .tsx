import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// LOCAL MARKET SUGGESTIONS COMPONENT
// 
// Purpose: Show location-based markets where ingredients can be purchased
// Psychology: Bridges planning → action. "I know where Mile 12 is" → actually shops
// Data flow: GET /api/markets/nearby?city={city}&ingredients={ingredientIds}
// 
// Features:
// - Market name + area/district
// - Distance (if coordinates available)
// - Availability indicator (common/seasonal/specialty)
// - Price range (low/medium/high)
// - What categories they sell
// ═══════════════════════════════════════════════════════════════════════════

type Availability = 'common' | 'seasonal' | 'specialty';
type PriceRange = 'low' | 'medium' | 'high';

interface MarketSuggestion {
    id: string;
    marketName: string;
    area: string;              // e.g., "Kosofe, Lagos"
    district?: string;
    distance?: number;         // km (if user coords available)
    availability: Availability;
    priceRange?: PriceRange;
    categories: string[];      // ['grains', 'protein', 'vegetables']
    openDays?: string;         // e.g., "Mon-Sat"
}

interface UserLocation {
    country: string;
    city: string;
    state?: string;
}

interface LocalMarketSuggestionsProps {
    markets: MarketSuggestion[];
    userLocation?: UserLocation;
    onUpdateLocation?: () => void;
}

export const LocalMarketSuggestions: React.FC<LocalMarketSuggestionsProps> = ({
    markets,
    userLocation,
    onUpdateLocation,
}) => {

    // If no location data
    if (!userLocation?.city) {
        return (
            <div className="fit-market-suggestions">
                <div className="fit-market-suggestions__header">
                    <h4 className="fit-market-suggestions__title">Where to Buy</h4>
                </div>

                <div className="fit-market-suggestions__no-location">
                    <div className="fit-market-suggestions__no-location-icon">📍</div>
                    <p className="fit-market-suggestions__no-location-text">
                        We need your location to suggest nearby markets
                    </p>
                    <button
                        className="fit-market-suggestions__location-btn"
                        onClick={onUpdateLocation}
                    >
                        Update Location
                    </button>
                </div>
            </div>
        );
    }

    // If no markets found
    if (markets.length === 0) {
        return (
            <div className="fit-market-suggestions">
                <div className="fit-market-suggestions__header">
                    <h4 className="fit-market-suggestions__title">Where to Buy</h4>
                    <span className="fit-market-suggestions__location-tag">
                        📍 {userLocation.city}
                    </span>
                </div>

                <div className="fit-market-suggestions__empty">
                    <p className="fit-market-suggestions__empty-text">
                        No market data available for your area yet. Check back soon!
                    </p>
                </div>
            </div>
        );
    }

    // Availability badge config
    const availabilityConfig: Record<Availability, { label: string; color: string }> = {
        common: { label: 'Common', color: '#27ae60' },
        seasonal: { label: 'Seasonal', color: '#f39c12' },
        specialty: { label: 'Specialty', color: '#9b59b6' },
    };

    // Price range config
    const priceRangeIcons: Record<PriceRange, string> = {
        low: '$',
        medium: '$$',
        high: '$$$',
    };

    return (
        <div className="fit-market-suggestions">
            <div className="fit-market-suggestions__header">
                <h4 className="fit-market-suggestions__title">Where to Buy</h4>
                <span className="fit-market-suggestions__location-tag">
                    📍 {userLocation.city}, {userLocation.country}
                </span>
            </div>

            <div className="fit-market-suggestions__list">
                {markets.map((market) => (
                    <div key={market.id} className="fit-market-item">
                        {/* Left: Market info */}
                        <div className="fit-market-item__content">
                            <div className="fit-market-item__name">{market.marketName}</div>
                            <div className="fit-market-item__location">
                                {market.area}
                                {market.district && ` • ${market.district}`}
                            </div>

                            {/* Categories they sell */}
                            <div className="fit-market-item__categories">
                                {market.categories.map((category, idx) => (
                                    <span key={idx} className="fit-market-item__category-tag">
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right: Badges + Distance */}
                        <div className="fit-market-item__meta">
                            {/* Distance */}
                            {market.distance !== undefined && (
                                <div className="fit-market-item__distance">
                                    {market.distance < 1
                                        ? `${Math.round(market.distance * 1000)}m`
                                        : `${market.distance.toFixed(1)}km`
                                    }
                                </div>
                            )}

                            {/* Availability badge */}
                            <span
                                className="fit-market-item__availability"
                                style={{
                                    background: `${availabilityConfig[market.availability].color}20`,
                                    color: availabilityConfig[market.availability].color
                                }}
                            >
                                {availabilityConfig[market.availability].label}
                            </span>

                            {/* Price range */}
                            {market.priceRange && (
                                <span className="fit-market-item__price">
                                    {priceRangeIcons[market.priceRange]}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer note */}
            <div className="fit-market-suggestions__footer">
                <span className="fit-market-suggestions__note">
                    💡 Tip: Call ahead to confirm ingredient availability
                </span>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockMarkets: MarketSuggestion[] = [
    {
        id: 'market_001',
        marketName: 'Mile 12 Market',
        area: 'Kosofe',
        district: 'Lagos',
        distance: 3.2,
        availability: 'common',
        priceRange: 'low',
        categories: ['grains', 'vegetables', 'protein', 'spices'],
        openDays: 'Daily',
    },
    {
        id: 'market_002',
        marketName: 'Oke Arin Market',
        area: 'Lagos Island',
        district: 'Lagos',
        distance: 7.5,
        availability: 'common',
        priceRange: 'medium',
        categories: ['grains', 'spices', 'dairy'],
        openDays: 'Mon-Sat',
    },
    {
        id: 'market_003',
        marketName: 'Ikeja City Mall',
        area: 'Ikeja',
        district: 'Lagos',
        distance: 2.1,
        availability: 'specialty',
        priceRange: 'high',
        categories: ['protein', 'dairy', 'fruit'],
        openDays: 'Daily',
    },
];

export const mockUserLocation: UserLocation = {
    country: 'Nigeria',
    city: 'Lagos',
    state: 'Lagos State',
};