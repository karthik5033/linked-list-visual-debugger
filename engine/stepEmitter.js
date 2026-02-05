
export class StepEmitter {
  constructor() {
    this.steps = [];
  }

  addStep(activeLine, variables, memoryState, explanation) {
    this.steps.push({
      activeLine,
      variables: JSON.parse(JSON.stringify(variables)), // Deep copy vars
      memoryState, // Already deep copied by memoryModel.getState()
      explanation
    });
  }

  getSteps() {
    return this.steps;
  }

  clear() {
    this.steps = [];
  }
}
