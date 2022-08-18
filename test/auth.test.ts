import supertest from 'supertest'

import app from '../src/app'
import db from '../src/models/index'

interface ResponseType {
    msg: string
}

let token = ''
let user = null
let tasks: any = []

describe('Test login route', () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true })
    })

    it('test should success when user created successfuly', async () => {
        const data = {
            name: 'rahul saini',
            email: 'rs@test.com',
            password: 'qwerty',
            confirm_password: 'qwerty'
        }
        const res = await supertest(app).post('/user/signup').send(data)

        expect(res.statusCode).toBe(200)
    })

    it('test should success when user the login', async() => {
        const body = {
            email: 'rs@test.com',
            password: 'qwerty'
        }
        const res = await supertest(app)
            .post('/user/login')
            .send(body)

        console.log(res.body)
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('user')
        token = res.body.token
        user = res.body.user
    })

    it('test create task', async() => {
        const body = {
            taskname: 'test task',
            taskDescription: 'Task description',
        }
        const res = await supertest(app).post('/create')
            .set('authorization', token)
            .send(body)
        console.log(res.body)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.arrayContaining([]))
    })

    it('Test for Get all post of the user', async() => {
        const res = await supertest(app).get('/').set('authorization', token)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.arrayContaining([]))
        tasks = res.body
    })

    it('test task update', async() => {
        const body = {
            taskname: 'test task',
            taskDescription: 'Task description update'
        }
        const res = await supertest(app).post(`/update/${tasks[0].id}`)
            .set('authorization', token)
            .send(body)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(expect.arrayContaining([]))
    })

    it('test task update isdone true', async() => {
        const body = {
            isDone: true
        }
        const res = await supertest(app).post(`/update/${tasks[0].id}`)
            .set('authorization', token)
            .send(body)
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty<ResponseType>('msg')
    })

    it('test task delete', async() => {
        const res = await supertest(app).delete(`/${tasks[0].id}`).set('authorization', token)
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty<ResponseType>('msg')
    })

    afterAll(async() => {
        await db.sequelize.close()
    })
})

