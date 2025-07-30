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
fee int 
)

create table enrollments(
enrollment_id serial primary key,
student_id int not null,
course_id int not null,
enrollment_date date default current_date,

foreign key (student_id) references students(id) on delete cascade,
foreign key (course_id) references courses(id) on delete cascade
)