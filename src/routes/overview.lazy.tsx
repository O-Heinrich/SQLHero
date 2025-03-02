/**
 * @module OverviewPage
 * @description 
 * Provides a challenge overview page that displays all available SQL challenges 
 * as interactive cards. Challenges are organized with visual indicators for difficulty level,
 * completion status, and performance metrics.
 */

import { useMemo } from 'react';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, XAxis, YAxis, Legend, Bar, LabelList } from 'recharts';
import { Wrapper } from '@/components/Wrapper';
import { useAppState } from '@/hooks/useAppState';
import { Challenge } from '@/lib/types';
import { ArrowRightIcon } from '@/components/icons';

/**
 * Route definition using TanStack Router
 * Creates a lazy-loaded route for the challenges overview page
 */
export const Route = createLazyFileRoute('/overview')({
    component: RouteComponent,
})

/**
 * Card component properties for displaying challenge information
 * 
 * @interface CardProps
 * @property {string} title         - The display title of the challenge
 * @property {number} number        - The unique challenge identifier number
 * @property {string[]} tags        - Array of categorization tags (schemas, topics, etc.)
 * @property {string} difficulty    - Challenge difficulty level (easy, medium, hard)
 * @property {boolean} completed    - Whether the challenge has been successfully completed
 * @property {boolean} attempted    - Whether the challenge has been attempted at least once
 * @property {boolean} failed       - Whether the last attempt resulted in failure
 * @property {Date} [lastAttempt]   - Optional timestamp of the last attempt
 * @property {number} [timeTaken]   - Optional duration in milliseconds to complete the challenge
 */
interface CardProps {
    title: string;
    number: number;
    tags: string[];
    difficulty: string;
    completed: boolean;
    attempted: boolean;
    failed: boolean;
    lastAttempt?: Date;
    timeTaken?: number;
}

/**
 * Card component for displaying challenge information
 * 
 * @component
 * @param {CardProps} props - Challenge card properties
 * 
 * @description
 * Renders a visually rich card for each SQL challenge with:
 * - Color-coded header based on difficulty level
 * - Visual indicators for completion status
 * - Challenge metadata (last attempt, completion time)
 * - Interactive hover effects
 * - Tag display with special styling for schema tags
 * 
 * The card adapts its appearance based on the challenge's status (completed, failed, or not attempted)
 * and includes appropriate icons and color indicators.
 * 
 * @returns {React.ReactElement} Challenge card component
 */
const Card: React.FC<CardProps> = ({
    title,
    number,
    tags,
    difficulty,
    completed,
    attempted,
    failed,
    lastAttempt,
    timeTaken
}) => {
    const difficultyColors = {
        'easy': 'border-green-600/50 dark:border-green-800/50 from-emerald-400/20 to-emerald-600/60 dark:from-emerald-300/40 dark:to-emerald-600/35',
        'medium': 'border-yellow-600/50 dark:border-yellow-800/50 from-yellow-400/20 to-yellow-600/60 dark:from-yellow-300/40 dark:to-yellow-600/35',
        'hard': 'border-red-600/50 dark:border-red-800/50 from-red-400/20 to-red-700/60 dark:from-red-300/40 dark:to-red-600/35',
        'default': 'from-blue-300/50 to-blue-600/60 border-blue-600'
    };

    const colorScheme = difficultyColors[difficulty?.toLowerCase() as keyof typeof difficultyColors] || difficultyColors.default;
    const formattedTime = timeTaken ? formatTimeTaken(timeTaken) : null;
    const formattedLastAttempt = lastAttempt ? formatDate(lastAttempt) : null;

    return (
        <div className={` group h-full flex flex-col rounded-2xl overflow-hidden ${completed ? 'ring-2 ring-green-500 dark:ring-green-400/50' : failed ? 'ring-2 ring-red-500 dark:border-red-400/50' : 'border border-gray-300 dark:border-gray-700'} bg-white/0 dark:bg-gray-800/0 dark:hover:shadow-blue-800/60 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
            {/* Card header with gradient */}
            <div className={`border-b-2 border-ridge px-6 py-3 min-h-20 bg-white/10 dark:bg-black/30 bg-radial-[at_100%_0%]  ${colorScheme} flex items-center justify-between`}>
                <span className="font-bold text-white text-shadow text-lg text-shadow-lg">{title}</span>
                <div className="flex ml-2 items-center gap-2">
                    {completed && (
                        <span className="bg-green-200 shadow-lg text-green-800 p-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                    )}
                    <span className="flex items-center justify-center shadow-lg bg-white/70 text-gray-800 h-8 w-8 rounded-full font-bold">
                        {number}
                    </span>
                </div>
            </div>

            {/* Card body */}
            <div className="px-6 py-4 flex-1 flex flex-col justify-between bg-zinc-50 dark:bg-gray-600/25">
                <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Herausforderung #{number}: Löse die SQL-Probleme zu diesem Thema.
                    </p>

                    {/* Status indicators */}
                    <div className="mt-3 space-y-2">
                        {attempted && (
                            <div className="flex items-center">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${completed ? 'bg-green-500' : failed ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {completed ? 'Abgeschlossen' : failed ? 'Fehlgeschlagen' : 'Wird bearbeitet'}
                                </span>
                            </div>
                        )}

                        {formattedLastAttempt && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Letzter Versuch: {formattedLastAttempt}
                            </div>
                        )}

                        {completed && formattedTime && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Bearbeitungszeit: {formattedTime}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tags section */}
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => {
                        // Different styling for each tag type
                        const isSchema = tag?.includes('.') || tag?.includes('/');
                        return (
                            <span
                                key={index}
                                className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${isSchema
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}
                            >
                                {tag}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Card footer with hover effect */}
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-300">
                <div className="flex justify-between items-center">
                    {failed && (
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                            Fehler
                        </span>
                    )}
                    <span className="flex gap-1 items-center text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:stroke-blue-600 group-hover:text-blue-600 dark:group-hover:stroke-blue-400 dark:group-hover:text-blue-400 transition-colors duration-300 ml-auto">
                        {attempted ? (completed ? 'Wiederholen' : 'Fortsetzen') : 'Starte die Herausforderung'} <ArrowRightIcon size={1.6} />
                    </span>
                </div>
            </div>
        </div>
    );
};

/**
 * Statistics component for displaying challenge progress metrics
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Array} props.challenges - Challenge data used to calculate statistics
 * @returns {React.ReactElement} Statistics dashboard component
 * 
 * @description
 * Renders a comprehensive statistics dashboard with multiple visualizations:
 * - Challenge completion status (pie chart)
 * - Challenge completion by difficulty (bar chart)
 * - Average completion time by difficulty (bar chart)
 * - Recent activity timeline (if applicable)
 * 
 * The component automatically calculates all metrics from the provided challenges data.
 */
const ChallengeStatistics = ({ challenges }: { challenges: Challenge[]; }): React.ReactElement => {
    // Calculate statistics from challenges data
    const stats = useMemo(() => {
        // Count challenges by status
        const statusCounts = {
            completed: challenges.filter(c => c.completed).length,
            failed: challenges.filter(c => c.failed && !c.completed).length,
            inProgress: challenges.filter(c => c.attempted && !c.completed && !c.failed).length,
            notStarted: challenges.filter(c => !c.attempted).length
        };

        // Count challenges by difficulty and status
        const difficultyStats = ['easy', 'medium', 'hard'].map(difficulty => {
            const challengesInCategory = challenges.filter(c => c.difficulty?.toLowerCase() === difficulty);
            return {
                difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
                total: challengesInCategory.length,
                completed: challengesInCategory.filter(c => c.completed).length,
                attempted: challengesInCategory.filter(c => c.attempted && !c.completed).length
            };
        });

        // Calculate average completion time by difficulty
        const timeStats = ['easy', 'medium', 'hard'].map(difficulty => {
            const completedChallenges = challenges.filter(
                c => c.completed && c.difficulty?.toLowerCase() === difficulty && c.totalDuration
            );
            
            const avgTime = completedChallenges.length > 0
                ? completedChallenges.reduce((sum, c) => sum + (c.totalDuration || 0), 0) / completedChallenges.length
                : 0;
                
            return {
                difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
                avgTime: avgTime / 1000, // Convert to seconds for the chart
                count: completedChallenges.length
            };
        });

        // Get total completion percentage
        const completionPercentage = challenges.length > 0
            ? Math.round((statusCounts.completed / challenges.length) * 100)
            : 0;

        return {
            statusCounts,
            difficultyStats,
            timeStats,
            completionPercentage,
            totalChallenges: challenges.length
        };
    }, [challenges]);

    // Data for the status pie chart
    const statusData = [
        { name: 'Fertig', value: stats.statusCounts.completed, color: '#10B981' },
        { name: 'Fehler', value: stats.statusCounts.failed, color: '#EF4444' },
        { name: 'Bearbeitung', value: stats.statusCounts.inProgress, color: '#F59E0B' },
        { name: 'Nicht gestartet', value: stats.statusCounts.notStarted, color: '#6B7280' }
    ].filter(item => item.value > 0);

    // Data for the difficulty completion bar chart
    const difficultyCompletionData = stats.difficultyStats.filter(item => item.total > 0);

    return (
        <section className="bg-slate-50/30 dark:bg-blue-400/10 p-6 rounded-xl shadow shadow-gray-400/25 dark:shadow-gray-800/30">
            
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Fortschrittsübersicht</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall completion stats */}
                <div className="flex flex-col items-center justify-center bg-white/20 dark:bg-gray-300/5 dark:mix-blend-color-dodge p-4 rounded-xl shadow-sm">
                    <div className="text-5xl font-bold text-gray-800/60 dark:text-white/60 mb-2">
                        {stats.completionPercentage}%
                    </div>
                    <div className="text-gray-600/60 dark:text-gray-300/60 text-center">
                        Gesamtfortschritt ({stats.statusCounts.completed} von {stats.totalChallenges})
                    </div>
                    <div className="w-full bg-gray-200/50 dark:bg-gray-800/20 rounded-full h-4 mt-4">
                        <div 
                            className="bg-green-500/50 h-4 rounded-full" 
                            style={{ width: `${stats.completionPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Difficulty completion */}
                <div className="bg-white/20 dark:bg-gray-300/5 dark:mix-blend-color-dodge rounded-xl shadow-sm p-4">
                    <h3 className="text-sm font-medium text-gray-700/70 dark:text-gray-300/40 mb-2">
                        Fortschritt nach Schwierigkeitsgrad
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={difficultyCompletionData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                className="text-gray-200"
                            >
                                <XAxis type="number" domain={[0, 'dataMax']} />
                                <YAxis dataKey="difficulty" type="category" width={70} />
                                <Legend />
                                <Bar dataKey="completed" stackId="a" fill="#10b9515e" name="Abgeschlossen" />
                                <Bar dataKey="attempted" stackId="a" fill="#f59e0b70" name="In Bearbeitung" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status pie chart */}
                <div className="mt-8 bg-white/20 dark:bg-gray-300/5 dark:mix-blend-color-dodge rounded-xl shadow-sm p-4 z-10">
                    <h3 className="text-sm font-medium text-gray-700/70 dark:text-gray-300/40 mb-2">
                        Status der Herausforderungen
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Average completion time by difficulty */}
                <div className="mt-8 bg-white/20 dark:bg-gray-300/5 dark:mix-blend-color-dodge rounded-xl shadow-sm p-4 z-10">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Durchschnittliche Bearbeitungszeit
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats.timeStats.filter(item => item.count > 0)}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis dataKey="difficulty" />
                                <YAxis label={{ value: 'Sekunden', angle: -90, position: 'insideLeft' }} />
                                <Bar dataKey="avgTime" fill="#3B82F665" name="Durchschnittliche Zeit">
                                    <LabelList dataKey="avgTime" position="top" formatter={(value: number) => `${value.toFixed(1)}s`} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
}; 

/**
 * Formats a time duration in milliseconds to a human-readable string
 * 
 * @function
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string (e.g., "500ms", "2.5s", "1m 30s")
 * 
 * @description
 * Converts raw millisecond values into appropriate time units:
 * - For durations < 1 second: returns milliseconds (e.g., "500ms")
 * - For durations < 1 minute: returns seconds with one decimal place (e.g., "2.5s")
 * - For durations >= 1 minute: returns minutes and seconds (e.g., "1m 30s")
 */
function formatTimeTaken(ms: number): string {
    if (ms < 1000) {
        return `${ms}ms`;
    } else if (ms < 60000) {
        return `${(ms / 1000).toFixed(1)}s`;
    } else {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    }
}

/**
 * Formats a Date object to a localized date-time string
 * 
 * @function
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string in German locale (DD.MM.YYYY, HH:MM)
 * 
 * @description
 * Uses the browser's Intl.DateTimeFormat API to format dates according to German locale
 * with day, month, year, hour, and minute components.
 */
function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date ?? new Date());
}

/**
 * Main component for the challenge overview route
 * 
 * @component
 * @returns {React.ReactElement} The overview page with challenge cards
 * 
 * @description
 * Renders the overview page containing:
 * - Statistics dashboard with visualizations of challenge progress
 * - Page header with title and description
 * - Grid of challenge cards retrieved from application state
 * - Each card is wrapped in a link to the specific challenge
 * 
 * This component serves as the main entry point for users to browse and select
 * SQL challenges based on their progress and interests.
 */
function RouteComponent(): React.ReactElement {
    const { state } = useAppState();
    return (
        <Wrapper>
            <title>SQL Hero - Übersicht</title>
            <article className="space-y-8 my-14">
                <header className="mb-8">
                    <h1>Übersicht</h1>
                    <div className="h-1 w-20 bg-red-400/50 dark:bg-orange-200/50 mb-4" />
                </header>

                {/* Statistics Dashboard */}
                <ChallengeStatistics challenges={state.challenges} />

                <h2>Herausforderungen</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Wähle eine Herausforderung, um deine SQL-Fähigkeiten zu testen.
                </p>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 py-4">
                    {state.challenges.map(({
                        number,
                        title,
                        schema,
                        difficulty,
                        completed,
                        attempted,
                        failed,
                        lastAttempt,
                        totalDuration
                    }, index) => (
                        <Link
                            key={index}
                            to={`/challenges/$name`}
                            params={{ name: number?.toString() }}
                            className="h-full block"
                        >
                            <Card
                                title={title}
                                number={number}
                                tags={schema !== undefined ? [schema.split('/').pop() ?? '', difficulty ?? 'unrated'] : [difficulty ?? 'unrated']}
                                difficulty={difficulty}
                                completed={completed}
                                attempted={attempted}
                                failed={failed}
                                lastAttempt={lastAttempt}
                                timeTaken={totalDuration}
                            />
                        </Link>
                    ))}
                </section>
            </article>
        </Wrapper>
    );
}