import { JSX, useEffect } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { InlineCode } from '@/components/InlineCode';
import { Skeleton } from '@/components/Skeleton';
import { Wrapper } from '@/components/Wrapper';
import { CheckBadgeIcon } from '@/components/icons';
import { CheckCircleIcon } from '@/components/icons';
import firefoxLogo from '@/assets/images/Firefox_logo,_2019.svg';
import chromeLogo from '@/assets/images/chrome-logo.svg';
import edgeLogo from '@/assets/images/Microsoft_Edge_logo_(2019).svg';
import { Button } from '@headlessui/react';
import { toast } from 'sonner';

/**
 * The `Introduction` component provides an introductory guide to SQL and its various aspects.
 * It includes sections on:
 * - What is SQL?
 * - The four pillars of SQL (DDL, DML, DCL, TCL)
 * - Learning with SQL Hero
 * - Error handling and tips
 * - Technical requirements for browser support
 *
 * Each section contains detailed explanations and examples to help users understand SQL concepts.
 *
 * @returns {JSX.Element} The rendered introduction component.
 */
const Introduction = (): JSX.Element => {
    useEffect(() => {
        if (window.scrollY > 0) {
            window.scrollTo(0, 0);
        }
    }, []);

    const handleExampleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const title = event.currentTarget.id === 'logic' ? 'Fehler' : 'Fehler beim Ausführen der Abfrage';
        const msg = event.currentTarget.id === 'logic' ? {
            description: 'Die gelieferten Datensätze stimmen nicht überein.'
            
        } : {
            description: 'relation "customer" does not exist'
        }

        toast.error(title, msg);
    }

    return (
        <Wrapper>
            <title>SQL Hero - Einführung</title>
            <article className="space-y-8 my-14">
                <header className="mb-8">
                    <h1>SQL Hero - Einführung in die Welt der Datenbanken</h1>
                    <div className="h-1 w-20 bg-red-400/50 dark:bg-orange-200/50 mb-4" />
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        Entdecken Sie die faszinierende Welt der Datenbanksprache SQL - Ihr Weg zum Datenbank-Experten beginnt hier.
                    </p>
                </header>

                {/* Was ist SQL? Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Was ist SQL?</h2>
                    <p className="leading-relaxed dark:text-gray-300">
                        SQL <em>(Structured Query Language)</em> ist die Standardsprache für die Verwaltung und Abfrage von Datenbanken.
                        Stellen Sie sich eine Datenbank wie eine sehr gut organisierte digitale Bibliothek vor: SQL ist dabei
                        Ihr persönlicher Bibliothekar, der Ihnen hilft, Informationen zu finden, zu ordnen und zu verwalten.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 my-4">
                        <div className="p-4 bg-blue-200/25 dark:bg-blue-800/20 rounded-xl shadow shadow-gray-400/25 dark:shadow-gray-800/30">
                            <h3 className="font-semibold mb-2 flex items-center justify-between gap-2">
                                Daten abrufen
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-18 dark:text-gray-200/25 text-gray-700/25">
                                    <path fillRule="evenodd" d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.25 6a.75.75 0 0 0-1.5 0v4.94l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V9.75Z" clipRule="evenodd" />
                                </svg>
                            </h3>
                            <p className="dark:text-gray-300">Wie ein Bibliothekar, der genau das richtige Buch findet,
                                hilft Ihnen <InlineCode>SELECT</InlineCode>, die gewünschten Informationen aus der Datenbank zu holen.</p>
                        </div>
                        <div className="p-4 bg-green-200/25 dark:bg-green-800/20 rounded-xl shadow shadow-gray-400/25 dark:shadow-gray-800/30">
                            <h3 className="font-semibold mb-2 flex items-center justify-between gap-2">
                                Daten speichern
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-18 dark:text-gray-200/25 text-gray-700/25">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                </svg>
                            </h3>
                            <p className="dark:text-gray-300">Mit <InlineCode>INSERT</InlineCode> fügen Sie neue Informationen
                                hinzu - vergleichbar mit dem Einordnen neuer Bücher in die Bibliothek.</p>
                        </div>
                    </div>
                </section>

                {/* Die vier Säulen von SQL Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Die vier Säulen von SQL</h2>
                    <p className="leading-relaxed dark:text-gray-300">
                        SQL ist wie ein Werkzeugkasten mit verschiedenen Werkzeugen für unterschiedliche Aufgaben.
                        Lassen Sie uns diese Werkzeuge genauer kennenlernen:
                    </p>

                    <div className="space-y-6">
                        {/* DDL Section */}
                        <div className="bg-slate-50/30 dark:bg-blue-400/10 p-6 rounded-xl shadow shadow-gray-400/25 dark:shadow-gray-800/30">
                            <h3 className="text-xl font-semibold mb-3">1. Data Definition Language (DDL)</h3>
                            <p className="mb-3 dark:text-gray-300">
                                Die DDL ist wie der Architekt Ihrer Datenbank. Mit ihr erstellen Sie die grundlegende Struktur:
                            </p>
                            <div className="bg-white/20 dark:bg-gray-300/5 p-4 rounded-xl shadow-sm">
                                <p className="mb-2 dark:text-gray-200"><InlineCode>CREATE TABLE</InlineCode> - Erstellt neue Tabellen</p>
                                <p className="mb-2 dark:text-gray-200"><InlineCode>ALTER TABLE</InlineCode> - Verändert bestehende Tabellen</p>
                                <p className="dark:text-gray-200"><InlineCode>DROP TABLE</InlineCode> - Löscht Tabellen</p>
                            </div>
                        </div>

                        {/* DML Section */}
                        <div className="bg-slate-50/30 dark:bg-blue-400/10 p-6 rounded-xl shadow shadow-gray-400/25 dark:shadow-gray-800/30">
                            <h3 className="text-xl font-semibold mb-3">2. Data Manipulation Language (DML)</h3>
                            <p className="mb-3 dark:text-gray-300">
                                Die DML ist Ihr wichtigstes Werkzeug für die tägliche Arbeit mit Daten:
                            </p>
                            <div className="bg-white/20 dark:bg-gray-300/5 p-4 rounded-xl shadow-sm space-y-3">
                                <div>
                                    <p className="font-semibold dark:text-gray-200">
                                        <InlineCode>SELECT</InlineCode> - Daten abrufen
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Beispiel: <InlineCode>SELECT Name FROM Kunden</InlineCode>
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold dark:text-gray-200">
                                        <InlineCode>INSERT INTO</InlineCode> - Neue Daten einfügen
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Beispiel: <InlineCode>INSERT INTO Kunden (Name) VALUES ('Max Mustermann')</InlineCode>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-50/30 dark:bg-blue-400/10 p-6 rounded-xl shadow shadow-gray-400/25 dark:shadow-gray-800/30">
                        <h3 className="text-xl font-semibold mb-3">3. Data Control Language (DCL)</h3>
                        <p className="mb-3 dark:text-gray-300">
                            Die DCL kontrolliert die Zugriffsrechte auf Ihre Datenbank. Sie ist wie ein Sicherheitssystem:
                        </p>
                        <div className="bg-white/20 dark:bg-gray-300/5 p-4 rounded-xl shadow-sm space-y-3">
                            <div>
                                <p className="font-semibold dark:text-gray-200">
                                    <InlineCode>GRANT</InlineCode> - Berechtigungen erteilen
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Beispiel: <InlineCode>GRANT SELECT ON Kunden TO Benutzer1</InlineCode>
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold dark:text-gray-200">
                                    <InlineCode>REVOKE</InlineCode> - Berechtigungen entziehen
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Beispiel: <InlineCode>REVOKE SELECT ON Kunden FROM Benutzer1</InlineCode>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50/30 dark:bg-blue-400/10 p-6 rounded-xl shadow shadow-gray-400/25 dark:shadow-gray-800/30">
                        <h3 className="text-xl font-semibold mb-3">4. Transaction Control Language (TCL)</h3>
                        <p className="mb-3 dark:text-gray-300">
                            Die TCL steuert Transaktionen - also Gruppen von Datenbankoperationen, die als Einheit behandelt werden:
                        </p>
                        <div className="bg-white/20 dark:bg-gray-300/5 p-4 rounded-xl shadow-sm space-y-3">
                            <div>
                                <p className="font-semibold dark:text-gray-200">
                                    <InlineCode>COMMIT</InlineCode> - Änderungen dauerhaft speichern
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Beispiel: Nach erfolgreichen Änderungen <InlineCode>COMMIT</InlineCode> ausführen
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold dark:text-gray-200">
                                    <InlineCode>ROLLBACK</InlineCode> - Änderungen rückgängig machen
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Beispiel: Bei Fehlern <InlineCode>ROLLBACK</InlineCode> zur Wiederherstellung des letzten stabilen Zustands
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold dark:text-gray-200">
                                    <InlineCode>SAVEPOINT</InlineCode> - Zwischenpunkt setzen
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Beispiel: <InlineCode>SAVEPOINT UpdatePoint1</InlineCode> vor wichtigen Änderungen
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lernen mit SQL Hero Section */}
                <section className="space-y-3">
                    <h2 className="text-2xl font-semibold">Lernen mit SQL Hero</h2>
                    <div className="bg-blue-50/20 dark:bg-blue-800/20 p-6 rounded-xl space-y-4 shadow shadow-gray-400/25 dark:shadow-gray-800/30">
                        <div>
                            <h3 className="font-semibold">Praktische Übungen</h3>
                            <p className="dark:text-gray-300">
                                Jede Lektion enthält praktische Aufgaben, die Sie direkt im Browser lösen können.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Sofortiges Feedback</h3>
                            <p className="dark:text-gray-300">
                                Ihre Lösungen werden automatisch überprüft und Sie erhalten sofort Feedback.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Fehlerbehandlung Section */}
                <section className="bg-gray-100/30 dark:bg-blue-400/10 p-6 rounded-xl mt-8 shadow shadow-gray-400/25 dark:shadow-gray-800/30">
                    <h3 className="text-2xl font-semibold">Fehlerbehandlung und Tipps</h3>
                    <div className="space-y-3">
                        <div className="bg-white/20 dark:bg-gray-300/5 p-4 rounded-xl shadow-sm">
                            <h4 className="font-semibold text-red-600 dark:text-red-400">Fachliche Fehler</h4>
                            <div className='flex items-center justify-between'>
                                <p className="dark:text-gray-300">
                                    Das SQL ist syntaktisch korrekt, liefert aber nicht das erwartete Ergebnis.
                                </p>
                                <Button id="logic" onClick={handleExampleClick} style={{fontSize: '1.2rem', padding: '0.75rem'}}>Beispiel</Button>
                            </div>
                        </div>
                        <div className="bg-white/20 dark:bg-gray-300/5 p-4 rounded-xl shadow-sm">
                            <h4 className="font-semibold text-red-600 dark:text-red-400">Technische Fehler</h4>
                            <div className='flex items-center justify-between'>
                                <p className="dark:text-gray-300">
                                    Der SQL-Befehl kann nicht ausgeführt werden.
                                </p>
                                <Button id="syntax" onClick={handleExampleClick} style={{fontSize: '1.2rem', padding: '0.75rem'}}>Beispiel</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Browser Support Section */}
                <section className="bg-gray-100/50 dark:bg-blue-400/10 p-6 rounded-xl mt-8 shadow shadow-gray-400/25 dark:shadow-gray-800/30">
                    <h3 className="text-2xl font-semibold mb-4">Technische Voraussetzungen</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative bg-white/20 dark:bg-gray-300/5 p-4 rounded-xl text-center shadow-sm">
                            <CheckBadgeIcon className="w-20 h-20 inline-block dark:fill-green-400/40 fill-green-800/40 absolute left-4 mix-blend-multiplay dark:mix-blend-hard-light" />
                            &nbsp;
                            <h3 className="flex flex-col items-center font-semibold dark:text-gray-200">
                                <span>Firefox</span>
                                <img src={firefoxLogo} alt="Firefox Logo" className="inline-block w-26 h-26 mt-5" loading="lazy" />
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Vollständig getestet</p>
                        </div>
                        <div className="relative bg-white/20 dark:bg-gray-300/5 p-4 rounded-xl text-center shadow-sm">
                            <CheckBadgeIcon className="w-20 h-20 inline-block dark:fill-green-400/40 fill-green-800/40 absolute left-4 mix-blend-multiplay dark:mix-blend-hard-light" />
                            &nbsp;
                            <h3 className="flex flex-col items-center font-semibold dark:text-gray-200">
                                <span>Chrome</span>
                                <img src={chromeLogo} alt="Firefox Logo" className="inline-block w-26 h-26 mt-5" loading="lazy" />
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Vollständig getestet</p>
                        </div>
                        <div className="relative bg-white/20 dark:bg-gray-300/5 p-4 rounded-xl text-center shadow-sm">
                            <CheckCircleIcon className="w-20 h-20 inline-block dark:fill-green-200/20 fill-green-800/20 absolute left-4" />
                            &nbsp;
                            <h3 className="flex-col items-center flex font-semibold dark:text-gray-200/50">
                                <span>Edge</span>
                                <img src={edgeLogo} alt="Firefox Logo" className="inline-block w-26 h-26 mt-5" loading="lazy" />
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Unterstützt</p>
                        </div>
                    </div>
                </section>
            </article>
        </Wrapper>
    );
}
/**
 * Lazy-loaded route configuration for the '/introduction' path.
 * 
 * This route uses the `createLazyFileRoute` function to dynamically load the 
 * `Introduction` component when the route is accessed. It also provides custom 
 * components for handling errors, pending states, and not found states.
 * 
 * @component Introduction - The main component to be rendered for this route.
 * @component errorComponent - A component to display when an error occurs. 
 *                             Receives an `error` prop with the error details.
 * @component pendingComponent - A component to display while the main component 
 *                               is being loaded.
 * @component notFoundComponent - A component to display when the route is not found.
 */
export const Route = createLazyFileRoute('/introduction')({
    component: Introduction,
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: () => <Skeleton />,
    notFoundComponent: () => <div>Challenge not found</div>,
});