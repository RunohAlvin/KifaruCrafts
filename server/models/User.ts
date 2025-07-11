import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'vendor';
  profileImageUrl?: string;
  // Vendor specific fields
  businessName?: string;
  bio?: string;
  location?: string;
  phone?: string;
  specialties?: string;
  yearsOfExperience?: number;
  isVerified: boolean;
  // Social media
  whatsappNumber?: string;
  instagramHandle?: string;
  facebookPage?: string;
  website?: string;
  // Payment methods
  mpesaNumber?: string;
  bankDetails?: string;
  acceptedPaymentMethods?: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'vendor'],
    default: 'customer'
  },
  profileImageUrl: String,
  // Vendor specific fields
  businessName: String,
  bio: String,
  location: String,
  phone: String,
  specialties: String,
  yearsOfExperience: Number,
  isVerified: {
    type: Boolean,
    default: false
  },
  // Social media
  whatsappNumber: String,
  instagramHandle: String,
  facebookPage: String,
  website: String,
  // Payment methods
  mpesaNumber: String,
  bankDetails: String,
  acceptedPaymentMethods: [String]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);