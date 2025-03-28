const express = require("express");

const app = express();

app.use(express.json());

app.post("/users", (request, response) => {
  const { name, email, password } = request.body;

  response.json({ name, email, password });
});;

const port = 3333;

app.listen(port, () => console.log(`Server is running on Port ${port}`));
