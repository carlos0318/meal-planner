// lib/db-operations.js
const db = require("../lib/db");

// Crear una tabla
const createTables = () => {
  const createMenusTable = `
        CREATE TABLE IF NOT EXISTS menus (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL
        );
    `;

  const createItemsTable = `
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            menu_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            mealType TEXT NOT NULL,
            FOREIGN KEY (menu_id) REFERENCES menus (id)
        );
    `;

  db.serialize(() => {
    db.run(createMenusTable);
    db.run(createItemsTable);
  });
};

// Insertar un nuevo men�
const insertMenu = (date, callback) => {
  const query = "INSERT INTO menus (date) VALUES (?)";

  db.run(query, [date], function (err) {
    if (err) {
      console.error("Error al insertar el men�:", err.message);
      return callback({ error: `Error al insertar el men�: ${err.message}` });
    }

    // Devuelve el �ltimo ID insertado
    callback(null, this.lastID);
  });
};

// Buscar por fecha
const findMenuByDate = (date, callback) => {
  const query = "SELECT * FROM menus WHERE date = ?";

  db.get(query, [date], (err, menu) => {
    if (err) {
      console.error("Error al buscar el menú por fecha:", err.message);
      return callback(err);
    }
    callback(null, menu); // Devuelve el menú encontrado o null si no existe
  });
};

// Insertar �tems para un men� espec�fico
const insertItems = (menuId, items, callback) => {
  const query =
    "INSERT INTO items (menu_id, name, type, mealType) VALUES (?, ?, ?, ?)";
  let insertCount = 0; // Contador para rastrear la inserci�n de �tems

  items.forEach((item) => {
    db.run(query, [menuId, item.name, item.type, item.mealType], (err) => {
      if (err) {
        console.error("Error al insertar �tem:", err.message);
        return callback(err); // Llama al callback en caso de error
      }
      insertCount++;

      // Verifica si se han insertado todos los �tems
      if (insertCount === items.length) {
        callback(null); // Llama al callback sin error cuando todos los �tems han sido insertados
      }
    });
  });

  // Si no hay �tems, llama al callback inmediatamente
  if (items.length === 0) {
    callback(null);
  }
};

// Obtener todos los men�s
const getMenus = (callback) => {
  const query = "SELECT * FROM menus";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error al consultar men�s:", err.message);
      return callback(err); // Llama al callback con el error
    }
    callback(null, rows); // Pasa los resultados al callback
  });
};

// Consultar todos los �tems para un men� espec�fico
const getItemsForMenu = (menuId, callback) => {
  const query = "SELECT * FROM items WHERE menu_id = ?";
  db.all(query, [menuId], (err, rows) => {
    if (err) {
      console.error("Error al consultar �tems:", err.message);
      return callback(err); // Llama al callback con el error
    }
    callback(null, rows); // Pasa los resultados al callback
  });
};

// Eliminar un menú por fecha
const deleteMenuByDate = (date, callback) => {
  const query = "DELETE FROM menus WHERE date = ?";

  db.run(query, [date], function (err) {
    if (err) {
      console.error("Error al eliminar el menú:", err.message);
      return callback({ error: `Error al eliminar el menú: ${err.message}` });
    }

    // Devuelve el número de filas afectadas
    callback(null, this.changes); // this.changes devuelve el número de filas eliminadas
  });
};

const updateMenuItems = (menuId, items, callback) => {
  // Primero, buscamos los �tems existentes para el men�
  const selectQuery = "SELECT * FROM items WHERE menu_id = ?";

  db.all(selectQuery, [menuId], (err, existingItems) => {
    if (err) {
      console.error("Error al consultar �tems existentes:", err.message);
      return callback(err); // Llama al callback con el error
    }

    // Si hay �tems existentes, los eliminamos
    if (existingItems.length > 0) {
      const deleteQuery = "DELETE FROM items WHERE menu_id = ?";

      db.run(deleteQuery, [menuId], function (err) {
        if (err) {
          console.error("Error al eliminar �tems existentes:", err.message);
          return callback(err); // Llama al callback con el error
        }

        console.log(`�tems eliminados para el men� ID: ${menuId}`);

        // Inserta los nuevos �tems
        insertItems(menuId, items, callback);
      });
    } else {
      // Si no hay �tems existentes, simplemente insertamos todos
      insertItems(menuId, items, callback);
    }
  });
};

// Exportar funciones
module.exports = {
  createTables,
  insertMenu,
  insertItems,
  getMenus,
  getItemsForMenu,
  findMenuByDate,
  deleteMenuByDate,
  updateMenuItems,
};
