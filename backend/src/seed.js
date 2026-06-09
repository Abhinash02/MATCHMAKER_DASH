/**
 * TDC Matchmaker — Database Seed Script
 * Run from the backend directory: npm run seed
 *
 * Seeds:
 *  - 2 staff users (admin + matchmaker)
 *  - 50 pool profiles (25 male + 25 female)
 *
 * SAFE: Skips existing users, skips if pool already has 100+ profiles.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Inline Schemas (avoids circular deps) ────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'matchmaker'], default: 'matchmaker' },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const SentMatchSchema = new mongoose.Schema({
  matchedProfileId: mongoose.Schema.Types.ObjectId,
  matchedName: String, score: Number, label: String,
  sentAt: { type: Date, default: Date.now }, introEmail: String,
});

const CustomerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  gender:    { type: String, enum: ['male', 'female', 'other'], required: true },
  dateOfBirth: Date, country: { type: String, default: 'India' },
  city: String, state: String, height: Number,
  email: String, phone: String,
  undergraduateCollege: String, degree: String,
  educationTier: { type: String, enum: ['premium', 'good', 'average'], default: 'good' },
  currentCompany: String, designation: String, income: Number,
  maritalStatus: { type: String, default: 'never_married' },
  wantKids:       { type: String, enum: ['yes', 'no', 'maybe'], default: 'maybe' },
  haveKids:       { type: String, enum: ['yes', 'no'], default: 'no' },
  openToRelocate: { type: String, enum: ['yes', 'no', 'maybe'], default: 'maybe' },
  openToPets:     { type: String, enum: ['yes', 'no', 'maybe'], default: 'maybe' },
  diet:           { type: String, default: 'non-vegetarian' },
  smoking:        { type: String, default: 'never' },
  drinking:       { type: String, default: 'never' },
  religion: String, caste: String,
  manglik:    { type: String, default: 'dont_know' },
  familyType: { type: String, enum: ['joint', 'nuclear', 'flexible'], default: 'nuclear' },
  motherTongue: String, languagesKnown: [String], hobbies: [String],
  siblings: { type: Number, default: 0 },
  aboutMe: String, partnerExpectations: String,
  profileType: { type: String, enum: ['client', 'pool'], default: 'pool' },
  status:      { type: String, enum: ['active', 'pending', 'matched', 'inactive'], default: 'active' },
  matchesSent: { type: Number, default: 0 },
  sentMatches: [SentMatchSchema],
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────

const MALE_NAMES = [
  'Aarav','Aditya','Amit','Ankit','Arjun','Gaurav','Harish','Jatin','Kabir',
  'Karan','Kartik','Kunwar','Manish','Nikhil','Piyush','Rahul','Ritesh',
  'Rohan','Sanjay','Saurabh','Varun','Vikram','Yash','Dev','Abhishek'
];

const FEMALE_NAMES = [
  'Aanya','Anjali','Bhavna','Deepa','Divya','Esha','Gauri','Isha','Ishita',
  'Jyoti','Kiran','Kriti','Lata','Meera','Mona','Neha','Nisha','Payal',
  'Pooja','Radhika','Riya','Shreya','Sneha','Tanvi','Tanya'
];

const LAST_NAMES = [
  'Agarwal','Banerjee','Bhasin','Chatterjee','Chawla','Das','Gill','Gupta',
  'Iyer','Joshi','Kapoor','Kumar','Malhotra','Mehta','Mishra','Nair','Pandey',
  'Patel','Rao','Reddy','Sen','Shah','Sharma','Singh','Trivedi','Verma'
];

const CITIES = [
  { city: 'Mumbai',     state: 'Maharashtra' },
  { city: 'Pune',       state: 'Maharashtra' },
  { city: 'Delhi',      state: 'Delhi' },
  { city: 'Bangalore',  state: 'Karnataka' },
  { city: 'Hyderabad',  state: 'Telangana' },
  { city: 'Chennai',    state: 'Tamil Nadu' },
  { city: 'Kolkata',    state: 'West Bengal' },
  { city: 'Ahmedabad',  state: 'Gujarat' },
  { city: 'Jaipur',     state: 'Rajasthan' },
  { city: 'Chandigarh', state: 'Punjab' },
  { city: 'Lucknow',    state: 'Uttar Pradesh' },
  { city: 'Bhopal',     state: 'Madhya Pradesh' },
];

const COMPANIES    = ['TCS','Infosys','Wipro','Google India','Microsoft','Reliance','HDFC Bank','ICICI Bank','Amazon','Flipkart','Zomato','Paytm'];
const DESIGNATIONS = ['Software Engineer','Senior SWE','Product Manager','Data Scientist','Business Analyst','Financial Analyst','Marketing Manager','HR Specialist','Consultant','Architect'];
const COLLEGES     = ['IIT Bombay','IIT Delhi','IIT Madras','BITS Pilani','NIT Trichy','Delhi University','Mumbai University','SRM University','VIT Vellore','RVCE Bangalore'];
const DEGREES      = ['B.Tech','B.E.','MBA','MCA','B.Sc','M.Sc','M.Tech','B.Com','MBBS','B.A.'];
const RELIGIONS    = ['Hindu','Sikh','Christian','Muslim','Jain','Buddhist'];
const CASTES       = ['Brahmin','Rajput','Agarwal','Gupta','Jat','Khatri','Arora','Yadav','Patel','Maratha','Kayastha','Reddy','Nair'];
const LANGUAGES    = ['Hindi','English','Bengali','Tamil','Telugu','Marathi','Gujarati','Punjabi','Kannada','Malayalam'];
const HOBBIES      = ['Reading','Travelling','Cooking','Music','Dancing','Fitness','Photography','Painting','Sports','Yoga','Hiking','Gaming'];
const DIETS        = ['vegetarian','non-vegetarian','vegan','jain','eggetarian'];
const FAMILY_TYPES = ['nuclear','joint','flexible'];
const KIDS_PREFS   = ['yes','no','maybe'];
const RELOCATE     = ['yes','no','maybe'];
const LIFESTYLE    = ['never','occasionally','regularly'];
const EDUCATION    = ['premium','good','average'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pick  = (arr)       => arr[Math.floor(Math.random() * arr.length)];
const sample = (arr, n)   => arr.slice().sort(() => 0.5 - Math.random()).slice(0, n);
const randDOB = (min, max) => {
  const year = new Date().getFullYear() - Math.floor(Math.random() * (max - min + 1)) - min;
  return new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
};

// ─── Build profiles ───────────────────────────────────────────────────────────

function buildProfile(firstName, gender) {
  const lastName = pick(LAST_NAMES);
  const loc      = pick(CITIES);
  const isMale   = gender === 'male';
  return {
    firstName, lastName, gender,
    dateOfBirth:         randDOB(isMale ? 24 : 21, isMale ? 38 : 35),
    country: 'India', city: loc.city, state: loc.state,
    height: isMale ? Math.floor(Math.random() * 25) + 165 : Math.floor(Math.random() * 20) + 150,
    email:  `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 900) + 100}@example.com`,
    phone:  `+91 ${(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
    undergraduateCollege: pick(COLLEGES),
    degree:        pick(DEGREES),
    educationTier: pick(EDUCATION),
    currentCompany: pick(COMPANIES),
    designation:   pick(DESIGNATIONS),
    income:        (Math.floor(Math.random() * (isMale ? 20 : 15)) + (isMale ? 5 : 3)) * 100000,
    maritalStatus: 'never_married',
    wantKids:       pick(KIDS_PREFS),
    haveKids:       'no',
    openToRelocate: pick(RELOCATE),
    openToPets:     pick(RELOCATE),
    diet:           pick(DIETS),
    smoking:        pick(LIFESTYLE),
    drinking:       pick(LIFESTYLE),
    religion:       pick(RELIGIONS),
    caste:          pick(CASTES),
    manglik:        pick(['yes','no','dont_know']),
    familyType:     pick(FAMILY_TYPES),
    motherTongue:   pick(LANGUAGES),
    languagesKnown: sample(LANGUAGES, Math.floor(Math.random() * 3) + 2),
    hobbies:        sample(HOBBIES,   Math.floor(Math.random() * 4) + 2),
    siblings:       Math.floor(Math.random() * 4),
    profileType: 'pool', status: 'active',
    matchesSent: 0, sentMatches: [],
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('❌  MONGODB_URI is not set in .env'); process.exit(1); }

  await mongoose.connect(uri);
  console.log('✅  MongoDB connected');

  // ── Staff users ───────────────────────────────────────────────────────────
  const staffUsers = [
    { name: 'Admin User',       email: 'admin@tdc.com',       password: 'Admin123',  role: 'admin' },
    { name: 'Matchmaker User',  email: 'matchmaker@tdc.com',  password: 'Match123',  role: 'matchmaker' },
  ];

  for (const u of staffUsers) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`⚠️   User "${u.email}" already exists — skipping.`);
    } else {
      await new User(u).save();
      console.log(`👤  Created user: ${u.email} (${u.role})`);
    }
  }

  // ── Pool profiles ─────────────────────────────────────────────────────────
  const poolCount = await Customer.countDocuments({ profileType: 'pool' });
  console.log(`\n📊  Current pool size: ${poolCount} profiles`);

  if (poolCount >= 100) {
    console.log('✅  Pool already has 100+ profiles — skipping dummy profile seed.');
  } else {
    const needed  = 100 - poolCount;
    const males   = MALE_NAMES.slice(0, Math.ceil(needed / 2));
    const females = FEMALE_NAMES.slice(0, Math.floor(needed / 2));

    const profiles = [
      ...males.map(n   => buildProfile(n, 'male')),
      ...females.map(n => buildProfile(n, 'female')),
    ];

    const inserted = await Customer.insertMany(profiles);
    console.log(`✅  Seeded ${inserted.length} pool profiles (pool now has ${poolCount + inserted.length} total)`);
  }

  console.log('\n🎉  Seeding complete!\n');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
