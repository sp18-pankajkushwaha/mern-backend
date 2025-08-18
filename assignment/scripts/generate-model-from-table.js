const fs = require('fs');
const path = require('path');
const { QueryTypes } = require('sequelize');

// Import database connection
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Load database configuration from config.json
const config = require('../config/config.json');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: false // Disable logging for cleaner output
});

// Utility function to convert snake_case to camelCase
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Utility function to convert snake_case to PascalCase
function toPascalCase(str) {
  return str.replace(/(^|_)([a-z])/g, (match, prefix, letter) => letter.toUpperCase());
}

// Map PostgreSQL types to Sequelize types
function mapPostgresToSequelize(pgType) {
  const typeMapping = {
    'character varying': 'STRING',
    'varchar': 'STRING',
    'text': 'TEXT',
    'integer': 'INTEGER',
    'bigint': 'BIGINT',
    'smallint': 'INTEGER',
    'real': 'FLOAT',
    'double precision': 'DOUBLE',
    'numeric': 'DECIMAL',
    'decimal': 'DECIMAL',
    'boolean': 'BOOLEAN',
    'timestamp with time zone': 'DATE',
    'timestamp without time zone': 'DATE',
    'date': 'DATEONLY',
    'time': 'TIME',
    'json': 'JSON',
    'jsonb': 'JSONB',
    'uuid': 'UUID'
  };
  
  // Handle types with parameters like varchar(255)
  const baseType = pgType.split('(')[0];
  return typeMapping[baseType] || 'STRING';
}

async function generateModelFromTable(tableName) {
  try {
    console.log(`🔍 Analyzing table: ${tableName}`);
    
    // Get table schema information
    const columns = await sequelize.query(`
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default,
        ordinal_position
      FROM information_schema.columns 
      WHERE table_name = :tableName 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `, {
      replacements: { tableName },
      type: QueryTypes.SELECT
    });

    if (columns.length === 0) {
      throw new Error(`Table '${tableName}' not found in database`);
    }

    // Get foreign key information
    const foreignKeys = await sequelize.query(`
      SELECT
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = :tableName;
    `, {
      replacements: { tableName },
      type: QueryTypes.SELECT
    });

    // Get unique constraints
    const uniqueConstraints = await sequelize.query(`
      SELECT column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu 
        ON tc.constraint_name = ccu.constraint_name
      WHERE tc.constraint_type = 'UNIQUE' 
        AND tc.table_name = :tableName;
    `, {
      replacements: { tableName },
      type: QueryTypes.SELECT
    });

    const uniqueColumns = new Set(uniqueConstraints.map(uc => uc.column_name));
    const foreignKeyMap = new Map(foreignKeys.map(fk => [fk.column_name, fk]));

    console.log(`✅ Found ${columns.length} columns in table ${tableName}`);

    // Generate the model
    const className = toPascalCase(tableName.replace(/s$/, '')); // Remove trailing 's' for singular
    
    let modelContent = `const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * ${className} Model
 * Auto-generated from table: ${tableName}
 * Generated: ${new Date().toISOString()}
 */

class ${className} extends Model {`;

    // Add property declarations
    columns.forEach(col => {
      const jsPropertyName = toCamelCase(col.column_name);
      const isRequired = col.is_nullable === 'NO';
      const isId = col.column_name === 'id';
      
      let tsType = 'any';
      switch (mapPostgresToSequelize(col.data_type)) {
        case 'STRING':
        case 'TEXT':
          tsType = 'string';
          break;
        case 'INTEGER':
        case 'BIGINT':
        case 'FLOAT':
        case 'DECIMAL':
          tsType = 'number';
          break;
        case 'BOOLEAN':
          tsType = 'boolean';
          break;
        case 'DATE':
        case 'DATEONLY':
          tsType = 'Date';
          break;
      }
      
      const optional = isRequired && !isId ? '!' : '?';
      const readonly = (col.column_name === 'created_at' || col.column_name === 'updated_at') ? 'readonly ' : '';
      
      modelContent += `\n  public ${readonly}${jsPropertyName}${optional}: ${tsType};`;
    });

    modelContent += `\n
  // Instance methods
  public getId(): number {
    return this.id;
  }

  public toJSON(): object {
    const values = Object.assign({}, this.get());
    return values;
  }
}

// Initialize the model
${className}.init(
  {`;

    // Add field definitions
    columns.forEach((col, index) => {
      const jsPropertyName = toCamelCase(col.column_name);
      const sequelizeType = mapPostgresToSequelize(col.data_type);
      const isId = col.column_name === 'id';
      
      modelContent += `\n    ${jsPropertyName}: {`;
      
      if (isId) {
        modelContent += `\n      type: DataTypes.${sequelizeType},`;
        modelContent += `\n      autoIncrement: true,`;
        modelContent += `\n      primaryKey: true,`;
      } else {
        modelContent += `\n      type: DataTypes.${sequelizeType},`;
        modelContent += `\n      field: '${col.column_name}',  // Maps to snake_case column`;
        
        if (col.is_nullable === 'NO') {
          modelContent += `\n      allowNull: false,`;
        }
        
        if (uniqueColumns.has(col.column_name)) {
          modelContent += `\n      unique: true,`;
        }
        
        if (col.column_default && !col.column_default.includes('nextval')) {
          let defaultValue = col.column_default;
          if (defaultValue.includes('CURRENT_TIMESTAMP')) {
            modelContent += `\n      defaultValue: DataTypes.NOW,`;
          } else if (defaultValue === 'true' || defaultValue === 'false') {
            modelContent += `\n      defaultValue: ${defaultValue},`;
          } else if (!isNaN(defaultValue)) {
            modelContent += `\n      defaultValue: ${defaultValue},`;
          } else {
            // String default, remove quotes
            defaultValue = defaultValue.replace(/'/g, '');
            modelContent += `\n      defaultValue: '${defaultValue}',`;
          }
        }
        
        if (foreignKeyMap.has(col.column_name)) {
          const fk = foreignKeyMap.get(col.column_name);
          modelContent += `\n      references: {`;
          modelContent += `\n        model: '${fk.foreign_table_name}',`;
          modelContent += `\n        key: '${fk.foreign_column_name}',`;
          modelContent += `\n      },`;
          modelContent += `\n      onUpdate: 'CASCADE',`;
          modelContent += `\n      onDelete: 'CASCADE',`;
        }
      }
      
      modelContent += `\n    }${index < columns.length - 1 ? ',' : ''}`;
    });

    // Check if timestamps exist
    const hasTimestamps = columns.some(col => col.column_name === 'created_at' || col.column_name === 'updated_at');

    modelContent += `\n  },
  {
    sequelize,
    modelName: '${className}',
    tableName: '${tableName}',
    timestamps: ${hasTimestamps},`;

    if (hasTimestamps) {
      modelContent += `\n    underscored: true,  // Use snake_case for timestamps`;
    }

    modelContent += `\n    indexes: [
      // Indexes will be automatically detected from database
    ]
  }
);

module.exports = ${className};`;

    // Write the model file
    const modelsDir = path.join(process.cwd(), 'src', 'orm', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }
    
    const fileName = `${className}.js`;
    const filePath = path.join(modelsDir, fileName);
    fs.writeFileSync(filePath, modelContent);
    
    console.log(`✅ Model generated: src/orm/models/${fileName}`);
    console.log(`📝 Class name: ${className}`);
    console.log(`🔗 Table: ${tableName}`);
    console.log('');
    console.log('🎯 Model features:');
    console.log(`• ${columns.length} properties mapped from database columns`);
    console.log(`• ${foreignKeys.length} foreign key relationships detected`);
    console.log(`• ${uniqueColumns.size} unique constraints detected`);
    console.log(`• Timestamps: ${hasTimestamps ? 'Yes' : 'No'}`);
    console.log(`• Field mapping: camelCase properties ↔ snake_case columns`);
    
    return { fileName, filePath, className, tableName };
    
  } catch (error) {
    console.error('❌ Error generating model:', error.message);
    throw error;
  }
}

// Command line interface
const args = process.argv.slice(2);
const tableName = args[0];

if (!tableName) {
  console.log('🎯 Model Generator from Database Table');
  console.log('=====================================');
  console.log('Usage: node scripts/generate-model-from-table.js <table_name>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/generate-model-from-table.js schools');
  console.log('  node scripts/generate-model-from-table.js users');
  console.log('  node scripts/generate-model-from-table.js products');
  console.log('');
  console.log('Prerequisites:');
  console.log('• Table must exist in the database');
  console.log('• Database connection must be configured');
  console.log('• Run migrations first: npm run migrate');
  process.exit(1);
}

// Generate the model
generateModelFromTable(tableName)
  .then(() => {
    console.log('\n🎉 Model generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Model generation failed:', error.message);
    process.exit(1);
  });

module.exports = { generateModelFromTable }; 