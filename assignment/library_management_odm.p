// Library Management System using Mongoose ODM with MongoDB
// Implemented: One-to-One (Member-Profile), One-to-Many (Member-BorrowRecord), unique constraints (email, phone, ISBN),
// validations (price >= 0, copies >= 0), hooks 

//Member model
const memberSchema = new mongoose.Schema(
  {
    name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email address'
    ]
  },
  membershipDate: {
    type: Date,
    default: Date.now
  },
  membershipStatus: {
    type: String,
    enum: ['Active', 'Expired', 'Suspended'],
    default: 'Active'
  }
  });

//Unique email
memberSchema.index({ email: 1 }, { unique: true });

// Hook: 

findRecentlyCreated(days = 7) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.find({ 
      createdAt: { $gte: cutoffDate } 
    }).sort({ createdAt: -1 });
  };


//Profile model
const profileSchema = new mongoose.Schema(
  {
    member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    unique: true, // Enforces one-to-one (one profile per member)
    required: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  }
  }
);

//unique fields
profileSchema.index({ phone: 1 }, { unique: true });
profileSchema.index({ member: 1 }, { unique: true });

const Profile = mongoose.model("Profile", profileSchema);

//Book Model
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
  }
);


//Get documents created in the last N days

  findRecentlyCreated(days = 7) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.find({ 
      createdAt: { $gte: cutoffDate } 
    }).sort({ createdAt: -1 });
  };

//Unique fields
bookSchema.index({ ISBN: 1 }, { unique: true });

const Book = mongoose.model("Book", bookSchema);

//BorrowRecord Model 
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
  });

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

// Hook: reduce availableCopies after borrow

borrowRecordSchema.post("save", async function (doc, next) {
  if (doc.status === "Borrowed") {
    await mongoose.model("Book").updateOne({ _id: doc.book }, { $inc: { availableCopies: -1 } });
  }
  next();
});

// Hooked Method: return book logic
borrowRecordSchema.methods.returnBook = async function () {
  if (this.status === "Borrowed") {
    this.returnDate = new Date();
    const diffDays = Math.ceil((this.returnDate - this.borrowDate) / (1000 * 60 * 60 * 24));
    this.status = diffDays > 14 ? "Overdue" : "Returned";

    await mongoose.model("Book").updateOne({ _id: this.book }, { $inc: { availableCopies: 1 } });
    return this.save();
  }
};

const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);

