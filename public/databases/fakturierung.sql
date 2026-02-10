-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server-Version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server-Betriebssystem:        Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Exportiere Struktur von Tabelle fakturierung.artikel
CREATE TABLE IF NOT EXISTS `artikel` (
  `Art_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Art_Nr` varchar(5) DEFAULT NULL,
  `Art_Bezeichnung` varchar(40) DEFAULT NULL,
  `Art_Preis` decimal(9,2) DEFAULT NULL,
  `Art_ArtTypID` int(11) NOT NULL,
  `Art_WeinTypID` int(11) NOT NULL,
  `Art_GeschmackTypID` int(11) NOT NULL,
  PRIMARY KEY (`Art_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle fakturierung.artikel: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle fakturierung.artikel_typ
CREATE TABLE IF NOT EXISTS `artikel_typ` (
  `ArtTyp_ID` int(11) NOT NULL AUTO_INCREMENT,
  `ArtTyp_Bezeichnung` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ArtTyp_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle fakturierung.artikel_typ: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle fakturierung.geschmack_typ
CREATE TABLE IF NOT EXISTS `geschmack_typ` (
  `Geschmack_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Geschmack_Name` varchar(20) DEFAULT NULL,
  `Geschmack_Bezeichnung` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Geschmack_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle fakturierung.geschmack_typ: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle fakturierung.kunde
CREATE TABLE IF NOT EXISTS `kunde` (
  `Kd_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Kd_Firma` varchar(40) DEFAULT NULL,
  `Kd_PLZ` varchar(5) DEFAULT NULL,
  `Kd_Ort` varchar(30) DEFAULT NULL,
  `Kd_Strasse` varchar(30) DEFAULT NULL,
  `Kd_HausNr` int(11) DEFAULT NULL,
  PRIMARY KEY (`Kd_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle fakturierung.kunde: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle fakturierung.rechnung
CREATE TABLE IF NOT EXISTS `rechnung` (
  `Rg_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Rg_KdID` int(11) NOT NULL,
  `Rg_RgNr` int(11) NOT NULL,
  `Rg_RgDatum` date DEFAULT NULL,
  PRIMARY KEY (`Rg_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle fakturierung.rechnung: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle fakturierung.rechnung_position
CREATE TABLE IF NOT EXISTS `rechnung_position` (
  `RgPos_ID` int(11) NOT NULL AUTO_INCREMENT,
  `RgPos_RgID` int(11) NOT NULL,
  `RgPos_PosNr` int(11) DEFAULT NULL,
  `RgPos_ArtID` int(11) NOT NULL,
  `RgPos_Menge` int(11) DEFAULT NULL,
  `RgPos_Preis` decimal(9,2) DEFAULT NULL,
  PRIMARY KEY (`RgPos_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle fakturierung.rechnung_position: ~0 rows (ungefähr)

-- Exportiere Struktur von Tabelle fakturierung.wein_typ
CREATE TABLE IF NOT EXISTS `wein_typ` (
  `WeinTyp_ID` int(11) NOT NULL AUTO_INCREMENT,
  `WeinTyp_Bezeichnung` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`WeinTyp_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle fakturierung.wein_typ: ~0 rows (ungefähr)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
