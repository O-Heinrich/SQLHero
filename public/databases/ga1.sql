CREATE TABLE IF NOT EXISTS abteilung (
    Abteilungs_ID integer PRIMARY KEY, 
    Bezeichnung varchar(50) NOT NULL,
    Leistungs_ID integer NOT NULL DEFAULT 0
);

TRUNCATE TABLE abteilung;
INSERT INTO abteilung (Abteilungs_ID, Bezeichnung, Leistungs_ID) VALUES
    (3, 'EDV', 2),
    (5, 'Controlling', 5),
    (7, 'Vertrieb', 9);

CREATE TABLE IF NOT EXISTS gehaltsgruppen (
    Gruppen_ID integer PRIMARY KEY, 
    Gehalt numeric(10,2) NOT NULL DEFAULT 0.00
);

TRUNCATE TABLE gehaltsgruppen;
INSERT INTO gehaltsgruppen (Gruppen_ID, Gehalt) VALUES
    (1, 22000.00),
    (2, 14000.00),
    (4, 8500.00),
    (5, 5500.00),
    (6, 4250.00),
    (7, 3450.00);

CREATE TABLE IF NOT EXISTS mitarbeiter (
    Mitarbeiter_ID integer PRIMARY KEY,
    Name varchar(50) NOT NULL,
    Tätigkeit varchar(50) NOT NULL,
    Gehaltgruppe integer NOT NULL,
    Abteilungs_ID integer DEFAULT NULL,
    Vorgesetzten_ID integer DEFAULT NULL
);

TRUNCATE TABLE mitarbeiter;
INSERT INTO mitarbeiter (Mitarbeiter_ID, Name, Tätigkeit, Gehaltgruppe, Abteilungs_ID, Vorgesetzten_ID) VALUES
    (1, 'Hansen', 'Gesamtleitung', 1, 0, 0),
    (2, 'Knudsen', 'Abteilungsleitung', 3, 3, 1),
    (3, 'Laufer', 'Entwicklerin', 6, 3, 2),
    (4, 'Kaiser', 'Consultant', 4, 3, 2),
    (5, 'Paulsen', 'Abteilungsleitung', 4, 5, 1),
    (6, 'König', 'Sachbearbeiterin', 7, 5, 5);