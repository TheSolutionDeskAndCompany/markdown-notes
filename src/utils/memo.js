import { memo } from 'react';
import isEqual from 'react-fast-compare';

/**
 * Memoize a component with deep prop comparison
 * @param {React.ComponentType} Component - The component to memoize
 * @param {Object} options - Options for the memoization
 * @param {Function} [options.areEqual] - Custom equality function
 * @returns {React.MemoExoticComponent} - Memoized component
 */
export function memoWithDeepCompare(Component, { areEqual = isEqual } = {}) {
  return memo(Component, (prevProps, nextProps) => {
    try {
      return areEqual(prevProps, nextProps);
    } catch (error) {
      console.warn('Error in memo comparison:', error);
      return false;
    }
  });
}

/**
 * Memoize a component with named display name
 * @param {React.ComponentType} Component - The component to memoize
 * @param {string} displayName - Display name for the memoized component
 * @param {Object} options - Options for the memoization
 * @returns {React.MemoExoticComponent} - Memoized component with display name
 */
export function memoWithName(Component, displayName, options) {
  const MemoizedComponent = memoWithDeepCompare(Component, options);
  MemoizedComponent.displayName = `${displayName}`;
  return MemoizedComponent;
}

/**
 * Memoize a function with a cache size limit
 * @template {(...args: any[]) => any} T
 * @param {T} fn - The function to memoize
 * @param {number} [maxSize=100] - Maximum cache size
 * @returns {T & { clearCache: () => void }} - Memoized function with cache control
 */
export function memoizeWithLimit(fn, maxSize = 100) {
  const cache = new Map();
  const keys = [];

  const memoized = (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      // Move to end of keys (most recently used)
      const keyIndex = keys.indexOf(key);
      if (keyIndex > -1) {
        keys.splice(keyIndex, 1);
        keys.push(key);
      }
      return cache.get(key);
    }

    // Remove least recently used if cache is full
    if (keys.length >= maxSize) {
      const oldestKey = keys.shift();
      cache.delete(oldestKey);
    }

    const result = fn(...args);
    cache.set(key, result);
    keys.push(key);
    
    return result;
  };

  memoized.clearCache = () => {
    cache.clear();
    keys.length = 0;
  };

  return memoized;
}

/**
 * Create a memoized selector function for Redux-like state
 * @template S, R
 * @param {(...args: any[]) => R} selector - The selector function
 * @param {(...args: any[]) => any[]} [depsFn] - Dependency function
 * @returns {(...args: any[]) => R} - Memoized selector
 */
export function createSelector(selector, depsFn = (...args) => args) {
  let lastDeps = [];
  let lastResult;
  
  return (...args) => {
    const deps = depsFn(...args);
    
    if (deps.length === 0) {
      return selector(...args);
    }
    
    const hasChanged = deps.some((dep, i) => !Object.is(dep, lastDeps[i]));
    
    if (!hasChanged) {
      return lastResult;
    }
    
    lastDeps = deps;
    lastResult = selector(...args);
    return lastResult;
  };
}
