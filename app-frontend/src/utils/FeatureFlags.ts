export const FEATURE_FLAGS = {
    // If true, enables the live websocket / EventBus feed instead of static mock data.
    ENABLE_LIVE_FEEDS: false,

    // If true, enables experimental virtualization for very long lists (e.g., Audit Logs).
    ENABLE_VIRTUALIZATION: true,
};

/**
 * A utility to check if a feature flag is enabled.
 * In a real application, this might check a context, local storage, or LaunchDarkly.
 */
export function useFeatureFlag(flag: keyof typeof FEATURE_FLAGS): boolean {
    return FEATURE_FLAGS[flag];
}
