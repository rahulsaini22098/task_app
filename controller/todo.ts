import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../models/index';

interface TaskInputs {
  id: string;
  taskname: string;
  taskDescription: string;
  userId: string;
}

export const getAllTodo = async (req: Request, res: Response) => {
  try {
    const todos = await db.Task.findAll();
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ msg: 'fail to get tasks' });
  }
};

export const findTodoById = async (req: Request, res: Response) => {
  try {
    const todo = await db.Task.findByPk(req.params.id);
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ msg: 'fail to find the task' });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  const { taskname, taskDescription } = req.body;

  if (taskname === '' || taskname === undefined) {
    return res.status(400).json({ msg: 'Task name is required' });
  }

  if (taskDescription === '' || taskDescription === undefined) {
    return res.status(400).json({ msg: 'Task description is required' });
  }

  const input: TaskInputs = {
    id: uuidv4(),
    taskname: taskname,
    taskDescription: taskDescription,
    userId: '8cf57ebe-98c4-4d30-81fe-18a7ce6105f2',
  };

  try {
    const todo = await db.Task.create(input);
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ msg: 'fail to create todo' });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const todo = await db.Task.update(
      { ...req.body },
      { where: { id: req.params.id } },
    );

    if (todo[0] === 0) {
      return res.status(400).json({ msg: 'task not found' });
    }

    return res.status(200).json({ msg: 'task updated successfully' });
  } catch (error) {
    return res.status(500).json({ msg: 'fail to update todo' });
  }
};

export const deletTodoById = async (req: Request, res: Response) => {
  try {
    const todo = await db.Task.destroy({ where: { id: req.params.id } });

    if (todo === 0) {
      return res.status(400).json({ msg: 'task not found' });
    }

    return res.status(200).json({ msg: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ msg: 'fail to delete todo' });
  }
};
