const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

//Lib nativa que resolve os diretórios automaticamente
const path = require("path");

//Criamos a função responsável abrir uma conexão com o sqlite
async function sqliteConnection() {
  const database = await sqlite.open({
    filename: path.resolve(__dirname, "..", "database.db"),
    driver: sqlite3.Database
  });

  return database;
}

module.exports = sqliteConnection;
