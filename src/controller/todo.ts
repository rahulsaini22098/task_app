import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "../models/todo";

interface UpdateTaskDAO {
  id: string;
  taskname?: string;
  isDone?: boolean;
}

export const getAllTodo = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.findAll();
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ msg: "fail to get tasks" });
  }
};

export const findTodoById = (req: Request, res: Response) => {
  return res.status(200).json(req.params.id);
};

export const createTodo = async (req: Request, res: Response) => {
  const taskname: string = req.body.taskname;

  if (taskname == "") {
    return res.status(400).json({ msg: "Task name is requires" });
  }

  const id = uuidv4();
  try {
    const todo = await Todo.create({ id, taskname });
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ msg: "fail to create todo" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const body: UpdateTaskDAO = req.body;
    const todo = await Todo.findByPk(req.params.id);

    if (todo == null) {
      return res.status(400).json({ msg: "task not found" });
    }

    const updatedTodo: Todo = await todo.update({ ...body });

    return res.status(200).json(updatedTodo);
  } catch (error) {
    return res.status(500).json({ msg: "fail to update todo" });
  }
};

export const deletTodoById = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByPk(req.params.id);

    if (todo == null) {
      return res.status(400).json({ msg: "task not found" });
    }

    await todo.destroy();
    return res
      .status(200)
      .json({ id: todo.id, msg: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "fail to delete todo" });
  }
};
