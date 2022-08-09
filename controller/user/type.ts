export enum ErrorUserMessages {
    'USER_NOT_CREATED' = 'User not created',
    'USER_NOT_FOUND' = 'User not found',
    'USER_ALREADY_EXIST' = 'User already exist',
    'INCORRECT_PASSWORD' = 'Please check your password',
    'SOMETHING_WRONG' = 'Something went wrong',
}

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  profile_picture?: string;
  secret?: string
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
