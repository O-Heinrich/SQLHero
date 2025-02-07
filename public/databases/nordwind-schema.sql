-- --------------------------------------------------------
-- Host:                         D:\sql-hero\public\databases\nordwind.db
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

-- Exportiere Struktur von Tabelle nordwind.tbl_artikel
CREATE TABLE IF NOT EXISTS "tbl_artikel" (
  "ArtikelNr" int NOT NULL ,
  "Artikelname" varchar(40) DEFAULT NULL,
  "LieferantenNr" int DEFAULT NULL,
  "KategorieNr" int DEFAULT NULL,
  "Liefereinheit" varchar(25) DEFAULT NULL,
  "Einzelpreis" decimal(19,4) DEFAULT NULL,
  "Lagerbestand" smallint DEFAULT NULL,
  "BestellteEinheiten" smallint DEFAULT NULL,
  "Mindestbestand" smallint DEFAULT NULL,
  "Auslaufartikel" tinyint(1) NOT NULL,
  PRIMARY KEY ("ArtikelNr")
  CONSTRAINT "KategorienArtikel" FOREIGN KEY ("KategorieNr") REFERENCES "tbl_kategorien" ("KategorieNr"),
  CONSTRAINT "LieferantenArtikel" FOREIGN KEY ("LieferantenNr") REFERENCES "tbl_lieferanten" ("LieferantenNr")
);

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle nordwind.tbl_bestelldetails
CREATE TABLE IF NOT EXISTS "tbl_bestelldetails" (
  "BestellNr" int NOT NULL,
  "ArtikelNr" int NOT NULL,
  "Einzelpreis" decimal(19,4) DEFAULT NULL,
  "Anzahl" smallint DEFAULT NULL,
  "Rabatt" double(7,2) DEFAULT NULL,
  PRIMARY KEY ("BestellNr","ArtikelNr")
  CONSTRAINT "ArtikelBestelldetails" FOREIGN KEY ("ArtikelNr") REFERENCES "tbl_artikel" ("ArtikelNr") ON DELETE CASCADE,
  CONSTRAINT "BestellungenBestelldetails" FOREIGN KEY ("BestellNr") REFERENCES "tbl_bestellungen" ("BestellNr") ON DELETE CASCADE
);

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle nordwind.tbl_bestellungen
CREATE TABLE IF NOT EXISTS "tbl_bestellungen" (
  "BestellNr" int NOT NULL ,
  "KundenCode" varchar(5) DEFAULT NULL,
  "PersonalNr" int DEFAULT NULL,
  "Bestelldatum" datetime DEFAULT NULL,
  "Lieferdatum" datetime DEFAULT NULL,
  "Versanddatum" datetime DEFAULT NULL,
  "Versandueber" int DEFAULT NULL,
  "Frachtkosten" decimal(19,4) DEFAULT NULL,
  "Empfaenger" varchar(40) DEFAULT NULL,
  "Strasse" varchar(60) DEFAULT NULL,
  "Ort" varchar(15) DEFAULT NULL,
  "Region" varchar(15) DEFAULT NULL,
  "PLZ" varchar(10) DEFAULT NULL,
  "Bestimmungsland" varchar(15) DEFAULT NULL,
  PRIMARY KEY ("BestellNr")
  CONSTRAINT "KundenBestellungen" FOREIGN KEY ("KundenCode") REFERENCES "tbl_kunden" ("KundenCode") ON UPDATE CASCADE,
  CONSTRAINT "PersonalBestellungen" FOREIGN KEY ("PersonalNr") REFERENCES "tbl_personal" ("PersonalNr") ON DELETE CASCADE,
  CONSTRAINT "VersandfirmenBestellungen" FOREIGN KEY ("Versandueber") REFERENCES "tbl_versandfirmen" ("FirmenNr")
);

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle nordwind.tbl_kategorien
CREATE TABLE IF NOT EXISTS "tbl_kategorien" (
  "KategorieNr" int NOT NULL ,
  "Kategoriename" varchar(20) DEFAULT NULL,
  "Beschreibung" longtext,
  "Abbildung" longblob,
  PRIMARY KEY ("KategorieNr")
);

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle nordwind.tbl_kunden
CREATE TABLE IF NOT EXISTS "tbl_kunden" (
  "KundenCode" varchar(5) NOT NULL,
  "Firma" varchar(40) DEFAULT NULL,
  "Kontaktperson" varchar(30) DEFAULT NULL,
  "Position" varchar(30) DEFAULT NULL,
  "Strasse" varchar(60) DEFAULT NULL,
  "Ort" varchar(15) DEFAULT NULL,
  "Region" varchar(15) DEFAULT NULL,
  "PLZ" varchar(10) DEFAULT NULL,
  "Land" varchar(15) DEFAULT NULL,
  "Telefon" varchar(24) DEFAULT NULL,
  "Telefax" varchar(24) DEFAULT NULL,
  PRIMARY KEY ("KundenCode")
);

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle nordwind.tbl_lieferanten
CREATE TABLE IF NOT EXISTS "tbl_lieferanten" (
  "LieferantenNr" int NOT NULL ,
  "Firma" varchar(40) DEFAULT NULL,
  "Kontaktperson" varchar(30) DEFAULT NULL,
  "Position" varchar(30) DEFAULT NULL,
  "Strasse" varchar(60) DEFAULT NULL,
  "Ort" varchar(15) DEFAULT NULL,
  "Region" varchar(15) DEFAULT NULL,
  "PLZ" varchar(10) DEFAULT NULL,
  "Land" varchar(15) DEFAULT NULL,
  "Telefon" varchar(24) DEFAULT NULL,
  "Telefax" varchar(24) DEFAULT NULL,
  "Homepage" longtext,
  PRIMARY KEY ("LieferantenNr")
);

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle nordwind.tbl_personal
CREATE TABLE IF NOT EXISTS "tbl_personal" (
  "PersonalNr" int NOT NULL ,
  "Nachname" varchar(20) DEFAULT NULL,
  "Vorname" varchar(10) DEFAULT NULL,
  "Position" varchar(30) DEFAULT NULL,
  "Anrede" varchar(25) DEFAULT NULL,
  "Geburtsdatum" datetime DEFAULT NULL,
  "Einstellung" datetime DEFAULT NULL,
  "Strasse" varchar(60) DEFAULT NULL,
  "Ort" varchar(15) DEFAULT NULL,
  "Region" varchar(15) DEFAULT NULL,
  "PLZ" varchar(10) DEFAULT NULL,
  "Land" varchar(15) DEFAULT NULL,
  "Telefonprivat" varchar(24) DEFAULT NULL,
  "DurchwahlBuero" varchar(4) DEFAULT NULL,
  "Foto" longblob,
  "Bemerkungen" longtext,
  "Vorgesetzter" int DEFAULT NULL,
  PRIMARY KEY ("PersonalNr")
);

-- Daten-Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle nordwind.tbl_versandfirmen
CREATE TABLE IF NOT EXISTS "tbl_versandfirmen" (
  "FirmenNr" int NOT NULL ,
  "Firma" varchar(40) DEFAULT NULL,
  "Telefon" varchar(24) DEFAULT NULL,
  PRIMARY KEY ("FirmenNr")
);

-- Daten-Export vom Benutzer nicht ausgewählt

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
