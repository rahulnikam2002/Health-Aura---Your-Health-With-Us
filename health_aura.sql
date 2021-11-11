-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 11, 2021 at 05:52 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `health_aura`
--

-- --------------------------------------------------------

--
-- Table structure for table `healthaura_hospitals`
--

CREATE TABLE `healthaura_hospitals` (
  `id` int(11) NOT NULL,
  `hospitalName` varchar(500) NOT NULL,
  `phoneNumber` varchar(100) NOT NULL,
  `hospitalLocation` varchar(500) NOT NULL,
  `City` varchar(150) NOT NULL,
  `hospitalType` varchar(150) NOT NULL,
  `hospitalIframe` varchar(2000) NOT NULL,
  `hospitalMeta` text NOT NULL,
  `treatments` varchar(3000) NOT NULL,
  `hospitalAbout` varchar(1000) NOT NULL,
  `hospitalImgs` varchar(1500) NOT NULL,
  `featuredImg` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `healthaura_hospitals`
--

INSERT INTO `healthaura_hospitals` (`id`, `hospitalName`, `phoneNumber`, `hospitalLocation`, `City`, `hospitalType`, `hospitalIframe`, `hospitalMeta`, `treatments`, `hospitalAbout`, `hospitalImgs`, `featuredImg`) VALUES
(2, 'Nikam Hospital', '8767213959', 'Samartha Nagar, Khed-Shivtar Road, Khed', 'Khed', 'Private', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.538364319699!2d73.38612501488164!3d17.766377787852527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be9df0179886a03%3A0x42b236968d373369!2sGaavShahar!5e0!3m2!1sen!2sin!4v1636481475414!5m2!1sen!2sin', 'Aditya Birla Hospital is situated in Pimpri Chinchwad and on the best hospital with best staff in Pune', 'Surgery,Cardiology,Dentist,Heart,Cancer,Endocrinology,Epilepsy Treatment,Pain Management,Psychiatric', 'Aditya Birla Memorial Hospital is a homage and tribute to late Shri Aditya Vikram Birla. He had envisioned a world-class hospital in India. His vision has taken shape in the form of a medicity sprawled over 16 acres of land. This medicity is a super specialty healthcare facility to cater to the needs of all sections of society. The hospital’s mission: Compassionate Quality Healthcare.', 'Aditya Birla Hospital.jpg,aditya-memorial-main.jpg,', 'aditya-memorial-main.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `healthaura_users`
--

CREATE TABLE `healthaura_users` (
  `id` int(11) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `userEmail` varchar(300) NOT NULL,
  `userPassword` varchar(500) NOT NULL,
  `userCity` varchar(100) NOT NULL,
  `userImg` varchar(500) NOT NULL,
  `role` varchar(100) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `healthaura_users`
--

INSERT INTO `healthaura_users` (`id`, `userName`, `userEmail`, `userPassword`, `userCity`, `userImg`, `role`) VALUES
(1, 'Rahul Nikam', 'rahul@gmail.com', '$2b$10$TEafMu0G5Go7NOxdlbIxEeEKWtXzsgwT.IlkD3byz/bbsub.Q3ci2', '', '', 'user'),
(2, 'saurav', 's@gmail.com', '$2b$10$.BJPsJ294DZquepQBaigAuSev8UCthPUmWwR.oYRO/tFHFpDHITfC', 'Pune', '', 'user'),
(3, 'saurav@gmail.com', 'f@gmail.com', '$2b$10$Ozxwy.7Y7ne5UXwXPSN16efzYurumcbESXnxZ3iioReLtJ20EfagK', '', '', 'user'),
(4, 'Rasika', 'rasika@gmail.com', '$2b$10$MJuXxUuoC2rDehbJiUpMoekjGdXDmw5D3iByDNWucoyODFwPKUaWS', '', '', 'user'),
(5, 'harry', 'harrychoudhary605@gmail.com', '$2b$10$mLV9w/Uytz1lnrD.gVmPJeiMijGIhVWHv1WnMpVsmZ6U98TJnZNlu', '', '', 'user'),
(6, 'Rasika Nikam', 'rasikanikam88@gmail.com', '$2b$10$xijMdNC8yDe09nf4amLCpeJMY13VJsiqgV60E/AsR7gD4FTfYEzS.', '', '', 'user'),
(7, 'Kundan Vijay Jadhav', 'en20133485@git-india.edu.in', '$2b$10$q99NFcfw8lBKpmOE1MndjeaqR3WoEMUHCjkDubgqTfHk3.J6Q80NC', '', '', 'user'),
(8, 'Rahul Nikam', 'codewithrahulnikam@gmail.com', '$2b$10$NANOZDmt9gTz9jrvakvLqeREx9PAwU1ncYdu3ehGta.etxn.WW/t.', 'Khed', 'Rahul Nikam 1.jpg', 'admin'),
(9, 'test acc', 'test@t.com', '$2b$10$.WeJyizl9VLEHbOmdA.ztuNLBgXO3npkX6YRGGjkwg5kxL5/uzdQi', '', '', 'user'),
(10, 'Saurav Rajesh Nikam', 'saurav@gmail.com', '$2b$10$mnnqcOH2sfWrlhWtly5JeuUs6h8hHau7vYpV2xYXqVWGNctbkN6/K', '', '', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `healthaura_hospitals`
--
ALTER TABLE `healthaura_hospitals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `healthaura_users`
--
ALTER TABLE `healthaura_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userEmail` (`userEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `healthaura_hospitals`
--
ALTER TABLE `healthaura_hospitals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `healthaura_users`
--
ALTER TABLE `healthaura_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
