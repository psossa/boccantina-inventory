import express from 'express';
import TaskBoard from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    let board = await TaskBoard.findOne();
    if (!board) {
      board = new TaskBoard({
        columns: { 'to-order': [], 'ordered': [], 'received': [], 'in-stock': [] }
      });
      await board.save();
    }
    res.json(board.columns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', authenticate, async (req, res) => {
  try {
    let board = await TaskBoard.findOne();
    if (!board) board = new TaskBoard({ columns: req.body.tasks });
    else board.columns = req.body.tasks;
    await board.save();
    res.json(board.columns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
