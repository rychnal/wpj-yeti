-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: yetinder
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `yeti_id` int NOT NULL,
  `user_id` int NOT NULL,
  `score` tinyint unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rating_yeti` (`yeti_id`),
  KEY `fk_rating_user` (`user_id`),
  CONSTRAINT `fk_rating_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rating_yeti` FOREIGN KEY (`yeti_id`) REFERENCES `yeti` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_score` CHECK ((`score` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (1,1,1,3,'2026-04-22 09:07:49'),(2,2,1,5,'2026-04-22 11:18:38'),(3,5,1,1,'2026-04-22 11:54:20'),(4,3,1,2,'2026-04-22 12:27:17'),(5,5,1,5,'2026-04-22 12:27:25'),(6,6,1,2,'2026-04-22 12:27:33'),(7,2,1,2,'2026-04-22 12:27:38'),(8,3,1,3,'2026-04-22 12:27:43'),(9,4,1,4,'2026-04-22 12:27:49'),(10,6,3,5,'2026-04-24 06:09:59'),(11,4,3,4,'2026-04-24 06:10:08'),(12,6,3,2,'2026-04-24 06:10:17'),(13,5,3,3,'2026-04-24 06:10:24'),(14,1,3,3,'2026-04-24 06:10:30'),(15,1,3,3,'2026-04-24 06:10:35'),(16,4,3,3,'2026-04-24 06:10:43'),(17,6,3,3,'2026-04-24 06:21:34'),(18,1,3,4,'2026-04-24 06:32:15'),(19,1,3,4,'2026-04-24 06:32:21'),(20,4,3,3,'2026-04-24 06:35:14'),(21,2,3,2,'2026-04-24 07:33:41'),(22,3,3,2,'2026-04-24 07:33:48'),(23,4,4,4,'2026-04-24 07:56:51'),(24,1,4,1,'2026-04-24 07:56:59'),(25,6,4,4,'2026-04-24 07:57:03'),(26,2,4,5,'2026-04-24 07:57:09'),(27,5,4,5,'2026-04-24 07:57:15'),(28,3,4,2,'2026-04-24 07:57:22'),(29,4,5,1,'2026-04-24 08:11:01'),(30,2,5,1,'2026-04-24 08:11:04'),(31,5,5,5,'2026-04-24 08:11:12'),(32,6,5,5,'2026-04-24 08:11:23'),(33,1,5,5,'2026-04-24 08:11:28'),(34,3,5,1,'2026-04-24 08:12:01'),(35,7,6,4,'2026-04-24 08:27:34'),(36,8,6,5,'2026-04-24 08:27:45'),(37,9,6,3,'2026-04-24 08:27:56'),(38,5,6,4,'2026-04-24 08:28:05'),(39,6,6,5,'2026-04-24 08:28:16'),(40,1,6,2,'2026-04-24 08:28:21'),(41,4,6,1,'2026-04-24 08:28:25'),(42,2,6,1,'2026-04-24 08:28:29'),(43,3,6,1,'2026-04-24 08:28:32'),(44,10,3,4,'2026-04-24 13:03:37'),(45,8,3,5,'2026-04-24 13:03:42'),(46,7,3,4,'2026-04-24 13:03:46'),(47,9,3,4,'2026-04-24 13:03:51');
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@yetinder.cz','2026-04-22 13:24:33'),(3,'test@test.cz','2026-04-24 06:09:13'),(4,'test2@test.cz','2026-04-24 07:56:03'),(5,'test3@test.cz','2026-04-24 08:10:35'),(6,'test4@test.cz','2026-04-24 08:26:53');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yeti`
--

DROP TABLE IF EXISTS `yeti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yeti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `gender` enum('male','female','unknown') NOT NULL DEFAULT 'unknown',
  `height_cm` smallint unsigned NOT NULL,
  `weight_kg` smallint unsigned NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yeti`
--

LOCK TABLES `yeti` WRITE;
/*!40000 ALTER TABLE `yeti` DISABLE KEYS */;
INSERT INTO `yeti` VALUES (1,'Bigfoot','male',230,180,'Beskydy','Velmi agresivni, byl viden pri full moon.',NULL,'2026-04-21 22:08:46'),(2,'Franta Omáčka','male',340,320,'Přední Labská, Krkonoše','trošku blázen',NULL,'2026-04-22 09:30:49'),(3,'EMil','male',320,260,'Lucni bouda, Krkonose','divoch',NULL,'2026-04-22 11:30:12'),(4,'Lopatak','male',280,197,'Orlicke hory','mistni ikona',NULL,'2026-04-22 11:38:55'),(5,'Franta','female',170,98,'Beskydy','zloun','9f2b6d64885796a6.png','2026-04-22 11:52:52'),(6,'Krutak','male',305,220,'Lucni bouda, Krkonose','Hodny yeti, moznost se s nim vyfotit','6aac22e314baa412.png','2026-04-22 12:09:56'),(7,'Jindřiška Krásná','female',270,220,'Vysoké kolo, Krkonoše','hodná','7bee3538f500dcea.png','2026-04-24 08:13:50'),(8,'Radegast','male',380,400,'Beskydy','spatřen s pivem','fdac4432ad09289d.png','2026-04-24 08:15:36'),(9,'Lojza','male',321,271,'Krkonoše, pramen Labe','má rád klid','423da25d312ea4aa.png','2026-04-24 08:19:25'),(10,'Přízrak Šumavy','male',354,240,'Šumava','mluví německy','b0cf8129e3d2d38b.png','2026-04-24 08:50:06'),(11,'Krusnohorak','unknown',260,238,'Snezka','miluje lesy','d39c474fbdde4f14.png','2026-04-27 08:06:07'),(12,'Alpinista','male',310,244,'Alpy',NULL,'95a38ceab19d1ff5.png','2026-04-27 08:07:03'),(13,'Tibetan','male',390,380,'K2','ma rad ticho','de45b8cf88800620.png','2026-04-27 08:08:47'),(14,'Argentinec','female',300,180,'Andy',NULL,'a4c1115b9b126169.png','2026-04-27 08:18:59');
/*!40000 ALTER TABLE `yeti` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27  8:29:10
