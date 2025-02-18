import { InlineCode } from '@/components/InlineCode';
import { Skeleton } from '@/components/Skeleton';
import { Wrapper } from '@/components/Wrapper';
import { createLazyFileRoute } from '@tanstack/react-router';

import hljs from "highlight.js";

import { useEffect } from 'react';

export const Route = createLazyFileRoute('/introduction')({
    component: Introduction,
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: () => <Skeleton />,
    notFoundComponent: () => <div>Challenge not found</div>,
});

function Introduction() {
    useEffect(() => {
        hljs.highlightAll();
    }, []);

    return (
        <Wrapper>
            <title>SQL Hero - Einführung</title>
            <article className="space-y-8 my-14">
                <header className="mb-8">
                    <h1>SQL Hero - Einführung in die Welt der Datenbanken</h1>
                    <div className="h-1 w-20 bg-red-400/50 dark:bg-orange-200/50 mb-4"></div>
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
                        <div className="p-4 bg-blue-200/50 dark:bg-blue-400/10 rounded-lg">
                            <h3 className="font-semibold mb-2">Daten abrufen</h3>
                            <p className="dark:text-gray-300">Wie ein Bibliothekar, der genau das richtige Buch findet,
                                hilft Ihnen <InlineCode>SELECT</InlineCode>, die gewünschten Informationen aus der Datenbank zu holen.</p>
                        </div>
                        <div className="p-4 bg-green-50/50 dark:bg-green-400/10 rounded-lg">
                            <h3 className="font-semibold mb-2">Daten speichern</h3>
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
                        <div className="bg-gray-50/50 dark:bg-gray-400/10 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3">1. Data Definition Language (DDL)</h3>
                            <p className="mb-3 dark:text-gray-300">
                                Die DDL ist wie der Architekt Ihrer Datenbank. Mit ihr erstellen Sie die grundlegende Struktur:
                            </p>
                            <div className="bg-white/50 dark:bg-gray-300/10 p-4 rounded-lg shadow-sm">
                                <p className="mb-2 dark:text-gray-200"><InlineCode>CREATE TABLE</InlineCode> - Erstellt neue Tabellen</p>
                                <p className="mb-2 dark:text-gray-200"><InlineCode>ALTER TABLE</InlineCode> - Verändert bestehende Tabellen</p>
                                <p className="dark:text-gray-200"><InlineCode>DROP TABLE</InlineCode> - Löscht Tabellen</p>
                            </div>
                        </div>

                        {/* DML Section */}
                        <div className="bg-gray-50/50 dark:bg-gray-400/10 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3">2. Data Manipulation Language (DML)</h3>
                            <p className="mb-3 dark:text-gray-300">
                                Die DML ist Ihr wichtigstes Werkzeug für die tägliche Arbeit mit Daten:
                            </p>
                            <div className="bg-white/50 dark:bg-gray-300/10 p-4 rounded-lg shadow-sm space-y-3">
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
                    <div className="bg-gray-50/50 dark:bg-gray-400/10 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">3. Data Control Language (DCL)</h3>
                        <p className="mb-3 dark:text-gray-300">
                            Die DCL kontrolliert die Zugriffsrechte auf Ihre Datenbank. Sie ist wie ein Sicherheitssystem:
                        </p>
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm space-y-3">
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

                    <div className="bg-gray-50/50 dark:bg-gray-400/10 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">4. Transaction Control Language (TCL)</h3>
                        <p className="mb-3 dark:text-gray-300">
                            Die TCL steuert Transaktionen - also Gruppen von Datenbankoperationen, die als Einheit behandelt werden:
                        </p>
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm space-y-3">
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
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Lernen mit SQL Hero</h2>
                    <div className="bg-blue-50/50 dark:bg-blue-400/10 p-6 rounded-lg space-y-4">
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
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Fehlerbehandlung und Tipps</h2>
                    <div className="bg-gray-50/50 dark:bg-gray-400/10 p-6 rounded-lg">
                        <div className="space-y-3">
                            <div className="bg-white/50 dark:bg-gray-300/10 p-4 rounded-lg">
                                <h4 className="font-semibold text-red-600 dark:text-red-400">Fachliche Fehler</h4>
                                <p className="dark:text-gray-300">
                                    Das SQL ist syntaktisch korrekt, liefert aber nicht das erwartete Ergebnis.
                                </p>
                            </div>
                            <div className="bg-white/50 dark:bg-gray-300/10 p-4 rounded-lg">
                                <h4 className="font-semibold text-red-600 dark:text-red-400">Technische Fehler</h4>
                                <p className="dark:text-gray-300">
                                    Der SQL-Befehl kann nicht ausgeführt werden.
                                </p>
                                <code className="block mt-2 bg-red-50/50 dark:bg-red-400/10 px-2 py-1 rounded text-red-700 dark:text-red-300">
                                    "Error: no such table: tbl_kunde"
                                </code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Browser Support Section */}
                <section className="bg-gray-50/50 dark:bg-gray-400/10 p-6 rounded-lg mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Technische Voraussetzungen</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white/50 dark:bg-gray-300/10 p-4 rounded-lg text-center">
                            <h3 className="font-semibold dark:text-gray-200">Firefox</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Vollständig getestet</p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-300/10 p-4 rounded-lg text-center">
                            <h3 className="font-semibold dark:text-gray-200">Chrome</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Vollständig getestet</p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-300/10 p-4 rounded-lg text-center">
                            <h3 className="font-semibold dark:text-gray-200/50">Edge</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Unterstützt</p>
                        </div>
                    </div>
                </section>
            </article>
        </Wrapper >
    )
}
