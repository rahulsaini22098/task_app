/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'
import { DataTypes, Sequelize } from 'sequelize'
import path from 'path'
import fs from 'fs'
const basename = path.basename(__filename)
const env = 'development'
const config = require('../config/config.js')

interface ConfigAttribute {
  database: string;
  username: string;
  password: string;
  host: string;
}

const db: any = {}
const configValue: ConfigAttribute = config[env]

const sequelize: Sequelize = new Sequelize(
    configValue.database,
    configValue.username,
    configValue.password,
    configValue
)

fs.readdirSync(__dirname)
    .filter((file: string) => {
        return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
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
