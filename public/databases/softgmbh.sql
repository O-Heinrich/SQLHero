CREATE TABLE IF NOT EXISTS bundesland (
    B_ID integer NOT NULL,
    B_Bezeichnung varchar(255) NOT NULL,
    PRIMARY KEY (B_ID)
);

TRUNCATE TABLE bundesland;
INSERT INTO bundesland (B_ID, B_Bezeichnung) VALUES
    (1, 'Baden-Württemberg'),
    (2, 'Bayern'),
    (3, 'Berlin'),
    (4, 'Brandenburg'),
    (5, 'Bremen'),
    (6, 'Hamburg'),
    (7, 'Hessen'),
    (8, 'Mecklenburg-Vorpommern'),
    (9, 'Niedersachsen'),
    (10, 'Nordrhein-Westfalen'),
    (11, 'Rheinland-Pfalz'),
    (12, 'Saarland'),
    (13, 'Sachsen'),
    (14, 'Sachsen-Anhalt'),
    (15, 'Schleswig-Holstein'),
    (16, 'Thüringen');

CREATE TABLE IF NOT EXISTS partei (
    P_ID integer NOT NULL,
    P_Bezeichnung varchar(255) NOT NULL,
    PRIMARY KEY (P_ID)
);

TRUNCATE TABLE partei;
INSERT INTO partei (P_ID, P_Bezeichnung) VALUES
    (1, 'Die Orangen'),
    (2, 'DLD'),
    (3, 'LPD'),
    (4, 'PKM'),
    (5, 'PSM'),
    (6, 'RBP');

CREATE TABLE IF NOT EXISTS schulabschluss (
    S_ID integer NOT NULL,
    S_Bezeichnung varchar(255) NOT NULL,
    PRIMARY KEY (S_ID)
);

TRUNCATE TABLE schulabschluss;
INSERT INTO schulabschluss (S_ID, S_Bezeichnung) VALUES
    (1, 'Hauptschulabschluss'),
    (2, 'Realschulabschluss'),
    (3, 'Fachoberschulreife');

CREATE TABLE IF NOT EXISTS waehler (
    W_ID integer NOT NULL,
    W_Geschlecht varchar(1) NOT NULL,
    W_Alter integer NOT NULL,
    W_S_ID integer NOT NULL,
    W_B_ID integer NOT NULL,
    W_PLZ varchar(5) NOT NULL,
    W_P_ID integer NOT NULL,
    PRIMARY KEY (W_ID),
    FOREIGN KEY (W_S_ID) REFERENCES schulabschluss (S_ID),
    FOREIGN KEY (W_B_ID) REFERENCES bundesland (B_ID),
    FOREIGN KEY (W_P_ID) REFERENCES partei (P_ID)
);

TRUNCATE TABLE waehler;
INSERT INTO waehler (W_ID, W_Geschlecht, W_Alter, W_S_ID, W_B_ID, W_PLZ, W_P_ID) VALUES
    (1, 'w', 38, 1, 3, '10437', 1),
    (2, 'm', 64, 2, 2, '97001', 6),
    (3, 'm', 19, 3, 16, '96501', 5),
    (4, 'm', 23, 1, 13, '2826', 4),
    (5, 'w', 66, 3, 8, '17335', 3),
    (6, 'w', 39, 1, 7, '69235', 2),
    (7, 'm', 51, 2, 4, '19307', 1),
    (8, 'm', 40, 3, 10, '53621', 1),
    (9, 'm', 70, 2, 6, '21039', 5),
    (10, 'm', 29, 2, 12, '66001', 5),
    (11, 'm', 33, 1, 13, '2826', 4),
    (12, 'w', 45, 3, 8, '17335', 3),
    (13, 'w', 56, 1, 7, '69235', 2),
    (14, 'm', 19, 2, 4, '19307', 1),
    (15, 'm', 61, 3, 10, '53621', 2),
    (16, 'm', 34, 2, 6, '21039', 5),
    (17, 'm', 37, 2, 12, '66001', 5),
    (18, 'm', 30, 1, 13, '2826', 4),
    (19, 'w', 65, 3, 8, '17335', 3),
    (20, 'w', 29, 1, 7, '69235', 2),
    (21, 'm', 19, 2, 4, '19307', 1),
    (22, 'm', 68, 3, 10, '53621', 3),
    (23, 'm', 38, 2, 10, '53039', 4),
    (24, 'm', 47, 2, 10, '53039', 5),
    (25, 'm', 25, 2, 10, '53039', 6),
    (26, 'm', 25, 2, 9, '21255', 1),
    (27, 'm', 58, 2, 9, '21256', 2),
    (28, 'w', 24, 2, 9, '21560', 3),
    (29, 'w', 70, 2, 9, '21561', 4),
    (30, 'm', 29, 3, 9, '21588', 5),
    (31, 'm', 55, 1, 9, '21588', 6),
    (32, 'w', 41, 2, 10, '53039', 4),
    (33, 'w', 35, 3, 9, '21588', 4),
    (34, 'm', 35, 3, 9, '21588', 6);