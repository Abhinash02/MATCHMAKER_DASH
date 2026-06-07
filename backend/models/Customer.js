const mongoose = require('mongoose');

const SentMatchSchema = new mongoose.Schema({
  matchedProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  matchedName: String,
  score: Number,
  label: String,
  sentAt: { type: Date, default: Date.now },
  introEmail: String,
});

const CustomerSchema = new mongoose.Schema({
  // Basic
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  dateOfBirth: Date,
  // Contact
  email: String,
  phone: String,
  // Location
  country: { type: String, default: 'India' },
  city: String,
  // Physical
  height: Number, // cm
  // Education
  undergraduateCollege: String,
  degree: String,
  educationTier: { type: String, enum: ['premium', 'good', 'average'], default: 'good' },
  // Career
  currentCompany: String,
  designation: String,
  income: Number, // annual INR
  // Marital
  maritalStatus: { type: String, enum: ['never_married', 'divorced', 'widowed', 'separated'], default: 'never_married' },
  wantKids: { type: String, enum: ['yes', 'no', 'maybe'], default: 'maybe' },
  haveKids: { type: String, enum: ['yes', 'no'], default: 'no' },
  // Lifestyle
  openToRelocate: { type: String, enum: ['yes', 'no', 'maybe'], default: 'maybe' },
  openToPets: { type: String, enum: ['yes', 'no', 'maybe'], default: 'maybe' },
  diet: { type: String, enum: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'eggetarian'], default: 'non-vegetarian' },
  smoking: { type: String, enum: ['never', 'occasionally', 'regularly'], default: 'never' },
  drinking: { type: String, enum: ['never', 'occasionally', 'regularly'], default: 'never' },
  // Cultural
  religion: String,
  caste: String,
  manglik: { type: String, enum: ['yes', 'no', 'dont_know'], default: 'dont_know' },
  familyType: { type: String, enum: ['joint', 'nuclear', 'flexible'], default: 'nuclear' },
  motherTongue: String,
  // Misc
  languagesKnown: [String],
  hobbies: [String],
  siblings: { type: Number, default: 0 },
  aboutMe: String,
  partnerExpectations: String,
  // Profile meta
  profileType: { type: String, enum: ['client', 'pool'], default: 'client' },
  status: { type: String, enum: ['active', 'pending', 'matched', 'inactive'], default: 'active' },
  matchesSent: { type: Number, default: 0 },
  sentMatches: [SentMatchSchema],
  profilePicture: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

CustomerSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const diff = Date.now() - new Date(this.dateOfBirth).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

CustomerSchema.set('toJSON', { virtuals: true });
CustomerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
