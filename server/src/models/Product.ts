import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  featured: boolean;
  badge?: string;
  stock: number;
  tags?: string[];
  specifications?: Record<string, any>;
  isActive: boolean;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  badge: String,
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  tags: [String],
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, featured: -1 });
productSchema.index({ vendor: 1, isActive: 1 });

export default mongoose.model<IProduct>('Product', productSchema);