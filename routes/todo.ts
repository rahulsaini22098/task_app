import express from 'express';
import {
  getAllTodo,
  findTodoById,
  createTodo,
  updateTodo,
  deletTodoById,
} from '../controller/todo';

const router = express.Router();

router.get('/', getAllTodo);
router.post('/create', createTodo);
router.post('/update/:id', updateTodo);
router.get('/:id', findTodoById);
router.delete('/:id', deletTodoById);

export default router;
