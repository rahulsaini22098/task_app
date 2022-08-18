/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'
import { DataTypes, Sequelize } from 'sequelize'
import path from 'path'
import fs from 'fs'
import configJson from '../config/config'
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'test'

interface ConfigAttribute {
  database: string;
  username: string;
  password: string;
  host: string;
}

interface EnvironmentTypes{
    [key: string]: ConfigAttribute
}

const db: any = {}
const config = configJson as EnvironmentTypes
const configValue = config[env]

const sequelize: Sequelize = new Sequelize(
    configValue.database,
    configValue.username,
    configValue.password,
    configValue
)

fs.readdirSync(__dirname)
    .filter((file: string) => {
        return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts' || 
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
        )
    })
    .forEach((file: any) => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes)
        db[model.name] = model
    })

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize

export default db
