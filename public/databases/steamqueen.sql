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

-- Exportiere Struktur von Tabelle steamqueen.eigenschaft
CREATE TABLE IF NOT EXISTS `eigenschaft` (
  `EigenschaftID` int(11) NOT NULL AUTO_INCREMENT,
  `Bezeichnung` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`EigenschaftID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle steamqueen.eigenschaft: ~3 rows (ungefähr)
INSERT INTO `eigenschaft` (`EigenschaftID`, `Bezeichnung`) VALUES
	(1, 'Produzent'),
	(2, 'Regisseur'),
	(3, 'Schauspieler');

-- Exportiere Struktur von Tabelle steamqueen.film
CREATE TABLE IF NOT EXISTS `film` (
  `FilmID` int(11) NOT NULL AUTO_INCREMENT,
  `Titel` varchar(100) DEFAULT NULL,
  `Erscheinungsjahr` int(11) DEFAULT NULL,
  `SpieldauerMinuten` int(11) DEFAULT NULL,
  `Preis` float DEFAULT NULL,
  PRIMARY KEY (`FilmID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle steamqueen.film: ~5 rows (ungefähr)
INSERT INTO `film` (`FilmID`, `Titel`, `Erscheinungsjahr`, `SpieldauerMinuten`, `Preis`) VALUES
	(1, 'Matrix', 1999, NULL, NULL),
	(2, 'High Noon', 1952, NULL, NULL),
	(3, 'Das Fenster zum Hof', 1954, NULL, NULL),
	(4, 'Über den Dächern von Nizza', 1955, NULL, NULL),
	(5, 'Mohn ist auch eine Blume', 1966, NULL, NULL);

-- Exportiere Struktur von Tabelle steamqueen.person
CREATE TABLE IF NOT EXISTS `person` (
  `PersonID` int(11) NOT NULL AUTO_INCREMENT,
  `PersonName` varchar(20) DEFAULT NULL,
  `Vorname` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`PersonID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle steamqueen.person: ~4 rows (ungefähr)
INSERT INTO `person` (`PersonID`, `PersonName`, `Vorname`) VALUES
	(1, 'Kelly', 'Grace'),
	(2, 'Reeves', 'Keanu'),
	(3, 'Wachowski', 'Lana'),
	(4, 'Silver', 'Joel');

-- Exportiere Struktur von Tabelle steamqueen.person_film_eigenschaft
CREATE TABLE IF NOT EXISTS `person_film_eigenschaft` (
  `LaufendeNr` int(11) NOT NULL AUTO_INCREMENT,
  `PersonID` int(11) NOT NULL,
  `FilmID` int(11) NOT NULL,
  `EigenschaftID` int(11) DEFAULT NULL,
  PRIMARY KEY (`LaufendeNr`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle steamqueen.person_film_eigenschaft: ~7 rows (ungefähr)
INSERT INTO `person_film_eigenschaft` (`LaufendeNr`, `PersonID`, `FilmID`, `EigenschaftID`) VALUES
	(1, 1, 2, 3),
	(2, 2, 1, 3),
	(3, 1, 3, 3),
	(4, 1, 4, 3),
	(5, 1, 5, 3),
	(6, 3, 1, 2),
	(7, 4, 1, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
