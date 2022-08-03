import { Model } from 'sequelize';
import { NextFunction, Request, Response } from "express";
import { Mode } from "fs";
import { v4 as uuidv4 } from "uuid";
import db from "../models/index";

interface UpdateTaskDAO {
  id: string;
  taskname?: string;
  isDone?: boolean;
}

export const getAllTodo = async (req: Request, res: Response) => {
  try {
    const todos = await db.Task.findAll();
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ msg: "fail to get tasks" });
  }
};

export const findTodoById = async (req: Request, res: Response) => {
  try {
    const todo = await db.Task.findByPk(req.params.id);
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ msg: "fail to find the task" });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  const taskname: string = req.body.taskname;
  const userId: string = "e9e247a6-c6ab-47ff-87bb-e83bcc07cfa9"

  if (taskname == "") {
    return res.status(400).json({ msg: "Task name is requires" });
  }

  const id = uuidv4();
  try {
    const todo = await db.Task.create({ id, taskname, userId });
    return res.status(200).json(todo);
  } catch (error) {
    console.log(error)

    return res.status(500).json({ msg: "fail to create todo" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const body: UpdateTaskDAO = req.body;
    const todo = await db.Task.update(
      { ...req.body },
      { where: { id: req.params.id } }
    );

    if (todo[0] == 0) {
      return res.status(400).json({ msg: "task not found" });
    }

    return res.status(200).json({ msg: "task updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "fail to update todo" });
  }
};

export const deletTodoById = async (req: Request, res: Response) => {
  try {
    const todo = await db.Task.destroy({ where: { id: req.params.id } });

    if (todo == 0) {
      return res.status(400).json({ msg: "task not found" });
    }

    return res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "fail to delete todo" });
  }
};
