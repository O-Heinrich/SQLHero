import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";

/**
 * Hook to extract challenge number from URL path
 * 
 * @returns {number} Challenge number
 */
export function useChallengeNumber(): number {
    const location = useLocation();
    const challengeNo: number = useMemo(() => {
        const path = location.pathname.split('/').pop();
        return parseInt(path ?? '1', 10);
    }, [location.pathname]);
    return challengeNo;
}