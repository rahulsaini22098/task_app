/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'

export const errorMethod = (res: Response, msg: string | any[], status = 400) =>{
    return res.status(status).json({ error: msg })
}