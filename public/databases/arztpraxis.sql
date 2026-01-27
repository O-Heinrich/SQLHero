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

-- Exportiere Struktur von Tabelle arztpraxis.arzt
CREATE TABLE IF NOT EXISTS `arzt` (
  `A_Id` int(11) NOT NULL AUTO_INCREMENT,
  `A_Nachname` varchar(20) DEFAULT NULL,
  `A_Vorname` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`A_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle arztpraxis.arzt: ~3 rows (ungefähr)
INSERT INTO `arzt` (`A_Id`, `A_Nachname`, `A_Vorname`) VALUES
	(1, 'Freudenstedt', 'Dr. med. Rudolf'),
	(2, 'Nierens', 'Dr. med. Kirsten'),
	(3, 'Leier', 'Dr. med. Patrick');

-- Exportiere Struktur von Tabelle arztpraxis.krankenkasse
CREATE TABLE IF NOT EXISTS `krankenkasse` (
  `KK_Id` int(11) NOT NULL AUTO_INCREMENT,
  `KK_Name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`KK_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle arztpraxis.krankenkasse: ~4 rows (ungefähr)
INSERT INTO `krankenkasse` (`KK_Id`, `KK_Name`) VALUES
	(1, 'TK'),
	(2, 'AOK'),
	(3, 'BKK'),
	(4, 'Knappschaft');

-- Exportiere Struktur von Tabelle arztpraxis.patient
CREATE TABLE IF NOT EXISTS `patient` (
  `Pat_Id` int(11) NOT NULL AUTO_INCREMENT,
  `Pat_Nachname` varchar(20) DEFAULT NULL,
  `Pat_Vorname` varchar(20) DEFAULT NULL,
  `Pat_GebDat` date DEFAULT NULL,
  `Pat_Strasse` varchar(30) DEFAULT NULL,
  `Pat_PLZ` varchar(5) DEFAULT NULL,
  `Pat_Ort` varchar(30) DEFAULT NULL,
  `Pat_KKId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Pat_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle arztpraxis.patient: ~8 rows (ungefähr)
INSERT INTO `patient` (`Pat_Id`, `Pat_Nachname`, `Pat_Vorname`, `Pat_GebDat`, `Pat_Strasse`, `Pat_PLZ`, `Pat_Ort`, `Pat_KKId`) VALUES
	(1, 'Müller', 'Manni', '1966-04-15', 'Forstweg 12', '44456', 'Musterhausen', 1),
	(2, 'Peters', 'Peter', '1988-03-12', NULL, NULL, NULL, 1),
	(3, 'Fransi', 'Melanie', '1999-01-13', NULL, NULL, NULL, 2),
	(4, 'Kastor', 'Heinz', '1952-12-14', NULL, NULL, NULL, 1),
	(5, 'Krenz', 'Christina', '1977-02-14', NULL, NULL, NULL, 2),
	(6, 'Kreisla', 'Johann', '1999-01-13', NULL, NULL, NULL, 3),
	(7, 'Freie', 'Ilse', '1955-05-02', NULL, NULL, NULL, 2),
	(8, 'König', 'Ihnes', '2002-03-01', NULL, NULL, NULL, 1);

-- Exportiere Struktur von Tabelle arztpraxis.termin
CREATE TABLE IF NOT EXISTS `termin` (
  `T_Id` int(11) NOT NULL AUTO_INCREMENT,
  `T_Termin` datetime DEFAULT NULL,
  `T_PatId` int(11) NOT NULL,
  `T_AId` int(11) DEFAULT NULL,
  `T_Wahrgenommen` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`T_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle arztpraxis.termin: ~7 rows (ungefähr)
INSERT INTO `termin` (`T_Id`, `T_Termin`, `T_PatId`, `T_AId`, `T_Wahrgenommen`) VALUES
	(1, '2022-06-01 12:10:00', 1, 1, 1),
	(2, '2022-06-01 12:20:00', 2, 1, 0),
	(3, '2022-06-01 12:10:00', 3, 2, 1),
	(4, '2022-06-01 12:40:00', 4, 1, 1),
	(5, '2022-06-01 12:50:00', 6, 1, 1),
	(6, '2022-06-01 13:10:00', 8, 1, 1),
	(7, '2022-06-01 12:20:00', 7, 1, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
