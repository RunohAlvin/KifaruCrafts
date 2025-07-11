import mongoose from 'mongoose';

// For development, we'll use MongoDB Atlas or local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kifaru-crafts';

interface MongoConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

let cached: MongoConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose.connection;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      console.log('🔄 Using in-memory storage fallback...');
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

// Mongoose Schemas
const UserMongooseSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ["customer", "vendor"], default: "customer" },
  profileImageUrl: { type: String },
  
  // Vendor-specific fields
  businessName: { type: String },
  bio: { type: String },
  location: { type: String },
  phone: { type: String },
  specialties: { type: String },
  yearsOfExperience: { type: Number },
  isVerified: { type: Boolean, default: false },
  
  // Contact information
  whatsappNumber: { type: String },
  instagramHandle: { type: String },
  facebookPage: { type: String },
  website: { type: String },
  
  // Payment details
  mpesaNumber: { type: String },
  bankDetails: { type: String },
  acceptedPaymentMethods: [{ type: String }],
}, { timestamps: true });

const CategoryMongooseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
});

const ProductMongooseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  featured: { type: Boolean, default: false },
  badge: { type: String },
  stock: { type: Number, default: 0 },
});

const CartItemMongooseSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  sessionId: { type: String, required: true },
});

// Export Mongoose Models
export const UserModel = mongoose.models.User || mongoose.model('User', UserMongooseSchema);
export const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategoryMongooseSchema);
export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductMongooseSchema);
export const CartItemModel = mongoose.models.CartItem || mongoose.model('CartItem', CartItemMongooseSchema);

export const db = {
  connect: connectToDatabase,
  disconnect: () => mongoose.disconnect(),
};
