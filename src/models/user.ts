/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict'

import { Model, Optional, UUIDV4 } from 'sequelize'
import { UserAttributes } from './../controller/user/type'
import crypto from 'crypto'
import { v4 as uuid4 } from 'uuid'

module.exports = (sequelize: any, DataTypes: any) => {
    class User
        extends Model<UserAttributes, Optional<UserAttributes, 'secret'>>
        implements UserAttributes
    {
        id!: string
        name!: string
        email!: string
        password!: string
        profile_picture?: string
        secret?: string

        encrypt_password(password: string): string {
            if(this.secret == null) return ''
            return crypto.createHmac('sha256', this.secret).update(password).digest('hex')
        }

        isAuthenticated(password: string): boolean {
            return this.encrypt_password(password) === this.password
        }

        
    }

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                set(this, val: string) {
                    this, this.setDataValue('secret', uuid4())
                    this.setDataValue('password', this.encrypt_password(val))
                }
            },
            secret: {
                type: DataTypes.UUID,
            },
            profile_picture: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
        }
    )

    return User
}
