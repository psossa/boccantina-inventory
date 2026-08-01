import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  unit: String,
  cost: Number
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  status: { type: String, enum: ['pending', 'approved', 'delivered'], default: 'pending' },
  date: { type: String, required: true },
  total: { type: Number, required: true },
  requester: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
