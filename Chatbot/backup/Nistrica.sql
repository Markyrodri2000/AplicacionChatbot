-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: nistrica
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `apikeys`
--

DROP TABLE IF EXISTS `apikeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apikeys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `apikey` varchar(100) NOT NULL,
  `usuario_email` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_email` (`usuario_email`),
  CONSTRAINT `apikeys_ibfk_1` FOREIGN KEY (`usuario_email`) REFERENCES `users` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apikeys`
--

LOCK TABLES `apikeys` WRITE;
/*!40000 ALTER TABLE `apikeys` DISABLE KEYS */;
INSERT INTO `apikeys` VALUES (38,'js1IC_YVQP3IbjtG','markus.9.mr@gmail.com','Marc'),(39,'0bdO_+tBCbNaDaf+9QJM4K5','carlita@gmail.com','Carla'),(41,'8TbAFWxDgmV_wSh9OBj7WtR+p1','marc@gmail.com','123');
/*!40000 ALTER TABLE `apikeys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--
DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(6000) NOT NULL,
  `usuario_email` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `modelo` varchar(10) NOT NULL,
  `temperatura` float(4) NOT NULL,
  `prompt` varchar(1000) NOT NULL,
  `idioma` varchar(10) NOT NULL,
  `links` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_email` (`usuario_email`),
  CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`usuario_email`) REFERENCES `users` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('carlita@gmail.com','$2b$10$HtIJrczBwdtLar0wegdLK.SrRsK9WWLXQkkoscz.wy5VQTtmfNvEK','Carla'),('juan@gmail.com','$2b$10$eTev7DRk/kEXHy4IFg5bSeT7Fa9N3cWcpzUs2pbSU3daXCBEI28lm','Juan'),('marc@gmail.com','$2b$10$f0Y/eo1.8fQ.rDv8HFnEp.H4pmewuT2RaqTvm5Bd67Pa6N/92weRK','Marc'),('marcrodriguez231@gmail.com','00280300Mar','Marc'),('markus.9.mr@gmail.com','$2b$10$aSj9lUgnhwkOfYtLzcQvYO0O43fZMMsC7AvuRR/t5Q7JCZghQPonK','Marc');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-23  0:50:30
