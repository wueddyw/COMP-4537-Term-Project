-- MySQL dump 10.13  Distrib 5.6.50, for Linux (x86_64)
--
-- Host: localhost    Database: heroku_8efe97cb5d411b8
-- ------------------------------------------------------
-- Server version	5.6.50-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('admin','$2b$10$ELDmMPTbPzCuGqdrb4scC.5yTg8M1BBr.wRikNIBHX.mR.f9ABtoq');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `CommentID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `Comment` varchar(255) NOT NULL,
  PRIMARY KEY (`CommentID`),
  KEY `username` (`username`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (24,'wueddyw','lol');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `endpointcounter`
--

DROP TABLE IF EXISTS `endpointcounter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `endpointcounter` (
  `method` varchar(10) DEFAULT NULL,
  `endpoint` varchar(50) DEFAULT NULL,
  `requests` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `endpointcounter`
--

LOCK TABLES `endpointcounter` WRITE;
/*!40000 ALTER TABLE `endpointcounter` DISABLE KEYS */;
INSERT INTO `endpointcounter` VALUES ('POST','/API/V1/register',3),('POST','/API/V1/login',24),('POST','/API/V1/createcomment',6),('POST','/API/V1/createquack',2),('GET','/API/V1/validsession',0),('GET','/API/V1/loadquack',0),('GET','/API/V1/loadcomment',0),('GET','/API/V1/validsession',0),('DELETE','/API/V1/deletecomment',5),('DELETE','/API/V1/deletequack',1),('PUT','/API/V1/editcomment',12),('PUT','/API/V1/editquack',2);
/*!40000 ALTER TABLE `endpointcounter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quack`
--

DROP TABLE IF EXISTS `quack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quack` (
  `QuackID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `Content` varchar(255) NOT NULL,
  PRIMARY KEY (`QuackID`),
  KEY `username` (`username`),
  CONSTRAINT `quack_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quack`
--

LOCK TABLES `quack` WRITE;
/*!40000 ALTER TABLE `quack` DISABLE KEYS */;
INSERT INTO `quack` VALUES (14,'wueddyw','Ron Jeremy');
/*!40000 ALTER TABLE `quack` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quackcomment`
--

DROP TABLE IF EXISTS `quackcomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quackcomment` (
  `QCID` int(11) NOT NULL AUTO_INCREMENT,
  `QuackID` int(11) NOT NULL,
  `CommentID` int(11) NOT NULL,
  PRIMARY KEY (`QCID`),
  KEY `QuackID` (`QuackID`),
  KEY `CommentID` (`CommentID`),
  CONSTRAINT `quackcomment_ibfk_1` FOREIGN KEY (`QuackID`) REFERENCES `quack` (`QuackID`),
  CONSTRAINT `quackcomment_ibfk_2` FOREIGN KEY (`CommentID`) REFERENCES `comment` (`CommentID`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quackcomment`
--

LOCK TABLES `quackcomment` WRITE;
/*!40000 ALTER TABLE `quackcomment` DISABLE KEYS */;
INSERT INTO `quackcomment` VALUES (24,14,24);
/*!40000 ALTER TABLE `quackcomment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokens` (
  `token` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ind1ZWRkeXciLCJpYXQiOjE2MTgyODA1NDJ9.YDTBYM6G83P6plrSORXKvDXA-cM2miDQTz18RcQvCSo'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ind1ZWRkeXciLCJpYXQiOjE2MTgyODA1NjB9.mF4MmLd0Kfxx99L0W8ZiHNub0Zb3B5foN4EnJS4s0Bc'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ind1ZWRkeXciLCJpYXQiOjE2MTgyODEyMDd9.SYVxXJGTa-POBDuFX-NXwKdrG5WE7MTb276dlxWbqbM'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODEzNzR9.Ty9IbCnRwdP6AJ24FGxb9W7xyznLf7eq0R6oxz-a6p4'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ind1ZWRkeXciLCJpYXQiOjE2MTgyODEzODJ9.u9AAcNZB0zKgWR7i54A9s36Txrb3glDwz1Nkc89Mrzo'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODE4MjZ9.gMhJ8Fu7mmTaAMsMt4XGvyU_QPeCFV46G6j6AAPFuaI'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNvZnRqb2huIiwiaWF0IjoxNjE4MjgyMTY1fQ.7_No8cb4q14iet65czEHT-XIftwJ93bu1_lXimEk4VE'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ind1ZWRkeXciLCJpYXQiOjE2MTgyODIzOTN9.kKbRTQ39kwqD6nqrJyfc-R2jeOO5Aa6GU-I3RSDcbd8'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODI3NzN9.NXW05MXXhy38Be2Vt0_sL4borJuQ73YWzjhOiwX9Vo4'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODI5Nzh9.rZxaJl6K0jsq6i-C95X6AejjXEHtyJWU6B_Qwh7xBE8'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODQwNzZ9.7GXn3r42wzkqBDlB1q-bvDh__Tx9_pq25HSKtvyxAd8'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODQzMzd9.TkPiup5o78lJrZwm42m5FHAKJeCUgAQlRWuYB32xZUc'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODYzNzR9.QPJHkeY9eQa7LL8Q1fRa9Oll8ppIt5oVrnBPayOIgdQ'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODg0MjN9.hTz18KflPallGgUB-rstOQsXCUuQzKZBqPJMmPTa6zw'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ind1ZWRkeXciLCJpYXQiOjE2MTgyODkxNjZ9.cYH97VzRbAyTBhsq5sbdrM9_j-_IAj95zp3skYP8ULI'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODkyMTl9.xMdmU3i6AoVWLZucNyrG_ukOzYDIIGgcUpYZptNcNVM'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Impkb2UiLCJpYXQiOjE2MTgyODk2ODh9.MBp77PNb6sPHtUYr5y6ZUzqaMzIWxAVxYFF4TZXaJ2Y'),('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ind1ZWRkeXciLCJpYXQiOjE2MTgyODk3MTh9.s_VGg7qGEftg8K3Nt89vfVqfApOzyoB7vsO3h6mV7Z4');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `username` varchar(20) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('bob','bob','bob','bob@gmail.com','123'),('jdoe','John','Doe','jdoe@gmail.com','$2b$10$mMwpnbGRivkfyVGhAe5T5O5GYbAjl0wnSErOLK3sUzbiyfNwzZoQC'),('softjohn','Soft','John','softjohnn','$2b$10$1QLQiuMqIMt2OGaNfuormOMeVafwIhDMc/9RWy.hiYMTv3224QXPW'),('wueddyw','Eddy','Wu','wueddyw@gmail.com','$2b$10$yNfAm0hFKN3N7Vv5/u7TZergXa2znEvGMGECi3DPRUHznhCKWdtAG');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'heroku_8efe97cb5d411b8'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-13  4:56:36
