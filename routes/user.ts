import express from 'express'
import multer from 'multer'
import { body, CustomValidator, param } from 'express-validator'

import { 
    AuthGuard, 
    checkUserGuard, 
    loginUser, 
    signUpUser, 
    updateProfilePicture 
} from './../controller/user/user'

const router = express.Router()
const upload  = multer({ dest: __dirname })

const confirmPasswordValidator: CustomValidator = (confirmPass: string, { req }) => {
    if(req.body.password !== confirmPass){
        throw new Error('Password confirmation does not match password')
    }

    return true
}

router.post('/signup', [
    body('name').trim().isLength({ min: 1 }),
    body('email').isEmail(),
    body('password').trim().isLength({ min: 1 }),
    body('confirm_password').custom(confirmPasswordValidator)
],
signUpUser
)

router.post('/login', [
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 1 })],
loginUser
)

router.post('/profilepicture/upload',
    upload.single('profile_picture'),
    AuthGuard,
    checkUserGuard,
    updateProfilePicture
)

export default router