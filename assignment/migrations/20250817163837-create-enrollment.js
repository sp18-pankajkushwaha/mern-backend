'use strict';

/**
 * Migration: Create enrollment table
 * Database: PostgreSQL (Relational)
 * Naming Convention: snake_case columns
 * Generated: 2025-08-17T16:38:37.584Z
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enrollment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: 'Primary key for enrollment table'
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
      
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'course',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      enrollment_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status: {
        type: Sequelize.ENUM('Active', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Active'
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
    // await queryInterface.addIndex('enrollment', ['column_name'], {
    //   unique: true,
    //   name: 'enrollment_column_name_unique'
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('enrollment');
  }
};

/*
NEXT STEPS:
===========
1. Edit this file and add your columns between the marked lines
2. Run: npm run migrate
3. Run: npm run generate-model enrollment
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