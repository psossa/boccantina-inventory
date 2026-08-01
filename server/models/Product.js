import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  pack: { type: String, required: true },
  code: { type: String, default: '' },
  begin: { type: Number, default: 0 },
  used: { type: Number, default: 0 },
  end: { type: Number, default: 0 },
  min: { type: Number, default: 1 },
  costPerUnit: { type: Number, required: true },
  currentStock: { type: Number, default: 0 },
  threshold: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
