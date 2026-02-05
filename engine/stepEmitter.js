/**
 * Step Emitter
 * Emits execution steps with memory state, active line, and variables
 * This is what drives the debugger-style step-by-step execution
 */

export class StepEmitter {
  constructor() {
    this.steps = [];
    this.currentStepIndex = -1;
  }

  // Add a new step
  addStep(activeLine, variables, memoryState, description = '') {
    this.steps.push({
      stepNumber: this.steps.length,
      activeLine,
      variables: { ...variables },
      memoryState: JSON.parse(JSON.stringify(memoryState)), // deep copy
      description,
    });
  }

  // Get all steps
  getSteps() {
    return this.steps;
  }

  // Get current step
  getCurrentStep() {
    if (this.currentStepIndex >= 0 && this.currentStepIndex < this.steps.length) {
      return this.steps[this.currentStepIndex];
    }
    return null;
  }

  // Move to next step
  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      return this.getCurrentStep();
    }
    return null;
  }

  // Move to previous step
  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      return this.getCurrentStep();
    }
    return null;
  }

  // Reset to beginning
  reset() {
    this.currentStepIndex = -1;
  }

  // Clear all steps
  clear() {
    this.steps = [];
    this.currentStepIndex = -1;
  }

  // Check if there are more steps
  hasNextStep() {
    return this.currentStepIndex < this.steps.length - 1;
  }

  // Check if we can go back
  hasPrevStep() {
    return this.currentStepIndex > 0;
  }

  // Get total step count
  getTotalSteps() {
    return this.steps.length;
  }

  // Get current step index
  getCurrentStepIndex() {
    return this.currentStepIndex;
  }
}
