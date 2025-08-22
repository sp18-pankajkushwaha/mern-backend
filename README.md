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

## Day 9 (Thursday, 31-07-2025)
=> Connected Express.js with MongoDB using Mongoose.  
=> Understood the concept of ODM (Object Document Mapper).  
=> Defined Mongoose schemas and created models.  
=> Practiced CRUD operations in MongoDB using Mongoose methods.  
=> Learnt how to use .save(), .find(), .findById(), .findByIdAndUpdate(), .deleteOne() etc.  
=> Created sample collections and documents for Students and Courses.  
=> Discussed the difference between .create() and .save().  
=> Understood how MongoDB documents differ from SQL rows.  

## Day 10 (Friday, 01-08-2025)
=> Built a basic CRUD API using Express.js and MongoDB.  
=> Organized the project using MVC (Model-View-Controller) architecture.    
=> Created separate folders for routes, controllers, models, and middleware.  
=> Implemented basic API routes for Create, Read, Update, and Delete operations.  
=> Used Postman to test all routes with various data cases.  
=> Handled errors gracefully with try-catch and centralized error middleware.  
=> Integrated environment variables using dotenv for database credentials and port.  
=> Practiced using async/await for handling asynchronous database operations.  

## Day 11 (Monday, 04-08-2025)
What is NoSQL?

NoSQL stands for "Not Only SQL" and refers to a type of database that is non-relational, meaning it does not rely on fixed schemas and tables like traditional SQL databases. It is designed for flexibility, scalability, and handling large amounts of unstructured or semi-structured data. NoSQL databases are especially useful in real-time applications and big data environments.

 Types of NoSQL Databases
- There are four main types of NoSQL databases:
- Document-Oriented Databases – Store data as JSON-like documents (e.g., MongoDB, CouchDB).
- Key-Value Stores – Store data as simple key-value pairs (e.g., Redis, DynamoDB).
- Column-Family Stores – Organize data into columns rather than rows (e.g., Apache Cassandra, HBase).
- Graph Databases – Store data as nodes and edges, making them ideal for relationships (e.g., Neo4j, ArangoDB).

- Introduction to MongoDB

MongoDB is a document-oriented NoSQL database that stores data in a flexible, JSON-like format called BSON (Binary JSON). It is highly scalable, supports replication and sharding, and provides a powerful query language. Its schema-less nature allows developers to quickly adapt to changing requirements without restructuring the entire database.

- Document-Based Model and BSON Format

In MongoDB:
A document is a single record, similar to a row in SQL.
A collection is a group of documents, similar to a table in SQL.
Data is stored in BSON (Binary JSON), which is a binary representation of JSON, optimized for performance.
Example:
{
  "_id": "12345",
  "name": "Alice",
  "age": 25,
  "skills": ["MongoDB", "Node.js", "React"]
}
- Installing MongoDB and Setting up the Environment
Start the MongoDB service:
net start MongoDB             # Windows  

- Using MongoDB Compass (GUI)
MongoDB Compass is a graphical interface to interact with MongoDB databases. It allows you to:
Create and manage databases and collections.
Insert, update, and delete documents visually.
Run queries without using the command line.
You can download it from the MongoDB Compass page.

- Basic MongoDB Commands
Some fundamental MongoDB shell commands include:
show dbs → Displays all databases
use <database> → Switches to (or creates) a database.
db.createCollection("name") → Creates a new collection in the selected database.
db.dropDatabase() → Deletes the current database.

## Day 16 (Tuesday, 05-08-2025)

- Understanding JSON and BSON
JSON is a human-readable format used to store and exchange data.
BSON (Binary JSON) is used internally by MongoDB, supports more types (e.g., ObjectId, Date), and is faster for storage/retrieval.
- CRUD Operations (Create, Read, Update, Delete)
Create: Insert documents into a collection using .insertOne() and .insertMany().
Read: Retrieve data using .find() and .findOne().
Update: Modify data using .updateOne() and .updateMany().
Delete: Remove documents using .deleteOne() and .deleteMany().
- MongoDB Query Operators
Comparison Operators: $gt, $lt, $eq, $ne, $in, $nin (filter based on values).
Logical Operators: $and, $or, $not (combine conditions).
Element Operators: $exists, $type (check if a field exists or its data type).

## Day 17 (Wednesday, 06-08-2025)

- Array Fields and Embedded Documents
- MongoDB supports arrays and nested documents inside documents.
- Useful for storing multiple values (like hobbies) or related data (like address).
- Querying Arrays
($size: Match documents where an array has a specific length).
($all: Match documents where the array contains all given values).
($elemMatch: Match documents with array elements satisfying multiple conditions).
- Projection (Selecting Specific Fields)
Use projection to include/exclude fields in query results.
Example: Only return name and age, hide _id.
Sorting and Limiting Results
.sort() to order results (ascending/descending).
.limit() to restrict number of results.
.skip() with .limit() for pagination.
Indexing in MongoDB
Improves query performance by avoiding full collection scans.
- Types of Indexes:
Single-field index.
Compound index (multiple fields).
Unique index (no duplicate values).
Text index (search within text fields).
Indexes make queries faster but can slow down insert/update operations.

## Day 18 (Thursday, 07-08-2025)

- Aggregation Framework
Used to process and analyze data in stages (pipeline).
- Common Stages:
$match: Filter documents.
$group: Group by a field and perform operations (sum, avg, count).
$sort: Order results.
$limit: Restrict number of results.
$project: Include or transform fields.
$lookup: Join two collections.
- Data Modeling in NoSQL
Embedded Documents (Denormalization): Store related data together in a single document.
 Faster reads.
 Data duplication.
References (Normalization): Store data separately and link with an ID.
 Less duplication.
Requires joins/extra queries.
- When to Use
Use Embedding when data is read together frequently (e.g., user profile + address).
Use Referencing when data is large, reused, or updated frequently (e.g., users and orders).

## Day 19 and weekend
Complete the Online Library assignment with all queries.
Revise CRUD, Query Operators, Indexing, Aggregation.

# Day 22 (Friday, 08-08-2025)
- What is ORM and ODM?
- ORM (Object Relational Mapper):
Used with SQL databases (e.g., PostgreSQL, MySQL).
Maps JavaScript objects to relational database tables.
Example: Sequelize.
- ODM (Object Document Mapper):
Used with NoSQL databases (MongoDB).
Maps JavaScript objects to document-based collections.
Example: Mongoose.
- Difference between ORM (Sequelize) and ODM (Mongoose)
Sequelize works with relational databases → Tables, Rows, Foreign Keys.
Mongoose works with MongoDB → Collections, Documents, References.
Sequelize → Structured schema with relations.
Mongoose → Flexible schema with embedded/nested documents.
- Setting Up PostgreSQL with Sequelize (ORM)
Install Sequelize & CLI:
npm install sequelize pg pg-hstore
npm install --save-dev sequelize-cli
Configure Sequelize (config/config.json or .env).
Initialize Sequelize:
npx sequelize-cli init
Setting Up MongoDB with Mongoose (ODM)
Install Mongoose:
npm install mongoose
Connect using mongoose.connect(MONGO_URI).
Store URI in .env for security.
Creating Basic Models
Sequelize:
Example Models: User, Post.
Define fields with data types (STRING, INTEGER, BOOLEAN, etc.).
Mongoose:
Example Models: Product, Review.
Define schema with validation rules.

## Day 23 (Monday, 11-08-2025)

- Sequelize (ORM)
Migrations & Seeders
Migration = Version-controlled schema changes.
Seeder = Populating initial/sample data.
- Generate migration:
npx sequelize-cli model:generate --name User --attributes name:string,email:string
Run migration:
npx sequelize-cli db:migrate
- Adding Validations
Unique email
Password min length.
Non-null fields.
Data Seeding
npx sequelize-cli seed:generate --name demo-user
npx sequelize-cli db:seed:all
- Mongoose (ODM)
Validation Rules in Schema
Required fields.
Default values.
Correct data types
Custom Validations
Example: Price must be greater than 0.
Enum Validation
Restrict field values (e.g., category: "Electronics" | "Clothing" | "Books").

## Day 24 (Tuesday, 12-08-2025)

- Sequelize (ORM)
Types of Associations
One-to-One → User -> Profile.
One-to-Many → User -> Posts.
Many-to-Many → Post <-> Tags (through PostTags).
Eager vs Lazy Loading
Eager: Load related models immediately (include).
Lazy: Load when accessed
Cascading Deletes
- Using ON DELETE CASCADE ensures child rows are removed when parent is deleted.
Mongoose (ODM)
- Types of Relationships
One-to-Many → Array of IDs (Product -> Reviews).
One-to-One → Reference field (User -> Profile).
- Population
Replace referenced ObjectIds with actual documents using .populate().

## Day 25 (Wednesday, 13-08-2025)

- Sequelize (ORM) – Hooks
- Lifecycle Hooks
beforeCreate, beforeUpdate.
afterCreate, afterDestroy.
- Use Cases
Hashing password before saving.
Logging changes to data.
- Mongoose (ODM) – Middleware
- Pre and Post Middleware
pre('save'), post('save').
pre('findOne'), post('findOne').
- Common Use Cases
Validate/modify data before save.
Auto-set timestamps.
Populate fields automatically.
Error Handling in Middleware
Use next(err) to prevent invalid saves.
Gracefully handle validation errors.

## Day 26 (Thursday, 14-08-2025)

Build the Student Course Management System using Sequelize + PostgreSQL with one-to-one, one-to-many, and many-to-many relations.
Implement validations, constraints, and hooks (password hashing, auto-set dates).
Build the Library Management System using Mongoose + MongoDB with profile, borrow records, and validations.
Add hooks (auto-set dates, update copies, overdue check) and Express middleware for error handling.

## Day 29 (Monday, 18-08-2025)

- Authentication vs Authorization
Authentication → Verifies who you are.
Authorization → Verifies what you can do.
- RBAC vs ABAC
RBAC → Access based on roles (Admin, User).
ABAC → Access based on attributes (age, subscription, etc).
- JWT Authentication
JWT = JSON Web Token.
Structure → Header + Payload + Signature.
Use in Express API → Login → Generate JWT → Verify JWT in routes.
- OAuth 2.0
Delegated login (Google, GitHub, etc).
Example: Google OAuth → Redirect → Token → Access user profile.

## Day 30 (Tuesday, 19-08-2025)

RBAC (Role-Based Access Control)
Define roles → Admin, User, Editor.
Protect routes with role-based middleware.
- ABAC (Attribute-Based Access Control)
Access based on user attributes (e.g., age > 18, plan = premium).
More flexible than RBAC.
- Environment Variables Security
Use dotenv for secrets.
Never expose keys in code.
- Basic Security Practices
helmet → Secure HTTP headers.
express-rate-limit → Prevent brute force / DDoS attacks.

## Day 31 (Wednesday, 20-08-2025)
- SOLID Principles in Node.js
S: Single Responsibility → One function = one job.
O: Open/Closed → Open for extension, closed for modification.
L: Liskov Substitution → Child classes replace parent without breaking.
I: Interface Segregation → Don't force unnecessary methods.
D: Dependency Inversion → Depend on abstractions, not details.
- Class-based Development
Use Classes for Controllers in Express.
Apply Dependency Injection for cleaner, testable code.
- Error Handling Best Practices
Centralized error handler in Express.
Custom errors (e.g., NotFoundError, ValidationError).

