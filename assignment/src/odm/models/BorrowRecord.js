const mongoose = require('mongoose');

/**
 * BorrowRecord Mongoose Model
 * Collection: borrowRecord
 * Generated: 2025-08-18T05:56:23.677Z
 */

const borrowRecordSchema = new mongoose.Schema(
  {
    member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Borrowed', 'Returned', 'Overdue'],
    default: 'Borrowed'
  }
  },
  {
    // Schema options
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'borrowRecord', // Explicit collection name
    
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

borrowRecordSchema.index(
  { member: 1, book: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['Borrowed'] } } }
);

borrowRecordSchema.pre('save', function(next) {
  if (this.status === 'Returned' && this.returnDate && this.borrowDate) {
    const diff = (this.returnDate - this.borrowDate) / (1000 * 60 * 60 * 24); 
    if (diff > 14) {
      this.status = 'Overdue';
    }
  }
  next();
});

// Indexes
// Add your indexes here for better query performance
// Example:
// borrowrecordSchema.index({ email: 1 }, { unique: true });
// borrowrecordSchema.index({ createdAt: -1 });
// borrowrecordSchema.index({ name: 'text', description: 'text' }); // Text search

// Instance methods
borrowRecordSchema.methods = {
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
borrowRecordSchema.statics = {
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
borrowRecordSchema.virtual('url').get(function() {
  return `/api/borrowRecord/${this._id}`;
});

// Middleware (hooks)
// Pre-save middleware
borrowRecordSchema.pre('save', function(next) {
  // Example: Auto-generate slug, hash passwords, etc.
  // if (this.isModified('name')) {
  //   this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  // }
  next();
});

// Post-save middleware
borrowRecordSchema.post('save', function(doc) {
  console.log(`BorrowRecord document saved: ${doc._id}`);
});

borrowRecordSchema.post("save", async function (doc, next) {
  if (doc.status === "Borrowed") {
    await mongoose.model("Book").updateOne({ _id: doc.book }, { $inc: { availableCopies: -1 } });
  }
  next();
});

// Pre-remove middleware
borrowRecordSchema.pre('deleteOne', { document: true }, function(next) {
  console.log(`Removing BorrowRecord: ${this._id}`);
  // Cleanup related documents here
  next();
});

borrowRecordSchema.methods.returnBook = async function () {
  if (this.status === "Borrowed") {
    this.returnDate = new Date();
    const diffDays = Math.ceil((this.returnDate - this.borrowDate) / (1000 * 60 * 60 * 24));
    this.status = diffDays > 14 ? "Overdue" : "Returned";

    await mongoose.model("Book").updateOne({ _id: this.book }, { $inc: { availableCopies: 1 } });
    return this.save();
  }
};

// Export the model
const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);

module.exports = BorrowRecord;

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