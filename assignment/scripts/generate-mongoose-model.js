const fs = require('fs');
const path = require('path');

// Utility function to convert snake_case to camelCase
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Utility function to convert to PascalCase
function toPascalCase(str) {
  return str.replace(/(^|_)([a-z])/g, (match, prefix, letter) => letter.toUpperCase());
}

function generateMongooseModel(collectionName) {
  // Convert collection name to model name (PascalCase, singular)
  const className = toPascalCase(collectionName.replace(/s$/, '')); // Remove trailing 's' for singular
  
  const modelTemplate = `const mongoose = require('mongoose');

/**
 * ${className} Mongoose Model
 * Collection: ${collectionName}
 * Generated: ${new Date().toISOString()}
 */

const ${className.toLowerCase()}Schema = new mongoose.Schema(
  {
    // TODO: Add your schema fields here
    // Example fields:
    /*
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot exceed 150'],
      validate: {
        validator: Number.isInteger,
        message: 'Age must be an integer'
      }
    },
    
    isActive: {
      type: Boolean,
      default: true
    },
    
    tags: {
      type: [String],
      default: []
    },
    
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    
    // Reference to another model
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // }
    */
  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: '${collectionName}', // Explicit collection name
    
    // JSON transformation
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    
    // Object transformation
    toObject: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes
// Add your indexes here for better query performance
// Example:
// ${className.toLowerCase()}Schema.index({ email: 1 }, { unique: true });
// ${className.toLowerCase()}Schema.index({ createdAt: -1 });
// ${className.toLowerCase()}Schema.index({ name: 'text', description: 'text' }); // Text search

// Instance methods
${className.toLowerCase()}Schema.methods = {
  /**
   * Get the full name or display name
   */
  getDisplayName() {
    return this.name || this.email || this._id.toString();
  },

  /**
   * Convert to a safe object (remove sensitive fields)
   */
  toSafeObject() {
    const obj = this.toObject();
    // Remove sensitive fields
    // delete obj.password;
    // delete obj.secretKey;
    return obj;
  },

  /**
   * Check if document is recently created (within last 24 hours)
   */
  isRecentlyCreated() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.createdAt > oneDayAgo;
  }
};

// Static methods
${className.toLowerCase()}Schema.statics = {
  /**
   * Find active documents
   */
  findActive() {
    return this.find({ isActive: true });
  },

  /**
   * Find by name (case-insensitive)
   */
  findByName(name) {
    return this.findOne({ 
      name: new RegExp(name, 'i') 
    });
  },

  /**
   * Get documents created in the last N days
   */
  findRecentlyCreated(days = 7) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.find({ 
      createdAt: { $gte: cutoffDate } 
    }).sort({ createdAt: -1 });
  }
};

// Virtuals
// Example virtual field
${className.toLowerCase()}Schema.virtual('url').get(function() {
  return \`/api/${collectionName}/\${this._id}\`;
});

// Middleware (hooks)
// Pre-save middleware
${className.toLowerCase()}Schema.pre('save', function(next) {
  // Example: Auto-generate slug, hash passwords, etc.
  // if (this.isModified('name')) {
  //   this.slug = this.name.toLowerCase().replace(/\\s+/g, '-');
  // }
  next();
});

// Post-save middleware
${className.toLowerCase()}Schema.post('save', function(doc) {
  console.log(\`${className} document saved: \${doc._id}\`);
});

// Pre-remove middleware
${className.toLowerCase()}Schema.pre('deleteOne', { document: true }, function(next) {
  console.log(\`Removing ${className}: \${this._id}\`);
  // Cleanup related documents here
  next();
});

// Export the model
const ${className} = mongoose.model('${className}', ${className.toLowerCase()}Schema);

module.exports = ${className};

/*
MONGOOSE FIELD TYPES:
====================
String          // Text
Number          // Integer or decimal
Boolean         // true/false
Date            // Date/timestamp
ObjectId        // MongoDB ObjectId
Array           // Array of values
Mixed           // Any type
Buffer          // Binary data
Decimal128      // High precision decimals
Map             // Key-value pairs

COMMON VALIDATORS:
=================
required: true                    // Field is required
unique: true                      // Must be unique
default: 'value'                  // Default value
min: 0, max: 100                 // Number range
minlength: 2, maxlength: 50      // String length
lowercase: true, uppercase: true  // String transformation
trim: true                       // Remove whitespace
match: /regex/                   // Regex validation
enum: ['opt1', 'opt2']          // Allowed values
validate: { validator: fn }      // Custom validation

SCHEMA OPTIONS:
==============
timestamps: true        // Auto createdAt/updatedAt
collection: 'name'     // Collection name
strict: true           // Strict schema
versionKey: false      // Disable __v field
*/`;

  // Create the models directory
  const modelsDir = path.join(process.cwd(), 'src', 'odm', 'models');
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  const fileName = `${className}.js`;
  const filePath = path.join(modelsDir, fileName);

  // Check if model already exists
  if (fs.existsSync(filePath)) {
    console.error(`❌ Error: Model '${fileName}' already exists!`);
    console.log(`📍 Path: ${filePath}`);
    process.exit(1);
  }

  fs.writeFileSync(filePath, modelTemplate);

  console.log(`✅ Mongoose model generated: src/odm/models/${fileName}`);
  console.log(`📝 Class name: ${className}`);
  console.log(`🔗 Collection: ${collectionName}`);
  console.log('');
  console.log('🎯 Model features:');
  console.log('• Schema validation with examples');
  console.log('• Instance and static methods');
  console.log('• Virtual fields');
  console.log('• Pre/post middleware hooks');
  console.log('• Automatic timestamps');
  console.log('• JSON transformation');
  console.log('');
  console.log('📝 Next steps:');
  console.log(`1. Edit src/odm/models/${fileName} and add your schema fields`);
  console.log('2. Add indexes for better query performance');
  console.log('3. Customize validation rules and methods');
  console.log('4. Import and use in your controllers');
  console.log('');
  console.log('💡 Usage example:');
  console.log(`const ${className} = require('./src/odm/models/${className}');`);
  console.log(`const doc = await ${className}.create({ name: 'Example' });`);

  return { fileName, filePath, className, collectionName };
}

// Command line interface
const args = process.argv.slice(2);
const collectionName = args[0];

if (!collectionName) {
  console.log('🎯 Mongoose Model Generator');
  console.log('===========================');
  console.log('Usage: node scripts/generate-mongoose-model.js <collection_name>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/generate-mongoose-model.js users');
  console.log('  node scripts/generate-mongoose-model.js products');
  console.log('  node scripts/generate-mongoose-model.js orders');
  console.log('');
  console.log('This will create a comprehensive Mongoose model with:');
  console.log('• Schema validation');
  console.log('• Instance/static methods');
  console.log('• Middleware hooks');
  console.log('• Virtual fields');
  process.exit(1);
}

// Validate collection name
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(collectionName)) {
  console.error('❌ Invalid collection name. Use only letters, numbers, and underscores.');
  process.exit(1);
}

// Generate the model
try {
  generateMongooseModel(collectionName);
} catch (error) {
  console.error('❌ Error generating Mongoose model:', error.message);
  process.exit(1);
}

module.exports = { generateMongooseModel }; 