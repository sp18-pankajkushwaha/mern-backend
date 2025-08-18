const mongoose = require('mongoose');

/**
 * Book Mongoose Model
 * Collection: book
 * Generated: 2025-08-18T05:56:07.248Z
 */

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true
    },
    ISBN: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    availableCopies: {
      type: Number,
      required: [true, 'Available copies required'],
      min: [0, 'Available copies cannot be negative']
    }

  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'book', // Explicit collection name
    
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
// bookSchema.index({ email: 1 }, { unique: true });
// bookSchema.index({ createdAt: -1 });
// bookSchema.index({ name: 'text', description: 'text' }); // Text search

// Instance methods
bookSchema.methods = {
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
bookSchema.statics = {
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

bookSchema.index({ ISBN: 1 }, { unique: true });

// Virtuals
// Example virtual field
bookSchema.virtual('url').get(function() {
  return `/api/book/${this._id}`;
});

// Middleware (hooks)
// Pre-save middleware
bookSchema.pre('save', function(next) {
  // Example: Auto-generate slug, hash passwords, etc.
  // if (this.isModified('name')) {
  //   this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  // }
  next();
});

// Post-save middleware
bookSchema.post('save', function(doc) {
  console.log(`Book document saved: ${doc._id}`);
});

// Pre-remove middleware
bookSchema.pre('deleteOne', { document: true }, function(next) {
  console.log(`Removing Book: ${this._id}`);
  // Cleanup related documents here
  next();
});

// Export the model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

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
*/