'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export const useStepRunner = (steps = []) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  // If steps array is cleared, reset index
  useEffect(() => {
    if (steps.length === 0) {
      setCurrentStepIndex(0);
      setIsPlaying(false);
    }
  }, [steps]);

  // Current step object
  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const hasNext = currentStepIndex < totalSteps - 1;
  const hasPrev = currentStepIndex > 0;

  // Navigation handlers
  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  // Playback logic
  const start = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, steps.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000); // 1 second per step
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    prevStep,
    start,
    pause,
    reset,
    isPlaying,
    hasNext,
    hasPrev
  };
};
