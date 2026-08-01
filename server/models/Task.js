import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  date: { type: String, required: true }
});

const taskBoardSchema = new mongoose.Schema({
  columns: {
    'to-order': [taskSchema],
    'ordered': [taskSchema],
    'received': [taskSchema],
    'in-stock': [taskSchema]
  }
}, { timestamps: true });

export default mongoose.model('TaskBoard', taskBoardSchema);
