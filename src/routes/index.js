const { Router } = require("express");

const routes = Router();

const usersRouter = require("./users.routes.js");

routes.use("/users", usersRouter);

module.exports = routes;
