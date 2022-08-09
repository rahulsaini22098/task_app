import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import fs from 'fs'
import db from '../../models/index'
import { uploadFile } from './file'
import { SignupInput, ErrorUserMessages, LoginInput } from './type'

export const signUpUser = async (req: Request, res: Response) => {
    try {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(400).json(error.array())
        }

        const body: SignupInput = req.body
        const user = await db.User.create(body)

        if (user == null) {
            return res
                .status(400)
                .json({ error: ErrorUserMessages.USER_NOT_CREATED })
        }

        return res.status(200).json(user)
    } catch (error: any) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            return res
                .status(400)
                .json({ msg: ErrorUserMessages.USER_ALREADY_EXIST })
        }
        return res.status(400).json({ error: ErrorUserMessages.SOMETHING_WRONG })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(400).json(error.array())
        }

        const body: LoginInput = req.body
        const user = await db.User.findOne({ where: { email: body.email } })

        if (user == null) {
            return res.status(400).json({ error: ErrorUserMessages.USER_NOT_FOUND })
        }

        const isPasswordCorrect = user.isAuthenticated(body.password)

        if (!isPasswordCorrect) {
            return res
                .status(400)
                .json({ msg: ErrorUserMessages.INCORRECT_PASSWORD })
        }

        return res.status(200).json(user)
    } catch (err) {
        return res.status(400).json({ error: ErrorUserMessages.SOMETHING_WRONG })
    }
}

export const updateProfilePicture = async (req: Request, res: Response) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json(error.array())
    }

    const userId = req.params.userId
    const file = req.file

    if (file == undefined) {
        return res.status(400).json({ error: 'file not found' })
    }

    try {
        const result = await uploadFile(file)
        const updatePicture = await db.User.update(
            { profile_picture: result.Location },
            { where: { id: userId } }
        )

        if (updatePicture[0] == 0) {
            return res.status(400).json({ error: ErrorUserMessages.USER_NOT_FOUND })
        }

        return res.status(200).json({ profile_picture: result.Location })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: ErrorUserMessages.SOMETHING_WRONG })
    } finally{
        if(file.path.length > 0){
            await fs.promises.unlink(file.path)
        }
    }
}
