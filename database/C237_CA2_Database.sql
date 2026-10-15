-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: c237-meilan-mysql.mysql.database.azure.com    Database: c237_010_team2_ca2_project
-- ------------------------------------------------------
-- Server version	8.0.44-azure

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
-- Table structure for table `achievements`
--

DROP TABLE IF EXISTS `achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievements` (
  `achievement_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `achievement_type` varchar(100) NOT NULL,
  `earned_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`achievement_id`),
  UNIQUE KEY `uq_user_achievement` (`user_id`,`achievement_type`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `fk_achievements_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievements`
--

LOCK TABLES `achievements` WRITE;
/*!40000 ALTER TABLE `achievements` DISABLE KEYS */;
INSERT INTO `achievements` VALUES (1,1,'first_task_completed','2026-07-21 13:20:50'),(2,1,'early_finisher','2026-07-21 13:20:50'),(9,2,'first_task_completed','2026-07-15 11:04:32'),(20,1,'team_mvp','2026-07-21 15:24:06'),(22,10,'first_task_completed','2026-07-21 15:34:40'),(23,10,'early_finisher','2026-07-21 15:34:40'),(24,10,'no_overdue_tasks','2026-07-21 15:34:40'),(61,8,'first_task_completed','2026-07-22 02:04:27'),(62,8,'early_finisher','2026-07-22 02:04:27'),(63,8,'no_overdue_tasks','2026-07-22 02:04:27'),(79,2,'early_finisher','2026-07-22 14:08:23'),(107,16,'no_overdue_tasks','2026-07-22 16:30:08'),(108,18,'no_overdue_tasks','2026-07-22 16:47:24'),(109,15,'first_task_completed','2026-07-22 16:47:47'),(110,15,'early_finisher','2026-07-22 16:47:47'),(111,15,'no_overdue_tasks','2026-07-22 16:47:47'),(113,19,'first_task_completed','2026-07-22 16:48:08'),(114,19,'early_finisher','2026-07-22 16:48:08'),(115,19,'no_overdue_tasks','2026-07-22 16:48:08'),(116,17,'first_task_completed','2026-07-22 16:48:19'),(117,17,'early_finisher','2026-07-22 16:48:19'),(118,17,'no_overdue_tasks','2026-07-22 16:48:19'),(121,18,'first_task_completed','2026-07-22 16:48:41'),(122,18,'early_finisher','2026-07-22 16:48:41'),(124,16,'first_task_completed','2026-07-22 16:49:03'),(125,16,'early_finisher','2026-07-22 16:49:03'),(139,14,'no_overdue_tasks','2026-07-22 17:02:01'),(140,14,'first_task_completed','2026-07-22 17:02:20'),(141,14,'early_finisher','2026-07-22 17:02:20');
/*!40000 ALTER TABLE `achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `activity_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `description` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`activity_id`),
  KEY `idx_activities_project` (`project_id`),
  KEY `idx_activities_created_at` (`created_at`),
  KEY `fk_activities_user` (`user_id`),
  CONSTRAINT `fk_activities_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_activities_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,1,2,'Joel completed the user profile feature.','2026-07-15 11:04:32'),(2,1,1,'James created the role-permission review task.','2026-07-15 11:04:32'),(3,2,2,'Joel completed the campaign presentation task.','2026-07-15 11:04:32'),(4,2,1,'James updated the awareness poster task.','2026-07-15 11:04:32'),(5,2,2,'Joel Tan updated the task \"Prepare awareness poster\".','2026-07-15 11:08:29'),(6,2,2,'Joel Tan added the task \"Be Gay\".','2026-07-15 11:14:06'),(7,1,1,'James Lim added the task \"Read the bible\".','2026-07-16 09:43:51'),(8,1,1,'James Lim added the task \"Eat 15 chickens\".','2026-07-17 04:27:43'),(9,2,1,'James Lim added a retrospective entry.','2026-07-17 08:58:20'),(10,2,1,'James Lim added a retrospective entry.','2026-07-17 08:58:23'),(11,2,1,'James Lim added a retrospective entry.','2026-07-17 08:58:26'),(12,5,1,'James Lim added the task \"Toilet\".','2026-07-17 08:59:02'),(13,5,1,'James Lim scheduled the meeting \"svd\".','2026-07-17 08:59:19'),(14,5,1,'James Lim deleted the meeting \"svd\".','2026-07-17 08:59:32'),(15,5,1,'James Lim added ww to the project.','2026-07-17 08:59:47'),(16,5,1,'ww was removed from the project.','2026-07-17 08:59:55'),(17,5,1,'James Lim added qq to the project.','2026-07-17 09:00:05'),(18,5,1,'qq became the Project Leader.','2026-07-17 09:00:08'),(19,1,1,'James Lim deleted the meeting \"Weekly Project Meeting\".','2026-07-17 09:00:52'),(22,4,1,'James Lim scheduled the meeting \"Swordfight\".','2026-07-18 14:43:10'),(23,4,1,'James Lim deleted the meeting \"Swordfight\".','2026-07-18 14:43:15'),(24,2,1,'James Lim deleted a retrospective entry.','2026-07-18 14:48:36'),(25,2,1,'James Lim deleted a retrospective entry.','2026-07-18 14:48:40'),(26,2,1,'James Lim deleted a retrospective entry.','2026-07-18 14:48:42'),(27,4,1,'James Lim added the task \"Be Gay\".','2026-07-18 16:42:19'),(28,4,1,'James Lim updated the task \"Be Gay\".','2026-07-18 16:42:33'),(29,4,1,'James Lim updated the task \"Be Gay\".','2026-07-18 16:43:15'),(30,4,1,'James Lim updated the task \"Be Gay\".','2026-07-18 16:54:59'),(31,4,1,'James Lim uploaded \"RJ Wk12\".','2026-07-18 17:07:31'),(32,4,1,'James Lim updated resource \"RJ Wk12\".','2026-07-18 17:07:38'),(33,4,1,'James Lim added the task \"Idk\".','2026-07-18 19:00:34'),(34,4,1,'James Lim added the task \"WD\".','2026-07-18 19:00:46'),(35,4,1,'James Lim updated the task \"WD\".','2026-07-18 19:01:05'),(36,4,1,'James Lim scheduled the meeting \"WEG\".','2026-07-18 19:01:26'),(37,4,1,'James Lim updated the task \"Be Gay\".','2026-07-18 19:32:01'),(40,4,1,'Joel updated the meeting \"W5\".','2026-07-20 03:22:19'),(41,2,1,'Joel updated the task \"Be Gay\".','2026-07-20 03:24:57'),(42,2,1,'Joel updated the task \"Be Gay\".','2026-07-20 03:31:07'),(43,2,1,'Joel updated the task \"Be Gay\".','2026-07-20 03:47:36'),(44,4,1,'Joel updated the task \"WD\".','2026-07-20 03:54:11'),(45,2,1,'Joel updated the task \"Be Gay\".','2026-07-20 03:59:16'),(46,2,1,'Joel updated the task \"Be Gay\".','2026-07-20 04:00:55'),(47,4,1,'Joel updated the task \"WD\".','2026-07-20 04:13:23'),(48,4,1,'Joel added a retrospective entry.','2026-07-20 04:14:35'),(49,4,1,'Joel updated the task \"Idk\".','2026-07-21 11:31:10'),(50,4,1,'Joel scheduled the meeting \"Submit CA2\".','2026-07-21 11:32:12'),(51,4,1,'Joel deleted a retrospective entry.','2026-07-21 11:38:59'),(52,1,1,'Joel added the task \"as\".','2026-07-21 13:02:02'),(53,1,1,'Joel updated the task \"as\".','2026-07-21 13:02:32'),(54,1,1,'Joel uploaded \"test\".','2026-07-21 13:03:14'),(55,4,NULL,'Nigel Elvis updated the task \"WD\".','2026-07-21 13:20:01'),(56,4,NULL,'Nigel Elvis updated the task \"Be Gay\".','2026-07-21 13:20:36'),(57,4,NULL,'Nigel Elvis updated the task \"Idk\".','2026-07-21 13:20:50'),(58,4,NULL,'Nigel Elvis updated the task \"Be Gay\".','2026-07-21 13:26:11'),(61,10,NULL,'Tan added the task \"be gay\".','2026-07-21 13:39:27'),(62,10,NULL,'Tan scheduled the meeting \"wff\".','2026-07-21 13:39:52'),(63,10,NULL,'Tan added a retrospective entry.','2026-07-21 13:40:13'),(64,10,NULL,'Tan added a retrospective entry.','2026-07-21 13:40:17'),(65,10,NULL,'Tan added a retrospective entry.','2026-07-21 13:40:19'),(66,4,NULL,'Nigel Elvis updated the task \"WD\".','2026-07-21 14:00:26'),(67,4,NULL,'Nigel Elvis updated the task \"WD\".','2026-07-21 14:00:54'),(68,2,2,'Joel Tan deleted the meeting \"Campaign Content Review\".','2026-07-21 14:19:35'),(69,2,2,'Joel Tan scheduled the meeting \"wrgwr\".','2026-07-21 14:19:50'),(71,2,2,'Joel Tan updated the meeting \"wrgwr\".','2026-07-21 14:46:24'),(72,2,2,'Joel Tan updated the meeting \"wrgwr\".','2026-07-21 14:46:31'),(73,2,2,'Joel Tan deleted the meeting \"wrgwr\".','2026-07-21 14:46:37'),(74,2,2,'Joel Tan scheduled the meeting \"test\".','2026-07-21 14:46:51'),(75,2,2,'Joel Tan uploaded \"hnefe\".','2026-07-21 14:54:56'),(76,2,2,'Joel Tan updated resource \"hnefe\".','2026-07-21 14:55:03'),(77,2,2,'Joel Tan deleted a resource.','2026-07-21 14:55:06'),(78,2,2,'Joel Tan updated the task \"Be Gay\".','2026-07-21 14:56:20'),(79,2,2,'Joel Tan updated the task \"Prepare awareness poster\".','2026-07-21 14:56:29'),(80,2,2,'Joel Tan added the task \"afae\".','2026-07-21 14:57:23'),(81,2,2,'Joel Tan deleted a retrospective entry.','2026-07-21 15:00:04'),(82,2,2,'Joel Tan added a retrospective entry.','2026-07-21 15:00:09'),(83,4,NULL,'Nigel Elvis added a retrospective entry.','2026-07-21 15:22:35'),(84,4,NULL,'Nigel Elvis updated the task \"WD\".','2026-07-21 15:24:06'),(89,4,NULL,'Nigel Elvis updated the task \"Be Gay\".','2026-07-21 15:38:46'),(95,20,8,'shiqi uploaded \"Week 11\".','2026-07-22 02:01:13'),(96,20,8,'shiqi added the task \"12324\".','2026-07-22 02:04:14'),(97,20,8,'shiqi updated the task \"12324\".','2026-07-22 02:04:27'),(98,20,8,'shiqi added the task \"98765\".','2026-07-22 02:05:13'),(99,20,8,'shiqi updated the task \"98765\".','2026-07-22 02:05:30'),(100,20,8,'shiqi updated the task \"98765\".','2026-07-22 02:05:44'),(105,22,NULL,'Nigel Elvis added the task \"W9\".','2026-07-22 14:07:40'),(106,22,NULL,'Nigel Elvis updated the task \"W9\".','2026-07-22 14:08:23'),(107,22,NULL,'Nigel Elvis added the task \"t\".','2026-07-22 14:08:57'),(108,22,NULL,'Nigel Elvis updated the task \"W9\".','2026-07-22 15:27:09'),(109,25,14,'Mei Lan added the task \"Create App Workspace\".','2026-07-22 16:15:37'),(110,25,14,'Mei Lan added the task \"Design Database Schema\".','2026-07-22 16:16:06'),(111,25,14,'Mei Lan added the task \"User Login System\".','2026-07-22 16:16:33'),(112,25,14,'Mei Lan added the task \"Task Management CRUD\".','2026-07-22 16:17:07'),(113,25,14,'Mei Lan added the task \"Meeting Scheduler\".','2026-07-22 16:17:49'),(114,25,14,'Mei Lan updated the task \"Create App Workspace\".','2026-07-22 16:18:12'),(115,25,14,'Mei Lan updated the task \"Meeting Scheduler\".','2026-07-22 16:18:26'),(116,25,14,'Mei Lan updated the task \"User Login System\".','2026-07-22 16:18:39'),(117,25,14,'Mei Lan updated the task \"Task Management CRUD\".','2026-07-22 16:18:56'),(118,25,14,'Mei Lan updated the task \"Design Database Schema\".','2026-07-22 16:19:06'),(119,25,14,'Mei Lan scheduled the meeting \"C237 Discussion\".','2026-07-22 16:20:16'),(120,25,14,'Mei Lan updated the meeting \"C237 Discussion\".','2026-07-22 16:20:26'),(121,25,18,'Kandavel Mukesh updated the task \"Create App Workspace\".','2026-07-22 16:47:21'),(122,25,18,'Kandavel Mukesh updated the task \"Create App Workspace\".','2026-07-22 16:47:47'),(123,25,18,'Kandavel Mukesh updated the task \"Design Database Schema\".','2026-07-22 16:48:08'),(124,25,18,'Kandavel Mukesh updated the task \"Meeting Scheduler\".','2026-07-22 16:48:19'),(125,25,18,'Kandavel Mukesh updated the task \"Task Management CRUD\".','2026-07-22 16:48:41'),(126,25,18,'Kandavel Mukesh updated the task \"User Login System\".','2026-07-22 16:48:48'),(127,25,18,'Kandavel Mukesh updated the task \"User Login System\".','2026-07-22 16:49:03'),(128,25,14,'Mei Lan updated the task \"Create App Workspace\".','2026-07-22 16:56:19'),(129,25,14,'Mei Lan updated the task \"Design Database Schema\".','2026-07-22 16:56:29'),(130,25,14,'Mei Lan updated the task \"Meeting Scheduler\".','2026-07-22 16:56:34'),(131,25,14,'Mei Lan updated the task \"Task Management CRUD\".','2026-07-22 16:56:40'),(132,25,14,'Mei Lan updated the task \"User Login System\".','2026-07-22 16:56:45'),(133,25,14,'Mei Lan updated the task \"Create App Workspace\".','2026-07-22 16:57:07'),(134,25,15,'Joel Tan updated the task \"Create App Workspace\".','2026-07-22 16:58:48'),(135,25,15,'Joel Tan updated the task \"Create App Workspace\".','2026-07-22 16:58:54'),(136,25,14,'Mei Lan added the task \"Check Team Progress\".','2026-07-22 17:01:58'),(137,25,14,'Mei Lan updated the task \"Check Team Progress\".','2026-07-22 17:02:20'),(138,25,14,'Mei Lan updated the task \"Task Management CRUD\".','2026-07-22 17:02:31'),(139,25,18,'Kandavel Mukesh updated the task \"Task Management CRUD\".','2026-07-22 17:03:28'),(140,25,14,'Mei Lan updated the task \"User Login System\".','2026-07-22 17:06:15'),(141,28,16,'Elvis Tan scheduled the meeting \"<script>alert(1)</script>\".','2026-07-23 12:46:59'),(142,28,16,'Elvis Tan scheduled the meeting \"<script>alert(2)</script>\".','2026-07-23 12:47:37'),(143,28,16,'Elvis Tan added the task \"<script>alert(1)</script>\".','2026-07-23 12:48:10'),(144,28,16,'Elvis Tan added a retrospective entry.','2026-07-23 12:48:39'),(145,28,16,'Elvis Tan added a retrospective entry.','2026-07-23 12:48:42'),(146,28,16,'Elvis Tan added a retrospective entry.','2026-07-23 12:48:44'),(147,20,8,'shiqi scheduled the meeting \"123\".','2026-07-23 14:02:56');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meetings`
--

DROP TABLE IF EXISTS `meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meetings` (
  `meeting_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `meeting_title` varchar(150) NOT NULL,
  `meeting_date` date NOT NULL,
  `meeting_time` time NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `agenda` varchar(1000) DEFAULT NULL,
  `created_by_user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`meeting_id`),
  KEY `idx_meetings_project` (`project_id`),
  KEY `idx_meetings_date` (`meeting_date`),
  KEY `fk_meetings_creator` (`created_by_user_id`),
  CONSTRAINT `fk_meetings_creator` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_meetings_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meetings`
--

LOCK TABLES `meetings` WRITE;
/*!40000 ALTER TABLE `meetings` DISABLE KEYS */;
INSERT INTO `meetings` VALUES (2,1,'CA2 Progress Review','2026-07-18','14:00:00','Microsoft Teams','Check role permissions, dashboard functions and integration readiness.',1,'2026-07-15 11:04:32','2026-07-15 11:04:32'),(6,4,'W5','2026-07-29','09:01:00','FWA','WFE',1,'2026-07-18 19:01:26','2026-07-20 03:22:19'),(7,4,'Submit CA2','2026-07-24','23:59:00','SA3.0','Please',1,'2026-07-21 11:32:12','2026-07-21 11:32:12'),(8,10,'wff','2026-07-22','21:39:00','wefw','wfew',NULL,'2026-07-21 13:39:52','2026-07-21 13:39:52'),(10,2,'test','2026-07-23','22:46:00','ad','aafc',2,'2026-07-21 14:46:51','2026-07-21 14:46:51'),(13,25,'C237 Discussion','2026-07-24','21:00:00','MS Teams','Outline the Scope of the Project',14,'2026-07-22 16:20:16','2026-07-22 16:20:26'),(14,28,'<script>alert(1)</script>','2026-07-23','08:46:00','<script>alert(1)</script>','<script>alert(1)</script>',16,'2026-07-23 12:46:59','2026-07-23 12:46:59'),(15,28,'<script>alert(2)</script>','2026-07-01','08:47:00','<script>alert(1)</script>','<script>alert(1)</script>',16,'2026-07-23 12:47:37','2026-07-23 12:47:37'),(16,20,'123','2026-07-27','14:30:00','school','',8,'2026-07-23 14:02:56','2026-07-23 14:02:56');
/*!40000 ALTER TABLE `meetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_members`
--

DROP TABLE IF EXISTS `project_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_members` (
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` enum('Project Leader','Project Member') NOT NULL DEFAULT 'Project Member',
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`,`user_id`),
  KEY `idx_project_members_user` (`user_id`),
  CONSTRAINT `fk_project_members_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_project_members_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_members`
--

LOCK TABLES `project_members` WRITE;
/*!40000 ALTER TABLE `project_members` DISABLE KEYS */;
INSERT INTO `project_members` VALUES (1,1,'Project Leader','2026-07-15 11:04:32'),(1,2,'Project Member','2026-07-15 11:04:32'),(2,1,'Project Member','2026-07-15 11:04:32'),(2,2,'Project Leader','2026-07-15 11:04:32'),(4,1,'Project Leader','2026-07-17 05:40:40'),(4,8,'Project Member','2026-07-21 11:30:38'),(5,1,'Project Member','2026-07-17 08:53:16'),(13,1,'Project Leader','2026-07-21 13:13:44'),(14,1,'Project Leader','2026-07-21 13:30:36'),(20,8,'Project Leader','2026-07-22 01:59:43'),(22,2,'Project Member','2026-07-22 14:07:08'),(23,10,'Project Leader','2026-07-22 15:42:00'),(25,14,'Project Leader','2026-07-22 15:58:31'),(25,15,'Project Member','2026-07-22 16:11:19'),(25,16,'Project Member','2026-07-22 16:11:22'),(25,17,'Project Member','2026-07-22 16:11:24'),(25,18,'Project Member','2026-07-22 16:11:27'),(25,19,'Project Member','2026-07-22 16:11:30'),(27,14,'Project Leader','2026-07-22 15:59:30'),(28,16,'Project Leader','2026-07-23 12:41:42'),(29,19,'Project Leader','2026-07-23 12:49:46');
/*!40000 ALTER TABLE `project_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(150) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  `created_by_user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  KEY `idx_projects_creator` (`created_by_user_id`),
  CONSTRAINT `fk_projects_creator` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Student Project Management','A system for managing projects, tasks, meetings and retrospectives.',NULL,'Active',1,'2026-07-15 11:04:32','2026-07-21 14:11:04'),(2,'Cybersecurity','A team project that creates cybersecurity awareness resources.','2026-07-28','Active',2,'2026-07-15 11:04:32','2026-07-21 14:44:29'),(3,'Test','12345',NULL,'',1,'2026-07-17 05:16:34','2026-07-17 05:16:34'),(4,'Mukesh gay','Testing case for project leader','2026-07-09','Active',1,'2026-07-17 05:40:40','2026-07-21 14:12:21'),(5,'Swordfigther','Mukesh',NULL,'Active',1,'2026-07-17 08:53:16','2026-07-20 03:49:00'),(10,'Go home','yay','2026-07-18','Active',NULL,'2026-07-18 15:16:41','2026-07-18 15:16:41'),(13,'hi','w','2026-07-24','Active',1,'2026-07-21 13:13:44','2026-07-21 14:11:07'),(14,'ghesfrh','hr','2026-07-23','Archived',1,'2026-07-21 13:30:36','2026-07-21 14:12:16'),(20,'123','123','2026-07-24','Active',8,'2026-07-22 01:59:43','2026-07-22 01:59:43'),(22,'network secu','tg','2026-08-08','Active',NULL,'2026-07-22 14:06:57','2026-07-22 14:06:57'),(23,'test','test','2026-07-24','Active',10,'2026-07-22 15:42:00','2026-07-22 15:45:43'),(24,'For A Test','Created on 22/7/26 @1147pm','2026-07-24','Active',NULL,'2026-07-22 15:47:48','2026-07-22 15:47:48'),(25,'C237 Testing','Hi there!\r\n\r\nLet\'s work hard together this semester','2026-07-24','Active',14,'2026-07-22 15:58:31','2026-07-22 17:09:12'),(27,'Delete testing','1','2026-07-24','Active',14,'2026-07-22 15:59:30','2026-07-23 07:43:55'),(28,'<script>alert(1)</script>','<script>alert(1)</script>','2026-07-23','Active',16,'2026-07-23 12:41:42','2026-07-23 12:41:42'),(29,'<script>','This is an encode test.','2026-07-23','Active',19,'2026-07-23 12:49:46','2026-07-23 13:00:02');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `resources_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `resource_name` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `file_name` varchar(250) NOT NULL,
  `file_type` varchar(20) NOT NULL,
  `uploaded_by_user_id` int NOT NULL,
  `uploaded_at` datetime NOT NULL,
  PRIMARY KEY (`resources_id`),
  KEY `project_id_idx` (`project_id`),
  KEY `uploaded_by_user_id_idx` (`uploaded_by_user_id`),
  CONSTRAINT `project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  CONSTRAINT `uploaded_by_user_id` FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (1,4,'RJ Wk12','sdgs','1784394450968-Lesson_12_RJ.docx','docx',1,'2026-07-18 17:07:31'),(2,1,'test','1','1784638994931-Lesson_12_RJ.docx','docx',1,'2026-07-21 13:03:14'),(4,20,'Week 11','ppt','1784685671817-C335_W11_6P.pptx','pptx',8,'2026-07-22 02:01:13');
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `retrospective_items`
--

DROP TABLE IF EXISTS `retrospective_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `retrospective_items` (
  `retrospective_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `bucket_type` enum('went_well','improvement','thanks') NOT NULL,
  `content` varchar(1000) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`retrospective_id`),
  KEY `idx_retrospective_project` (`project_id`),
  KEY `idx_retrospective_user` (`user_id`),
  CONSTRAINT `fk_retrospective_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_retrospective_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `retrospective_items`
--

LOCK TABLES `retrospective_items` WRITE;
/*!40000 ALTER TABLE `retrospective_items` DISABLE KEYS */;
INSERT INTO `retrospective_items` VALUES (1,1,1,'went_well','The team communicated clearly during the planning meeting.','2026-07-15 11:04:32','2026-07-15 11:04:32'),(2,1,2,'improvement','Tasks should be assigned earlier so everyone has more time.','2026-07-15 11:04:32','2026-07-15 11:04:32'),(3,1,2,'thanks','Thanks to James for organising the project requirements.','2026-07-15 11:04:32','2026-07-15 11:04:32'),(5,2,1,'improvement','The presentation examples can be more relevant to students.','2026-07-15 11:04:32','2026-07-15 11:04:32'),(6,2,1,'thanks','Thanks to Joel for checking the presentation content.','2026-07-15 11:04:32','2026-07-15 11:04:32'),(11,10,NULL,'thanks','vdsd','2026-07-21 13:40:13','2026-07-21 13:40:13'),(12,10,NULL,'improvement','sdvsd','2026-07-21 13:40:17','2026-07-21 13:40:17'),(13,10,NULL,'went_well','svdsd','2026-07-21 13:40:19','2026-07-21 13:40:19'),(14,2,2,'went_well','dfbhd','2026-07-21 15:00:09','2026-07-21 15:00:09'),(15,4,NULL,'went_well','wfwe','2026-07-21 15:22:35','2026-07-21 15:22:35'),(17,28,16,'thanks','<script>alert(1)</script>','2026-07-23 12:48:39','2026-07-23 12:48:39'),(18,28,16,'went_well','<script>alert(1)</script>','2026-07-23 12:48:42','2026-07-23 12:48:42'),(19,28,16,'improvement','<script>alert(1)</script>','2026-07-23 12:48:44','2026-07-23 12:48:44');
/*!40000 ALTER TABLE `retrospective_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_comments`
--

DROP TABLE IF EXISTS `task_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment` varchar(1000) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `idx_task_comments_task` (`task_id`),
  KEY `idx_task_comments_user` (`user_id`),
  CONSTRAINT `fk_task_comments_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_task_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_comments`
--

LOCK TABLES `task_comments` WRITE;
/*!40000 ALTER TABLE `task_comments` DISABLE KEYS */;
INSERT INTO `task_comments` VALUES (1,12,1,'Ur Gay','2026-07-18 16:55:11'),(3,6,2,'hi','2026-07-21 14:48:53'),(4,8,2,'hi','2026-07-21 14:49:33'),(7,30,18,'nice','2026-07-22 16:46:24');
/*!40000 ALTER TABLE `task_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `task_name` varchar(150) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `assigned_user_id` int DEFAULT NULL,
  `created_by_user_id` int DEFAULT NULL,
  `priority` enum('Low','Medium','High') NOT NULL DEFAULT 'Medium',
  `status` enum('Not Started','In Progress','Completed') NOT NULL DEFAULT 'Not Started',
  `due_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`),
  KEY `idx_tasks_project` (`project_id`),
  KEY `idx_tasks_assigned_user` (`assigned_user_id`),
  KEY `idx_tasks_due_date` (`due_date`),
  KEY `fk_tasks_creator` (`created_by_user_id`),
  CONSTRAINT `fk_tasks_assigned_user` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_tasks_creator` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,1,'Complete user profile feature','Create profile, edit profile and profile-picture upload features.',2,1,'High','Completed','2026-07-18','2026-07-15 11:04:32','2026-07-15 11:04:32'),(2,1,'Complete retrospective board','Create the three retrospective buckets and CRUD operations.',2,1,'High','In Progress','2026-07-24','2026-07-15 11:04:32','2026-07-15 11:04:32'),(3,1,'Review role permissions','Test the Project Leader and Project Member permissions.',1,1,'Medium','Not Started','2026-07-28','2026-07-15 11:04:32','2026-07-15 11:04:32'),(4,2,'Prepare awareness poster','Design a poster about phishing awareness.',1,2,'High','Completed','2026-07-25','2026-07-15 11:04:32','2026-07-21 14:56:29'),(5,2,'Write campaign presentation','Prepare the presentation script and supporting examples.',2,2,'High','Completed','2026-07-20','2026-07-15 11:04:32','2026-07-15 11:04:32'),(6,2,'Be Gay','Gay',2,2,'Medium','Completed','2026-07-16','2026-07-15 11:14:06','2026-07-20 03:24:57'),(7,1,'Read the bible','HI',2,1,'High','In Progress','2026-07-16','2026-07-16 09:43:51','2026-07-16 09:43:51'),(8,1,'Eat 15 chickens','I ated 15 chickens',1,1,'High','In Progress','2026-07-16','2026-07-17 04:27:43','2026-07-17 04:27:43'),(9,5,'Toilet','hi',1,1,'High','In Progress','2026-07-16','2026-07-17 08:59:02','2026-07-17 08:59:02'),(12,4,'Be Gay','Be Gay',1,1,'High','Completed','2026-07-24','2026-07-18 16:42:19','2026-07-21 13:26:11'),(13,4,'Idk','DWD',1,1,'Medium','Completed','2026-07-24','2026-07-18 19:00:34','2026-07-21 13:20:50'),(14,4,'WD','WWD',1,1,'Medium','Completed','2026-07-08','2026-07-18 19:00:46','2026-07-21 14:00:54'),(16,1,'as','avd',NULL,1,'Low','In Progress','2026-07-17','2026-07-21 13:02:02','2026-07-21 13:02:32'),(17,10,'be gay','afae',NULL,NULL,'High','In Progress','2026-07-24','2026-07-21 13:39:27','2026-07-21 13:39:27'),(19,2,'afae','awfew',1,2,'High','Completed','2026-07-22','2026-07-21 14:57:23','2026-07-21 14:57:23'),(23,20,'12324','12345t',8,8,'Medium','Completed','2026-07-24','2026-07-22 02:04:14','2026-07-22 02:04:27'),(24,20,'98765','09876',8,8,'Medium','Completed','2026-07-29','2026-07-22 02:05:13','2026-07-22 02:05:44'),(26,22,'W9','tbttttttttttttttttttt',2,NULL,'Medium','Completed','2026-07-21','2026-07-22 14:07:40','2026-07-22 14:08:23'),(27,22,'t','t',NULL,NULL,'High','Completed','2026-07-30','2026-07-22 14:08:57','2026-07-22 14:08:57'),(28,25,'Create App Workspace','Set up project repository, folder structure, Express app, and EJS views.',15,14,'High','Completed','2026-07-24','2026-07-22 16:15:37','2026-07-22 16:58:54'),(29,25,'Design Database Schema','Create users, projects, tasks, project_members, retrospectives, and meetings tables.',19,14,'High','In Progress','2026-07-24','2026-07-22 16:16:06','2026-07-22 16:56:28'),(30,25,'User Login System','Develop login page with session authentication and logout functionality.',16,14,'Low','Completed','2026-07-24','2026-07-22 16:16:33','2026-07-22 17:06:15'),(31,25,'Task Management CRUD','Create, edit, update, and delete project tasks.',18,14,'Medium','In Progress','2026-07-24','2026-07-22 16:17:07','2026-07-22 17:03:28'),(32,25,'Meeting Scheduler','Allow project leaders to schedule project meetings.',17,14,'Medium','In Progress','2026-07-24','2026-07-22 16:17:49','2026-07-22 16:56:34'),(33,25,'Check Team Progress','Very Good',14,14,'High','Completed','2026-07-27','2026-07-22 17:01:58','2026-07-22 17:02:20'),(34,28,'<script>alert(1)</script>','<script>alert(1)</script>',16,16,'Medium','Not Started','2026-01-23','2026-07-23 12:48:10','2026-07-23 12:48:10');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contact_number` varchar(9) DEFAULT NULL,
  `diploma` varchar(150) DEFAULT NULL,
  `year_semester` varchar(50) DEFAULT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT '/images/profile-pictures/default-profile.svg',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `failed_attempts` int NOT NULL DEFAULT '0',
  `locked_until` datetime DEFAULT NULL,
  `lockout_level` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'James','254aa248acb47dd654ca3ea53f48c2c26d641d23d7e2e93a1ec56258df7674c4','James','jt@example.com','90001111','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','Project leader who enjoys planning and coordinating tasks.','/images/profile-pictures/profile-1784406762554-730138232.jpg','2026-07-15 11:04:32','2026-07-22 15:21:43',0,'2026-07-23 15:21:43',3),(2,'Joel','9c56cc51b374c3ba189210d5b6d4bf57790d351c96c47c02190ecf1e430635ab','Joel Tan','joel@example.com','90002222','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','Cybersecurity student working on application development.','/images/profile-pictures/profile-1784363596679-631802622.png','2026-07-15 11:04:32','2026-07-22 16:58:12',0,'2026-07-23 16:58:12',3),(8,'shiqi','10e8933f8a77d0b5d4a4dedfbd95beac03303f26c48dbb9edfbfc94a771893a6','shiqi','25004124@myrp.edu.sg','12345678','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','','/images/profile-pictures/profile-1784685510635-908843730.jpg','2026-07-19 17:06:05','2026-07-22 01:58:32',0,NULL,0),(9,'Mei','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','Lan','3@gmail.com','12345678','Diploma in Enterprise Cloud Computing & Management (R12)','Year 1 Semester 2','Hi','/images/profile-pictures/profile-1784520306063-319774948.jpg','2026-07-20 04:05:06','2026-07-21 14:06:47',0,NULL,0),(10,'test','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','C237','testing@gmail.com','12345678','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','test','/images/profile-pictures/profile-1784646968646-791840664.png','2026-07-21 15:16:08','2026-07-22 15:41:30',0,NULL,0),(14,'C237_Lecturer','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','Mei Lan','c237test@gmail.com','6510 3000','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','Hi, this account is strictly for testing/presentation purposes','/images/profile-pictures/profile-1784735838637-877313443.jpg','2026-07-22 15:57:19','2026-07-22 16:08:02',0,NULL,0),(15,'C237_Student1','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','Joel Tan','joel@gmail.com','6510 3000','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','Hi, I am Joel','/images/profile-pictures/profile-1784736063168-228313006.jpg','2026-07-22 16:01:03','2026-07-22 16:13:14',0,NULL,0),(16,'C237_Student2','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','Elvis Tan','elvis@gmail.com','6510 3000','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','Hi, I am Elvis','/images/profile-pictures/profile-1784736130711-750083459.jpg','2026-07-22 16:02:11','2026-07-22 16:13:14',0,NULL,0),(17,'C237_Student3','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','Shi Qi','shiqi@gmail.com','6510 3000','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','Hi, I am Shi Qi','/images/profile-pictures/profile-1784736173518-73730935.jpg','2026-07-22 16:02:54','2026-07-22 16:13:14',0,NULL,0),(18,'C237_Student4','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','Kandavel Mukesh','mukesh@gmail.com','6510 3000','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','Hi, I am Mukesh','/images/profile-pictures/profile-1784736223404-993045351.jpg','2026-07-22 16:03:43','2026-07-22 17:03:04',0,NULL,0),(19,'C237_Student5','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','Nigel Koh','nigel@gmail.com','6510 3000','Diploma in Cybersecurity & Digital Forensics (R55)','Year 2 Semester 1','Hi, I am Nigel','/images/profile-pictures/profile-1784736271542-747954169.jpg','2026-07-22 16:04:32','2026-07-22 16:13:14',0,NULL,0);
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

-- Dump completed on 2026-07-24 10:08:10
