/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { errorMethod } from './../../utils/helperFunctions'
import { AuthRequest, ErrorUserMessages } from './../user/type'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import db from '../../models/index'

interface TaskInputs {
  id: string;
  taskname: string;
  taskDescription: string;
  userId: string;
}

export const getAllTodo = async (req: AuthRequest, res: Response) => {
    try {
        if(req.auth == undefined){
            return errorMethod(res, ErrorUserMessages.UNAUTHORISED_ACCESS)
        }

        const todos = await db.Task.findAll({ where: { userId: req.auth.id } })

        return res.status(200).json(todos)
    } catch (error) {
        return res.status(500).json({ msg: 'fail to get tasks' })
    }
}

export const getCompletedTask = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await db.Task.findAll({ where: { isDone: true, userId: req.auth!.id } })
        
        return res.status(200).json(tasks)
    } catch (error) {
        return errorMethod(res, ErrorUserMessages.SOMETHING_WRONG)
    }
}

export const findTodoById = async (req: Request, res: Response) => {
    try {
        const todo = await db.Task.findByPk(req.params.id)

        return res.status(200).json(todo)
    } catch (error) {
        return res.status(500).json({ msg: 'fail to find the task' })
    }
}

export const createTodo = async (req: AuthRequest, res: Response) => {
    const { taskname, taskDescription } = req.body

    if (taskname === '' || taskname === undefined) {
        return res.status(400).json({ msg: 'Task name is required' })
    }

    if (taskDescription === '' || taskDescription === undefined) {
        return res.status(400).json({ msg: 'Task description is required' })
    }

    const input: TaskInputs = {
        id: uuidv4(),
        taskname: taskname,
        taskDescription: taskDescription,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: req.auth!.id
    }

    try {
        const todo = await db.Task.create(input)

        return res.status(200).json(todo)
    } catch (error) {
        return res.status(500).json({ msg: 'fail to create todo' })
    }
}

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const todo = await db.Task.update(
            { ...req.body },
            { where: { id: req.params.id } },
        )

        if (todo[0] === 0) {
            return res.status(400).json({ msg: 'task not found' })
        }

        return res.status(200).json({ msg: 'task updated successfully' })
    } catch (error) {
        return res.status(500).json({ msg: 'fail to update todo' })
    }
}

export const deletTodoById = async (req: Request, res: Response) => {
    try {
        const todo = await db.Task.destroy({ where: { id: req.params.id } })

        if (todo === 0) {
            return res.status(400).json({ msg: 'task not found' })
        }

        return res.status(200).json({ msg: 'Task deleted successfully' })
    } catch (error) {
        return res.status(500).json({ msg: 'fail to delete todo' })
    }
}
