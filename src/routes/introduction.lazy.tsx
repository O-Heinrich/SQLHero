import { InlineCode } from '@/components/InlineCode';
import { Wrapper } from '@/components/Wrapper';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/introduction')({
  component: introduction,
});

function introduction() {
  return (
    <Wrapper>
        <title>SQL Hero - Einführung</title>
        <h2>Einführung</h2>
        <p>
            Dieses Tutorial bietet dir einen Einstieg in SQL. Es vermittelt allgemeine SQL-Kenntnisse wie <InlineCode>SELECT</InlineCode>, <InlineCode>WHERE</InlineCode>-Clauses, <InlineCode>Group By</InlineCode> und einiges mehr.</p>
        <p>
            SQL besteht zum einen aus der Data Definition Language <em>(DDL)</em> zur Datendefinition, z.B.: <InlineCode>CREATE TABLE</InlineCode>, der Data Manipulation Language <em>(DML)</em> zur Datenmanipulation, z.B. <InlineCode>SELECT</InlineCode>, <InlineCode>UPDATE</InlineCode>, <InlineCode>INSERT INTO</InlineCode>, der Data Control Language <em>(DCL)</em> zur Zugriffssteuerung, z.B. <InlineCode>GRANT</InlineCode>, <InlineCode>REVOKE</InlineCode>, der Transaction Control Language <em>(TCL)</em> zur Transaktionssteuerung, z.B. <InlineCode>COMMIT</InlineCode>, <InlineCode>ROLLBACK</InlineCode>. Wir setzen uns hier hauptsächlich mit der DML auseinander.
        </p>
        <p>
            SQL Hero besteht aus kleinen, überschaubaren Aufgaben. Die Übungen bewegen sich auf unterschiedlichem Niveau. Hier soll das Gelernte angewendet und vertieft werden.
        </p>
        <p>
            Das Ergebnis Ihrer Lösung wird mit dem Ergebnis einer Musterlösung verglichen. Erst wenn dieser Vergleich erfolgreich ist, wird ein "Erfolg" vermeldet. Unterhalb des Test-Buttons erscheint dann das Ergebnis dieses Vergleichs.
        </p>
        <p>
            Bei einem nicht bestandenen Vergleich liegt entweder ein fachlicher oder ein technischer Fehler vor. Bei einem fachlichen Fehler stimmt das tatsächliche Ergebnis nicht mit dem erwarteten Ergebnis überein.
        </p>
        <p>
            Bei technischen Fehlern kann das SQL nicht ausgeführt werden. Das SQL kann entweder nicht eingelesen werden oder sie bricht während ihrer Ausführung ab. Bei technischen Fehlern liefert der SQL-Ausführer, das die SQL-Anweisung ausführt, eine entsprechende Fehlermeldung. Existiert z.B. eine Tabelle nicht, weil man sich vertippt hat, so wird folgender Fehler geworfen: <code>"Error: no such table: tbl_kunde"</code>. Diese Fehlermeldungen sind in Englisch, da sie direkt von dem SQL-Ausführer stammen.
        </p>
        <p>
            SQL Hero funktioniert mit den gängigsten Browsern (Firefox, Chrome, Edge). Gestestet wurde es mit Firefox und Chromium.
        </p>

    </Wrapper>
  )
}
