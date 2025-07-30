# mern-backend

## Day 1 (Monday, 21-07-2025)

 => Learnt what Node.js is - it's a JavaScript runtime built on Chrome's V8 engine.  
 => Node.js allows us to run JavaScript outside the browser.  
 => Installed Node.js and npm (node package manager).  
 => Understood the architecture of Node.js and how the event loop works.  
 => Practiced running JavaScript using Node.js REPL.  
 => Explored different types of modules:
    - Core Modules (like `fs`, `http`, `path`)
    - Local Modules (user-defined)
    - Third-party Modules (installed using npm)
 => Used both `require` (CommonJS) and `import` (ES Module) syntax to include modules.  
 => Learnt to install packages using `npm install`.  
 => Created a new Node.js project using `npm init`.  
 => Understood the purpose of `package.json` and `node_modules`.

---

## Day 2 (Tuesday, 22-07-2025)

 => Introduction to Express.js - a minimal and flexible web framework for Node.js.  
 => Understood why Express is commonly used with Node.js for building APIs and web apps.  
 => Installed Express using npm.  
 => Created the first basic Express server using `app.listen()`.  
 => Learnt about Middleware:
    - Built-in middleware like `express.json()` and `express.urlencoded()`
    - Custom middleware using `app.use()`  
 => Implemented basic routing with methods:
    - GET
    - POST
    - PUT
    - DELETE  
 => Understood how to use Route Parameters (`/user/:id`) and Query Parameters (`/search?q=node`).

---

## Day 3 (Wednesday, 23-07-2025)

 => Practiced advanced routing concepts with Express.js.  
 => Explored route chaining using `app.route()` for cleaner code.  
 => Organized routes using Express Router in separate files.  
 => Learnt how to structure an Express project in MVC-style folders.  
 => Implemented multiple routes and practiced using middleware across specific routes.  
 => Handled different HTTP methods and tested routes using Postman.  
 => Understood how to handle form data in Express using middleware.  
 => Explored how to pass form-data in Postman using Body → form-data and x-www-form-urlencoded.

---

## Day 4 (Thursday, 24-07-2025)
  => Learnt about next() function to move control to the next middleware.  
  => Implemented multiple custom middleware functions for logging and error handling.  
  => Explored third-party middleware like morgan for logging HTTP requests.  
  => Practiced error-handling middleware and sending custom responses.  
  => Understood the importance of middleware ordering in Express.  

## Day 5 (Friday, 25-07-2025)
=> Introduction to MongoDB and NoSQL databases.  
=> Installed and connected MongoDB to Express using Mongoose ODM.  
=> Learnt about Mongoose Schema and Model creation.  
=> Created models for basic entities (like Product).  
=> Performed CRUD operations (Create, Read, Update, Delete) using Mongoose.  
=> Handled MongoDB ObjectId validation using regex and middleware.  
=> Used Postman to test MongoDB CRUD endpoints.  

## Day 6 (Monday, 28-07-2025)
=> Introduction to SQL and Relational Databases.  
=> Understood differences between SQL vs NoSQL.  
=> Learnt basic SQL syntax: CREATE, SELECT, INSERT, UPDATE, DELETE.  
=> Created basic tables for Students, Courses, and Enrollments.  
=> Understood primary keys, foreign keys, and data types (VARCHAR, INT, BOOLEAN).  
=> Used NOT NULL, UNIQUE, and DEFAULT constraints.  

## Day 7 (Tuesday, 29-07-2025)
=> Deep dive into SQL data types - VARCHAR, TEXT, NUMERIC, BOOLEAN, etc.  
=> Practiced altering tables and modifying column types (ALTER TABLE).  
=> Learnt about ENUM type in PostgreSQL and case sensitivity issues.  
=> Explored TRUNCATE vs DELETE vs DROP with examples.  
=> Understood the use of ON DELETE CASCADE in foreign keys.  
=> Practiced writing queries for table relationships (JOIN-like logic).  
=> Discussed differences between MySQL and PostgreSQL.  

## Day 8 (Wednesday, 30-07-2025)
=> Reviewed SQL commands and practiced real-life table relationships.  
=> Created and tested foreign key constraints with ON UPDATE / ON DELETE actions.  
=> Learnt about BOOLEAN in PostgreSQL and valid input values (true, false, not 'YES', 'NO').  
=> Explored indexing basics and why PRIMARY KEY implies indexing.  
=> Practiced writing SELECT queries with WHERE, LIKE, and ORDER BY.  
=> Created a small relational data model involving students, courses, and enrollments with real data entries.  

References:  
- https://nodejs.org/  
- https://expressjs.com/  
- https://www.w3schools.com/nodejs/  
- https://www.postman.com/

