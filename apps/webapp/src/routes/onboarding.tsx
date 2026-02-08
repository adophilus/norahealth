import React, { useState, useReducer, createContext, useContext, Dispatch } from "react";
import { createFileRoute } from '@tanstack/react-router'

/** Every field the onboarding form collects. */
interface OnboardingFormData {
    name: string;
    email: string;
    ageGroup: string;
    gender: string;
    weightClass: string;
    hasInjuries: boolean | null;
    injuryDetail: string;
    hasMedical: boolean | null;
    medicalDetail: string;
    fitnessGoals: string[];
    workoutMinutes: string;
    hasAllergies: boolean | null;
    allergyDetail: string;
    country: string;
    city: string;
    _errors: OnboardingErrors;
}

// error validation shape
interface OnboardingErrors {
    name?: string;
    email?: string;
    ageGroup?: string;
    gender?: string;
    weightClass?: string;
    hasInjuries?: string;
    injuryDetail?: string;
    hasMedical?: string;
    medicalDetail?: string;
    fitnessGoals?: string;
    workoutMinutes?: string;
    hasAllergies?: string;
    allergyDetail?: string;
    country?: string;
    city?: string;
}


/** Discriminated union — every action the reducer understands. */
type OnboardingAction =
    | { type: "SET_FIELD"; field: keyof OnboardingFormData; value: OnboardingFormData[keyof OnboardingFormData] }
    | { type: "TOGGLE_GOAL"; goal: string }
    | { type: "SET_ERROR"; field: keyof OnboardingErrors; error: string | undefined }
    | { type: "CLEAR_ERRORS" }
    | { type: "SET_ERRORS"; errors: OnboardingErrors };

/** Shape exposed by the context to every step component. */
interface OnboardingContextValue {
    data: OnboardingFormData;
    dispatch: Dispatch<OnboardingAction>;
}

/** Props for each step entry in the STEPS config array. */
interface StepConfig {
    id: number;
    title: string;
    subtitle: string;
    Component: React.FC;
}

/** Props accepted by the root <Onboarding /> component. */
interface OnboardingProps {
    onComplete?: (data: OnboardingFormData) => void;
}

// ═══════════════════════════════════════════════════════════  CONTEXT + REDUCER

const INITIAL_DATA: OnboardingFormData = {
    name: "",
    email: "",
    ageGroup: "",
    gender: "",
    weightClass: "",
    hasInjuries: null,
    injuryDetail: "",
    hasMedical: null,
    medicalDetail: "",
    fitnessGoals: [],
    workoutMinutes: "",
    hasAllergies: null,
    allergyDetail: "",
    country: "",
    city: "",
    _errors: {},
};

// Context is created with a dummy default; useOnboarding() throws if it's ever
// actually reached, so the non-null assertion on the consumer side is safe.
const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function onboardingReducer(state: OnboardingFormData, action: OnboardingAction): OnboardingFormData {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };

        case "TOGGLE_GOAL": {
            const goals = state.fitnessGoals;
            return {
                ...state,
                fitnessGoals: goals.includes(action.goal)
                    ? goals.filter((g) => g !== action.goal)
                    : [...goals, action.goal],
            };
        }
        case "SET_ERROR":
            return {
                ...state,
                _errors: { ...state._errors, [action.field]: action.error },
            };

        case "CLEAR_ERRORS":
            return { ...state, _errors: {} };

        case "SET_ERRORS":
            return { ...state, _errors: action.errors };

        default:
            return state;
    }
}

/** Typed hook — throws at dev time if used outside the provider. */
function useOnboarding(): OnboardingContextValue {
    const ctx = useContext(OnboardingContext);
    if (!ctx) throw new Error("useOnboarding must be used inside <Onboarding />");
    return ctx;
}

// ═══════════════════════════════════════════════════════════  SVG ICONS
// All icons are zero-prop components.  Colour is driven by `currentColor` so
// the parent's `color` style propagates automatically.

const IconMale: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="22" r="8" />
        <path d="M26 14l6-6M26 8h6v6" />
    </svg>
);

const IconFemale: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="18" r="8" />
        <path d="M20 26v8M16 30h8" />
    </svg>
);

const IconOther: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="9" />
        <path d="M20 14v12M14 20h12" />
    </svg>
);

const IconSlim: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="10" r="4" />
        <path d="M20 14v16" />
        <path d="M20 20l-4 4M20 20l4 4" />
        <path d="M20 30l-3 6M20 30l3 6" />
    </svg>
);

const IconMedium: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="10" r="4" />
        <path d="M20 14v14" />
        <path d="M20 18l-5 5M20 18l5 5" />
        <path d="M20 28l-3 6M20 28l3 6" />
    </svg>
);

const IconHeavy: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="10" r="4" />
        <path d="M20 14v12" />
        <path d="M20 16l-6 6M20 16l6 6" />
        <path d="M20 26l-4 8M20 26l4 8" />
    </svg>
);

const IconLosing: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12l8 8 6-6 10 10" />
        <path d="M24 32l6-10" />
        <path d="M24 32h6" />
    </svg>
);

const IconMuscle: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 28c0-4 3-7 6-7h8c3 0 6 3 6 7" />
        <path d="M14 21v-6a6 6 0 0112 0v6" />
        <path d="M10 28l-2 4M30 28l2 4" />
    </svg>
);

const IconEndurance: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="12" r="4" />
        <path d="M16 16l-4 8h6l-2 10" />
        <path d="M24 16l4 8h-6l2 10" />
        <path d="M18 34h4" />
    </svg>
);

const IconGeneral: React.FC = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="10" />
        <path d="M20 14v6l4 2" />
    </svg>
);

const IconCheck: React.FC = () => (
    <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6l3 3 5-5" />
    </svg>
);

const IconBack: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 4L6 8l4 4" />
    </svg>
);

const IconNext: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4l4 4-4 4" />
    </svg>
);

//  SHARED SUB-TYPES
// Used by StepTwo, StepThree, StepSix — keeps the option arrays type-safe.

interface CardOption {
    value: string;
    label: string;
    image: string | undefined;
    Icon: React.FC;
}


//  VALIDATION RULES
/** Email regex — standard RFC 5322 simplified pattern. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate a single field — returns error string or undefined. */
function validateField(field: keyof OnboardingFormData, value: any): string | undefined {
    switch (field) {
        // ── Step 1 ──
        case "name":
            if (!value || value.trim().length === 0) return "Name is required";
            if (value.trim().length < 2) return "Name must be at least 2 characters";
            return undefined;

        case "email":
            if (!value || value.trim().length === 0) return "Email is required";
            if (!EMAIL_REGEX.test(value)) return "Enter a valid email address";
            return undefined;

        case "ageGroup":
            if (!value) return "Please select your age group";
            return undefined;

        // ── Step 2 ──
        case "gender":
            if (!value) return "Please select your gender";
            return undefined;

        // ── Step 3 ──
        case "weightClass":
            if (!value) return "Please select your body type";
            return undefined;

        // ── Step 4 ──
        case "hasInjuries":
            if (value === null) return "Please answer this question";
            return undefined;

        case "injuryDetail":
            // Only required if hasInjuries is true — this check happens at step level
            return undefined;

        // ── Step 5 ──
        case "hasMedical":
            if (value === null) return "Please answer this question";
            return undefined;

        case "medicalDetail":
            // Only required if hasMedical is true
            return undefined;

        // ── Step 6 ──
        case "fitnessGoals":
            if (!value || value.length === 0) return "Please select at least one goal";
            return undefined;

        // ── Step 7 ──
        case "workoutMinutes":
            if (!value || value.trim().length === 0) return "Please enter available time";
            const num = parseInt(value, 10);
            if (isNaN(num) || num < 0) return "Enter a valid number";
            return undefined;

        case "hasAllergies":
            if (value === null) return "Please answer this question";
            return undefined;

        case "allergyDetail":
            // Only required if hasAllergies is true
            return undefined;

        case "country":
            if (!value || value.trim().length === 0) return "Country is required";
            return undefined;

        case "city":
            if (!value || value.trim().length === 0) return "City is required";
            return undefined;

        default:
            return undefined;
    }
}

/** Validate all fields for a given step — returns error object. */
function validateStep(stepIndex: number, data: OnboardingFormData): OnboardingErrors {
    const errors: OnboardingErrors = {};

    switch (stepIndex) {
        case 0: // Step 1
            errors.name = validateField("name", data.name);
            errors.email = validateField("email", data.email);
            errors.ageGroup = validateField("ageGroup", data.ageGroup);
            break;

        case 1: // Step 2
            errors.gender = validateField("gender", data.gender);
            break;

        case 2: // Step 3
            errors.weightClass = validateField("weightClass", data.weightClass);
            break;

        case 3: // Step 4
            errors.hasInjuries = validateField("hasInjuries", data.hasInjuries);
            if (data.hasInjuries === true && (!data.injuryDetail || data.injuryDetail.trim().length === 0)) {
                errors.injuryDetail = "Please describe your injury";
            }
            break;

        case 4: // Step 5
            errors.hasMedical = validateField("hasMedical", data.hasMedical);
            if (data.hasMedical === true && (!data.medicalDetail || data.medicalDetail.trim().length === 0)) {
                errors.medicalDetail = "Please describe your condition";
            }
            break;

        case 5: // Step 6
            errors.fitnessGoals = validateField("fitnessGoals", data.fitnessGoals);
            break;

        case 6: // Step 7
            errors.workoutMinutes = validateField("workoutMinutes", data.workoutMinutes);
            errors.hasAllergies = validateField("hasAllergies", data.hasAllergies);
            if (data.hasAllergies === true && (!data.allergyDetail || data.allergyDetail.trim().length === 0)) {
                errors.allergyDetail = "Please specify your allergies";
            }
            errors.country = validateField("country", data.country);
            errors.city = validateField("city", data.city);
            break;
    }

    // Strip undefined values so we can check Object.keys(errors).length
    Object.keys(errors).forEach((key) => {
        if (errors[key as keyof OnboardingErrors] === undefined) {
            delete errors[key as keyof OnboardingErrors];
        }
    });

    return errors;
}

/** Validate the entire form — returns error object. */
function validateAllSteps(data: OnboardingFormData): OnboardingErrors {
    let allErrors: OnboardingErrors = {};
    for (let i = 0; i < 7; i++) {
        const stepErrors = validateStep(i, data);
        allErrors = { ...allErrors, ...stepErrors };
    }
    return allErrors;
}


// STEP COMPONENTS
// ── Step 1: Name / Email / Age group 
const StepOne: React.FC = () => {
    const { data, dispatch } = useOnboarding();
    const errors = data._errors;

    return (
        <div className="onb-step-body">
            <div className="onb-field">
                <label className="onb-label">Full Name</label>
                <input
                    className={`onb-input${errors.name ? " onb-input--error" : ""}`}
                    type="text"
                    placeholder="e.g. Amina Okafor"
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })
                    }
                />
                {errors.name && <span className="onb-error">{errors.name}</span>}
            </div>

            <div className="onb-field">
                <label className="onb-label">Email Address</label>
                <input
                    className={`onb-input${errors.email ? " onb-input--error" : ""}`}
                    type="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })
                    }
                />
                {errors.email && <span className="onb-error">{errors.email}</span>}
            </div>

            <div className="onb-field">
                <label className="onb-label">Age Group</label>
                <select
                    className={`onb-input onb-select${errors.ageGroup ? " onb-input--error" : ""}`}
                    value={data.ageGroup}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        dispatch({ type: "SET_FIELD", field: "ageGroup", value: e.target.value })
                    }
                >
                    <option value="" disabled>Select your age group</option>
                    <option value="17-25">17 – 25</option>
                    <option value="26-40">26 – 40</option>
                    <option value="41-60+">41 – 60+</option>
                </select>
                {errors.ageGroup && <span className="onb-error">{errors.ageGroup}</span>}
            </div>
        </div>
    );
};

// ── Step 2: Gender ────────────────────────────────────────
const StepTwo: React.FC = () => {
    const { data, dispatch } = useOnboarding();
    const errors = data._errors;

    const options: CardOption[] = [
        { value: "male", label: "Male", Icon: IconMale, image: '/hgj.png' },
        { value: "female", label: "Female", Icon: IconFemale, image: undefined },
        { value: "other", label: "Other", Icon: IconOther, image: undefined },
    ];

    return (
        <div className="onb-step-body">
            <div className="onb-cards onb-cards--3">
                {options.map(({ value, label, Icon }) => {
                    const selected = data.gender === value;
                    return (
                        <div
                            key={value}
                            className={`onb-card${selected ? " onb-card--selected" : ""}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => dispatch({ type: "SET_FIELD", field: "gender", value })}
                            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                                e.key === "Enter" && dispatch({ type: "SET_FIELD", field: "gender", value })
                            }
                        >
                            <div className="onb-card-icon" style={{ color: selected ? "var(--onb-primary)" : "var(--onb-muted)" }}>
                                <Icon />
                            </div>
                            <span className="onb-card-label">{label}</span>
                        </div>
                    );
                })}
            </div>
            {errors.gender && <span className="onb-error">{errors.gender}</span>}
        </div>
    );
};

// ── Step 3: Weight class ──────────────────────────────────
const StepThree: React.FC = () => {
    const { data, dispatch } = useOnboarding();
    const errors = data._errors;

    const options: CardOption[] = [
        { value: "slim", label: "Slim", Icon: IconSlim, image: '/S.png' },
        { value: "medium", label: "Medium", Icon: IconMedium, image: '/M.png' },
        { value: "heavy", label: "Heavy", Icon: IconHeavy, image: '/XL.png' },
    ];

    return (
        <div className="onb-step-body">
            <div className="onb-cards onb-cards--3">
                {options.map(({ value, label, image }) => {
                    const selected = data.weightClass === value;
                    return (
                        <div
                            key={value}
                            className={`onb-card${selected ? " onb-card--selected" : ""}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => dispatch({ type: "SET_FIELD", field: "weightClass", value })}
                            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                                e.key === "Enter" && dispatch({ type: "SET_FIELD", field: "weightClass", value })
                            }
                        >
                            <div className="onb-card-icon" style={{ color: selected ? "var(--onb-primary)" : "var(--onb-muted)" }}>
                                {/* <Icon /> */}
                                <img src={image} alt="nora-health images" />
                            </div>
                            <span className="onb-card-label">{label}</span>
                        </div>
                    );
                })}
            </div>
            {errors.weightClass && <span className="onb-error">{errors.weightClass}</span>}
        </div>
    );
};

// ── Step 4: Injuries ──────────────────────────────────────
const StepFour: React.FC = () => {
    const { data, dispatch } = useOnboarding();
    const errors = data._errors;

    return (
        <div className="onb-step-body">
            <div className="onb-toggle-row">
                <button
                    className={`onb-toggle-btn onb-toggle-btn--yes${data.hasInjuries === true ? " onb-toggle-btn--active" : ""}`}
                    onClick={() => dispatch({ type: "SET_FIELD", field: "hasInjuries", value: true })}
                >Yes</button>
                <button
                    className={`onb-toggle-btn onb-toggle-btn--no${data.hasInjuries === false ? " onb-toggle-btn--active" : ""}`}
                    onClick={() => {
                        dispatch({ type: "SET_FIELD", field: "hasInjuries", value: false });
                        dispatch({ type: "SET_FIELD", field: "injuryDetail", value: "" });
                    }}
                >No</button>
            </div>
            {errors.hasInjuries && <span className="onb-error">{errors.hasInjuries}</span>}

            <div className={`onb-conditional${data.hasInjuries ? " onb-conditional--open" : ""}`}>
                <div className="onb-field">
                    <label className="onb-label">Describe your injury</label>
                    <input
                        className={`onb-input${errors.injuryDetail ? " onb-input--error" : ""}`}
                        type="text"
                        placeholder="e.g. torn ACL, lower back pain…"
                        value={data.injuryDetail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            dispatch({ type: "SET_FIELD", field: "injuryDetail", value: e.target.value })
                        }
                    />
                    {errors.injuryDetail && <span className="onb-error">{errors.injuryDetail}</span>}
                </div>
            </div>
        </div>
    );
};

// ── Step 5: Medical conditions ────────────────────────────
const StepFive: React.FC = () => {
    const { data, dispatch } = useOnboarding();
    const errors = data._errors;

    return (
        <div className="onb-step-body">
            <div className="onb-toggle-row">
                <button
                    className={`onb-toggle-btn onb-toggle-btn--yes${data.hasMedical === true ? " onb-toggle-btn--active" : ""}`}
                    onClick={() => dispatch({ type: "SET_FIELD", field: "hasMedical", value: true })}
                >Yes</button>
                <button
                    className={`onb-toggle-btn onb-toggle-btn--no${data.hasMedical === false ? " onb-toggle-btn--active" : ""}`}
                    onClick={() => {
                        dispatch({ type: "SET_FIELD", field: "hasMedical", value: false });
                        dispatch({ type: "SET_FIELD", field: "medicalDetail", value: "" });
                    }}
                >No</button>
            </div>
            {errors.hasMedical && <span className="onb-error">{errors.hasMedical}</span>}

            <div className={`onb-conditional${data.hasMedical ? " onb-conditional--open" : ""}`}>
                <div className="onb-field">
                    <label className="onb-label">Describe your condition</label>
                    <input
                        className={`onb-input${errors.medicalDetail ? " onb-input--error" : ""}`}
                        type="text"
                        placeholder="e.g. diabetes, hypertension…"
                        value={data.medicalDetail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            dispatch({ type: "SET_FIELD", field: "medicalDetail", value: e.target.value })
                        }
                    />
                    {errors.medicalDetail && <span className="onb-error">{errors.medicalDetail}</span>}
                </div>
            </div>
        </div>
    );
};

// ── Step 6: Fitness goals (multi-select) ──────────────────
const StepSix: React.FC = () => {
    const { data, dispatch } = useOnboarding();
    const errors = data._errors;

    const options: CardOption[] = [
        { value: "weight-loss", label: "Weight Loss", Icon: IconLosing, image: '/888412.png' },
        { value: "muscle-gain", label: "Muscle Gain", Icon: IconMuscle, image: '/1340471.png' },
        { value: "endurance", label: "Endurance", Icon: IconEndurance, image: '/318612518714.png' },
        { value: "general-health", label: "General Health", Icon: IconGeneral, image: '/817219738.png' },
    ];

    return (
        <div className="onb-step-body">
            <div className="onb-cards onb-cards--2x2">
                {options.map(({ value, label, Icon, image }) => {
                    const selected = data.fitnessGoals.includes(value);
                    return (
                        <div
                            key={value}
                            className={`onb-card onb-card--multi${selected ? " onb-card--selected" : ""}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => dispatch({ type: "TOGGLE_GOAL", goal: value })}
                            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                                e.key === "Enter" && dispatch({ type: "TOGGLE_GOAL", goal: value })
                            }
                        >
                            <div className="onb-card-check"><IconCheck /></div>
                            <div className="onb-card-icon" style={{ color: selected ? "var(--onb-primary)" : "var(--onb-muted)" }}>
                                {/* <Icon /> */}
                                <img src={image} alt="nora-health images" />
                            </div>
                            <span className="onb-card-label">{label}</span>
                        </div>
                    );
                })}
            </div>
            {errors.fitnessGoals && <span className="onb-error">{errors.fitnessGoals}</span>}
        </div>
    );
};

// ── Step 7: Workout time / Allergies / Location ──────────
const StepSeven: React.FC = () => {
    const { data, dispatch } = useOnboarding();
    const errors = data._errors;

    return (
        <div className="onb-step-body">
            <div className="onb-field">
                <label className="onb-label">Time available for workouts (min/week)</label>
                <input
                    className={`onb-input${errors.workoutMinutes ? " onb-input--error" : ""}`}
                    type="number"
                    min="0"
                    placeholder="e.g. 150"
                    value={data.workoutMinutes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        dispatch({ type: "SET_FIELD", field: "workoutMinutes", value: e.target.value })
                    }
                />
                {errors.workoutMinutes && <span className="onb-error">{errors.workoutMinutes}</span>}
            </div>

            <label className="onb-label">Do you have any allergies?</label>
            <div className="onb-toggle-row">
                <button
                    className={`onb-toggle-btn onb-toggle-btn--yes${data.hasAllergies === true ? " onb-toggle-btn--active" : ""}`}
                    onClick={() => dispatch({ type: "SET_FIELD", field: "hasAllergies", value: true })}
                >Yes</button>
                <button
                    className={`onb-toggle-btn onb-toggle-btn--no${data.hasAllergies === false ? " onb-toggle-btn--active" : ""}`}
                    onClick={() => {
                        dispatch({ type: "SET_FIELD", field: "hasAllergies", value: false });
                        dispatch({ type: "SET_FIELD", field: "allergyDetail", value: "" });
                    }}
                >No</button>
            </div>
            {errors.hasAllergies && <span className="onb-error">{errors.hasAllergies}</span>}

            <div className={`onb-conditional${data.hasAllergies ? " onb-conditional--open" : ""}`}>
                <div className="onb-field">
                    <label className="onb-label">Specify your allergies</label>
                    <input
                        className={`onb-input${errors.allergyDetail ? " onb-input--error" : ""}`}
                        type="text"
                        placeholder="e.g. peanuts, gluten…"
                        value={data.allergyDetail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            dispatch({ type: "SET_FIELD", field: "allergyDetail", value: e.target.value })
                        }
                    />
                    {errors.allergyDetail && <span className="onb-error">{errors.allergyDetail}</span>}
                </div>
            </div>

            <div className="onb-field" style={{ marginTop: 8 }}>
                <label className="onb-label">Location</label>
                <div className="onb-location-row">
                    <input
                        className={`onb-input${errors.country ? " onb-input--error" : ""}`}
                        type="text"
                        placeholder="Country"
                        value={data.country}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            dispatch({ type: "SET_FIELD", field: "country", value: e.target.value })
                        }
                    />
                    <input
                        className={`onb-input${errors.city ? " onb-input--error" : ""}`}
                        type="text"
                        placeholder="City"
                        value={data.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            dispatch({ type: "SET_FIELD", field: "city", value: e.target.value })
                        }
                    />
                    {errors.country && <span className="onb-error">{errors.country}</span>}
                    {errors.city && <span className="onb-error">{errors.city}</span>}
                </div>
            </div>
        </div>
    );
};

// STEP CONFIG
// Single source of truth for step metadata.  Adding a new step = one object.

const STEPS: StepConfig[] = [
    { id: 1, title: "About You", subtitle: "Tell us a little about yourself", Component: StepOne },
    { id: 2, title: "Gender", subtitle: "Select your gender", Component: StepTwo },
    { id: 3, title: "Body Type", subtitle: "Which best describes your build?", Component: StepThree },
    { id: 4, title: "Injuries", subtitle: "Do you have any existing injuries?", Component: StepFour },
    { id: 5, title: "Medical Conditions", subtitle: "Any medical conditions we should know?", Component: StepFive },
    { id: 6, title: "Fitness Goals", subtitle: "Pick one or more goals", Component: StepSix },
    { id: 7, title: "Schedule & Details", subtitle: "A few final details", Component: StepSeven },
];


const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState<number>(0);
    const [formData, formDispatch] = useReducer(onboardingReducer, INITIAL_DATA);

    const currentStep = STEPS[step];
    const StepComponent = currentStep.Component;
    const isFirst = step === 0;
    const isLast = step === STEPS.length - 1;
    const progress = ((step + 1) / STEPS.length) * 100;

    const goBack = () => setStep((s) => Math.max(0, s - 1));
    const goNext = () => {
        // Clear previous errors
        formDispatch({ type: "CLEAR_ERRORS" });

        // Validate current step
        const stepErrors = validateStep(step, formData);

        if (Object.keys(stepErrors).length > 0) {
            // Validation failed — set errors and block navigation
            formDispatch({ type: "SET_ERRORS", errors: stepErrors });
            return;
        }

        // Validation passed
        if (isLast) {
            // Final step — run full validation before calling onComplete
            const allErrors = validateAllSteps(formData);
            if (Object.keys(allErrors).length > 0) {
                formDispatch({ type: "SET_ERRORS", errors: allErrors });
                return;
            }
            onComplete?.(formData);
        } else {
            setStep((s) => s + 1);
        }
    };

    return (
        <OnboardingContext.Provider value={{ data: formData, dispatch: formDispatch }}>
            {/* Scoped stylesheet — injected once, lives with this component */}
            <style dangerouslySetInnerHTML={{ __html: CSS }} />

            <div className="onb-root">
                {/* ── Header ── */}
                <header className="onb-header">
                    <a className="onb-logo" href="#">
                        <div className="onb-logo-badge" style={{ color: "var(--onb-primary)" }}>
                            <img src="/logo-black.png" alt="nora-health logo" />
                        </div>
                    </a>
                    <button className="onb-header-action">Sign In</button>
                </header>

                {/* ── Content frame ── */}
                <div className="onb-frame">
                    {/* Headline + step counter */}
                    <div className="onb-headline-row">
                        <h1 className="onb-headline">{currentStep.title}</h1>
                        <span className="onb-step-badge">Step {step + 1} of {STEPS.length}</span>
                    </div>
                    <p className="onb-subtitle">{currentStep.subtitle}</p>

                    {/* Progress bar */}
                    <div className="onb-progress-track">
                        <div className="onb-progress-fill" style={{ width: `${progress}%` }} />
                    </div>

                    {/* Active step — key forces remount + re-trigger of the fade animation */}
                    <StepComponent key={step} />

                    {/* Nav footer */}
                    <nav className="onb-nav">
                        <button className="onb-btn-back" onClick={goBack} disabled={isFirst}>
                            <IconBack /> Back
                        </button>
                        <button className="onb-btn-next" onClick={goNext}>
                            {isLast ? "Finish" : "Continue"} <IconNext />
                        </button>
                    </nav>
                </div>
            </div>
        </OnboardingContext.Provider>
    );
};

// export default Onboarding;

export const Route = createFileRoute('/onboarding')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Onboarding />;
}

export type { OnboardingFormData };