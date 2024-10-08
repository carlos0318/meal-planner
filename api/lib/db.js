const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Ruta al archivo de la base de datos
const DB_PATH = path.resolve("./db/database.db");

// Crear y exportar una instancia de la base de datos
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
  }
});

module.exports = db;
