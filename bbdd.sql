-- Crear la base de datos
CREATE DATABASE carnetlify;
USE carnetlify;

-- Tabla Users
CREATE TABLE Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    isActive BOOLEAN DEFAULT TRUE
);

-- Tabla PersonalInfo (solo obligatoria para trámites con la DGT)
CREATE TABLE PersonalInfo (
    infoId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    firstName VARCHAR(50),
    lastName VARCHAR(100),
    idDocument VARCHAR(50),
    age INT,
    country VARCHAR(50),
    province VARCHAR(50),
    city VARCHAR(50),
    postalCode VARCHAR(10),
    address VARCHAR(255),
    phone VARCHAR(20),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

-- Tabla Packages
CREATE TABLE Packages (
    packageId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

-- Tabla StudentPackages (relación entre alumnos y paquetes)
CREATE TABLE StudentPackages (
    studentPackageId INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT,
    packageId INT,
    purchaseDate DATE,
    FOREIGN KEY (studentId) REFERENCES Users(userId),
    FOREIGN KEY (packageId) REFERENCES Packages(packageId)
);

-- Tabla StudyBlocks
CREATE TABLE StudyBlocks (
    blockId INT AUTO_INCREMENT PRIMARY KEY,
    packageId INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    FOREIGN KEY (packageId) REFERENCES Packages(packageId)
);

-- Tabla Lessons
CREATE TABLE Lessons (
    lessonId INT AUTO_INCREMENT PRIMARY KEY,
    blockId INT,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    order INT NOT NULL,
    FOREIGN KEY (blockId) REFERENCES StudyBlocks(blockId)
);

-- Tabla StudentLessons (relación entre alumnos y lecciones)
CREATE TABLE StudentLessons (
    studentLessonId INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT,
    lessonId INT,
    isCompleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (studentId) REFERENCES Users(userId),
    FOREIGN KEY (lessonId) REFERENCES Lessons(lessonId)
);

-- Tabla Exams
CREATE TABLE Exams (
    examId INT AUTO_INCREMENT PRIMARY KEY,
    blockId INT,
    examDate DATE,
    maxFails INT DEFAULT 3,
    FOREIGN KEY (blockId) REFERENCES StudyBlocks(blockId)
);

-- Tabla StudentExams (relación entre alumnos y exámenes de bloque)
CREATE TABLE StudentExams (
    studentExamId INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT,
    examId INT,
    grade INT,
    isApproved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (studentId) REFERENCES Users(userId),
    FOREIGN KEY (examId) REFERENCES Exams(examId)
);

-- Tabla FinalExam
CREATE TABLE FinalExam (
    finalExamId INT AUTO_INCREMENT PRIMARY KEY,
    finalExamDate DATE,
    description TEXT,
    maxFails INT DEFAULT 3
);

-- Tabla StudentFinalExam (relación entre alumnos y el examen final)
CREATE TABLE StudentFinalExam (
    studentFinalExamId INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT,
    finalExamId INT,
    finalGrade INT,
    isApproved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (studentId) REFERENCES Users(userId),
    FOREIGN KEY (finalExamId) REFERENCES FinalExam(finalExamId)
);

-- Tabla PracticeSessions
CREATE TABLE PracticeSessions (
    sessionId INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT,
    teacherId INT,
    date DATE,
    duration TIME,
    FOREIGN KEY (studentId) REFERENCES Users(userId),
    FOREIGN KEY (teacherId) REFERENCES Users(userId)
);

-- Tabla Teachers (relacionada con la tabla Users)
CREATE TABLE Teachers (
    teacherId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

-- Tabla Admins (relacionada con la tabla Users)
CREATE TABLE Admins (
    adminId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    FOREIGN KEY (userId) REFERENCES Users(userId)
);