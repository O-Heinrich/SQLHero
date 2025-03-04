/**
 * Resize Observation Utilities Module
 * 
 * This module provides a custom React hook for flexible and dynamic element size tracking
 * using the ResizeObserver API. It offers a simplified way to observe multiple elements
 * with individual resize callbacks while managing the underlying ResizeObserver lifecycle.
 * 
 * Key Features:
 * - Dynamic registration of resize observers
 * - Single ResizeObserver instance for performance
 * - Type-safe generic implementation
 * - Automatic cleanup of observers
 * 
 * @module useResizeObserver
 * @requires react
 */

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Provides a flexible resize observer hook for tracking element size changes in React.
 * 
 * This custom hook creates a single ResizeObserver instance that can track multiple elements
 * and their individual resize callbacks. It handles the creation, observation, and cleanup
 * of resize observers dynamically.
 * 
 * @template T - The type of HTML element being observed, extending HTMLElement
 * @param options - Optional ResizeObserver configuration options
 * @returns A function to register elements and their resize callbacks
 * 
 * @example
 * function MyComponent() {
 *   const observeResize = useResizeObserver<HTMLDivElement>();
 *   const divRef = useRef<HTMLDivElement>(null);
 * 
 *   useEffect(() => {
 *     if (divRef.current) {
 *       observeResize(divRef.current, (entries) => {
 *         const { width, height } = entries[0].contentRect;
 *         console.log(`Div resized to ${width}x${height}`);
 *       });
 *     }
 *   }, [observeResize]);
 * 
 *   return <div ref={divRef}>Resizable Content</div>;
 * }
 */
export function useResizeObserver<T extends HTMLElement>(
    options?: ResizeObserverOptions
) {
    /** 
     * Ref to maintain a single ResizeObserver instance across renders 
     */
    const observer = useRef<ResizeObserver | null>(null);

    /** 
     * State to track observed elements and their individual callbacks 
     */
    const [elements, setElements] = useState<Map<T, ResizeObserverCallback>>(new Map());

    /**
     * Sets up the ResizeObserver on mount and handles dispatching callbacks
     */
    useEffect(() => {
        observer.current = new ResizeObserver((entries, obs) => {
            entries.forEach(entry => {
                const cb = elements.get(entry.target as T);
                if (cb) {
                    cb([entry], obs);
                }
            });
        });
        return () => {
            observer.current?.disconnect();
        };
    }, [elements]);

    /**
     * Observes newly added elements and handles cleanup
     */
    useEffect(() => {
        if (observer.current) {
            elements.forEach((_, element) =>
                observer.current?.observe(element, options));
        }
        return () => {
            observer.current?.disconnect();
        };
    }, [elements, options]);

    /**
     * Returns a callback to register new elements for resize observation
     * 
     * @param element - The HTML element to observe
     * @param callback - The callback to invoke on resize events
     */
    return useCallback((element: T, callback: ResizeObserverCallback) => {
        setElements(prev => new Map(prev).set(element, callback));
    }, []);
}