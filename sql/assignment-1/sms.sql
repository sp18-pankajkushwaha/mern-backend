--Creating database
CREATE DATABASE "SchoolManagementSystem"

--Creating students table
CREATE TABLE students(
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
age INT CHECK (age>0),
gender VARCHAR(20),
email VARCHAR(50) UNIQUE NOT NULL,
phone VARCHAR(15)
)

--Creating courses table
CREATE TABLE Courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(50) NOT NULL,
    duration INTERVAL NOT NULL,
    fees DECIMAL(10, 2) NOT NULL CHECK (fees >0)
);

--Creating enrollments table
CREATE TABLE enrollments(
enrollment_id SERIAL PRIMARY KEY,
student_id INT NOT NULL,
course_id INT ,
enrollment_date DATE DEFAULT CURRENT_DATE,

FOREIGN KEY (student_id) REFERENCES students(id) ,
FOREIGN KEY (course_id) REFERENCES courses(id)
)

--Creating enum type gender_enum
CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');

--Changing datatype of gender FROM VARCHAR to enum
ALTER TABLE students
ALTER COLUMN gender TYPE gender_enum USING gender::gender_enum;

--Populating students table
INSERT INTO students (id,name,age,gender,email,phone)
VALUES
(1, 'Alice Sharma', 20, 'Female', 'alice@gmail.com', '9876543210'),
(2, 'Rahul Verma', 22, 'Male', 'rahulv@gmail.com', '9876500001'),
(3, 'Sneha Roy', 19, 'Female', 'sneha.r@gmail.com', '9876500002'),
(4, 'Amit Singh', 21, 'Male', 'amit.singh@gmail.com', '9876500003'),
(5, 'Tanya Das', 23, 'Female', 'tanya.das@gmail.com', '9876500004'),
(6, 'Mohit Jain', 20, 'Male', 'mohit.jain@gmail.com', '9876500005'),
(7, 'Divya Menon', 24, 'Female', 'divya.menon@gmail.com', '9876500006'),
(8, 'Rohan Mehta', 22, 'Male', 'rohan.mehta@gmail.com', '9876500007'),
(9, 'Kavita Rao', 21, 'Female', 'kavita.rao@gmail.com', '9876500008'),
(10, 'Ankur Yadav', 20, 'Male', 'ankur.yadav@gmail.com', '9876500009');

--Populating courses table
INSERT INTO courses (id, course_name, duration, fees)
VALUES 
    (201, 'mathematics', '6 Months', 60000.00),     
    (202, 'science', '5 Months', 45000.00),      
    (203, 'biology', '8 Months', 55000.00),         
    (204, 'english','7 Months', 50000.00),        
    (205, 'electronics', '12 years', 58000.00);

--Populating enrollments table
INSERT INTO enrollments VALUES
(1, 1, 201, '2025-07-01'),
(2, 2, 202, '2025-07-02'),
(3, 3, 203, '2025-07-03'),
(4, 4, 204, '2025-07-04'),
(5, 5, 205, '2025-07-05'),
(6, 6, null, '2025-07-06'),
(7, 7, 201, '2025-07-07'),
(8, 8, 201, '2025-07-08'),
(9, 9, 205, '2025-07-09'),
(10, 10, 205, '2025-07-10'),
(11, 1, 201, '2025-07-11'),
(12, 2, null, '2025-07-12'),
(13, 3, 203, '2025-07-13'),
(14, 4, 201, '2025-07-14'),
(15, 5, 205, '2025-07-15');


SELECT * FROM courses

--List of all students with their enrolled courses.
SELECT s.name, c.course_name FROM students s LEFT JOIN enrollments e ON s.id=e.student_id
LEFT JOIN courses c ON e.course_id=c.id

--List all courses along with the number of students enrolled in each.
SELECT c.course_name, COUNT(e.student_id) FROM courses c LEFT JOIN enrollments e
ON e.course_id = c.id GROUP BY c.course_name

--List of students who are not enrolled in any course.
SELECT s.name FROM students s INNER JOIN enrollments e ON s.id=e.student_id WHERE 
e.course_id IS NULL

--List of students who are enrolled in more than one course.
SELECT s.name, COUNT(e.student_id) AS courses_count FROM students s INNER JOIN enrollments e ON 
e.student_id = s.id  GROUP BY s.name HAVING COUNT(e.student_id) >1

--All courses without any enrolled students.
SELECT c.course_name FROM courses c LEFT JOIN enrollments e ON c.id=e.course_id
GROUP BY c.course_name
HAVING COUNT(e.course_id)=0 

 --Details of the student who enrolled most recently
SELECT s.name,s.age, s.gender, c.course_name FROM students s INNER JOIN enrollments e ON 
s.id=e.student_id INNER JOIN courses c ON e.course_id=c.id ORDER BY
enrollment_date DESC LIMIT 1  

--Updating the course fee for "mathematics" to 5500.
UPDATE courses SET fees=55000.00 WHERE course_name='mathematics'

--Creating enum type status for students table
CREATE TYPE status AS ENUM ('enrolled', 'dropout');

--Adding column status in students table
ALTER TABLE Students
ADD STATUS STATUS NOT NULL DEFAULT 'enrolled';

--Manually dropping out a student
UPDATE Students
SET status = 'dropout'
WHERE id=10;

--Removing all enrollments of a student who has dropped out.
DELETE FROM enrollments e
USING students s
WHERE e.student_id = s.id
AND s.status = 'dropout';

--Changing the course duration for "electronics" to 18 weeks.
UPDATE courses SET duration='18 weeks' WHERE id=205  

-- Aggregate functions
SELECT COUNT(*) FROM students GROUP BY gender HAVING gender='Male';
SELECT MIN(age) FROM students GROUP BY gender HAVING gender='Female' 
SELECT MAX(age) FROM students GROUP BY gender HAVING gender='Female' 
SELECT MAX(fee) FROM courses GROUP BY gender HAVING gander='Male';
SELECT SUM(age) FROM students GROUP BY gender HAVING gender ='Male' 
SELECT AVG(age) FROM students GROUP BY gender HAVING gender ='Male' 

--Adding a unique constraINT to the Phone column of the Students table.
ALTER TABLE students
ADD UNIQUE (phone);

--Adding an index on the EnrollmentDate column in the Enrollments table.
CREATE INDEX idx_enrollment_date
ON enrollments (enrollment_date);

--Ensuring that a course fee cannot be less than 1000.
ALTER TABLE Courses
ADD CONSTRAINT CHECK (fees >= 1000);



