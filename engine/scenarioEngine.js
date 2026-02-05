/**
 * Scenario Engine
 * Handles context mapping, label transformation, and scenario-specific code generation
 */

import { getScenarioById } from './scenarioConfigs.js';

export class ScenarioEngine {
    constructor() {
        this.currentScenario = null;
    }

    /**
     * Set the current scenario
     * @param {string} scenarioId - ID of the scenario to activate
     */
    setScenario(scenarioId) {
        this.currentScenario = getScenarioById(scenarioId);
        return this.currentScenario !== null;
    }

    /**
     * Get the current scenario configuration
     * @returns {object|null} Current scenario config or null
     */
    getScenarioConfig() {
        return this.currentScenario;
    }

    /**
     * Map a scenario action to a linked list operation
     * @param {string} actionId - Scenario-specific action ID
     * @returns {string|null} Corresponding LL operation
     */
    mapActionToOperation(actionId) {
        if (!this.currentScenario) return null;

        const action = this.currentScenario.actions.find(a => a.id === actionId);
        return action ? action.operation : null;
    }

    /**
     * Get scenario-specific labels for UI transformation
     * @returns {object} Labels object with transformed terms
     */
    getLabels() {
        if (!this.currentScenario) {
            return {
                node: 'Node',
                data: 'Data',
                next: 'Next',
                head: 'HEAD',
                tail: 'TAIL',
                nodeIcon: null,
                emptyMessage: 'Empty List - Execute an operation to see memory visualization'
            };
        }

        return this.currentScenario.labels;
    }

    /**
     * Get scenario-specific actions for control panel
     * @returns {array} Array of action objects
     */
    getActions() {
        if (!this.currentScenario) return [];
        return this.currentScenario.actions;
    }

    /**
     * Transform variable names for scenario context
     * @param {object} variables - Original variable names and values
     * @returns {object} Transformed variables
     */
    transformVariables(variables) {
        if (!this.currentScenario) return variables;

        const labels = this.currentScenario.labels;
        const transformed = {};

        // Map standard variable names to scenario-specific ones
        const variableMapping = {
            'head': labels.head || 'head',
            'tail': labels.tail || 'tail',
            'current': labels.current || 'current',
            'prev': labels.prev || 'prev',
            'next': labels.next || 'next'
        };

        for (const [key, value] of Object.entries(variables)) {
            const newKey = variableMapping[key] || key;
            transformed[newKey] = value;
        }

        return transformed;
    }

    /**
     * Get scenario-specific code with contextual comments
     * @param {string} operation - Base operation name
     * @param {object} codeMap - Original code map object
     * @returns {array} Array of code lines with scenario context
     */
    getScenarioCode(operation, codeMap) {
        if (!this.currentScenario) return codeMap[operation] || [];

        const baseCode = codeMap[operation] || [];
        const labels = this.currentScenario.labels;

        // Transform code with scenario-specific terminology
        return baseCode.map(line => {
            let transformedLine = line;

            // Replace common terms with scenario-specific ones
            transformedLine = transformedLine.replace(/Node\*/g, `${labels.node}*`);
            transformedLine = transformedLine.replace(/Node\(/g, `${labels.node}(`);
            transformedLine = transformedLine.replace(/newNode/g, `new${labels.node.replace(/\s/g, '')}`);

            // Add contextual comments for key operations
            if (line.includes('new Node') || line.includes(`new ${labels.node}`)) {
                transformedLine += ` // Create new ${labels.node.toLowerCase()}`;
            }

            return transformedLine;
        });
    }

    /**
     * Get learning context for the current scenario
     * @returns {object} Learning objectives and concept mapping
     */
    getLearningContext() {
        if (!this.currentScenario) return null;

        return {
            description: this.currentScenario.description,
            learningObjectives: this.currentScenario.learningObjectives,
            conceptMapping: this.currentScenario.conceptMapping
        };
    }

    /**
     * Clear the current scenario (return to debug mode)
     */
    clearScenario() {
        this.currentScenario = null;
    }

    /**
     * Check if a scenario is currently active
     * @returns {boolean}
     */
    isScenarioActive() {
        return this.currentScenario !== null;
    }

    /**
     * Get the current scenario ID
     * @returns {string|null}
     */
    getCurrentScenarioId() {
        return this.currentScenario ? this.currentScenario.id : null;
    }
}
