import mongoose from 'mongoose';

export interface ICartItem extends mongoose.Document {
  user?: mongoose.Types.ObjectId;
  sessionId?: string;
  product: mongoose.Types.ObjectId;
  quantity: number;
  priceAtTime: number;
}

const cartItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sessionId: {
    type: String,
    required: false
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  priceAtTime: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Ensure either user or sessionId is provided
cartItemSchema.pre('save', function(next) {
  if (!this.user && !this.sessionId) {
    next(new Error('Either user or sessionId must be provided'));
  } else {
    next();
  }
});

// Index for efficient queries
cartItemSchema.index({ user: 1 });
cartItemSchema.index({ sessionId: 1 });
cartItemSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true });
cartItemSchema.index({ sessionId: 1, product: 1 }, { unique: true, sparse: true });

export default mongoose.model<ICartItem>('CartItem', cartItemSchema);