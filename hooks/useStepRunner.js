/**
 * useStepRunner Hook
 * Manages step-by-step execution state
 */

'use client';

import { useState, useCallback } from 'react';

export function useStepRunner(steps = []) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length 
    ? steps[currentStepIndex] 
    : null;

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [currentStepIndex, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentStepIndex]);

  const reset = useCallback(() => {
    setCurrentStepIndex(-1);
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    setCurrentStepIndex(0);
    setIsRunning(true);
  }, []);

  const hasNext = currentStepIndex < steps.length - 1;
  const hasPrev = currentStepIndex > 0;
  const isComplete = currentStepIndex === steps.length - 1;

  return {
    currentStep,
    currentStepIndex,
    nextStep,
    prevStep,
    reset,
    start,
    hasNext,
    hasPrev,
    isRunning,
    isComplete,
    totalSteps: steps.length
  };
}
