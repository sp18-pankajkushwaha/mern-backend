const fs = require('fs');
const path = require('path');

// Utility function to convert camelCase to snake_case
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function createMigrationTemplate(tableName) {
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
  const fileName = `${timestamp}-create-${tableName}.js`;
  
  const migrationTemplate = `'use strict';

/**
 * Migration: Create ${tableName} table
 * Database: PostgreSQL (Relational)
 * Naming Convention: snake_case columns
 * Generated: ${new Date().toISOString()}
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('${tableName}', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'Primary key for ${tableName} table'
      },
      
      // TODO: Add your columns here
      // Example:
      // column_name: {
      //   type: Sequelize.STRING,           // STRING, INTEGER, BOOLEAN, TEXT, DATE, etc.
      //   allowNull: false,                 // true or false
      //   unique: false,                    // true or false
      //   defaultValue: null,               // Any default value
      //   comment: 'Description of field'
      // },
      
      // Add your columns below this line:
      // =======================================
      
      
      
      // =======================================
      // Timestamps (created_at, updated_at)
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record creation timestamp'
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record last update timestamp'
      }
    });
    
    // TODO: Add indexes here if needed
    // Example:
    // await queryInterface.addIndex('${tableName}', ['column_name'], {
    //   unique: true,
    //   name: '${tableName}_column_name_unique'
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('${tableName}');
  }
};

/*
NEXT STEPS:
===========
1. Edit this file and add your columns between the marked lines
2. Run: npm run migrate
3. Run: npm run generate-model ${tableName}
   (This will auto-generate the Sequelize model based on the migrated table)

COLUMN TYPES REFERENCE:
======================
Sequelize.STRING          // VARCHAR(255)
Sequelize.STRING(100)     // VARCHAR(100)
Sequelize.TEXT            // TEXT
Sequelize.INTEGER         // INTEGER
Sequelize.BIGINT          // BIGINT
Sequelize.FLOAT           // FLOAT
Sequelize.DECIMAL(10,2)   // DECIMAL(10,2)
Sequelize.BOOLEAN         // BOOLEAN
Sequelize.DATE            // TIMESTAMP
Sequelize.DATEONLY        // DATE (YYYY-MM-DD)
Sequelize.JSON            // JSON (PostgreSQL)

COMMON OPTIONS:
===============
allowNull: false          // NOT NULL
unique: true              // UNIQUE constraint
defaultValue: 'value'     // DEFAULT value
references: {             // Foreign key
  model: 'other_table',
  key: 'id'
}
*/`;

  // Create migrations directory if it doesn't exist
  const migrationsDir = path.join(process.cwd(), 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  const filePath = path.join(migrationsDir, fileName);
  fs.writeFileSync(filePath, migrationTemplate);
  
  console.log(`✅ Migration template created: ${fileName}`);
  console.log(`📝 File location: migrations/${fileName}`);
  console.log('');
  console.log('🔧 Next steps:');
  console.log(`1. Edit migrations/${fileName} and add your columns`);
  console.log(`2. Run: npm run migrate`);
  console.log(`3. Run: npm run generate-model ${tableName}`);
  console.log('');
  console.log('💡 The migration file includes examples and documentation!');
  
  return { fileName, filePath };
}

// Command line interface
const args = process.argv.slice(2);
const tableName = args[0];

if (!tableName) {
  console.log('🎯 Migration Template Generator');
  console.log('==============================');
  console.log('Usage: node scripts/create-migration.js <table_name>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/create-migration.js schools');
  console.log('  node scripts/create-migration.js users');
  console.log('  node scripts/create-migration.js products');
  console.log('');
  console.log('This will create a migration template that you can customize.');
  process.exit(1);
}

// Validate table name
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
  console.error('❌ Invalid table name. Use only letters, numbers, and underscores.');
  process.exit(1);
}

// Create the migration template
createMigrationTemplate(tableName);

module.exports = { createMigrationTemplate }; 