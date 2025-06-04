const {hash} = require(`bcryptjs`)

const AppError = require('../utils/AppError.js')

const sqliteConnection = require('../database/sqlite/index.js')

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body

        if (!name) {
            throw new AppError('O nome é obrigatório!')
        }

        if (!email) {
            throw new Error('Email obrigatório')
        }

        const database = await sqliteConnection()
        const checkUserExists = await database.get(
            'SELECT * FROM users WHERE email = (?)',
        [email]
        )

        if (checkUserExists) {
            throw new AppError("Este e-mail já está em uso.");
        }

        const hashedPassword = await hash(password, 8)

        await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        )
        
        response.status(201).json({name, email, password})
    }
}

module.exports = UsersController