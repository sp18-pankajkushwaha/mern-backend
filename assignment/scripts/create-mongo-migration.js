const fs = require('fs');
const path = require('path');

function createMongoMigrationTemplate(collectionName) {
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
  const fileName = `${timestamp}-init-${collectionName}.js`;
  
  const migrationTemplate = `const { MongoClient } = require('mongodb');
require('dotenv').config();

/**
 * MongoDB Migration: Initialize ${collectionName} collection
 * Database: MongoDB (Document-based)
 * Generated: ${new Date().toISOString()}
 */

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/odm_demo';
const DB_NAME = process.env.MONGO_DB_NAME || 'odm_demo';

async function up() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Create collection with validation schema
    await db.createCollection('${collectionName}', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["_id"], // Add required fields here
          properties: {
            _id: {
              bsonType: "objectId",
              description: "Primary key for ${collectionName}"
            },
            
            // TODO: Add your schema validation here
            // Example:
            // name: {
            //   bsonType: "string",
            //   minLength: 2,
            //   maxLength: 100,
            //   description: "User's full name"
            // },
            // email: {
            //   bsonType: "string",
            //   pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            //   description: "Valid email address"
            // },
            // age: {
            //   bsonType: "int",
            //   minimum: 0,
            //   maximum: 150,
            //   description: "Age in years"
            // },
            // isActive: {
            //   bsonType: "bool",
            //   description: "Whether the user is active"
            // },
            
            createdAt: {
              bsonType: "date",
              description: "Document creation timestamp"
            },
            updatedAt: {
              bsonType: "date",
              description: "Document last update timestamp"
            }
          }
        }
      }
    });
    
    console.log(\`✅ Collection '\${collectionName}' created successfully\`);
    
    // Create indexes
    await db.collection('${collectionName}').createIndexes([
      // TODO: Add your indexes here
      // Example:
      // { key: { email: 1 }, unique: true, name: '${collectionName}_email_unique' },
      // { key: { createdAt: -1 }, name: '${collectionName}_created_at_desc' },
      
      // Default indexes
      { key: { createdAt: -1 }, name: '${collectionName}_created_at_desc' },
      { key: { updatedAt: -1 }, name: '${collectionName}_updated_at_desc' }
    ]);
    
    console.log(\`✅ Indexes created for '\${collectionName}'\`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

async function down() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Drop collection
    await db.collection('${collectionName}').drop();
    console.log(\`✅ Collection '\${collectionName}' dropped successfully\`);
    
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Command line interface
const command = process.argv[2];

if (command === 'up') {
  up()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error.message);
      process.exit(1);
    });
} else if (command === 'down') {
  down()
    .then(() => {
      console.log('🎉 Rollback completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Rollback failed:', error.message);
      process.exit(1);
    });
} else {
  console.log('Usage: node ${fileName} <up|down>');
  console.log('');
  console.log('Examples:');
  console.log('  node ${fileName} up    # Apply migration');
  console.log('  node ${fileName} down  # Rollback migration');
  process.exit(1);
}

module.exports = { up, down };

/*
NEXT STEPS:
===========
1. Edit this file and add your schema validation and indexes
2. Run: node migrations/mongodb/${fileName} up
3. Run: npm run odm-model ${collectionName}
   (This will generate the Mongoose model)

MONGODB SCHEMA TYPES:
====================
"string"       // String
"int"          // 32-bit integer
"long"         // 64-bit integer
"double"       // Double
"decimal"      // Decimal128
"bool"         // Boolean
"date"         // Date
"objectId"     // ObjectId
"array"        // Array
"object"       // Embedded document

VALIDATION OPTIONS:
==================
minLength: 5          // Minimum string length
maxLength: 100        // Maximum string length
minimum: 0            // Minimum number
maximum: 150          // Maximum number
pattern: "^[a-z]+$"   // Regex pattern
enum: ["A", "B", "C"] // Allowed values
*/`;

  // Create migrations/mongodb directory if it doesn't exist
  const migrationsDir = path.join(process.cwd(), 'migrations', 'mongodb');
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  const filePath = path.join(migrationsDir, fileName);
  fs.writeFileSync(filePath, migrationTemplate);
  
  console.log(`✅ MongoDB migration template created: ${fileName}`);
  console.log(`📝 File location: migrations/mongodb/${fileName}`);
  console.log('');
  console.log('🔧 Next steps:');
  console.log(`1. Edit migrations/mongodb/${fileName} and add your schema`);
  console.log(`2. Run: node migrations/mongodb/${fileName} up`);
  console.log(`3. Run: npm run odm-model ${collectionName}`);
  console.log('');
  console.log('💡 The migration file includes MongoDB schema validation examples!');
  
  return { fileName, filePath };
}

// Command line interface
const args = process.argv.slice(2);
const collectionName = args[0];

if (!collectionName) {
  console.log('🎯 MongoDB Migration Template Generator');
  console.log('======================================');
  console.log('Usage: node scripts/create-mongo-migration.js <collection_name>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/create-mongo-migration.js users');
  console.log('  node scripts/create-mongo-migration.js products');
  console.log('  node scripts/create-mongo-migration.js orders');
  console.log('');
  console.log('This will create a MongoDB migration with schema validation.');
  process.exit(1);
}

// Validate collection name
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(collectionName)) {
  console.error('❌ Invalid collection name. Use only letters, numbers, and underscores.');
  process.exit(1);
}

// Create the migration template
createMongoMigrationTemplate(collectionName);

module.exports = { createMongoMigrationTemplate }; 