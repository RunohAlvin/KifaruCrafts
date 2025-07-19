import express from 'express';
import User from '../models/User';
import Product from '../models/Product';

const router = express.Router();

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' })
      .select('-password -email')
      .sort({ createdAt: -1 });

    res.json(vendors);
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single vendor
router.get('/:id', async (req, res) => {
  try {
    const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' })
      .select('-password -email');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get vendor's products
router.get('/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ 
      vendor: req.params.id, 
      isActive: true 
    })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get vendor products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;