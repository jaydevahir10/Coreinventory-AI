const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./inventory.db");

db.run(
"CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT,password TEXT)"
);

db.run(
"INSERT INTO users(username,password) VALUES('admin','admin123')"
);

app.get("/api/products",(req,res)=>{

db.all("SELECT * FROM products",[],(err,rows)=>{
res.json(rows);
});

});

app.post("/api/products",(req,res)=>{

const {name,quantity} = req.body;

db.run(
"INSERT INTO products(name,quantity) VALUES(?,?)",
[name,quantity]
);

res.json({message:"Product added"});

});

app.listen(5000,()=>{
console.log("Server running on port 5000");
});

app.post("/api/login", (req, res) => {

  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, row) => {

      if (row) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }

    }
  );

});

app.get("/api/lowstock", (req, res) => {

  db.all(
    "SELECT * FROM products WHERE quantity < 5",
    [],
    (err, rows) => {
      res.json(rows);
    }
  );

});