import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export enum ErrorUserMessages {
    'USER_NOT_CREATED' = 'User not created',
    'USER_NOT_FOUND' = 'User not found',
    'USER_ALREADY_EXIST' = 'User already exist',
    'INCORRECT_PASSWORD' = 'Please check your password',
    'SOMETHING_WRONG' = 'Something went wrong',
    'AUTHENTICATION_FAILED' = 'Authenctication failed',
    'UNAUTHORISED_ACCESS' = 'Unauthorised access'
}
export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  profile_picture?: string;
  secret?: string
}

export interface UserDTO{
  id: string,
  name: string,
  email: string,
  profile_picture: string | null,
  createdAt: Date,
  updatedAt: Date
}

export interface AuthDTO{
  token: string,
  user: UserDTO
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
    email: string,
    password: string
}


export interface JWTPayload extends JwtPayload {
  id: string,
  email: string
}

export interface AuthRequest extends Request{
  auth?: JWTPayload
}
