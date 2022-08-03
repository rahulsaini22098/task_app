require('dotenv').config()

const config = {
    "development": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_USER_PASSWORD,
        "database": process.env.DB_NAME,
        "host": "localhost",
        "dialect": "mysql"
    }
}

module.exports = config