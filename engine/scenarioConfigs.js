/**
 * Scenario Configurations
 * Defines all real-world scenarios with their mappings and metadata
 */

export const SCENARIOS = {
    // Scenario 1: Music Playlist (Singly Linked List)
    musicPlaylist: {
        id: 'musicPlaylist',
        name: 'Music Playlist',
        listType: 'singly',
        description: 'Simulate a music playlist where songs are played sequentially',

        labels: {
            node: 'Song',
            data: 'Song Name',
            next: 'Next Song',
            head: 'Currently Playing',
            tail: 'Last Song',
            nodeIcon: '🎵',
            emptyMessage: 'Playlist is empty - Add songs to get started'
        },

        actions: [
            {
                id: 'addSong',
                label: 'Add Song to Playlist',
                operation: 'insertTail',
                needsValue: true,
                valueLabel: 'Song Name'
            },
            {
                id: 'playNext',
                label: 'Play Next Song',
                operation: 'traverse',
                needsValue: false
            },
            {
                id: 'removeCurrent',
                label: 'Remove Current Song',
                operation: 'deleteHead',
                needsValue: false
            },
            {
                id: 'restart',
                label: 'Restart Playlist',
                operation: 'reset',
                needsValue: false
            }
        ],

        learningObjectives: [
            'Understand how playlists use singly linked lists for sequential playback',
            'See why next-only pointers are sufficient for forward-only navigation',
            'Learn how insertion at tail enables queue-like behavior for adding songs'
        ],

        conceptMapping: {
            'Node': 'Song in the playlist',
            'data': 'Song name or title',
            'next': 'Pointer to the next song to play',
            'head': 'Currently playing song',
            'tail': 'Last song in the playlist',
            'nullptr': 'End of playlist'
        }
    },

    // Scenario 2: Browser History (Doubly Linked List)
    browserHistory: {
        id: 'browserHistory',
        name: 'Browser History',
        listType: 'doubly',
        description: 'Simulate browser navigation with back and forward buttons',

        labels: {
            node: 'Web Page',
            data: 'URL',
            next: 'Forward',
            prev: 'Back',
            head: 'First Page',
            tail: 'Latest Page',
            current: 'Current Page',
            nodeIcon: '🌐',
            emptyMessage: 'No browsing history - Visit a page to start'
        },

        actions: [
            {
                id: 'visitPage',
                label: 'Visit New Page',
                operation: 'insertAfterCurrent',
                needsValue: true,
                valueLabel: 'URL'
            },
            {
                id: 'goBack',
                label: 'Go Back',
                operation: 'traversePrev',
                needsValue: false
            },
            {
                id: 'goForward',
                label: 'Go Forward',
                operation: 'traverseNext',
                needsValue: false
            },
            {
                id: 'clearHistory',
                label: 'Clear History',
                operation: 'reset',
                needsValue: false
            }
        ],

        learningObjectives: [
            'Understand why singly linked lists fail for browser history',
            'See how doubly linked lists enable bidirectional navigation',
            'Learn how visiting a new page clears forward history (like real browsers)'
        ],

        conceptMapping: {
            'Node': 'Web page in history',
            'data': 'URL of the page',
            'next': 'Forward button (newer page)',
            'prev': 'Back button (older page)',
            'current': 'Currently displayed page',
            'nullptr': 'No more pages in that direction'
        }
    },

    // Scenario 3: OS Round-Robin Scheduler (Circular Singly Linked List)
    osScheduler: {
        id: 'osScheduler',
        name: 'OS Round-Robin Scheduler',
        listType: 'circular-singly',
        description: 'Simulate CPU scheduling where processes are executed in circular order',

        labels: {
            node: 'Process',
            data: 'Process Name',
            next: 'Next Process',
            head: 'Active Process',
            nodeIcon: '⚙️',
            emptyMessage: 'No processes in queue - Add processes to schedule'
        },

        actions: [
            {
                id: 'addProcess',
                label: 'Add Process to Queue',
                operation: 'insertTail',
                needsValue: true,
                valueLabel: 'Process Name'
            },
            {
                id: 'executeNext',
                label: 'Execute Next Process',
                operation: 'traverseCircular',
                needsValue: false
            },
            {
                id: 'removeProcess',
                label: 'Remove Completed Process',
                operation: 'deleteHead',
                needsValue: false
            }
        ],

        learningObjectives: [
            'Understand why circular linked lists are used for round-robin scheduling',
            'See how infinite traversal works without NULL pointers',
            'Learn how the last process points back to the first for continuous cycling'
        ],

        conceptMapping: {
            'Node': 'Process waiting for CPU time',
            'data': 'Process name or ID',
            'next': 'Next process to execute',
            'head': 'Currently executing process',
            'Circular': 'Last process points to first (no NULL)'
        }
    }
};

// Helper function to get scenario by ID
export function getScenarioById(scenarioId) {
    return SCENARIOS[scenarioId] || null;
}

// Helper function to get scenarios by list type
export function getScenariosByListType(listType) {
    return Object.values(SCENARIOS).filter(scenario => scenario.listType === listType);
}

// Helper function to get all scenario IDs
export function getAllScenarioIds() {
    return Object.keys(SCENARIOS);
}
