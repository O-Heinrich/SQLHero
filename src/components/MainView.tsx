import { DockviewReact, DockviewReadyEvent } from 'dockview-react';
import dompurify from 'dompurify';
import 'dockview/dist/styles/dockview.css';

interface MainViewProps {
    theme?: string;
}

const CHALLENGE = {
    "title": "Woher kommen die Kunden?",
    "schema": "/databases/nordwind.sql",
    "number": 1,
    "difficulty": "easy",
    "query": "SELECT DISTINCT \n  \"Country\" \nFROM \n  customers \nORDER BY \n  \"Country\" \nASC;\n",
    "description": "<h2>Einführung in SQL SELECT und SELECT DISTINCT Statements</h2>\n<p>SQL (Structured Query Language) ist eine weit verbreitete Sprache zur Verwaltung und Manipulation von Daten in relationalen Datenbanken. Ein grundlegendes SQL-Kommando ist das <code>SELECT</code> Statement, das verwendet wird, um Daten aus einer oder mehreren Tabellen abzurufen.</p>\n<h4>Das SELECT Statement</h4>\n<p>Das <code>SELECT</code> Statement ermöglicht es, bestimmte Datenfelder aus einer Tabelle zu extrahieren. Hier ist ein einfaches Beispiel:</p>\n<pre><code class=\"language-sql hljs\" data-highlighted=\"yes\"><span class=\"hljs-keyword\">SELECT</span> spalte1, spalte2 <span class=\"hljs-keyword\">FROM</span> tabelle;\n</code></pre>\n<p>In diesem Beispiel werden die Spalten <code>spalte1</code> und <code>spalte2</code> aus der Tabelle <code>tabelle</code> ausgewählt. Wenn alle Spalten der Tabelle ausgewählt werden sollen, kann das Sternchen (<code>*</code>) verwendet werden:</p>\n<pre><code class=\"language-sql hljs\" data-highlighted=\"yes\"><span class=\"hljs-keyword\">SELECT</span> <span class=\"hljs-operator\">*</span> <span class=\"hljs-keyword\">FROM</span> tabelle;\n</code></pre>\n<h4>Das SELECT DISTINCT Statement</h4>\n<p>Manchmal enthalten die Daten, die aus einer Tabelle abgerufen werden, Duplikate. Um nur eindeutige Werte zu erhalten, kann das <code>SELECT DISTINCT</code> Statement verwendet werden. Dieses Kommando entfernt Duplikate und gibt nur einzigartige Datensätze zurück.</p>\n<p>Weiterführende Informationen finden Sie hier:  <a href=\"https://www.w3schools.com/sql/sql_distinct.asp\">w3schools.com</a></p>\n<hr>\n<h2>Woher kommen die Kunden?</h2>\n<h3>Aufgabenstellung</h3>\n<p>Aus welchen Ländern kommen die Kunden? </p>\n<h4>Ausgabe</h4>\n<table>\n<thead>\n<tr>\n<th>Länder</th>\n<th></th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Argentina</td>\n<td></td>\n</tr>\n<tr>\n<td>Austria</td>\n<td></td>\n</tr>\n<tr>\n<td>Belgium</td>\n<td></td>\n</tr>\n<tr>\n<td>Brazil</td>\n<td></td>\n</tr>\n<tr>\n<td>Canada</td>\n<td></td>\n</tr>\n<tr>\n<td>Denmark</td>\n<td></td>\n</tr>\n<tr>\n<td>Finland</td>\n<td></td>\n</tr>\n<tr>\n<td>France</td>\n<td></td>\n</tr>\n<tr>\n<td>Germany</td>\n<td></td>\n</tr>\n<tr>\n<td>Ireland</td>\n<td></td>\n</tr>\n<tr>\n<td>Italy</td>\n<td></td>\n</tr>\n<tr>\n<td>Mexico</td>\n<td></td>\n</tr>\n<tr>\n<td>Norway</td>\n<td></td>\n</tr>\n<tr>\n<td>Poland</td>\n<td></td>\n</tr>\n<tr>\n<td>Portugal</td>\n<td></td>\n</tr>\n<tr>\n<td>Spain</td>\n<td></td>\n</tr>\n<tr>\n<td>Sweden</td>\n<td></td>\n</tr>\n<tr>\n<td>Switzerland</td>\n<td></td>\n</tr>\n<tr>\n<td>UK</td>\n<td></td>\n</tr>\n<tr>\n<td>USA</td>\n<td></td>\n</tr>\n<tr>\n<td>Venezuela</td>\n<td></td>\n</tr>\n</tbody></table>\n"
};

/**
 * Challenge lesson display component with sanitized HTML
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.lesson - HTML lesson content
 */
const ChallengeLesson: React.FC<{ lesson: string, difficulty: 'easy' | 'medium' | 'hard' | 'unknown' }> = ({
    lesson,
    difficulty
}: {
    lesson: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'unknown';
}) => (
    <article className="mt-24">
        <div 
            style={{height: 'auto', overflow: 'auto'}}
            dangerouslySetInnerHTML={{
                __html: `<span class="float-right inline-block rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">${difficulty}</span>\n${dompurify.sanitize(lesson)}`
            }}
        />
    </article>
);

export const MainView: React.FC<MainViewProps> = (props: MainViewProps) => {
    const onReady = (event: DockviewReadyEvent) => {
        // Initialize panels
        event.api.addPanel({
            id: 'panel1',
            component: 'basicPanel',
            title: 'Panel 1',
        });

        event.api.addPanel({
            id: 'panel2',
            component: 'lessonPanel',
            title: 'Panel 2',

            position: { referencePanel: 'panel1', direction: 'right' },
        });
    };

    const components = {
        basicPanel: (props: { params: { title: string } }) => (
            <div style={{ padding: '20px' }}>
                <h2>{props.params.title}</h2>
                <p>Content goes here</p>
            </div>
        ),
        lessonPanel: () => (
            <ChallengeLesson lesson={CHALLENGE.description} difficulty={CHALLENGE.difficulty} />
        ),
    };
    return (
        <DockviewReact
            components={components}
            onReady={onReady}
            className={props.theme || 'dockview-theme-abyss'}
        />
    );
}

