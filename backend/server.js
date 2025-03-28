/* Backend - server.js */
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
app.use(cors());

const db = new sqlite3.Database("./database/sensors.db", (err) => {
  if (err) console.error("Ошибка подключения к БД:", err.message);
  else console.log("База данных подключена");
});

// Функция для добавления случайных данных
function insertRandomData() {
  const temperature = (Math.random() * 10 + 20).toFixed(1); // Температура от 20 до 30 градусов
  const timestamp = new Date().toISOString();
  db.run("INSERT INTO temperature (timestamp, temperature) VALUES (?, ?)", [timestamp, temperature], (err) => {
    if (err) console.error("Ошибка вставки данных:", err.message);
  });
}

// Запускаем добавление данных каждые 10 секунд
setInterval(insertRandomData, 10000);

app.get("/api/data", (req, res) => {
  db.all("SELECT * FROM temperature ORDER BY timestamp DESC LIMIT 50", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(5000, () => console.log("Backend запущен на порту 5000"));