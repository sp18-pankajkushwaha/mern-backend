'use strict';

/**
 * Migration: Create students table
 * Database: PostgreSQL (Relational)
 * Naming Convention: snake_case columns
 * Generated: 2025-08-17T16:37:41.847Z
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'Primary key for students table'
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
      
       name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Full name of student'
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
        comment: 'Unique email of student'
      },
      password: {
        type: Sequelize.STRING(32),
        allowNull: false,
        comment: 'Encrypted password'
      },
      profile_image: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Profile image URL'
      },
      address_id: {
        type: Sequelize.INTEGER,
        unique: true, 
        allowNull: true,
        references: {
          model: 'address',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        comment: 'Foreign key - references addresses table'
      },
      
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
    // await queryInterface.addIndex('students', ['column_name'], {
    //   unique: true,
    //   name: 'students_column_name_unique'
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('students');
  }
};

/*
NEXT STEPS:
===========
1. Edit this file and add your columns between the marked lines
2. Run: npm run migrate
3. Run: npm run generate-model students
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
*/