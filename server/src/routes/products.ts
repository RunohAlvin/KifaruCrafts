import express from 'express';
import Product from '../models/Product.ts';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  image: z.string().url(),
  category: z.string(),
  stock: z.number().min(0),
  featured: z.boolean().default(false),
  badge: z.string().optional(),
  tags: z.array(z.string()).optional()
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, vendor } = req.query;
    let query: any = { isActive: true };

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (vendor) query.vendor = vendor;
    if (search) {
      query.$text = { $search: search as string };
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('vendor', 'firstName lastName businessName')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
      .populate('category', 'name')
      .populate('vendor', 'firstName lastName businessName bio location');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (vendor only)
router.post('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.session.userRole !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can create products' });
    }

    const validatedData = createProductSchema.parse(req.body);
    
    const product = new Product({
      ...validatedData,
      vendor: req.session.userId
    });

    await product.save();
    await product.populate('category', 'name');

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (vendor only)
router.put('/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.session.userRole !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can update products' });
    }

    const product = await Product.findOne({ 
      _id: req.params.id, 
      vendor: req.session.userId 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const validatedData = createProductSchema.partial().parse(req.body);
    
    Object.assign(product, validatedData);
    await product.save();
    await product.populate('category', 'name');

    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (vendor only)
router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.session.userRole !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can delete products' });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.session.userId },
      { isActive: false }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;