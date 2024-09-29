const express = require("express")
const mysql = require("mysql2")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
const PORT = 3000


// Creating my sql connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// connecting to the database
db.connect((err) => {
    if (err) {
        console.log("Failed to connect to database", err)
        return;
    }
    console.log("Database connection was successful")
})

// middleware to parse json bodies
app.use(express.json())


// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
db.query('SELECT first_name, last_name, provider_speciality FROM providers', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
});
});

// 3. Filter patients by first_name
app.get('/patients/filter', (req, res)=>{
    const {first_name} = req.query;
    db.query('SELECT * FROM patients WHERE first_name = ?',
        [first_name], (err, results) => {
            if (err) return res.status(500).json({error: err.message});
            res.json(results)
        }
    )
})

// 4. Retrieve all providers by their speciality
app.get('/providers/speciality', (req, res) => {
    const {speciality} = req.query;
    db.query("SELECT * FROM provider WHERE provider_speciality = ?", [speciality], (err, results) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(results)
    })
})

// Listening to server
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})