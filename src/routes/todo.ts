import { checkUserGuard } from './../controller/user/user'
import express from 'express'
import { 
    getAllTodo,
    findTodoById,
    createTodo,
    updateTodo,
    deletTodoById,
    getCompletedTask, 
} from '../controller/todo/todo'

import { AuthGuard } from '../controller/user/user'

const router = express.Router()

router.get('/', AuthGuard, checkUserGuard, getAllTodo)
router.get('/task/completed', AuthGuard, checkUserGuard, getCompletedTask)
router.post('/create', AuthGuard, checkUserGuard, createTodo)
router.post('/update/:id', AuthGuard, checkUserGuard, updateTodo)
router.get('/:id', AuthGuard, checkUserGuard, findTodoById)
router.delete('/:id', AuthGuard, checkUserGuard, deletTodoById)

export default router
