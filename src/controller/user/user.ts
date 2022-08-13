/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { errorMethod } from './../../utils/helperFunctions'
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import fs from 'fs'
import JWT from 'jsonwebtoken'
import db from '../../models/index'
import { uploadFile } from './file'
import { SignupInput, ErrorUserMessages, LoginInput, JWTPayload, AuthDTO, AuthRequest } from './type'

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

        return res.status(200).json({ msg: 'User signed up Successfully' })
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

        const {
            id,
            name,
            email,
            profile_picture,
            createdAt,
            updatedAt,
        } = user

        const payload: JWTPayload = {
            id: id,
            email: email,
        }

        const secret = process.env.JWT_SECRET

        if (secret == undefined) {
            return res.status(500).json({ error: ErrorUserMessages.SOMETHING_WRONG })
        }

        const jwtToken = JWT.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn: 60 * 60,
        })

        const response: AuthDTO = {
            token: jwtToken,
            user:  { id, name, email, profile_picture, createdAt, updatedAt }
        }

        return res
            .status(200)
            .json(response)
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: ErrorUserMessages.SOMETHING_WRONG })
    }
}

export const updateProfilePicture = async (req: AuthRequest, res: Response) => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json(error.array())
    }

    const userId = req.auth!.id
    const file = req.file

    if (file == undefined) {
        return res.status(400).json({ error: 'file not found' })
    }

    console.log(file.path)

    try {
        const result = await uploadFile(file)
        const updatePicture = await db.User.update(
            { profile_picture: result.Location },
            { where: { id: userId } }
        )

        if (updatePicture[0] == 0) {
            return res.status(400).json({ error: ErrorUserMessages.USER_NOT_FOUND })
        }

        return res.status(200).json({ profile_picture: result.Location.toString() })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: ErrorUserMessages.SOMETHING_WRONG })
    } finally {
        if (file.path.length > 0) {
            await fs.promises.unlink(file.path)
        }
    }
}


export const AuthGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token: string = req.headers['authorization'] || req.params.token || req.body.token || req.query.token
    const secret = process.env.JWT_SECRET

    if(token == undefined){
        return res.status(400).json({ error: ErrorUserMessages.AUTHENTICATION_FAILED })
    }

    if (secret == undefined) {
        return res.status(500).json({ error: ErrorUserMessages.SOMETHING_WRONG })
    }

    const decode: JWTPayload = JWT.verify(token.replace('Bearer ', ''), secret) as JWTPayload
    req.auth = decode
    next()
}

export const checkUserGuard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        if(req.auth == undefined){
            return errorMethod(res, ErrorUserMessages.UNAUTHORISED_ACCESS)
        }
        
        const user = db.User.findOne({ where:{ id: req.auth.id } })
        if(user == null){
            return errorMethod(res, ErrorUserMessages.USER_NOT_FOUND)
        }

        next()
    } catch (error) {
        return errorMethod(res, ErrorUserMessages.SOMETHING_WRONG)
    }
}