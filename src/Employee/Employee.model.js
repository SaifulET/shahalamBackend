const employeeSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  name: String,

  email: {
    type: String,
    required: true,
    unique: true, // VERY IMPORTANT
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  }, 
   phone: String,

  profileImage: String,

  joiningDate: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
});
