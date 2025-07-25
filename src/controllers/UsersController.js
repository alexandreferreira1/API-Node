const { hash, compare } = require(`bcryptjs`);

const AppError = require("../utils/AppError.js");

const sqliteConnection = require("../database/sqlite/index.js");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name) {
      throw new AppError("O nome é obrigatório!");
    }

    if (!email) {
      throw new Error("Email obrigatório");
    }

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    response.status(201).json({ name, email, password });
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso");
    }

    // Se não passar no JSON de PUT, ele pega o já existente
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha"
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      `
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at= DATETIME('now')
        WHERE id = ?`,
      [user.name, user.email, user.password, id]
    );

    return response.status(200).json();
  }
}

module.exports = UsersController;
