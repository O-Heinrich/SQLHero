import { JSX } from "react";

/**
 * Represents a learning task with associated content and metadata
 * @interface
 */
interface Task {
    nr: number;
    titel: string;
    aufgabe: string;
    solution: string;
    lektion?: string | JSX.Element;
    intro?: string;
    view?: string;
}

/**
 * Represents a database of tasks with metadata
 * @interface
 */
interface Database {
    db: string;
    pdf: string;
    titelDB: string;
    tasks: Task[];
}


/**
 * Collection of database challenges with associated content and solutions
 * @type {Record<string, Database>}
 */
export const challenges: Record<string, Database> = {
    nordwind:
    {
        db: "https://sqlhero.it.bbwi/databases/nordwind.db",
        pdf: "https://sqlhero.it.bbwi/databases/pdf/NordwindDB.pdf",
        titelDB: "Nordwind",
        tasks: [
            {
                'nr': 1,
                'titel': "Woher kommen die Kunden?",
                'lektion': (
                    <>
                        <h3 id="Einführung-in-SQL-SELECT-und-SELECT-DISTINCT-Statements"><a className="anchor hidden-xs" href="#Einführung-in-SQL-SELECT-und-SELECT-DISTINCT-Statements" title="Einführung-in-SQL-SELECT-und-SELECT-DISTINCT-Statements" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Einführung in SQL SELECT und SELECT DISTINCT Statements</h3>
                        <p>SQL (Structured Query Language) ist eine weit verbreitete Sprache zur Verwaltung und Manipulation von Daten in relationalen Datenbanken. Ein grundlegendes SQL-Kommando ist das <code>SELECT</code> Statement, das verwendet wird, um Daten aus einer oder mehreren Tabellen abzurufen.</p>
                        <h4 id="Das-SELECT-Statement"><a className="anchor hidden-xs" href="#Das-SELECT-Statement" title="Das-SELECT-Statement" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Das SELECT Statement</h4>
                        <p>Das <code>SELECT</code> Statement ermöglicht es, bestimmte Datenfelder aus einer Tabelle zu extrahieren. Hier ist ein einfaches Beispiel:</p>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> spalte1, spalte2 <span className="hljs-keyword">FROM</span> tabelle;</code></pre>
                        <p>In diesem Beispiel werden die Spalten <code>spalte1</code> und <code>spalte2</code> aus der Tabelle <code>tabelle</code> ausgewählt. Wenn alle Spalten der Tabelle ausgewählt werden sollen, kann das Sternchen (<code>*</code>) verwendet werden:</p>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> <span className="hljs-operator">*</span> <span className="hljs-keyword">FROM</span> tabelle;</code></pre>
                        <h4 id="Das-SELECT-DISTINCT-Statement"><a className="anchor hidden-xs" href="#Das-SELECT-DISTINCT-Statement" title="Das-SELECT-DISTINCT-Statement" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Das SELECT DISTINCT Statement</h4>
                        <p>Manchmal enthalten die Daten, die aus einer Tabelle abgerufen werden, Duplikate. Um nur eindeutige Werte zu erhalten, kann das <code>SELECT DISTINCT</code> Statement verwendet werden. Dieses Kommando entfernt Duplikate und gibt nur einzigartige Datensätze zurück.</p>
                        <p>Weiterführende Informationen finden Sie hier:<br /><a href="https://www.w3schools.com/sql/sql_distinct.asp" target="_blank" rel="noopener">https://www.w3schools.com/sql/sql_distinct.asp</a></p>
                    </>
                ),
                'intro': "Laden Sie das <a href=\"http://sqlhero.it.bbwi/databases/pdf/NordwindDB.pdf\" >PDF </a> der Nordwind DB herunter, um die Tabellen und Attribute der DB zu sehen. Für diese DB sind entsprechende <br /> SQL-Aufgaben zu lösen. Viel Spaß!",
                "aufgabe": "Aus welchen Ländern kommen die Kunden? Ausgabe: Länder.",
                "solution": "SELECT DISTINCT \"Country\" \nFROM customers \nORDER BY \"Country\" ASC;"
            },
            {
                'nr': 2,
                'titel': "Anzahl Länder",
                "lektion": (
                    <>
                        <h3 id="Einführung-in-die-SQL-COUNT-Funktion"><a className="anchor hidden-xs" href="#Einführung-in-die-SQL-COUNT-Funktion" title="Einführung-in-die-SQL-COUNT-Funktion" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Einführung in die SQL COUNT Funktion</h3>
                        <p>Die SQL <code>COUNT</code> Funktion ist eine nützliche Aggregatfunktion, die verwendet wird, um die Anzahl der Zeilen zu zählen, die einem bestimmten Kriterium entsprechen. Sie wird häufig verwendet, um Daten in einer Tabelle zu analysieren und zu verstehen, wie viele Einträge bestimmten Bedingungen entsprechen.</p>
                        <h4 id="Verwendung-der-COUNT-Funktion"><a className="anchor hidden-xs" href="#Verwendung-der-COUNT-Funktion" title="Verwendung-der-COUNT-Funktion" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Verwendung der COUNT Funktion</h4>
                        <p>Die <code>COUNT</code> Funktion kann in einer <code>SELECT</code> Abfrage verwendet werden, um die Anzahl der Datensätze in einer Tabelle oder die Anzahl der Nicht-NULL-Werte in einer bestimmten Spalte zu ermitteln. Hier sind einige Beispiele für die Verwendung der <code>COUNT</code> Funktion:</p>
                        <ol><li><strong>Zählen aller Zeilen in einer Tabelle:</strong></li></ol>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> <span className="hljs-built_in">COUNT</span>(<span className="hljs-operator">*</span>) <span className="hljs-keyword">FROM</span> tabelle;</code></pre>
                        <p>Dieses Statement zählt alle Zeilen in der Tabelle <code>tabelle</code>.</p>
                        <ol data-data-start="2"><li><strong>Zählen von Zeilen mit Nicht-NULL-Werten in einer bestimmten Spalte:</strong></li></ol>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> <span className="hljs-built_in">COUNT</span>(spalte) <span className="hljs-keyword">FROM</span> tabelle;</code></pre>
                        <p>Dieses Statement zählt die Anzahl der Zeilen, in denen die Spalte <code>spalte</code> nicht NULL ist.</p>
                        <ol data-data-start="3"><li><strong>Zählen von Zeilen, die einem bestimmten Kriterium entsprechen:</strong></li></ol>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> <span className="hljs-built_in">COUNT</span>(<span className="hljs-operator">*</span>) <span className="hljs-keyword">FROM</span> tabelle <span className="hljs-keyword">WHERE</span> bedingung;</code></pre>
                        <p>Dieses Statement zählt die Anzahl der Zeilen, die der angegebenen <code>bedingung</code> entsprechen.</p>
                        <p>Mit der <code>COUNT</code> Funktion können Sie schnell und einfach die Anzahl der Datensätze in einer Datenbanktabelle analysieren und wertvolle Einblicke in Ihre Daten gewinnen.</p>
                        <p>Weiterführende Informationen finden Sie hier:<br /><a href="https://www.w3schools.com/sql/sql_count.asp" target="_blank" rel="noopener">https://www.w3schools.com/sql/sql_count.asp</a></p>
                    </>
                ),
                "aufgabe": "Lassen Sie die Anzahl der Länder ausgeben. <br /> Ausgabe: Anzahl der Länder",
                "solution": "SELECT COUNT(DISTINCT \"Country\") \nFROM customers;"
            },
            {
                'nr': 3,
                'titel': "Woher kommen die MEISTEN Kunden?",
                "lektion": (
                    <>
                        <h3 id="Einführung-in-das-SQL-ORDER-BY-Schlüsselwort"><a className="anchor hidden-xs" href="#Einführung-in-das-SQL-ORDER-BY-Schlüsselwort" title="Einführung-in-das-SQL-ORDER-BY-Schlüsselwort" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Einführung in das SQL ORDER BY Schlüsselwort</h3>
                        <p>Das SQL <code>ORDER BY</code> Schlüsselwort wird verwendet, um die Ergebnisse einer Abfrage in einer bestimmten Reihenfolge zu sortieren. Dies ermöglicht es, Daten geordnet nach einer oder mehreren Spalten abzurufen, wodurch die Analyse und Interpretation der Daten erleichtert wird.</p>
                        <h4 id="Verwendung-des-ORDER-BY-Schlüsselworts"><a className="anchor hidden-xs" href="#Verwendung-des-ORDER-BY-Schlüsselworts" title="Verwendung-des-ORDER-BY-Schlüsselworts" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Verwendung des ORDER BY Schlüsselworts</h4>
                        <p>Die grundlegende Syntax für die Verwendung von <code>ORDER BY</code> lautet:</p>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> spalte1, spalte2, ... <span className="hljs-keyword">FROM</span> tabelle <span className="hljs-keyword">ORDER</span> <span className="hljs-keyword">BY</span> spalte [<span className="hljs-keyword">ASC</span><span className="hljs-operator">|</span><span className="hljs-keyword">DESC</span>];</code></pre>
                        <ul>
                            <li><code>spalte1, spalte2, ...</code>: Die Spalten, die in der Ergebnismenge enthalten sein sollen.</li>
                            <li><code>tabelle</code>: Der Name der Tabelle, aus der die Daten abgerufen werden.</li>
                            <li><code>ORDER BY spalte</code>: Die Spalte, nach der die Daten sortiert werden sollen.</li>
                            <li><code>[ASC|DESC]</code>: Optional; gibt die Sortierreihenfolge an. <code>ASC</code> steht für aufsteigende Reihenfolge (Standard) und <code>DESC</code> für absteigende Reihenfolge.</li>
                        </ul>
                        <p>Das <code>ORDER BY</code> Schlüsselwort ist ein mächtiges Werkzeug in SQL, das es ermöglicht, Daten geordnet und strukturiert abzurufen, was die Handhabung und Interpretation der Daten erheblich vereinfacht.</p>
                        <p>Weiterführende Informationen finden Sie hier:<br /><a href="https://www.w3schools.com/sql/sql_orderby.asp" target="_blank" rel="noopener">https://www.w3schools.com/sql/sql_orderby.asp</a></p>
                    </>
                ),
                "aufgabe": "Wo kommen die meisten Kunden her? <br /> Ausgabe: Anzahl der Kunden (absteigend sortiert), Länder",
                "solution": "SELECT COUNT(\"CustomerID\") AS \"Number of Customers\", \n\t\"Country\"\nFROM customers \nGROUP BY \"Country\" \nORDER BY COUNT(\"CustomerID\") DESC;"
            },
            {
                'nr': 4,
                'titel': "Name Mitarbeiter",
                "lektion": (
                    <>
                        <h3 id="Einführung-in-die-SQL-WHERE-Klausel"><a className="anchor hidden-xs" href="#Einführung-in-die-SQL-WHERE-Klausel" title="Einführung-in-die-SQL-WHERE-Klausel" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Einführung in die SQL WHERE Klausel</h3>
                        <p>Die SQL <code>WHERE</code> Klausel ist ein wesentliches Werkzeug in SQL, das verwendet wird, um Daten aus einer Datenbank basierend auf bestimmten Kriterien zu filtern. Mit der <code>WHERE</code> Klausel können Sie gezielt Datensätze auswählen, die bestimmte Bedingungen erfüllen, wodurch Abfragen präziser und effizienter werden.</p>
                        <h4 id="Verwendung-der-WHERE-Klausel"><a className="anchor hidden-xs" href="#Verwendung-der-WHERE-Klausel" title="Verwendung-der-WHERE-Klausel" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Verwendung der WHERE Klausel</h4>
                        <p>Die <code>WHERE</code> Klausel wird in Kombination mit dem <code>SELECT</code> Statement (und auch mit anderen Statements wie <code>UPDATE</code>, <code>DELETE</code> und <code>INSERT</code>) verwendet, um nur die Datensätze zurückzugeben oder zu beeinflussen, die den angegebenen Bedingungen entsprechen.</p>
                        <p>Hier ist die grundlegende Syntax einer <code>SELECT</code> Abfrage mit der <code>WHERE</code> Klausel:</p>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> spalte1, spalte2 <span className="hljs-keyword">FROM</span> tabelle <span className="hljs-keyword">WHERE</span> bedingung;</code></pre>
                        <p>In diesem Beispiel werden nur die Zeilen aus der Tabelle <code>tabelle</code> ausgewählt, bei denen die <code>bedingung</code> wahr ist.</p>
                        <h4 id="Beispiele-für-die-Verwendung-der-WHERE-Klausel"><a className="anchor hidden-xs" href="#Beispiele-für-die-Verwendung-der-WHERE-Klausel" title="Beispiele-für-die-Verwendung-der-WHERE-Klausel" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Beispiele für die Verwendung der WHERE Klausel</h4>
                        <p>Angenommen, wir haben eine Tabelle namens <code>employees</code> mit folgender Struktur:</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>name</th>
                                    <th>age</th>
                                    <th>department</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Alice Green</td>
                                    <td>30</td>
                                    <td>HR</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Bob Brown</td>
                                    <td>35</td>
                                    <td>IT</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Carol White</td>
                                    <td>28</td>
                                    <td>Finance</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>Dave Black</td>
                                    <td>45</td>
                                    <td>IT</td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td>Eve Blue</td>
                                    <td>50</td>
                                    <td>HR</td>
                                </tr>
                            </tbody>
                        </table>
                        <p>Hier sind einige Beispiele für die Verwendung der <code>WHERE</code> Klausel:</p>
                        <ol>
                            <li><strong>Auswählen von Mitarbeitern in der IT-Abteilung:</strong></li>
                        </ol>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> <span className="hljs-operator">*</span> <span className="hljs-keyword">FROM</span> employees <span className="hljs-keyword">WHERE</span> department <span className="hljs-operator">=</span> <span className="hljs-string">'IT'</span>;</code></pre>
                        <p>Dieses Statement gibt alle Zeilen zurück, bei denen die Abteilung <code>IT</code> ist.</p>
                        <ol data-start="2">
                            <li><strong>Auswählen von Mitarbeitern, die älter als 30 Jahre sind:</strong></li>
                        </ol>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> <span className="hljs-operator">*</span> <span className="hljs-keyword">FROM</span> employees <span className="hljs-keyword">WHERE</span> age <span className="hljs-operator">&gt;</span> <span className="hljs-number">30</span>;</code></pre>
                        <p>Dieses Statement gibt alle Mitarbeiter zurück, die älter als 30 Jahre sind.</p>
                        <ol data-start="3">
                            <li><strong>Auswählen von Mitarbeitern in der HR-Abteilung, die älter als 40 Jahre sind:</strong></li>
                        </ol>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> <span className="hljs-operator">*</span> <span className="hljs-keyword">FROM</span> employees <span className="hljs-keyword">WHERE</span> department <span className="hljs-operator">=</span> <span className="hljs-string">'HR'</span> <span className="hljs-keyword">AND</span> age <span className="hljs-operator">&gt;</span> <span className="hljs-number">40</span>;</code></pre>
                        <p>Dieses Statement gibt alle Mitarbeiter der HR-Abteilung zurück, die älter als 40 Jahre sind.</p>
                        <h3 id="Kombination-von-Bedingungen"><a className="anchor hidden-xs" href="#Kombination-von-Bedingungen" title="Kombination-von-Bedingungen" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Kombination von Bedingungen</h3>
                        <p>Die <code>WHERE</code> Klausel kann mehrere Bedingungen kombinieren, indem logische Operatoren wie <code>AND</code>, <code>OR</code> und <code>NOT</code> verwendet werden. Dies ermöglicht komplexe Abfragen, die mehrere Kriterien berücksichtigen.</p>
                        <h4 id="Beispiel-mit-mehreren-Bedingungen"><a className="anchor hidden-xs" href="#Beispiel-mit-mehreren-Bedingungen" title="Beispiel-mit-mehreren-Bedingungen" data-smoothhashscroll=""><i className="fa fa-link"></i></a>Beispiel mit mehreren Bedingungen:</h4>
                        <pre><code className="sql hljs"><span className="hljs-keyword">SELECT</span> <span className="hljs-operator">*</span> <span className="hljs-keyword">FROM</span> employees <span className="hljs-keyword">WHERE</span> department <span className="hljs-operator">=</span> <span className="hljs-string">'IT'</span> <span className="hljs-keyword">AND</span> age <span className="hljs-operator">&gt;</span> <span className="hljs-number">40</span>;</code></pre>
                        <p>Dieses Statement gibt alle Mitarbeiter der IT-Abteilung zurück, die älter als 40 Jahre sind.</p>
                        <p>Mit der <code>WHERE</code> Klausel können Sie Ihre Datenbankabfragen präzisieren und nur die Datensätze zurückgeben, die für Ihre spezifischen Anforderungen relevant sind.</p>
                        <p>Weiterführende Informationen finden Sie hier:<br /><a href="https://www.w3schools.com/sql/sql_where.asp" target="_blank" rel="noopener">https://www.w3schools.com/sql/sql_where.asp</a></p>
                    </>
                ),
                "aufgabe": "Wie heißt der oder die Mitarbeiter*in mit der Personalnummer 9? <br /> Ausgabe: Nachname, Vorname",
                "solution": "SELECT \"LastName\", \"FirstName\" \nFROM Employees \nWHERE \"EmployeeID\" = 9;"
            },
            {
                'nr': 5,
                'titel': "Empfänger / Where-Klausel?",
                "aufgabe": "Gesucht werden die Empfänger, die vom Mitarbeiter mit der Personalnummer 9 betreut worden sind. <br /> Ausgabe: Empfänger, Straße, Ort, PLZ, Bestimmungsland",
                "solution": "SELECT DISTINCT \"ShipName\", \"ShipAddress\", \"ShipCity\", \"ShipPostalCode\", \"ShipCountry\"\nFROM Orders \nWHERE \"EmployeeID\" = 9\nORDER BY \"ShipCountry\" ASC;"
            },
            {
                'nr': 6,
                'titel': "Bestellte Artikel",
                "aufgabe": "Welche Artikel wurden bisher bestellt? <br /> Ausgabe: Artikelnummer (aufsteigend sortiert), Artikelname",
                "solution": "SELECT DISTINCT t1.\"ProductID\", t1.\"ProductName\" \nFROM Products AS t1, order_details AS t2 \nWHERE t1.\"ProductID\" = t2.\"ProductID\";"
            },
            {
                'nr': 7,
                'titel': "Kundentelefonliste",
                "aufgabe": "Erstellen Sie eine Kundentelefonliste. <br /> Ausgabe: Firma (sortiert), Kontaktperson, Telefonnummer, Telefax",
                "solution": "SELECT\n\t\"CompanyName\",\n\t\"ContactName\",\n\t\"Phone\",\n\t\"Fax\"\nFROM\n\tcustomers\nORDER BY\n\t\"CompanyName\";"
            },
            {
                'nr': 8,
                'titel': "Geburtstagsliste",
                "aufgabe": "Erstellen Sie eine Geburtstagsliste. <br /> Ausgabe: Name, Geburtstag",
                "solution": "SELECT\n\t\"BirthDate\",\n\t\"FirstName\",\n\t\"LastName\"\nFROM\n\temployees\nORDER BY\n\t\"FirstName\";"
            },
            {
                'nr': 9,
                'titel': "Artikel der Firma",
                "aufgabe": "Welche Artikel liefet die Firma „Norske Meierier“? <br /> Ausgabe: Firma, Artikelname (aufsteigend sortiert)",
                "solution": "SELECT tbl_lieferanten.Firma, tbl_artikel.Artikelname FROM tbl_artikel, tbl_lieferanten WHERE tbl_lieferanten.LieferantenNr = tbl_artikel.LieferantenNr AND tbl_lieferanten.Firma = 'Norske Meierier' ORDER BY Artikelname;"
            },
            {
                'nr': 10,
                'titel': "Betreute Kunden",
                "aufgabe": "Gesucht werden die Kunden, die vom Mitarbeiter Dodsworth betreut wurden. <br /> Ausgabe: Firma, Straße, Ort, PLZ, Bestimmungsland (aufsteigend sortiert)",
                "solution": "SELECT DISTINCT k.Firma, k.Strasse, k.Ort, k.PLZ, b.bestimmungsLand FROM tbl_personal AS p, tbl_bestellungen AS b, tbl_kunden AS k WHERE p.Nachname='Dodsworth' AND p.PersonalNr=b.PersonalNr AND b.KundenCode=k.KundenCode ORDER BY b.bestimmungsLand;"
            },
            {
                'nr': 11,
                'titel': "Bestellte Artikel von Firma",
                "aufgabe": "Schreiben Sie eine Abfrage, die alle bestellten Artikel der Firma „Ernst Handel“ ausgibt! <br /> Ausgabe: Artikelname (sortiert)",
                "solution": "SELECT DISTINCT a.Artikelname FROM tbl_kunden AS k, tbl_artikel AS a, tbl_bestellungen AS b, tbl_bestelldetails AS bd WHERE k.Firma LIKE 'Ernst Handel' AND k.KundenCode = b.KundenCode AND b.BestellNr = bd.BestellNr AND bd.ArtikelNr = a.ArtikelNr ORDER BY a.Artikelname;"
            },
            {
                'nr': 12,
                'titel': "Preiserhöhung",
                "aufgabe": "Alle Artikel bekommen eine Preiserhöhung von 2%. Ändern Sie den/die betreffenden Datensatz/-sätze mit UPDATE",
                "solution": "select (einzelpreis * 1.02) as Einzelpreis from tbl_artikel",
                "view": "select Einzelpreis from tbl_artikel"
            },
            {
                'nr': 13,
                'titel': "Anzahl bestellte Artikel",
                "aufgabe": "Wie viel Liefereinheiten des Artikels Lakkalikööri sind insgesamt bestellt worden? <br /> Ausgabe: Anzahl",
                "solution": "SELECT SUM(bd.anzahl) AS Anzahl FROM tbl_bestelldetails AS bd, tbl_artikel AS a WHERE a.Artikelname = 'Lakkalikööri' AND bd.Artikelnr = a.Artikelnr;"
            },
            {
                'nr': 14,
                'titel': "Anzahl bestellte Getränke",
                "aufgabe": "Wie viel Liefereinheiten sind für die Kategorie Getränke bestellt worden? <br /> Ausgabe: Anzahl",
                "solution": "SELECT SUM(bd.anzahl) AS [Anzahl Flaschen Kategorie Getränke] FROM tbl_bestelldetails AS bd, tbl_artikel AS a, tbl_kategorien AS k WHERE bd.Artikelnr = a.Artikelnr AND a.kategorienr = k.kategorienr AND k.kategoriename = 'Getränke';"
            },
            {
                'nr': 15,
                'titel': "Stückzahlen bestellter Artikel",
                "aufgabe": "Es sollen pro Kategorien die Stückzahlen der bestellten Artikel ausgegeben werden. <br /> Ausgabe: Stückzahl, Kategorie (sortiert)",
                "solution": "SELECT SUM(bd.anzahl) AS [Stückzahl], k.kategoriename AS Kategorie FROM tbl_bestelldetails AS bd, tbl_artikel AS a, tbl_kategorien AS k WHERE bd.Artikelnr = a.Artikelnr AND a.kategorienr = k.kategorienr GROUP BY k.kategoriename ORDER BY k.kategoriename;"
            },
            {
                'nr': 16,
                'titel': "Lagerbestand bestimmter Artikel",
                "aufgabe": "Es soll pro Kategoriennummer der Lagerbestand ausgegeben werden, für alle Artikel die nicht Auslaufartikel sind und über 10,00 EUR kosten. <br /> Ausgabe: Kategoriennummer, Lagerbestand (sortiert)",
                "solution": "SELECT Kategorienr, SUM(lagerbestand) AS [Anzahl Lagerbestand] FROM tbl_artikel WHERE Einzelpreis > 10 AND Auslaufartikel = false GROUP BY Kategorienr ORDER BY SUM(lagerbestand);"
            },
            {
                'nr': 17,
                'titel': "Bestellungen pro Mitarbeiter",
                "aufgabe": "Es soll die Anzahl der Bestellungen pro Mitarbeiter ausgegeben werden. <br /> Ausgabe: Vorname, Nachname, Anzahl Bestellungen (sortiert)",
                "solution": "SELECT Kategorienr, SUM(lagerbestand) AS [Anzahl Lagerbestand] FROM tbl_artikel WHERE Einzelpreis > 10 AND Auslaufartikel = false GROUP BY Kategorienr ORDER BY SUM(lagerbestand);"
            },
            {
                'nr': 18,
                'titel': "Gesamtumsatz je Artikel",
                "aufgabe": "Es soll der erzielte Gesamtumsatz je Artikel ermittelt werden. <br /> Ausgabe: Artikelname, Umsatz",
                "solution": "SELECT a.Artikelname, SUM(b.Einzelpreis * Anzahl) AS Umsatz FROM tbl_artikel a, tbl_bestelldetails b WHERE a.ArtikelNr=b.ArtikelNr GROUP BY 1;"
            },
            {
                'nr': 19,
                'titel': "Umsatz pro Auslaufartikel",
                "aufgabe": "Es soll der erzielte Umsatz pro Auslaufartikel ausgegeben werden. <br /> Ausgabe: Artikelname, Umsatz (sortiert ohne Nachkommabeträge und ohne Berücksichtigung des Rabattes)",
                "solution": "SELECT a.Artikelname, round(SUM(b.anzahl * b.Einzelpreis)) AS Umsatz FROM tbl_artikel AS a, tbl_bestelldetails AS b WHERE a.artikelnr = b.Artikelnr AND Auslaufartikel = true GROUP BY a.Artikelname ORDER BY SUM(b.anzahl * b.Einzelpreis) ASC;"
            },
            {
                'nr': 20,
                'titel': "Lagerbestand je Kategorie",
                "aufgabe": "Es soll der überschüssige Lagerbestand je Kategorie ausgegeben werden. <br /> Ausgabe: Kategorienname, Überschüssiger Lagerbestand (sortiert)",
                "solution": "SELECT k.Kategoriename, sum(lagerbestand-mindestbestand) AS 'Überschüssiger Lagerbestand' FROM tbl_artikel AS a, tbl_kategorien AS k WHERE k.Kategorienr = a.Kategorienr GROUP BY k.Kategoriename ORDER BY 2;"
            },
            {
                'nr': 21,
                'titel': "Anzahl der Kunden 1",
                "aufgabe": "Es soll pro Land die Anzahl der Kunden ermittelt werden. (nur GROUP BY) <br />  Ausgabe: Land, Anzahl an Kunden (sortiert)",
                "solution": "SELECT Land, COUNT(*) AS 'Anzahl der Kunden' FROM tbl_kunden GROUP BY Land ORDER BY 2;"
            },
            {
                'nr': 22,
                'titel': "Anzahl der Kunden 2",
                "aufgabe": "Es soll pro Land die Anzahl der Kunden ermittelt werden, welche unter 3 Kunden besitzen <br /> Ausgabe: Land, Anzahl an Kunden (sortiert)",
                "solution": "SELECT Land, COUNT(*) AS 'Anzahl der Kunden' FROM tbl_kunden GROUP BY Land HAVING COUNT(firma) < 3 ORDER BY 2;"
            },
            {
                'nr': 23,
                'titel': "Teuerste Produkte",
                "aufgabe": "Listen Sie die Lieferanten mit Ihrem jeweils teuersten Produkt auf. Es sollen nur die Lieferanten angezeigt werden, bei denen das teuerste Produkt billiger als 20  EUR ist. <br /> Ausgabe: Lieferantennummer (sortiert), Artikel Einzelpreis",
                "solution": "SELECT LieferantenNr, MAX(Einzelpreis) AS 'Artikel Einzelpreis' FROM tbl_artikel GROUP BY LieferantenNr HAVING MAX(Einzelpreis) < 20;"
            },
            {
                'nr': 24,
                'titel': "Bestellungen",
                "aufgabe": "Es soll die Anzahl der Bestellvorgänge und die Anzahl der bestellten Einheiten je Artikel mir der Artikel-Nr. zwischen 50 und 70 ausgegeben werden, welche weniger als 20 Bestellvorgänge haben. <br /> Ausgabe: Artikelname, Anzahl der Bestellvorgänge, Anzahl (sortiert aufsteigend)",
                "solution": "SELECT a.Artikelname, COUNT(bd.ArtikelNr) AS 'Anzahl der Bestellvorgänge', SUM(bd.Anzahl) AS Anzahl FROM tbl_bestelldetails AS bd, tbl_artikel AS a WHERE a.artikelnr = bd.artikelnr and bd.ArtikelNr BETWEEN 50 AND 70 GROUP BY a.Artikelname HAVING COUNT(bd.ArtikelNr) < 20;"
            },
            {
                'nr': 25,
                'titel': "Bestimmte Kunden 1",
                "aufgabe": "Gesucht werden die Kunden sowie deren Umsatz, welche aus den USA kommen und einen Gesamtbestellwert unter 5000,00 EUR besitzen. <br /> Ausgabe: Firma (Kunden), Umsatz (sortiert, ohne Berücksichtigung des Rabattes)",
                "solution": "SELECT ku.Firma, SUM(bd.einzelpreis * bd.anzahl) AS Umsatz FROM tbl_kunden AS ku, tbl_bestellungen AS be, tbl_bestelldetails AS bd WHERE ku.kundencode = be.kundencode AND be.bestellnr = bd.bestellnr AND ku.Land LIKE 'USA' GROUP BY ku.Firma Having SUM(bd.einzelpreis * bd.anzahl) < 5000 ORDER BY sum(bd.einzelpreis * bd.anzahl);"
            },
            {
                'nr': 26,
                'titel': "a-Kunden",
                "aufgabe": "Ermitteln Sie die Anzahl an Kunden, die ein „a“ im Namen haben, der Länder mit weniger als 3 Kunden. <br />  Ausgabe: Land, Anzahl an Kunden (sortiert)",
                "solution": "SELECT Land, COUNT(*) AS 'Anzahl der Kunden' FROM tbl_kunden WHERE Kontaktperson LIKE '%a%' GROUP BY Land HAVING COUNT(*) < 3 ORDER BY 2;"
            },
            {
                'nr': 27,
                'titel': "Bestimmte Kunden 2",
                "aufgabe": "Es soll alle die Kunden angezeigt welche mehr als insgesamt 5 Bestellungen aufgegeben haben und von den Mitarbeiter mit der 7,8,9 betreut wurden. <br />  Ausgabe: Firma (Kunden), Anzahl Bestellungen",
                "solution": "SELECT ku.Firma, COUNT(be.Kundencode) AS Bestellanzahl FROM tbl_bestellungen AS be, tbl_kunden AS ku WHERE ku.kundencode = be.kundencode AND Personalnr BETWEEN 7 AND 9 GROUP BY ku.Firma HAVING COUNT(be.Kundencode) > 5;"
            },
            {
                'nr': 28,
                'titel': "Bestellungen von „Lakkalikööri“",
                "aufgabe": "Wie viele Bestellungen wurden je Mitarbeiter für den Artikel „Lakkalikööri“ entgegengenommen? Begrenzen Sie die Ausgabe auf Mitarbeiter, die mindestens 2 Flaschen insgesamt verkauft haben. <br /> Ausgabe: Mitarbeitername, Anzahl der Bestellungen aus Deutschland",
                "solution": "SELECT CONCAT(p.Vorname,' ',p.Nachname), COUNT(*) AS 'Anzahl Bestellungen aus Deutschland', kd.Firma FROM tbl_personal AS p, tbl_bestellungen AS b, tbl_bestelldetails AS bd, tbl_artikel AS a, tbl_kunden AS kd WHERE p.PersonalNr=b.PersonalNr AND b.BestellNr=bd.BestellNr AND bd.ArtikelNr=a.ArtikelNr AND b.KundenCode=kd.KundenCode AND kd.Land LIKE 'Deutschland' AND a.Artikelname LIKE 'Lakkalikööri' GROUP BY p.Nachname HAVING COUNT(*) >= 2;"
            },
            {
                'nr': 29,
                'titel': "Gesamtumsatz der Mitarbeiter",
                "aufgabe": "Geben Sie den Gesamtumsatz der einzelnen Mitarbeiter aufsteigend sortiert aus. <br /> Ausgabe: Nachname des Mitarbeiter, Gesamtumsatz (aufsteigend sortiert)",
                "solution": "SELECT p.Nachname, SUM((bd.Einzelpreis * bd.Anzahl) * ( 1 - bd.Rabatt)) AS Gesamtumsatz FROM tbl_personal AS p, tbl_bestelldetails AS bd, tbl_bestellungen AS b WHERE p.PersonalNr = b.PersonalNr AND b.BestellNr = bd.BestellNr GROUP BY p.Nachname ORDER BY Gesamtumsatz ASC;"
            },
            {
                'nr': 30,
                'titel': "Umsatz der Auslaufartikel",
                "aufgabe": "Wie hoch ist der zu erwartende Umsatz mit (den verbleibenden) Auslaufartikeln? <br /> Ausgabe: Artikelname, Umsatz",
                "solution": "SELECT a.Artikelname, round(SUM(a.Einzelpreis*a.Lagerbestand),3) FROM tbl_artikel AS a WHERE a.Auslaufartikel GROUP BY a.Artikelname;"
            },
            {
                'nr': 31,
                'titel': "Gelieferte Artikel",
                "aufgabe": "Geben Sie die Anzahl an gelieferten Artikel für jeden Lieferanten, der mehr als 3 Artikel liefert, aus. <br /> Ausgabe: Firma, Anzahl an Artikeln",
                "solution": "SELECT l.Firma, COUNT(*) AS 'Anzahl der Artikel' FROM tbl_artikel AS a, tbl_lieferanten AS l WHERE a.LieferantenNr=l.LieferantenNr GROUP BY l.Firma HAVING COUNT(*) > 3 ORDER BY 2;"
            },
            {
                'nr': 32,
                'titel': "Summe Lagerbestand",
                "aufgabe": "Schreiben Sie eine Abfrage, welche Ihnen die Summe zwischen 50 und 100 Einheiten des Lagerbestands (Tabelle Artikel) ausgibt. Die Ausgabe soll nach Lieferantennummer und Kategoriennummer gruppiert werden. <br /> Ausgabe: Lieferantennummer, Kategoriennummer, Summe Lagerbestand (sortiert)",
                "solution": "SELECT l.LieferantenNr, k.KategorieNr, SUM(a.Lagerbestand) FROM tbl_lieferanten AS l, tbl_artikel AS a, tbl_kategorien AS k WHERE l.LieferantenNr=a.LieferantenNr AND a.KategorieNr=k.KategorieNr GROUP BY l.LieferantenNr, k.KategorieNr HAVING SUM(a.Lagerbestand) > 50 AND SUM(a.Lagerbestand) < 100;"
            }
        ]
    },
    ga1: {
        db: "https://sqlhero.it.bbwi/databases/ga1.db",
        pdf: "https://sqlhero.it.bbwi/databases/pdf/ga1db.pdf",
        titelDB: "GA",
        tasks: [
            {
                'nr': 33,
                'titel': "Mitarbeiter von „Abteilungsleitung“",
                'intro': "Laden Sie das <a href=\"http://sqlhero.it.bbwi/databases/pdf/ga1db.pdf\" >PDF </a> der ga1 DB herunter, um die Tabellen und Attribute der DB zu sehen. Viel Spaß!",
                'aufgabe': "Selektieren Sie alle Mitarbeiter mit der Tätigkeit „Abteilungsleitung“",
                "solution": "SELECT * FROM mitarbeiter  WHERE Tätigkeit = 'Abteilungsleitung'"

            },
            {
                'nr': 34,
                'titel': "Mitarbeiter von „Controlling“",
                'aufgabe': "Selektieren Sie alle Mitarbeiter aus der Abteilung „Controlling“. Versuchen Sie es mit einem Join.",
                "solution": "SELECT m.Mitarbeiter_ID, m.Name FROM mitarbeiter m, abteilung a WHERE m.Abteilungs_ID = a.Abteilungs_ID  AND a.Bezeichnung = 'Controlling'"

            },
            {
                'nr': 35,
                'titel': "Mitarbeiter Where-Klausel",
                'aufgabe': "Selektieren Sie Mitarbeiter, die mehr als die Kollegin „Laufer“ verdienen. Nutzen Sie dabei eine Unterabfrage.",
                'solution': "SELECT Mitarbeiter_ID, Name FROM mitarbeiter WHERE Gehaltgruppe < (SELECT Gehaltgruppe FROM mitarbeiter WHERE Name= 'Laufer')"
            },
            {
                'nr': 36,
                'titel': "Mitarbeiter von „Controlling“",
                'aufgabe': "Selektieren Sie den Mitarbeiternamen und den Vorgesetztennamen, sodass in einer Zeile folgender Text steht: „XX ist Vorgesetzter von YY“ (z.B. „Paulsen ist Vorgesetzter von König“). Nutzen sie dabei einen Self-Join. ",
                'solution': "SELECT v.Name, ' ist Vorgesetzter von ', m.Name FROM mitarbeiter v, mitarbeiter m WHERE m.Vorgesetzten_ID = v.Mitarbeiter_ID"
            },
            {
                'nr': 37,
                'titel': "Durchschnittsgehalt pro Abteilung",
                'aufgabe': "Selektieren Sie Abteilungsnamen sowie das Durchschnittsgehalt in der Abteilung. Nutzen Sie dabei eine Gruppierung und entsprechende Aggregratfunktionen",
                'solution': "SELECT a.Bezeichnung, AVG(g.Gehalt) FROM mitarbeiter m, gehaltsgruppen g, abteilung a WHERE m.Gehaltgruppe = g.Gruppen_ID AND m.Abteilungs_ID = a.Abteilungs_ID GROUP BY a.Bezeichnung"
            }
        ]
    },
    softgmbh: {
        db: "https://sqlhero.it.bbwi/databases/softgmbh.db",
        pdf: "https://sqlhero.it.bbwi/databases/pdf/softgmbhdb.pdf",
        titelDB: "Soft GmbH",
        tasks: [
            {
                'nr': 38,
                'titel': "Parteien mit Wähler 1",
                'intro': "Die Soft GmbH hat für die FAQ GmbH zur Wähleranalyse eine Datenbank nach folgendem <a href='https://sqlhero.it.bbwi/databases/pdf/softgmbhdb.pdf' >Modell</a> erstellt. Zur Auswertung der Datenbank sollen Sie nun SQL-Abfragen formulieren.",
                'aufgabe': "Erstellen Sie eine SQL-Abfrage, die alle in der DB gespeicherten Parteien mit Anzahl ihrer Wähler auflistet, alphabetisch aufsteigend, sortiert nach Parteienbezeichnung.",
                'solution': "SELECT p.P_Bezeichnung, COUNT(w.W_ID) FROM partei p, waehler w WHERE p.P_ID = w.W_P_ID GROUP BY p.P_Bezeichnung  ORDER BY p.P_Bezeichnung ASC"
            },
            {
                'nr': 39,
                'titel': "Parteien mit Wähler 2",
                'aufgabe': "Erstellen Sie eine SQL-Abfrage, die alle in der DB gespeicherten Parteien mit der Anzahl der Wähler auflistet, die eine Fachoberschulreife besitzen, sortiert nach Parteibezeichnung.",
                'solution': "SELECT p.P_Bezeichnung AS Partei, s.S_Bezeichnung AS Schulabschluss, COUNT(w.W_ID) AS AnzahlWaehler FROM partei p INNER JOIN waehler w ON p.P_ID = w.W_P_ID INNER JOIN schulabschluss s ON w.W_S_ID = s.S_ID WHERE s.S_Bezeichnung LIKE '%Fachoberschulreife%' GROUP BY p.P_Bezeichnung ORDER BY p.P_Bezeichnung ASC"
            },
            {
                'nr': 40,
                'titel': "Parteien 1",
                'aufgabe': "Erstellen Sie eine SQL-Abfrage, welche die Bezeichnungen aller in der DB gespeicherten Parteien auflistet, die in den Bundesländern vertreten sind, die mit \"N\" beginnen. Zu jeder Partei sollen je Bundesland die Anzahl der Wähler ermittelt werden. Die Sortierung soll absteigend nach Parteibezeichnung und innerhalb der Partei aufsteigend nach Bundesland erfolgen.",
                'solution': "SELECT p.P_Bezeichnung AS Partei, b.B_Bezeichnung AS Bundesland, COUNT(w.W_ID) AS AnzahlWaehler FROM partei p INNER JOIN waehler w ON p.P_ID = w.W_P_ID INNER JOIN bundesland b ON w.W_B_ID = b.B_ID WHERE b.B_Bezeichnung LIKE \"N%\" GROUP BY p.P_Bezeichnung,b.B_Bezeichnung ORDER BY p.P_Bezeichnung DESC, b.B_Bezeichnung ASC"
            },
            {
                'nr': 41,
                'titel': "Parteien 2",
                'aufgabe': "Erstellen Sie eine SQL-Abfrage, welche die Bezeichnungen aller in der DB gespeicherten Parteien auflistet und für jede Partei die Durchschnittsalter der weiblichen und männlichen Wähler ermittelt.",
                'solution': "SELECT p.P_Bezeichnung AS Partei, (SELECT ROUND(AVG(w.W_Alter),0) FROM waehler w WHERE w.W_Geschlecht LIKE \"w\" AND w.W_P_ID = p.P_ID) AS W_Alter, (SELECT CAST(AVG(w.W_Alter) AS INTEGER) FROM waehler w WHERE w.W_Geschlecht LIKE \"m\" AND w.W_P_ID = p.P_ID) AS M_Alter FROM partei p"
            }]
    },
    schule: {
        db: "https://sqlhero.it.bbwi/databases/schule.db",
        pdf: "https://sqlhero.it.bbwi/databases/pdf/schuledb.pdf",
        titelDB: "Schule",
        tasks: [
            {
                'nr': 42,
                'titel': "Liste von Schülern",
                'intro': "Das DB-Schema ist <a href='http://sqlhero.it.bbwi/databases/pdf/schuledb.pdf'>hier</a> zu finden.",
                'aufgabe': "Eine Liste aller Schüler mit Name und Vorname, alphabetisch sortiert nach dem Namen.",
                'solution': "SELECT s.name, s.vorname FROM schueler s ORDER BY s.name"
            },
            {
                'nr': 43,
                'titel': "Liste von Räumen",
                'aufgabe': "Eine Liste der Räume: Raumnummer und Anzahl der Plätze, sortiert nach der Anzahl der Plätze und zwar so, dass die großen Räume zuerst kommen.",
                'solution': "SELECT r.nummer, r.plaetze FROM raum r ORDER BY r.plaetze DESC"
            },
            {
                'nr': 44,
                'titel': "Liste von Etagen",
                'aufgabe': "Eine Liste der Etagen in dem Gebäude; jede Etage soll in der Liste nur einmal erscheinen.",
                'solution': "SELECT DISTINCT r.etage FROM raum r"
            },
            {
                'nr': 45,
                'titel': "Schüleranzahl",
                'aufgabe': "Wieviele Schüler gibt es insgesamt?",
                'solution': "SELECT COUNT(*) FROM schueler s"
            },
            {
                'nr': 46,
                'titel': "Stundenanzahl",
                'aufgabe': "Wieviele Stunden Unterricht werden insgesamt erteilt?",
                'solution': "SELECT SUM(u.stunden) FROM unterricht u"
            },
            {
                'nr': 47,
                'titel': "Stundenanzahl Sport",
                'aufgabe': "Wieviele Stunden Sport werden erteilt?",
                'solution': "SELECT SUM(u.stunden) FROM unterricht u WHERE u.fach = 'Sport'"
            },
            {
                'nr': 48,
                'titel': "Plätze im Raum 1",
                'aufgabe': "Wieviele Plätze hat der größte Raum?",
                'solution': "SELECT MAX(r.plaetze) FROM raum r"
            },
            {
                'nr': 49,
                'titel': "Plätze im Raum 2",
                'aufgabe': "Wieviele Plätze haben die Räume in der oberen Etage durchschnittlich?",
                'solution': "SELECT AVG(r.plaetze) FROM raum r WHERE r.etage='oben'"
            },
            {
                'nr': 50,
                'titel': "Räume in der Etage",
                'aufgabe': "Eine Liste der Etagen, in der vermerkt ist, wieviele Räume es jeweils in der Etage gibt.",
                'solution': "SELECT r.etage, COUNT(*) FROM raum r GROUP BY r.etage"
            },
            {
                'nr': 51,
                'titel': "Plätze in der Etage",
                'aufgabe': "Eine Liste der Etagen, in der vermerkt ist, wieviele Plätze es jeweils in der Etage gibt.",
                'solution': "SELECT r.etage, SUM(r.plaetze) FROM raum r GROUP BY r.etage"
            },
            {
                'nr': 52,
                'titel': "Unterrichtsfächer",
                'aufgabe': "Eine Liste aller Unterrichtsfächer, in der steht, wieviele Stunden sie jeweils unterrichtet werden; die Unterrichtsfächer mit vielen Stunden sollen oben stehen.",
                'solution': "SELECT u.fach, SUM(u.stunden) AS summe FROM unterricht u GROUP BY u.fach ORDER BY summe DESC"
            },
            {
                'nr': 53,
                'titel': "Schüler in der Klasse",
                'aufgabe': "    Eine Liste der Schüler, aus der hervorgeht, in welcher Klasse sie jeweils sind.",
                'solution': "SELECT s.name, s.vorname, k.name FROM schueler s JOIN klasse k ON s.klasse_id = k.id"
            },
            {
                'nr': 54,
                'titel': "Liste Klasse",
                'aufgabe': "    Eine Liste der Klassen, jeweils mit Klassenlehrer.",
                'solution': "SELECT k.name, l.name FROM klasse k  JOIN lehrer l ON k.klassenlehrer_id = l.id"
            },
            {
                'nr': 55,
                'titel': "Liste Unterrichtsfächer",
                'aufgabe': "Eine Liste der Unterrichtsfächer der Klasse 8B.",
                'solution': "SELECT u.fach FROM klasse k JOIN unterricht u ON k.id = u.klasse_id WHERE k.name = '8B'"
            },
            {
                'nr': 56,
                'titel': "Unterrichtsräume 8b",
                'aufgabe': "Eine Liste der Räume, in denen die 8B Unterricht hat.",
                'solution': "SELECT r.nummer FROM klasse k JOIN unterricht u ON k.id = u.klasse_id JOIN raum r ON u.raum_id = r.id WHERE k.name = '8B'"
            },
            {
                'nr': 57,
                'titel': "Schüler von Raum R112",
                'aufgabe': "Eine Liste der Schüler, die Unterricht in Raum R112 Unterricht haben.",
                'solution': "SELECT s.name FROM schueler s JOIN klasse k ON s.klasse_id = k.id JOIN unterricht u ON k.id = u.klasse_id JOIN raum r ON u.raum_id = r.id WHERE r.nummer = 'R112'"
            },
            {
                'nr': 58,
                'titel': "Liste von Klassen und Anzahl Schülern",
                'aufgabe': "Eine Liste der Klassen mit der Anzahl der Schüler; sortiert nach der Anzahl der Schüler.",
                'solution': "SELECT k.name, COUNT(s.id) FROM klasse k JOIN schueler s ON k.id = s.klasse_id GROUP BY k.id"
            },
            {
                'nr': 59,
                'titel': "Unterrichtsstunden der Klassen",
                'aufgabe': "Eine Liste der Klassen, aus der hervorgeht, wieviele Stunden Unterricht die jeweilige Klasse hat. Die Liste soll nach der Anzahl der Stunden sortiert sein.",
                'solution': "SELECT k.name, SUM(u.stunden) AS anzahl FROM klasse k JOIN unterricht u ON k.id = u.klasse_id GROUP BY k.id ORDER BY anzahl DESC"
            },
            {
                'nr': 60,
                'titel': "Meiste Unterrichtsstunden",
                'aufgabe': "Die Klasse, die am meisten Unterricht hat; mit der Anzahl der Unterrichtsstunden. Man addiert für jede Klasse die Unterrichtsstunden, sortiert dann nach der Stundenzahl absteigend, und führt dann LIMIT 1 aus, um nur die erste Zeile zu bekommen.",
                'solution': "SELECT k.name, SUM(u.stunden) AS anzahl FROM klasse k JOIN unterricht u ON k.id = u.klasse_id GROUP BY k.id ORDER BY anzahl DESC LIMIT 1"
            },
            {
                'nr': 61,
                'titel': "Liste Lehrer mir Raum u. Unterrichtsstunden",
                'aufgabe': "Eine Liste der Lehrer, in der für jeden Lehrer vermerkt ist, in welchem Raum er am wie viele Stunden unterrichtet. Hinweis: Man braucht ein GROUP BY für zwei Spalten: GROUP BY l.id, r.id",
                'solution': "SELECT l.name, r.nummer, SUM(u.stunden) AS anzahl FROM lehrer l JOIN unterricht u ON l.id = u.lehrer_id JOIN raum r ON u.raum_id = r.id GROUP BY l.id, r.id ORDER BY l.name, r.nummer"
            },
            {
                'nr': 62,
                'titel': "Lehrer- und Schülernamen",
                'aufgabe': "Eine Liste, in der Vor- und Nachnamen von Lehrern und Schülern auftauchen. Tipp: Union",
                'solution': "SELECT s.name, s.vorname FROM schueler s UNION SELECT l.name, l.vorname FROM lehrer l"
            },
            {
                'nr': 63,
                'titel': "Disziplinarkonferenz",
                'aufgabe': "Disziplinarkonferenz für Schüler Schmidt: Eingeladen werden seine Fachlehrer und alle Klassenlehrer.",
                'solution': "SELECT l.name, l.vorname FROM lehrer l JOIN unterricht u ON l.id = u.lehrer_id JOIN klasse k ON u.klasse_id = k.id JOIN schueler s ON k.id = s.klasse_id WHERE s.name = 'Schmidt' UNION SELECT l.name, l.vorname FROM lehrer l JOIN klasse k ON l.id = k.klassenlehrer_id JOIN schueler s ON k.id = s.klasse_id WHERE s.name = 'Schmidt'"
            },
            {
                'nr': 64,
                'titel': "Kein Sportunterricht",
                'aufgabe': "Welche Klassen haben keinen Sportunterricht? Tipp: IN oder NOT IN",
                'solution': "SELECT k.name FROM klasse k WHERE k.id NOT IN ( SELECT u.klasse_id FROM unterricht u WHERE u.fach = 'Sport')"
            },
            {
                'nr': 65,
                'titel': "Klassenkameraden",
                'aufgabe': "Welche Schüler sind Klassenkameraden von Anne Ebert?",
                'solution': "SELECT s.name, s.vorname FROM schueler s WHERE s.klasse_id IN ( SELECT s2.klasse_id FROM schueler s2 WHERE s2.name = 'Ebert')"
            },
            {
                'nr': 66,
                'titel': "Liste aller Schüler mit Klasse",
                'aufgabe': "Eine Liste ALLER Schüler, aus der hervorgeht, in welcher Klasse sie jeweils sind. Auch Schüler ohne Klasse (z.B. Wiesenhoff) sollen aufgeführt werden. Tipp: (left/right)Join",
                'solution': "SELECT s.name, s.vorname, k.name FROM schueler s LEFT JOIN klasse k ON s.klasse_id = k.id"
            },
            {
                'nr': 67,
                'titel': "Liste aller Schüler mit Unterricht",
                'aufgabe': "Eine Liste ALLER Schüler, in der steht, wieviel Unterricht sie haben. Für die Schüler Zimmermann und Wiesenhoff soll in dieser Übersicht als Stundenzahl '0' erscheinen.",
                'solution': "SELECT s.name, SUM(u.stunden) AS anzahl FROM schueler s JOIN unterricht u ON s.klasse_id = u.klasse_id GROUP BY s.id UNION SELECT s.name, 0 AS anzahl FROM schueler s LEFT JOIN unterricht u ON s.klasse_id = u.klasse_id WHERE u.klasse_id IS NULL"
            },
            {
                'nr': 68,
                'titel': "Schüler ohne Klasse",
                'aufgabe': "Eine Liste der Schüler, die keine Klasse haben.",
                'solution': "SELECT s.name, s.vorname FROM schueler s LEFT JOIN unterricht u ON s.klasse_id = u.klasse_id WHERE u.klasse_id IS NULL"
            },
            {
                'nr': 69,
                'titel': "Schüler aus bestimmter Klasse",
                'aufgabe': "Welche Schüler sind in der Klasse von Anne Ebert?",
                'solution': "SELECT s2.name, s2.vorname FROM schueler s1 JOIN schueler s2 ON s1.klasse_id = s2.klasse_id WHERE s1.name = 'Ebert' AND s1.vorname = 'Anne' AND s2.id != s1.id"
            },
            {
                'nr': 70,
                'titel': "Fachlehrer",
                'aufgabe': "Welche Fachlehrer unterrichten in der Klasse von Lehrer Buttenmüller?",
                'solution': "SELECT l2.name, l2.vorname FROM lehrer l2 JOIN unterricht u ON l2.id = u.lehrer_id JOIN klasse k ON u.klasse_id = k.id JOIN lehrer l1 ON k.klassenlehrer_id = l1.id WHERE l1.name = 'Buttenmüller'"
            },
            {
                'nr': 71,
                'titel': "Klassen mit Fächern",
                'aufgabe': "Eine Liste aller Klassen, in der für jede Klasse vermerkt ist, wie viele Stunden Geschichte und wie viele Stunden Deutsch sie hat. (D.h. 3 Spalten). Hinweis: Es gibt eine innere Abfrage für Deutsch und eine für Geschichte.",
                'solution': "SELECT deutsch.klasse AS klasse, deutsch.stunden AS deutsch, geschichte.stunden AS geschichte FROM ( SELECT k.name AS klasse, SUM(u.stunden) AS stunden FROM klasse k JOIN unterricht u ON k.id = u.klasse_id WHERE u.fach = 'deutsch' GROUP BY k.id) AS deutsch ,  ( SELECT k.name AS klasse, SUM(u.stunden) AS stunden FROM klasse k JOIN unterricht u ON k.id = u.klasse_id WHERE u.fach = 'geschichte' GROUP BY k.id ) AS geschichte  WHERE geschichte.klasse = deutsch.klasse"
            },
            {
                'nr': 72,
                'titel': "Durschnittliche Unterrichtsstunden",
                'aufgabe': "Wieviele Stunden Unterricht haben die Klassen durchschnittlich? Hinweis: Als innere Tabelle hat man eine Liste der Klassen mit ihrer Stundenzahl. In dieser muss man ein UNION verwenden, damit die 8D, die gar keinen Unterricht hat, mitgezählt wird.",
                'solution': "SELECT AVG(klassentabelle.gesamt)FROM  ( SELECT k.name AS name, SUM(u.stunden) AS gesamt FROM klasse k JOIN unterricht u ON k.id = u.klasse_id GROUP BY k.id UNION SELECT k.name AS name, 0 AS gesamt FROM klasse k LEFT JOIN unterricht u ON k.id = u.klasse_id WHERE u.klasse_id IS NULL ) AS klassentabelle"
            },
            {
                'nr': 73,
                'titel': "Unterrichtsfächer und -stunden",
                'aufgabe': "Eine Liste der Unterrichtsfächer, in der für jedes Fach vermerkt ist, wie viele Stunden in der unteren, in der mittleren bzw. in der oberen Etage unterrichtet werden. Hinweis: GROUP BY über zwei Attribute",
                'solution': "SELECT u.fach, r.etage, SUM(u.stunden)  FROM unterricht u JOIN raum r  ON u.raum_id = r.id  GROUP BY u.fach, r.etage  ORDER BY u.fach, r.etage"
            },
            {
                'nr': 74,
                'titel': "Klassen in Raum",
                'aufgabe': "Eine Liste der Klassen, die in Raum R112 Unterricht haben. Hinweis: JOIN über 3 Tabellen",
                'solution': "SELECT k.name FROM klasse k JOIN unterricht u JOIN raum r ON k.id = u.klasse_id AND u.raum_id = r.id WHERE r.nummer = 'R112'"
            },
            {
                'nr': 75,
                'titel': "AGs",
                'aufgabe': "Eine Liste aller AGs mit Teilnehmerzahl. Hinweis: Join über 2 Tabellen und GROUP BY",
                'solution': "SELECT a.name, COUNT(t.schueler_id) AS anzahl FROM ag a JOIN teilnahme t ON a.id = t.ag_id GROUP BY a.id"
            },
            {
                'nr': 76,
                'titel': "Räume mit Deutschunterricht 1",
                'aufgabe': "Eine Liste der Räume, in denen nie Deutsch stattfindet.",
                'solution': "SELECT r.nummer FROM raum r WHERE r.id NOT IN ( SELECT u.raum_id FROM unterricht u WHERE u.fach = 'Deutsch' )"
            },
            {
                'nr': 77,
                'titel': "Fachkollegen",
                'aufgabe': "Eine Liste der Fachkollegen von Josef Zimmermann.",
                'solution': "SELECT DISTINCT l1.name FROM lehrer l1 JOIN unterricht u1 JOIN unterricht u2 JOIN lehrer l2 ON l1.id = u1.lehrer_id AND u1.fach = u2.fach AND u2.lehrer_id = l2.id WHERE l2.name = 'Zimmermann'"
            },
            {
                'nr': 78,
                'titel': "AGs und Schüler 1",
                'aufgabe': "Eine Liste aller Schüler, in der aufgeführt wird, an welchen AGs sie teilnehmen. Wenn ein Schüler an mehreren AGs teilnimmt, dann soll er mehrfach aufgeführt werden. Schüler, die an keiner AG teilnehmen, sollen nicht aufgeführt werden.",
                'solution': "SELECT s.name, a.name FROM schueler s JOIN teilnahme t JOIN ag a ON s.id = t.schueler_id AND t.ag_id = a.id"
            },
            {
                'nr': 79,
                'titel': "AGs und Schüler 2",
                'aufgabe': "Wie die vorhergehende Abfrage, aber: Auch Schüler, die an keiner AG teilnehmen, sollen aufgeführt werden.",
                'solution': "SELECT s.name, a.name FROM schueler s LEFT JOIN (teilnahme t JOIN ag a) ON s.id = t.schueler_id AND t.ag_id = a.id"

            },
            {
                'nr': 80,
                'titel': "Arbeitsstunden der Lehrer",
                'aufgabe': "Es soll eine Liste erstellt werden, aus der hervorgeht, wie viele Stunden jeder Lehrer arbeitet! Dabei zählen die Unterrichtsstunden normal und jede AG, die ein Lehrer leitet, zählt 1 Stunde.",
                'solution': "SELECT ustunden.name AS name, ustunden.anzahl + agstunden.anzahl AS anzahl FROM ( SELECT l.name AS name, SUM(u.stunden) AS anzahl FROM lehrer l, unterricht u WHERE l.id = u.lehrer_id GROUP BY l.name ) AS ustunden,( SELECT l.name AS name, COUNT(*) AS anzahl FROM lehrer l, ag a WHERE l.id = a.lehrer_id GROUP BY l.name ) AS agstunden WHERE ustunden.name = agstunden.name"

            },
            {
                'nr': 81,
                'titel': "Räume mit Deutschunterricht 2",
                'aufgabe': "Eine Liste, in der alle Räume aufgeführt sind. Zu jedem Raum soll in einer Spalte angegeben werden, wie viele Stunden Deutsch dort unterrichtet wird und in einer zweiten Spalte, wie viele Stunden Englisch. Hinweis: 2 innere Abfragen.",
                'solution': "SELECT deutsch.raum, deutsch.stunden, englisch.stunden FROM ( SELECT r.nummer AS raum, SUM(u.stunden) AS stunden FROM raum r JOIN unterricht u ON r.id = u.raum_id WHERE u.fach = 'deutsch' UNION SELECT r.nummer AS raum, 0 AS stunden FROM raum r WHERE r.id NOT IN ( SELECT u.raum_id FROM unterricht u WHERE u.fach = 'deutsch')) AS deutsch , ( SELECT r.nummer AS raum, SUM(u.stunden) AS stunden FROM raum r LEFT JOIN unterricht u ON r.id = u.raum_id WHERE u.fach = 'englisch' UNION SELECT r.nummer AS raum, 0 AS stunden FROM raum r WHERE r.id NOT IN ( SELECT u.raum_id FROM unterricht u WHERE u.fach = 'englisch' ) ) AS englisch where deutsch.raum = englisch.raum"
            }]
    }
};
