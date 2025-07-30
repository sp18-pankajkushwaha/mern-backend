create database "SchoolManagementSystem"

create table students(
id serial primary key,
name varchar(50) not null,
age int check (age>0),
gender varchar(20),
email varchar(50) UNIQUE not null,
phone varchar(15)
)

create table courses(
id serial primary key,
course_name varchar(30) not null,
duration interval,
fee decimal(10,2) 
)

create table enrollments(
enrollment_id serial primary key,
student_id int not null,
course_id int not null,
enrollment_date date default current_date,

foreign key (student_id) references students(id) on delete cascade,
foreign key (course_id) references courses(id) on delete cascade
)

CREATE TYPE gender_enum AS ENUM ('Male', 'Female', 'Other');

ALTER TABLE students
ALTER COLUMN gender TYPE gender_enum USING gender::gender_enum;

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

INSERT INTO courses VALUES
(101, 'Web Development', '3 Months', 15000.00),
(102, 'Data Science', '6 Months', 30000.00),
(103, 'Graphic Design', '2 Months', 12000.00),
(104, 'Digital Marketing', '3 Months', 18000.00),
(105, 'Cybersecurity', '4 Months', 25000.00)

INSERT INTO enrollments VALUES
(1, 1, 101, '2025-07-01'),
(2, 2, 102, '2025-07-02'),
(3, 3, 103, '2025-07-03'),
(4, 4, 104, '2025-07-04'),
(5, 5, 105, '2025-07-05'),
(6, 6, 101, '2025-07-06'),
(7, 7, 102, '2025-07-07'),
(8, 8, 103, '2025-07-08'),
(9, 9, 104, '2025-07-09'),
(10, 10, 105, '2025-07-10'),
(11, 1, 102, '2025-07-11'),
(12, 2, 103, '2025-07-12'),
(13, 3, 104, '2025-07-13'),
(14, 4, 105, '2025-07-14'),
(15, 5, 101, '2025-07-15');

UPDATE courses set fee=55000.00 where course_name='Cybersecurity'
select * from courses