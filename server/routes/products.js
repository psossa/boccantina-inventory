import express from 'express';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/batch', authenticate, async (req, res) => {
  try {
    const { updates } = req.body;
    const ops = updates.map(u => ({
      updateOne: { filter: { id: u.id }, update: { $set: u } }
    }));
    await Product.bulkWrite(ops);
    res.json({ message: 'Products updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
