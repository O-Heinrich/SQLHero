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

-- Exportiere Struktur von Tabelle krankenhaus.bett
CREATE TABLE IF NOT EXISTS `bett` (
  `Bett_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Bett_Nummer` varchar(8) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Bett_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle krankenhaus.bett: ~5 rows (ungefähr)
INSERT INTO `bett` (`Bett_ID`, `Bett_Nummer`) VALUES
	(1, '00347783'),
	(2, '00448637'),
	(3, '00358999'),
	(4, '07785688'),
	(5, '55800987');

-- Exportiere Struktur von Tabelle krankenhaus.patient
CREATE TABLE IF NOT EXISTS `patient` (
  `Pat_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Pat_Name` varchar(20) DEFAULT NULL,
  `Pat_Vorname` varchar(20) DEFAULT NULL,
  `Pat_GebDatum` date DEFAULT NULL,
  PRIMARY KEY (`Pat_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle krankenhaus.patient: ~5 rows (ungefähr)
INSERT INTO `patient` (`Pat_ID`, `Pat_Name`, `Pat_Vorname`, `Pat_GebDatum`) VALUES
	(1, 'Müller', 'Peter', '1966-02-06'),
	(2, 'Trostan', 'Jannick', '1966-02-06'),
	(3, 'Sardon', 'Sandra', '1966-02-06'),
	(4, 'Grenzfeld', 'Thorsten', '1966-02-06'),
	(5, 'Neuhaus', 'Anne', '1966-02-06');

-- Exportiere Struktur von Tabelle krankenhaus.patient_aufenthalt
CREATE TABLE IF NOT EXISTS `patient_aufenthalt` (
  `PatAuf_ID` int(11) NOT NULL AUTO_INCREMENT,
  `PatAuf_PatID` int(11) NOT NULL,
  `PatAuf_ZID` int(11) NOT NULL,
  `PatAuf_AufnahmeDatum` date DEFAULT NULL,
  `PatAuf_EntlassDatum` date DEFAULT NULL,
  PRIMARY KEY (`PatAuf_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle krankenhaus.patient_aufenthalt: ~6 rows (ungefähr)
INSERT INTO `patient_aufenthalt` (`PatAuf_ID`, `PatAuf_PatID`, `PatAuf_ZID`, `PatAuf_AufnahmeDatum`, `PatAuf_EntlassDatum`) VALUES
	(1, 2, 2, '2020-02-07', '2020-02-24'),
	(2, 1, 2, '2020-02-01', '2020-02-26'),
	(3, 3, 2, '2020-02-26', '2020-02-28'),
	(4, 2, 3, '2020-04-11', '2020-04-30'),
	(5, 4, 3, '2020-05-01', '2020-05-08'),
	(6, 2, 1, '2020-05-02', '2020-05-18');

-- Exportiere Struktur von Tabelle krankenhaus.station
CREATE TABLE IF NOT EXISTS `station` (
  `Stat_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Stat_Station` varchar(42) DEFAULT NULL,
  PRIMARY KEY (`Stat_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle krankenhaus.station: ~3 rows (ungefähr)
INSERT INTO `station` (`Stat_ID`, `Stat_Station`) VALUES
	(1, 'Innere'),
	(2, 'Kardiologie'),
	(3, 'Onkologie');

-- Exportiere Struktur von Tabelle krankenhaus.zimmer
CREATE TABLE IF NOT EXISTS `zimmer` (
  `Z_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Z_BettID` int(11) NOT NULL,
  `Z_StatID` int(11) NOT NULL,
  `Z_ZimmerNummer` int(11) DEFAULT NULL,
  PRIMARY KEY (`Z_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle krankenhaus.zimmer: ~3 rows (ungefähr)
INSERT INTO `zimmer` (`Z_ID`, `Z_BettID`, `Z_StatID`, `Z_ZimmerNummer`) VALUES
	(1, 2, 1, 212),
	(2, 3, 1, 212),
	(3, 4, 1, 214);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
