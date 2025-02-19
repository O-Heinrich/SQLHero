-- --------------------------------------------------------
-- Host:                         D:\sql-hero\public\databases\schule.db
-- Server-Version:               3.48.0
-- Server-Betriebssystem:        
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Exportiere Struktur von Tabelle schule.ag
DROP TABLE IF EXISTS "ag";
CREATE TABLE IF NOT EXISTS ag (
  id integer NOT NULL
,  name varchar(40) NOT NULL
,  lehrer_id integer NOT NULL
, FOREIGN KEY (lehrer_id) REFERENCES lehrer (id)
);

-- Exportiere Daten aus Tabelle schule.ag: -1 rows
DELETE FROM "ag";
/*!40000 ALTER TABLE "ag" DISABLE KEYS */;
INSERT INTO "ag" ("id", "name", "lehrer_id") VALUES
	(3, 'Theater', 2),
	(4, 'Orchester', 1),
	(5, 'Homepage', 3),
	(6, 'Bigband', 1),
	(7, 'Holzwerken', 3),
	(8, 'Fotografie', 3);
/*!40000 ALTER TABLE "ag" ENABLE KEYS */;

-- Exportiere Struktur von Tabelle schule.klasse
DROP TABLE IF EXISTS "klasse";
CREATE TABLE IF NOT EXISTS klasse (
  id integer NOT NULL
,  name varchar(10) NOT NULL
,  klassenlehrer_id integer NOT NULL
, FOREIGN KEY (klassenlehrer_id) REFERENCES lehrer (id)
);

-- Exportiere Daten aus Tabelle schule.klasse: 4 rows
DELETE FROM "klasse";
/*!40000 ALTER TABLE "klasse" DISABLE KEYS */;
INSERT INTO "klasse" ("id", "name", "klassenlehrer_id") VALUES
	(1, '8A', 2),
	(2, '8B', 4),
	(3, '8C', 1),
	(4, '8D', 0);
/*!40000 ALTER TABLE "klasse" ENABLE KEYS */;

-- Exportiere Struktur von Tabelle schule.lehrer
DROP TABLE IF EXISTS "lehrer";
CREATE TABLE IF NOT EXISTS lehrer (
  id integer NOT NULL
,  name varchar(20) NOT NULL
,  vorname varchar(20) NOT NULL
);

-- Exportiere Daten aus Tabelle schule.lehrer: -1 rows
DELETE FROM "lehrer";
/*!40000 ALTER TABLE "lehrer" DISABLE KEYS */;
INSERT INTO "lehrer" ("id", "name", "vorname") VALUES
	(1, 'Buttenmüller', 'Georg'),
	(2, 'Zimmermann', 'Josef'),
	(3, 'Amann', 'Brigitte'),
	(4, 'Huber', 'Erika'),
	(5, 'Rees', 'Günter');
/*!40000 ALTER TABLE "lehrer" ENABLE KEYS */;

-- Exportiere Struktur von Tabelle schule.raum
DROP TABLE IF EXISTS "raum";
CREATE TABLE IF NOT EXISTS raum (
  id integer NOT NULL
,  nummer varchar(10) NOT NULL
,  plaetze integer NOT NULL
,  etage varchar(10) NOT NULL
);

-- Exportiere Daten aus Tabelle schule.raum: -1 rows
DELETE FROM "raum";
/*!40000 ALTER TABLE "raum" DISABLE KEYS */;
INSERT INTO "raum" ("id", "nummer", "plaetze", "etage") VALUES
	(1, 'R110', 12, 'unten'),
	(2, 'R112', 14, 'unten'),
	(3, 'R203', 30, 'Mitte'),
	(4, 'R205', 16, 'Mitte'),
	(5, 'R306', 18, 'oben'),
	(6, 'Sporthalle', 100, 'unten'),
	(7, 'R208', 32, 'oben'),
	(8, 'R101', 32, 'unten');
/*!40000 ALTER TABLE "raum" ENABLE KEYS */;

-- Exportiere Struktur von Tabelle schule.schueler
DROP TABLE IF EXISTS "schueler";
CREATE TABLE IF NOT EXISTS schueler (
  id integer NOT NULL
,  name varchar(20) NOT NULL
,  vorname varchar(20) NOT NULL
,  klasse_id integer NOT NULL
, FOREIGN KEY (klasse_id) REFERENCES klasse (id)
);

-- Exportiere Daten aus Tabelle schule.schueler: -1 rows
DELETE FROM "schueler";
/*!40000 ALTER TABLE "schueler" DISABLE KEYS */;
INSERT INTO "schueler" ("id", "name", "vorname", "klasse_id") VALUES
	(1, 'Meier', 'Johannes', 2),
	(2, 'Schwarzmüller', 'Maria', 3),
	(3, 'Schmidt', 'Michael', 1),
	(4, 'Ebert', 'Anne', 2),
	(8, 'Zimmermann', 'Anne', 0),
	(9, 'Wiesenhoff', 'Christian', 0);
/*!40000 ALTER TABLE "schueler" ENABLE KEYS */;

-- Exportiere Struktur von Tabelle schule.teilnahme
DROP TABLE IF EXISTS "teilnahme";
CREATE TABLE IF NOT EXISTS teilnahme (
  schueler_id integer NOT NULL
,  ag_id integer NOT NULL
,  PRIMARY KEY (schueler_id, ag_id)
, FOREIGN KEY (schueler_id) REFERENCES schueler (id)
, FOREIGN KEY (ag_id) REFERENCES ag (id)
);

-- Exportiere Daten aus Tabelle schule.teilnahme: -1 rows
DELETE FROM "teilnahme";
/*!40000 ALTER TABLE "teilnahme" DISABLE KEYS */;
INSERT INTO "teilnahme" ("schueler_id", "ag_id") VALUES
	(1, 7),
	(1, 8),
	(2, 4),
	(2, 6),
	(3, 3),
	(3, 4),
	(3, 7),
	(4, 5),
	(4, 8);
/*!40000 ALTER TABLE "teilnahme" ENABLE KEYS */;

-- Exportiere Struktur von Tabelle schule.unterricht
DROP TABLE IF EXISTS "unterricht";
CREATE TABLE IF NOT EXISTS unterricht (
  id integer NOT NULL
,  klasse_id integer NOT NULL
,  lehrer_id integer NOT NULL
,  raum_id integer NOT NULL
,  fach varchar(20) NOT NULL
,  stunden integer NOT NULL
, FOREIGN KEY (klasse_id) REFERENCES klasse (id)
, FOREIGN KEY (lehrer_id) REFERENCES lehrer (id)
, FOREIGN KEY (raum_id) REFERENCES raum (id)
);

-- Exportiere Daten aus Tabelle schule.unterricht: -1 rows
DELETE FROM "unterricht";
/*!40000 ALTER TABLE "unterricht" DISABLE KEYS */;
INSERT INTO "unterricht" ("id", "klasse_id", "lehrer_id", "raum_id", "fach", "stunden") VALUES
	(1, 1, 2, 2, 'Deutsch', 4),
	(2, 1, 3, 4, 'Mathe', 4),
	(3, 1, 4, 6, 'Sport', 3),
	(4, 2, 2, 4, 'Deutsch', 4),
	(5, 2, 4, 1, 'Sport', 3),
	(6, 3, 4, 3, 'Deutsch', 4),
	(7, 3, 1, 2, 'Englisch', 4),
	(8, 3, 2, 5, 'Geschichte', 2),
	(9, 3, 4, 6, 'Sport', 3);
/*!40000 ALTER TABLE "unterricht" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
