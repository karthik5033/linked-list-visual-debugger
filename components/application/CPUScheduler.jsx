'use client';

import { useState, useEffect } from 'react';
import MemoryBoard from '../MemoryBoard';

const PROCESS_COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#a855f7', // purple
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#8b5cf6', // violet
];

const ProcessBadge = ({ process, onRemove }) => (
    <div
        className="px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"
        style={{ backgroundColor: `${process.color}40`, color: process.color, border: `2px solid ${process.color}` }}
    >
        {process.name} (B:{process.burstTime}, A:{process.arrivalTime})
        <button
            onClick={() => onRemove(process.id)}
            className="hover:opacity-70 ml-1"
        >
            ×
        </button>
    </div>
);

const CPUDisplay = ({ process }) => {
    if (!process) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <div className="text-6xl mb-2">💤</div>
                    <div className="text-sm">CPU Idle</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-full">
            <div
                className="w-32 h-32 rounded-2xl flex items-center justify-center text-3xl font-bold animate-pulse relative"
                style={{
                    backgroundColor: `${process.color}40`,
                    border: `4px solid ${process.color}`,
                    boxShadow: `0 0 30px ${process.color}60`
                }}
            >
                {process.name}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs animate-spin-slow">
                    ⚙️
                </div>
            </div>
        </div>
    );
};

const GanttChart = ({ timeline }) => {
    if (timeline.length === 0) {
        return (
            <div className="text-gray-500 text-sm text-center py-4">
                No execution history yet
            </div>
        );
    }

    return (
        <div className="flex items-center gap-0 overflow-x-auto">
            {timeline.map((entry, idx) => (
                <div
                    key={idx}
                    className="flex-shrink-0 h-16 px-4 flex items-center justify-center text-sm font-bold border-r border-gray-700 relative"
                    style={{
                        backgroundColor: `${entry.color}60`,
                        minWidth: `${entry.duration * 40}px`
                    }}
                >
                    <div className="text-white">{entry.name}</div>
                    <div className="absolute bottom-0 left-0 right-0 text-[10px] text-gray-300 text-center pb-1">
                        {entry.start}-{entry.end}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function CPUScheduler({ engine }) {
    // Configuration
    const [quantum, setQuantum] = useState(2);
    const [burstTime, setBurstTime] = useState(4);
    const [arrivalTime, setArrivalTime] = useState(0);

    // Process Management
    const [processes, setProcesses] = useState([]);
    const [processCounter, setProcessCounter] = useState(1);

    // Simulation State
    const [currentTime, setCurrentTime] = useState(0);
    const [readyQueue, setReadyQueue] = useState([]);
    const [executingProcess, setExecutingProcess] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // Initialize with example processes
    useEffect(() => {
        if (processes.length === 0) {
            const exampleProcesses = [
                { id: 'P1', name: 'P1', burstTime: 3, arrivalTime: 0, remainingTime: 3, color: PROCESS_COLORS[0] },
                { id: 'P2', name: 'P2', burstTime: 4, arrivalTime: 0, remainingTime: 4, color: PROCESS_COLORS[1] },
                { id: 'P3', name: 'P3', burstTime: 4, arrivalTime: 0, remainingTime: 4, color: PROCESS_COLORS[2] },
                { id: 'P4', name: 'P4', burstTime: 4, arrivalTime: 0, remainingTime: 4, color: PROCESS_COLORS[3] },
            ];

            setProcesses(exampleProcesses);
            setProcessCounter(5);

            // Add to engine for visualization
            exampleProcesses.forEach(p => {
                engine.executeOperation('circular-singly', 'addProcess', {
                    value: p.name,
                    burstTime: p.burstTime
                });
            });

            // Initialize ready queue
            setReadyQueue(exampleProcesses.map(p => ({ ...p })));
        }
    }, []);

    // Auto-play simulation - runs every second
    useEffect(() => {
        if (processes.length === 0) return;

        const interval = setInterval(() => {
            setCurrentTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [processes.length]);

    // Handle simulation step when currentTime changes
    useEffect(() => {
        if (currentTime === 0 || processes.length === 0) return;

        // Add arriving processes to ready queue
        const arriving = processes.filter(p =>
            p.arrivalTime === currentTime &&
            !readyQueue.some(q => q.id === p.id) &&
            p.remainingTime > 0
        );

        let newQueue = [...readyQueue, ...arriving];

        if (!executingProcess && newQueue.length > 0) {
            // Start executing first process in queue
            const next = newQueue.shift();

            setExecutingProcess({ ...next, timeSlice: Math.min(quantum, next.remainingTime) });
            setReadyQueue(newQueue);
            setStatusMessage(`Process ${next.name} executing for ${Math.min(quantum, next.remainingTime)} units.`);
        } else if (executingProcess) {
            // Continue or finish current process
            const updated = { ...executingProcess };
            updated.timeSlice--;
            updated.remainingTime--;

            if (updated.timeSlice === 0 || updated.remainingTime === 0) {
                // Time slice finished or process completed
                const duration = Math.min(quantum, executingProcess.remainingTime);
                setTimeline(prev => [...prev, {
                    name: updated.name,
                    color: updated.color,
                    start: currentTime - duration,
                    end: currentTime,
                    duration
                }]);

                if (updated.remainingTime > 0) {
                    // Re-add to queue
                    newQueue.push(updated);
                    setStatusMessage(`Process ${updated.name} moved back to queue.`);
                } else {
                    setStatusMessage(`Process ${updated.name} completed!`);
                }

                setExecutingProcess(null);
                setReadyQueue(newQueue);
            } else {
                setExecutingProcess(updated);
            }
        }
    }, [currentTime]);

    const addProcess = () => {
        const newProcess = {
            id: `P${processCounter}`,
            name: `P${processCounter}`,
            burstTime: burstTime,
            arrivalTime: arrivalTime,
            remainingTime: burstTime,
            color: PROCESS_COLORS[(processCounter - 1) % PROCESS_COLORS.length]
        };

        setProcesses([...processes, newProcess]);
        setProcessCounter(processCounter + 1);

        // Add to engine for visualization
        engine.executeOperation('circular-singly', 'addProcess', {
            value: newProcess.name,
            burstTime: newProcess.burstTime
        });
    };

    const removeProcess = (id) => {
        setProcesses(processes.filter(p => p.id !== id));
    };

    const clearAll = () => {
        setProcesses([]);
        setProcessCounter(1);
        setCurrentTime(0);
        setReadyQueue([]);
        setExecutingProcess(null);
        setTimeline([]);
        setIsSimulating(false);
        setStatusMessage('');
        engine.reset();
    };

    const runSimulation = () => {
        if (processes.length === 0) return;

        setIsSimulating(true);
        // Simulation logic will be handled by step-by-step execution
    };

    const step = () => {
        // Add arriving processes to ready queue
        const arriving = processes.filter(p =>
            p.arrivalTime === currentTime &&
            !readyQueue.includes(p) &&
            p.remainingTime > 0
        );

        const newQueue = [...readyQueue, ...arriving];

        if (!executingProcess && newQueue.length > 0) {
            // Start executing first process in queue
            const next = newQueue.shift();
            setExecutingProcess({ ...next, timeSlice: Math.min(quantum, next.remainingTime) });
            setReadyQueue(newQueue);
            setStatusMessage(`Process ${next.name} executing for ${Math.min(quantum, next.remainingTime)} units.`);
        } else if (executingProcess) {
            // Continue or finish current process
            const updated = { ...executingProcess };
            updated.timeSlice--;
            updated.remainingTime--;

            if (updated.timeSlice === 0 || updated.remainingTime === 0) {
                // Time slice finished or process completed
                const duration = quantum - (updated.timeSlice + 1) + 1;
                setTimeline([...timeline, {
                    name: updated.name,
                    color: updated.color,
                    start: currentTime - duration + 1,
                    end: currentTime + 1,
                    duration
                }]);

                if (updated.remainingTime > 0) {
                    // Re-add to queue
                    newQueue.push(updated);
                }

                setExecutingProcess(null);
                setReadyQueue(newQueue);
            } else {
                setExecutingProcess(updated);
            }
        }

        setCurrentTime(currentTime + 1);
    };

    return (
        <div className="flex flex-col gap-6 p-6 animate-fade-in-up">
            {/* Configuration Card */}
            <div className="bg-[#1f2937] rounded-xl border border-[#374151] p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Configuration</h2>

                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Quantum</label>
                        <input
                            type="number"
                            min="1"
                            value={quantum}
                            onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                            disabled={isSimulating}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Burst Time</label>
                        <input
                            type="number"
                            min="1"
                            value={burstTime}
                            onChange={(e) => setBurstTime(parseInt(e.target.value) || 1)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                            disabled={isSimulating}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-gray-400 mb-1 block">Arrival</label>
                        <input
                            type="number"
                            min="0"
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                            disabled={isSimulating}
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <button
                            onClick={addProcess}
                            disabled={isSimulating}
                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-2 rounded font-medium transition-colors flex items-center gap-2"
                        >
                            ➕ Add Process
                        </button>
                        <button
                            onClick={clearAll}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors flex items-center gap-2"
                        >
                            🗑️ Clear
                        </button>
                    </div>
                </div>

                {/* Process Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {processes.map(p => (
                        <ProcessBadge key={p.id} process={p} onRemove={removeProcess} />
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex gap-2">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                            Prev
                        </button>
                        <button
                            onClick={step}
                            disabled={processes.length === 0}
                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-2 rounded font-bold flex items-center gap-2"
                        >
                            ▶ {currentTime} = {currentTime}
                        </button>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
                            Next
                        </button>
                    </div>
                    <div className="text-purple-400 text-sm">{statusMessage}</div>
                </div>
            </div>

            {/* Middle Section: Ready Queue + CPU Execution */}
            <div className="grid grid-cols-2 gap-6">
                {/* Ready Queue - Using MemoryBoard for circular linked list visualization */}
                <div className="bg-[#1f2937] rounded-xl border border-[#374151] shadow-lg overflow-hidden">
                    <MemoryBoard
                        memoryState={engine.getMemoryState()}
                        highlightedNodes={[]}
                        icon="↻"
                        title="Ready Queue"
                        type="circular-singly"
                        valueFormatter={(val) => val}
                    />
                </div>

                {/* CPU Execution */}
                <div className="bg-[#1f2937] rounded-xl border border-[#374151] p-6 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4">CPU Execution</h3>
                    <CPUDisplay process={executingProcess} />
                </div>
            </div>

            {/* Gantt Chart */}
            <div className="bg-[#1f2937] rounded-xl border border-[#374151] p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Gantt Chart</h3>
                <GanttChart timeline={timeline} />
            </div>
        </div>
    );
}
