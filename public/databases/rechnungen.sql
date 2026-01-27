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

-- Exportiere Struktur von Tabelle rechnungen.artikel
CREATE TABLE IF NOT EXISTS `artikel` (
  `Art_IdKey` int(11) NOT NULL AUTO_INCREMENT,
  `Art_Nummer` varchar(6) NOT NULL,
  `Art_Bezeichnung` varchar(30) DEFAULT NULL,
  `Art_Preis` decimal(9,2) DEFAULT NULL,
  `Art_VkEinheit` varchar(20) DEFAULT NULL,
  `Art_MwstSatz` float DEFAULT NULL,
  PRIMARY KEY (`Art_IdKey`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle rechnungen.artikel: ~7 rows (ungefähr)
INSERT INTO `artikel` (`Art_IdKey`, `Art_Nummer`, `Art_Bezeichnung`, `Art_Preis`, `Art_VkEinheit`, `Art_MwstSatz`) VALUES
	(1, 'BK1221', 'Unterhopf', 14.30, 'Kasten', 19),
	(2, 'BK1229', 'Frühes', 13.80, 'Kasten', 19),
	(3, 'BK1233', 'Pilschen', 15.40, 'Kasten', 19),
	(4, 'BB0088', 'Birnenbrand', 9.60, 'Flasche', 19),
	(5, 'BB0092', 'Apfelbrand', 9.60, 'Flasche', 19),
	(6, 'BB0097', 'Marillenbrand', 10.20, 'Flasche', 19),
	(7, 'BB0121', 'Pfirsischbrand', 9.60, 'Flasche', 19);

-- Exportiere Struktur von Tabelle rechnungen.kunde
CREATE TABLE IF NOT EXISTS `kunde` (
  `Kd_IdKey` int(11) NOT NULL AUTO_INCREMENT,
  `Kd_Firma` varchar(40) DEFAULT NULL,
  `Kd_Strasse` varchar(30) DEFAULT NULL,
  `Kd_PLZ` varchar(5) DEFAULT NULL,
  `Kd_Ort` varchar(20) DEFAULT NULL,
  `Kd_Nummer` varchar(6) NOT NULL,
  PRIMARY KEY (`Kd_IdKey`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle rechnungen.kunde: ~5 rows (ungefähr)
INSERT INTO `kunde` (`Kd_IdKey`, `Kd_Firma`, `Kd_Strasse`, `Kd_PLZ`, `Kd_Ort`, `Kd_Nummer`) VALUES
	(1, 'LikeLimo', 'Musterstr. 12', '50778', 'Köln', '012204'),
	(2, 'Gasthaus \'Die Perle\'', 'Perlenstr. 22', '50778', 'Köln', '012201'),
	(3, 'Traberstübchen', 'Traberweg 1', '50889', 'Köln', '012205'),
	(4, 'Brauhaus Brömle', 'Brauhausstr. 555', '50778', 'Köln', '013000'),
	(5, 'Zur Ente', 'Teichallee 11', '50780', 'Köln', '012211');

-- Exportiere Struktur von Tabelle rechnungen.rechnung
CREATE TABLE IF NOT EXISTS `rechnung` (
  `Rg_IdKey` int(11) NOT NULL AUTO_INCREMENT,
  `Rg_KdIdKey` int(11) NOT NULL,
  `Rg_Nummer` varchar(9) NOT NULL,
  `Rg_Datum` date DEFAULT NULL,
  `Rg_ZahlFristTage` int(11) DEFAULT NULL,
  PRIMARY KEY (`Rg_IdKey`)
) ENGINE=InnoDB AUTO_INCREMENT=2227 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle rechnungen.rechnung: ~4 rows (ungefähr)
INSERT INTO `rechnung` (`Rg_IdKey`, `Rg_KdIdKey`, `Rg_Nummer`, `Rg_Datum`, `Rg_ZahlFristTage`) VALUES
	(2223, 2, 'RG-002249', '2022-09-02', 14),
	(2224, 3, 'RG-002250', '2022-09-02', 14),
	(2225, 3, 'RG-002251', '2022-09-04', 14),
	(2226, 1, 'RG-002252', '2022-09-05', 7);

-- Exportiere Struktur von Tabelle rechnungen.rechnung_position
CREATE TABLE IF NOT EXISTS `rechnung_position` (
  `RgPos_IdKey` int(11) NOT NULL AUTO_INCREMENT,
  `RgPos_RgIdKey` int(11) NOT NULL,
  `RgPos_ArtIdKey` int(11) NOT NULL,
  `RgPos_Menge` int(11) DEFAULT NULL,
  `RgPos_EinzelPreis` decimal(9,2) DEFAULT NULL,
  `RgPos_RabattProzent` float DEFAULT NULL,
  `RgPos_MwStSatz` float DEFAULT NULL,
  PRIMARY KEY (`RgPos_IdKey`)
) ENGINE=InnoDB AUTO_INCREMENT=555456 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle rechnungen.rechnung_position: ~12 rows (ungefähr)
INSERT INTO `rechnung_position` (`RgPos_IdKey`, `RgPos_RgIdKey`, `RgPos_ArtIdKey`, `RgPos_Menge`, `RgPos_EinzelPreis`, `RgPos_RabattProzent`, `RgPos_MwStSatz`) VALUES
	(555434, 2223, 2, 4, 12.80, 0, 19),
	(555435, 2223, 1, 12, 13.30, 0, 19),
	(555436, 2223, 4, 6, 9.60, 5, 19),
	(555437, 2223, 5, 12, 9.60, 5, 19),
	(555438, 2224, 2, 8, 13.80, 0, 19),
	(555439, 2225, 4, 6, 9.60, 0, 19),
	(555450, 2225, 5, 6, 9.60, 0, 19),
	(555451, 2225, 6, 12, 10.10, 0, 19),
	(555452, 2225, 7, 6, 9.60, 0, 19),
	(555453, 2226, 1, 6, 14.30, 0, 19),
	(555454, 2226, 3, 6, 15.40, 0, 19),
	(555455, 2226, 2, 6, 13.80, 0, 19);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
