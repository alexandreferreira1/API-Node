const { Router } = require("express");

const routes = Router();

const usersRouter = require("./users.routes.js");
const notesRouter = require("./notes.routes.js");

routes.use("/users", usersRouter);
routes.use("/notes", notesRouter);

module.exports = routes;
