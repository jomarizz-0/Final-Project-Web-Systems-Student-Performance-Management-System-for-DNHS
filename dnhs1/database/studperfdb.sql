-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2026 at 07:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `studperfdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `personnel`
--

CREATE TABLE `personnel` (
  `personnel_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `birth_date` date NOT NULL,
  `gender` char(1) NOT NULL,
  `civil_status` varchar(20) NOT NULL,
  `position_type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personnel`
--

INSERT INTO `personnel` (`personnel_id`, `first_name`, `middle_name`, `last_name`, `birth_date`, `gender`, `civil_status`, `position_type`) VALUES
(1001, 'Jomari', 'M.', 'Singh', '1990-05-15', 'M', 'Single', 'Teacher'),
(1002, 'Maria', 'S.', 'Santos', '1985-11-20', 'F', 'Married', 'Adviser'),
(1003, 'Ricardo', 'L.', 'Dalisay', '1988-02-10', 'M', 'Single', 'Registrar'),
(1004, 'Lourdes', 'B.', 'Berces', '1975-11-20', 'F', 'Married', 'Head Teacher'),
(1005, 'Felipe', 'M.', 'Belen', '1978-02-14', 'M', 'Married', 'Head Teacher'),
(1006, 'Corazon', 'S.', 'Bañares', '1982-08-30', 'F', 'Single', 'Guidance Counselor'),
(1007, 'Gregorio', 'L.', 'Baldoza', '1980-04-12', 'M', 'Married', 'Librarian'),
(1008, 'Elena', 'R.', 'Ariola', '1985-06-25', 'F', 'Married', 'Teacher'),
(1009, 'Ronaldo', 'D.', 'Borja', '1988-12-05', 'M', 'Single', 'Teacher'),
(1010, 'Melba', 'G.', 'Bardon', '1990-01-15', 'F', 'Single', 'Teacher'),
(1011, 'Efren', 'T.', 'Belleza', '1986-09-22', 'M', 'Married', 'Teacher'),
(1012, 'Zenaida', 'P.', 'Rabino', '1983-03-10', 'F', 'Married', 'Teacher'),
(1013, 'Victor', 'H.', 'Resurreccion', '1992-07-18', 'M', 'Single', 'Teacher'),
(1014, 'Rosario', 'K.', 'Romano', '1987-11-04', 'F', 'Married', 'Teacher'),
(1015, 'Manuel', 'F.', 'Biazon', '1989-05-30', 'M', 'Single', 'Teacher'),
(1016, 'Teresita', 'V.', 'Balce', '1984-10-12', 'F', 'Married', 'Teacher'),
(1017, 'Jaime', 'C.', 'Barrios', '1991-02-28', 'M', 'Single', 'Teacher'),
(1018, 'Liza', 'N.', 'Buenafe', '1982-12-14', 'F', 'Married', 'Teacher'),
(1019, 'Arturo', 'W.', 'Briones', '1980-01-05', 'M', 'Married', 'Teacher'),
(1020, 'Imelda', 'Q.', 'gre', '1993-04-20', 'F', 'Single', 'Teacher'),
(1021, 'Danilo', 'E.', 'Espinas', '1988-08-15', 'M', 'Married', 'Teacher'),
(1022, 'Nenita', 'J.', 'Floranza', '1985-03-03', 'F', 'Married', 'Teacher'),
(1023, 'Oscar', 'U.', 'Garcia', '1990-11-27', 'M', 'Single', 'Teacher'),
(1024, 'Perla', 'Y.', 'Hernandez', '1987-06-14', 'F', 'Married', 'Teacher'),
(1025, 'Reynaldo', 'I.', 'Ibañez', '1991-09-09', 'M', 'Single', 'Teacher'),
(1026, 'Gloria', 'O.', 'Jimenez', '1986-12-25', 'F', 'Married', 'Teacher'),
(1027, 'Benigno', 'L.', 'Luces', '1984-02-11', 'M', 'Married', 'Teacher'),
(1028, 'Carmela', 'M.', 'Millena', '1992-10-30', 'F', 'Single', 'Teacher'),
(1029, 'Edgar', 'A.', 'Nimo', '1989-01-08', 'M', 'Married', 'Teacher'),
(1030, 'Vilma', 'H.', 'Orea', '1983-05-19', 'F', 'Married', 'Teacher'),
(1031, 'Amado', 'G.', 'Paguia', '1980-08-11', 'M', 'Married', 'Teacher'),
(1032, 'Doris', 'S.', 'Quintana', '1994-03-27', 'F', 'Single', 'Teacher'),
(1033, 'Nestor', 'R.', 'Sayson', '1987-11-04', 'M', 'Married', 'Teacher'),
(1034, 'Ofelia', 'T.', 'Tuazon', '1985-06-15', 'F', 'Married', 'Teacher'),
(1035, 'Wilfredo', 'P.', 'Vallarez', '1990-02-21', 'M', 'Single', 'Teacher'),
(1036, 'Ester', 'C.', 'Almayda', '1982-09-09', 'F', 'Married', 'Teacher'),
(1037, 'Rodolfo', 'K.', 'Basabe', '1981-04-17', 'M', 'Married', 'Teacher'),
(1038, 'Pilar', 'F.', 'Cardano', '1993-10-02', 'F', 'Single', 'Teacher'),
(1039, 'Humberto', 'V.', 'Dioneda', '1988-07-24', 'M', 'Married', 'Teacher'),
(1040, 'Lucia', 'N.', 'Estipona', '1986-12-30', 'F', 'Married', 'Teacher'),
(1041, 'Basilio', 'W.', 'Frondoza', '1984-05-13', 'M', 'Single', 'Teacher'),
(1042, 'Anita', 'Q.', 'Goyena', '1992-01-22', 'F', 'Single', 'Teacher'),
(1043, 'Cesar', 'E.', 'Honrado', '1989-08-04', 'M', 'Married', 'Teacher'),
(1044, 'Milagros', 'U.', 'Icaro', '1983-04-19', 'F', 'Married', 'Teacher'),
(1045, 'Leopoldo', 'J.', 'Jalmanzar', '1980-03-29', 'M', 'Married', 'Teacher'),
(1046, 'Felicidad', 'Y.', 'Lanuza', '1994-11-11', 'F', 'Single', 'Teacher'),
(1047, 'Mariano', 'I.', 'Manansala', '1987-06-18', 'M', 'Married', 'Teacher'),
(1048, 'Paz', 'O.', 'Navarro', '1985-02-05', 'F', 'Married', 'Teacher'),
(1049, 'Redios', 'L.', 'Quinto', '1990-10-12', 'F', 'Single', 'Teacher'),
(1050, 'Simeon', 'M.', 'Tiongson', '1982-07-31', 'M', 'Married', 'Teacher'),
(1051, 'Aurora', 'A.', 'Ubaldo', '1981-01-25', 'F', 'Married', 'Teacher'),
(1052, 'Vriano', 'H.', 'Valdez', '1993-05-08', 'M', 'Single', 'Teacher'),
(1053, 'Concepcion', 'G.', 'Wong', '1988-08-16', 'F', 'Married', 'Teacher'),
(1054, 'Renato', 'L.', 'Belen', '1982-11-05', 'M', 'Married', 'Security Guard'),
(1055, 'Efren', 'S.', 'Imperial', '1985-04-20', 'M', 'Single', 'Security Guard'),
(1056, 'Danilo', 'P.', 'Baldo', '1979-09-12', 'M', 'Married', 'Security Guard'),
(1057, 'Eusebio', 'M.', 'Borja', '1976-03-24', 'M', 'Married', 'Janitor'),
(1058, 'Pacita', 'G.', 'Reondanga', '1980-12-01', 'F', 'Widowed', 'Janitor'),
(1059, 'Mariano', 'T.', 'Berces', '1972-07-15', 'M', 'Married', 'Janitor'),
(1060, 'Luzviminda', 'R.', 'Bañares', '1983-05-30', 'F', 'Single', 'Janitor'),
(1061, 'Filon', 'C.', 'Imperial', '1978-01-18', 'M', 'Married', 'Maintenance'),
(1062, 'Flordeliza', 'D.', 'Belleza', '1987-10-10', 'F', 'Married', 'Canteen Staff'),
(1063, 'Imelda', 'B.', 'Rabino', '1984-06-22', 'F', 'Married', 'Canteen Staff'),
(1064, 'Conchita', 'F.', 'Romano', '1981-02-14', 'F', 'Widowed', 'Canteen Staff'),
(1065, 'Agapito', 'V.', 'Biazon', '1975-08-05', 'M', 'Married', 'Utility Worker'),
(1066, 'Nicanor', 'K.', 'Barrios', '1980-04-30', 'M', 'Single', 'Driver'),
(1067, 'Restituto', 'H.', 'Buenafe', '1977-11-20', 'M', 'Married', 'Gardener'),
(1068, 'Modesto', 'S.', 'Briones', '1974-12-12', 'M', 'Married', 'Maintenance'),
(2000, 'Salvador', 'A.', 'Imperial', '1970-05-12', 'M', 'Married', 'Principal');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `stud_lrn` char(12) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` char(1) NOT NULL,
  `birth_date` date NOT NULL,
  `address_barangay` varchar(100) NOT NULL,
  `address_municipality` varchar(100) NOT NULL,
  `personnel_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`stud_lrn`, `first_name`, `middle_name`, `last_name`, `gender`, `birth_date`, `address_barangay`, `address_municipality`, `personnel_id`) VALUES
('20260001', 'Aljon', 'Belen', 'Borja', 'M', '2008-03-14', 'Gogon', 'Legazpi', 1025),
('20260002', 'Maria Salve', '', 'Reondanga', 'F', '2007-11-09', 'Cruzada', 'Legazpi', 1025),
('20260003', 'John Paul', 'Mirasol', 'Imperial', 'M', '2008-06-21', 'Bitano', 'Legazpi', 1025),
('20260004', 'Rica', 'Belleza', 'Baldoza', 'F', '2007-01-30', 'Bonot', 'Legazpi', 1025),
('20260005', 'Jerico', 'Dela Cruz', 'Bañares', 'M', '2008-09-12', 'Rawis', 'Legazpi', 1025),
('20260006', 'Angelica', 'Nuñez', 'Ariola', 'F', '2007-04-18', 'EM\'s Barrio', 'Legazpi', 1025),
('20260007', 'Marvin', 'Toledo', 'Berces', 'M', '2008-12-05', 'Puro', 'Legazpi', 1025),
('20260008', 'Christine', 'Llorin', 'Bardon', 'F', '2007-07-27', 'Ilawod West', 'Legazpi', 1025),
('20260009', 'Renz', 'Pajarillo', 'Belleza', 'M', '2008-02-11', 'Market Site', 'Daraga', 1025),
('20260010', 'Jessa', 'Ofrin', 'Rabino', 'F', '2007-10-03', 'San Roque', 'Daraga', 1025),
('20260011', 'Mark Anthony', 'Fajardo', 'Resurreccion', 'M', '2008-05-19', 'Kimantong', 'Daraga', 1025),
('20260012', 'Princess', 'Llaguno', 'Romano', 'F', '2007-08-26', 'Binitayan', 'Daraga', 1025),
('20260013', 'Carlo', 'Belleza', 'Biazon', 'M', '2008-01-15', 'Cullat', 'Daraga', 1025),
('20260014', 'Hazel', 'Oasay', 'Balce', 'F', '2007-12-08', 'Bascaran', 'Daraga', 1025),
('20260015', 'Nathaniel', 'Perdigon', 'Barrios', 'M', '2008-04-02', 'Busay', 'Daraga', 1025),
('20260016', 'Sheila', 'Corvera', 'Buenafe', 'F', '2007-06-17', 'Mi-isi', 'Daraga', 1025),
('20260017', 'Vincent', 'Paner', 'Briones', 'M', '2008-11-24', 'Anislag', 'Daraga', 1025),
('20260018', 'Kyla', 'Mae', 'Abad', 'F', '2007-05-12', 'Albay District', 'Legazpi', 1025),
('20260019', 'Joshua', 'Reyes', 'Alegre', 'M', '2008-08-25', 'Arimbay', 'Legazpi', 1025),
('20260020', 'Beatrix', 'Lara', 'Baldo', 'F', '2007-12-01', 'Bagong Abre', 'Legazpi', 1025),
('20260021', 'Christian', 'Paul', 'Calleja', 'M', '2008-01-15', 'Banquerohan', 'Legazpi', 1025),
('20260022', 'Dianne', 'Grace', 'Diaz', 'F', '2007-09-18', 'Binanuahan', 'Legazpi', 1025),
('20260023', 'Ethan', 'James', 'Espinas', 'M', '2008-02-28', 'Bogtong', 'Legazpi', 1025),
('20260024', 'Fiona', 'Rose', 'Floranza', 'F', '2007-03-10', 'Capantawan', 'Legazpi', 1025),
('20260025', 'Gabriel', 'Ivan', 'Garcia', 'M', '2008-11-20', 'Dap-dap', 'Legazpi', 1025),
('20260026', 'Hannah', 'Nicole', 'Hernandez', 'F', '2007-06-05', 'Homapon', 'Legazpi', 1025),
('20260027', 'Ian', 'Gabriel', 'Ibañez', 'M', '2008-04-14', 'Mabinit', 'Legazpi', 1025),
('20260028', 'Jasmine', 'Joy', 'Jimenez', 'F', '2007-10-30', 'Oro Site', 'Legazpi', 1025),
('20260029', 'Kevin', 'Lee', 'Luces', 'M', '2008-07-22', 'Pawa', 'Legazpi', 1025),
('20260030', 'Lianne', 'Marie', 'Millena', 'F', '2007-01-08', 'Sagpon', 'Legazpi', 1025),
('20260031', 'Marcus', 'Anton', 'Nimo', 'M', '2008-05-19', 'Tula-tula', 'Legazpi', 1025),
('20260032', 'Nathalie', 'Hope', 'Orea', 'F', '2007-08-11', 'Bañag', 'Daraga', 1025),
('20260033', 'Oliver', 'Grant', 'Paguia', 'M', '2008-03-27', 'Bagumbayan', 'Daraga', 1025),
('20260034', 'Patricia', 'Ann', 'Quintana', 'F', '2007-11-04', 'Canlubang', 'Daraga', 1025),
('20260035', 'Quentin', 'Xavier', 'Ramos', 'M', '2008-06-15', 'Dinoronan', 'Daraga', 1025),
('20260036', 'Rochelle', 'Mae', 'Sayson', 'F', '2007-02-21', 'Gabawan', 'Daraga', 1011),
('20260037', 'Samuel', 'David', 'Tuazon', 'M', '2008-09-09', 'Inarado', 'Daraga', 1011),
('20260038', 'Trisha', 'Gail', 'Vallarez', 'F', '2007-04-17', 'Kilicao', 'Daraga', 1011),
('20260039', 'Ulysses', 'Cesar', 'Zamora', 'M', '2008-10-02', 'Malabog', 'Daraga', 1011),
('20260040', 'Vanessa', 'C.', 'Almayda', 'F', '2007-07-24', 'Matnog', 'Daraga', 1011),
('20260041', 'Wyatt', 'Ross', 'Basabe', 'M', '2008-12-30', 'Salvacion', 'Daraga', 1011),
('20260042', 'Xandra', 'Yvonne', 'Cardano', 'F', '2007-05-13', 'Tagas', 'Daraga', 1011),
('20260043', 'Yusuf', 'Ali', 'Dioneda', 'M', '2008-01-22', 'Anislag', 'Daraga', 1011),
('20260044', 'Zoe', 'Isabelle', 'Estipona', 'F', '2007-08-04', 'Binitayan', 'Daraga', 1011),
('20260045', 'Aidan', 'Drake', 'Frondoza', 'M', '2008-04-19', 'Busay', 'Daraga', 1011),
('20260046', 'Brianna', 'Claire', 'Goyena', 'F', '2007-03-29', 'Cullat', 'Daraga', 1011),
('20260047', 'Cedrick', 'John', 'Honrado', 'M', '2008-11-11', 'Inarado', 'Daraga', 1011),
('20260048', 'Danica', 'Faye', 'Icaro', 'F', '2007-06-18', 'Kimantong', 'Daraga', 1011),
('20260049', 'Elijah', 'Kent', 'Jalmanzar', 'M', '2008-02-05', 'Lacag', 'Daraga', 1011),
('20260050', 'Francine', 'G.', 'Lanuza', 'F', '2007-10-12', 'Malabog', 'Daraga', 1011),
('20260051', 'Gerald', 'M.', 'Manansala', 'M', '2008-07-31', 'Matnog', 'Daraga', 1011),
('20260052', 'Hazel', 'Anne', 'Navarro', 'F', '2007-01-25', 'Mayon', 'Daraga', 1011),
('20260053', 'Isaac', 'Newton', 'Ocampo', 'M', '2008-05-08', 'Pandora', 'Daraga', 1011),
('20260054', 'Juliana', 'Marie', 'Perez', 'F', '2007-08-16', 'Peñafrancia', 'Daraga', 1011),
('20260055', 'Kurt', 'Russell', 'Quinto', 'M', '2008-03-03', 'Sagpon', 'Daraga', 1011),
('20260056', 'Leila', 'Sofia', 'Reyes', 'F', '2007-12-28', 'Salvacion', 'Daraga', 1011),
('20260057', 'Nathan', 'Jake', 'Santos', 'M', '2008-06-10', 'San Roque', 'Daraga', 1011),
('20260058', 'Olivia', 'Kate', 'Tiongson', 'F', '2007-02-14', 'Tagas', 'Daraga', 1011),
('20260059', 'Patrick', 'Star', 'Ubaldo', 'M', '2008-09-20', 'Villahermosa', 'Daraga', 1011),
('20260060', 'Queenie', 'Rose', 'Valdez', 'F', '2007-04-26', 'Bascaran', 'Daraga', 1011),
('20260061', 'Renz', 'Mikel', 'Wong', 'M', '2008-10-15', 'Bogtong', 'Legazpi', 1011),
('20260062', 'Sofia', 'Bianca', 'Yanto', 'F', '2007-07-01', 'Gogon', 'Legazpi', 1011),
('20260063', 'Tyler', 'Durden', 'Zuniga', 'M', '2008-12-05', 'Rawis', 'Legazpi', 1011),
('20260064', 'Abigail', 'Mae', 'Arandia', 'F', '2007-05-19', 'Bitano', 'Legazpi', 1011),
('20260065', 'Brandon', 'Cole', 'Belmonte', 'M', '2008-01-30', 'Bonot', 'Legazpi', 1011),
('20260066', 'Chloe', 'Isabel', 'Casas', 'F', '2007-08-22', 'Cruzada', 'Legazpi', 1011),
('20260067', 'Dominic', 'Savio', 'Dela Torre', 'M', '2008-04-10', 'Dap-dap', 'Legazpi', 1011),
('20260068', 'Erica', 'Jane', 'Flores', 'F', '2007-03-05', 'Ilawod', 'Legazpi', 1011),
('20260069', 'Felix', 'The Cat', 'Gomez', 'M', '2008-11-27', 'Maoyod', 'Legazpi', 1011),
('20260070', 'Giselle', 'Lao', 'Hidalgo', 'F', '2007-06-14', 'Pinaric', 'Legazpi', 1011);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `personnel`
--
ALTER TABLE `personnel`
  ADD PRIMARY KEY (`personnel_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`stud_lrn`),
  ADD KEY `Student_FK2` (`personnel_id`),
  ADD KEY `idx_student_name` (`last_name`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `Student_FK2` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`personnel_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
