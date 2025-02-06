-- --------------------------------------------------------
-- Host:                         D:\sql-hero\public\databases\ga1.db
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


-- Exportiere Datenbank-Struktur für ga1
DROP DATABASE IF EXISTS "ga1";
CREATE DATABASE IF NOT EXISTS "ga1";
;

-- Exportiere Struktur von Tabelle ga1.abteilung
DROP TABLE IF EXISTS "abteilung";
CREATE TABLE IF NOT EXISTS "abteilung" ("Abteilungs_ID" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "Bezeichnung" varchar(50) NOT NULL DEFAULT ' ', "Leistungs_ID" integer NOT NULL DEFAULT 0);

-- Exportiere Daten aus Tabelle ga1.abteilung: 3 rows
DELETE FROM "abteilung";
/*!40000 ALTER TABLE "abteilung" DISABLE KEYS */;
INSERT INTO "abteilung" ("Abteilungs_ID", "Bezeichnung", "Leistungs_ID") VALUES
	(3, 'EDV', 2),
	(5, 'Controlling', 5),
	(7, 'Vertrieb', 9);
/*!40000 ALTER TABLE "abteilung" ENABLE KEYS */;

-- Exportiere Struktur von Tabelle ga1.gehaltsgruppen
DROP TABLE IF EXISTS "gehaltsgruppen";
CREATE TABLE IF NOT EXISTS "gehaltsgruppen" ("Gruppen_ID" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "Gehalt" double(10,2) NOT NULL DEFAULT 0.00);

-- Exportiere Daten aus Tabelle ga1.gehaltsgruppen: 6 rows
DELETE FROM "gehaltsgruppen";
/*!40000 ALTER TABLE "gehaltsgruppen" DISABLE KEYS */;
INSERT INTO "gehaltsgruppen" ("Gruppen_ID", "Gehalt") VALUES
	(1, 22000.0),
	(2, 14000.0),
	(4, 8500.0),
	(5, 5500.0),
	(6, 4250.0),
	(7, 3450.0);
/*!40000 ALTER TABLE "gehaltsgruppen" ENABLE KEYS */;

-- Exportiere Struktur von Tabelle ga1.mitarbeiter
DROP TABLE IF EXISTS "mitarbeiter";
CREATE TABLE IF NOT EXISTS `mitarbeiter` (
  `Mitarbeiter_ID` integer NOT NULL PRIMARY KEY AUTOINCREMENT
,  `Name` varchar(50) NOT NULL DEFAULT ' '
,  `Tätigkeit` varchar(50) NOT NULL DEFAULT ' '
,  `Gehaltgruppe` integer NOT NULL
,  `Abteilungs_ID` integer DEFAULT NULL
,  `Vorgesetzten_ID` integer DEFAULT NULL
);

-- Exportiere Daten aus Tabelle ga1.mitarbeiter: -1 rows
DELETE FROM "mitarbeiter";
/*!40000 ALTER TABLE "mitarbeiter" DISABLE KEYS */;
INSERT INTO "mitarbeiter" ("Mitarbeiter_ID", "Name", "Tätigkeit", "Gehaltgruppe", "Abteilungs_ID", "Vorgesetzten_ID") VALUES
	(1, 'Hansen', 'Gesamtleitung', 1, 0, 0),
	(2, 'Knudsen', 'Abteilungsleitung', 3, 3, 1),
	(3, 'Laufer', 'Entwicklerin', 6, 3, 2),
	(4, 'Kaiser', 'Consultant', 4, 3, 2),
	(5, 'Paulsen', 'Abteilungsleitung', 4, 5, 1),
	(6, 'König', 'Sachbearbeiterin', 7, 5, 5);
/*!40000 ALTER TABLE "mitarbeiter" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
