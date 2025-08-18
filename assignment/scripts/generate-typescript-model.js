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
// Map PostgreSQL types to TypeScript types
function mapPostgresToTypeScript(pgType, columnName) {
  const typeMapping = {
    'character varying': 'string',
    'varchar': 'string',
    'text': 'string',
    'integer': 'number',
    'bigint': 'number',
    'smallint': 'number',
    'real': 'number',
    'double precision': 'number',
    'numeric': 'number',
    'decimal': 'number',
    'boolean': 'boolean',
    'timestamp with time zone': 'Date',
    'timestamp without time zone': 'Date',
    'date': 'Date',
    'time': 'string',
    'json': 'object',
    'jsonb': 'object',
    'uuid': 'string'
  };
  
  // Handle types with parameters like varchar(255)
  const baseType = pgType.split('(')[0];
  return typeMapping[baseType] || 'any';
}
// Map PostgreSQL types to Sequelize DataTypes
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
  
  const baseType = pgType.split('(')[0];
  return typeMapping[baseType] || 'STRING';
}
async function generateTypeScriptModel(tableName) {
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
    // Generate the TypeScript model
    const className = tableName; // Keep original table name for consistency
    const interfaceName = `${className}Attributes`;
    const creationInterfaceName = `${className}CreationAttributes`;
    
    // Build attributes interface
    let attributeInterface = `export interface ${interfaceName} {\n`;
    let optionalFields = [];
    
    columns.forEach(col => {
      const jsPropertyName = toCamelCase(col.column_name);
      const isOptional = col.is_nullable === 'YES' || col.column_default !== null || col.column_name === 'id';
      const tsType = mapPostgresToTypeScript(col.data_type, col.column_name);
      
      const optional = isOptional ? '?' : '';
      attributeInterface += `  ${jsPropertyName}${optional}: ${tsType};\n`;
      
      if (isOptional) {
        optionalFields.push(`"${jsPropertyName}"`);
      }
    });
    
    attributeInterface += `}`;
    
         // Generate main model content
     let modelContent = `import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
/**
 * ${className} Model
 * Auto-generated from table: ${tableName}
 * Generated: ${new Date().toISOString()}
 */
export interface ${interfaceName} {${columns.map(col => {
  const jsPropertyName = toCamelCase(col.column_name);
  const isOptional = col.is_nullable === 'YES' || col.column_default !== null || col.column_name === 'id';
  const tsType = mapPostgresToTypeScript(col.data_type, col.column_name);
  const optional = isOptional ? '?' : '';
  return `\n  ${jsPropertyName}${optional}: ${tsType};`;
}).join('')}
}
export type ${className}Pk = "id";
export type ${className}Id = ${className}[${className}Pk];
export type ${className}OptionalAttributes = ${optionalFields.join(' | ') || '"id"'};
export type ${creationInterfaceName} = Optional<${interfaceName}, ${className}OptionalAttributes>;
export class ${className} extends Model<${interfaceName}, ${creationInterfaceName}> implements ${interfaceName} {`;
    // Add property declarations
    columns.forEach(col => {
      const jsPropertyName = toCamelCase(col.column_name);
      const isOptional = col.is_nullable === 'YES' || col.column_default !== null || col.column_name === 'id';
      const tsType = mapPostgresToTypeScript(col.data_type, col.column_name);
      
      const optional = isOptional ? '?' : '!';
      modelContent += `\n  ${jsPropertyName}${optional}: ${tsType};`;
    });
    // Add association placeholders
    modelContent += `\n
  // Association methods will be added here
  // Example:
  // user!: User;
  // getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  // setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  // createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;
  static initModel(sequelize: Sequelize.Sequelize): typeof ${className} {
    return ${className}.init({`;
    // Add field definitions
    columns.forEach((col, index) => {
      const jsPropertyName = toCamelCase(col.column_name);
      const sequelizeType = mapPostgresToSequelize(col.data_type);
      const isId = col.column_name === 'id';
      
      modelContent += `\n      ${jsPropertyName}: {`;
      
      if (isId) {
        modelContent += `\n        autoIncrement: true,`;
        modelContent += `\n        type: DataTypes.${sequelizeType},`;
        modelContent += `\n        allowNull: false,`;
        modelContent += `\n        primaryKey: true`;
      } else {
        modelContent += `\n        type: DataTypes.${sequelizeType}`;
        
        if (col.character_maximum_length && sequelizeType === 'STRING') {
          modelContent += `(${col.character_maximum_length})`;
        }
        
        modelContent += `,\n        allowNull: ${col.is_nullable === 'YES' ? 'true' : 'false'}`;
        
        if (uniqueColumns.has(col.column_name)) {
          modelContent += `,\n        unique: true`;
        }
        
        if (col.column_default && !col.column_default.includes('nextval')) {
          let defaultValue = col.column_default;
          if (defaultValue.includes('CURRENT_TIMESTAMP')) {
            modelContent += `,\n        defaultValue: Sequelize.NOW`;
          } else if (defaultValue === 'true' || defaultValue === 'false') {
            modelContent += `,\n        defaultValue: ${defaultValue}`;
          } else if (!isNaN(defaultValue)) {
            modelContent += `,\n        defaultValue: ${defaultValue}`;
          } else {
            // String default, remove quotes
            defaultValue = defaultValue.replace(/'/g, '');
            modelContent += `,\n        defaultValue: "${defaultValue}"`;
          }
        }
        
        if (foreignKeyMap.has(col.column_name)) {
          const fk = foreignKeyMap.get(col.column_name);
          modelContent += `,\n        references: {`;
          modelContent += `\n          model: '${fk.foreign_table_name}',`;
          modelContent += `\n          key: '${fk.foreign_column_name}'`;
          modelContent += `\n        }`;
        }
      }
      
      modelContent += `\n      }${index < columns.length - 1 ? ',' : ''}`;
    });
    // Complete the initModel method
    modelContent += `\n    }, {
      sequelize,
      tableName: '${tableName}',
      timestamps: false,`;
    // Add indexes if any
    if (uniqueColumns.size > 0 || foreignKeys.length > 0) {
      modelContent += `\n      indexes: [`;
      
      // Primary key index
      modelContent += `\n        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" }
          ]
        }`;
      
      // Unique indexes
      uniqueColumns.forEach(colName => {
        if (colName !== 'id') {
          modelContent += `,\n        {
          name: "${colName}",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "${colName}" }
          ]
        }`;
        }
      });
      
      modelContent += `\n      ]`;
    }
    modelContent += `\n    });
  }
     static associate(models: any) {
     const ${toPascalCase(className)}: typeof ${className} = models.${className};
     
     // Define associations here
     // Example:
     // ${toPascalCase(className)}.belongsTo(models.User, { foreignKey: "userId" });
     // models.User.hasMany(${className}, { foreignKey: "userId" });
   }
 }
 
 export default ${className};`;
    // Write the model file
    const modelsDir = path.join(process.cwd(), 'src', 'orm', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }
    
    const fileName = `${className}.ts`;
    const filePath = path.join(modelsDir, fileName);
    fs.writeFileSync(filePath, modelContent);
    
    console.log(`✅ TypeScript model generated: src/orm/models/${fileName}`);
    console.log(`📝 Class name: ${className}`);
    console.log(`🔗 Table: ${tableName}`);
    console.log('');
    console.log('🎯 Model features:');
    console.log(`• ${columns.length} typed properties`);
    console.log(`• ${foreignKeys.length} foreign key relationships`);
    console.log(`• ${uniqueColumns.size} unique constraints`);
    console.log('• TypeScript interfaces for type safety');
    console.log('• Sequelize association methods');
    console.log('• Proper Optional types for creation');
    
    return { fileName, filePath, className, tableName };
    
  } catch (error) {
    console.error('❌ Error generating TypeScript model:', error.message);
    throw error;
  }
}
// Command line interface
const args = process.argv.slice(2);
const tableName = args[0];
if (!tableName) {
  console.log('🎯 TypeScript Sequelize Model Generator');
  console.log('======================================');
  console.log('Usage: node scripts/generate-typescript-model.js <table_name>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/generate-typescript-model.js users');
  console.log('  node scripts/generate-typescript-model.js products');
  console.log('  node scripts/generate-typescript-model.js club_chat_txn');
  console.log('');
  console.log('This will generate a fully-typed TypeScript Sequelize model.');
  process.exit(1);
}
// Generate the model
generateTypeScriptModel(tableName)
  .then(() => {
    console.log('\n🎉 TypeScript model generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ TypeScript model generation failed:', error.message);
    process.exit(1);
  });
module.exports = { generateTypeScriptModel }; 