const express = require("express");
const bodyParser = require("body-parser");
const dbOperations = require("./models/menu");

const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Crear tablas
dbOperations.createTables();

// Ruta para agregar un nuevo men� y sus �tems
app.post("/menu/addDish", (req, res) => {
  const { date, items } = req.body; // Supone que el cliente env�a 'date' y 'items'

  if (!date || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Fecha e �tems requeridos" });
  }

  // Buscar el men� por fecha
  dbOperations.findMenuByDate(date, (err, existingMenu) => {
    if (err) {
      return res.status(500).json({ error: "Error al buscar el men�" });
    }

    if (existingMenu) {
      // Si el men� ya existe, insertar los �tems
      dbOperations.insertItems(existingMenu.id, items, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al insertar los �tems del men�" });
        }

        return res.status(200).json({
          message: "�tems insertados correctamente",
          menuId: existingMenu.id,
        });
      });
    } else {
      // Si el men� no existe, crear uno nuevo
      dbOperations.insertMenu(date, (err, menuId) => {
        if (err) {
          return res.status(500).json({ error: "Error al insertar el men�" });
        }

        // Insertar los �tems del men� reci�n creado
        dbOperations.insertItems(menuId, items, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Error al insertar los �tems del men�" });
          }

          res
            .status(201)
            .json({ message: "Men� e �tems insertados correctamente", menuId });
        });
      });
    }
  });
});

// Ruta para obtener todos los menus con sus items
app.get("/menu/all", (_req, res) => {
  dbOperations.getMenus((err, menus) => {
    if (err) {
      return res.status(500).json({ error: "Error al consultar los men�s" });
    }

    // Para cada men�, obtener sus �tems
    const menusWithItems = [];

    let menusProcessed = 0; // Contador para saber cu�ndo se han procesado todos los men�s

    menus.forEach((menu) => {
      dbOperations.getItemsForMenu(menu.id, (err, items) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al consultar los �tems" });
        }

        menusWithItems.push({ ...menu, items }); // Combina men� con sus �tems
        menusProcessed++;

        // Si todos los men�s han sido procesados, env�a la respuesta
        if (menusProcessed === menus.length) {
          res.status(200).json(menusWithItems);
        }
      });
    });

    // Si no hay men�s, responde inmediatamente
    if (menus.length === 0) {
      res.status(200).json(menusWithItems);
    }
  });
});

app.delete("/menu/deleteByDate", (req, res) => {
  const { date } = req.query; // Se espera que el cliente env�e la fecha

  if (!date) {
    return res.status(400).json({ error: "Fecha requerida" });
  }

  // Eliminar el men� por fecha
  dbOperations.deleteMenuByDate(date, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar el men�" });
    }

    if (changes === 0) {
      return res.status(404).json({
        message: "No se encontr� ning�n men� para la fecha proporcionada",
      });
    }

    res.status(200).json({ message: "Men� eliminado correctamente" });
  });
});

app.post("/menu/copyByDate", (req, res) => {
  const { fromDate, toDate } = req.body; // fecha de origen (fromDate) y destino (toDate)

  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ error: "Las fechas de origen y destino son requeridas" });
  }

  // Buscar men� por la fecha de origen
  dbOperations.findMenuByDate(fromDate, (err, menu) => {
    if (err) {
      return res.status(500).json({ error: "Error al buscar el men�" });
    }

    if (!menu) {
      return res.status(404).json({
        message: "No se encontr� ning�n men� para la fecha de origen",
      });
    }

    // Obtener los �tems del men� original
    dbOperations.getItemsForMenu(menu.id, (err, items) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener los �tems del men�" });
      }

      // Verificar si ya existe un men� en la fecha de destino
      dbOperations.findMenuByDate(toDate, (err, existingMenu) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al buscar el men� existente" });
        }

        if (existingMenu) {
          // Si ya existe el men� en la fecha de destino, actualizarlo
          dbOperations.updateMenuItems(existingMenu.id, items, (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error al actualizar los �tems del men�" });
            }

            res.status(200).json({
              message: "Men� actualizado correctamente",
              menuId: existingMenu.id,
            });
          });
        } else {
          // Si no existe, insertar un nuevo men� en la fecha de destino
          dbOperations.insertMenu(toDate, (err, newMenuId) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error al insertar el nuevo men�" });
            }

            // Copiar los �tems del men� original al nuevo men�
            dbOperations.insertItems(newMenuId, items, (err) => {
              if (err) {
                return res.status(500).json({
                  error: "Error al insertar los �tems en el nuevo men�",
                });
              }

              res.status(201).json({
                message: "Men� copiado correctamente",
                menuId: newMenuId,
              });
            });
          });
        }
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
