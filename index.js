import express from "express";

const app = express();
const port = 3007;

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

import mysql from "mysql2";

// create the connection pool to database
const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_express_api'
});

// Verify that the database is connected successfully
dbPool.getConnection(function(error) {
    if (error) {
        console.log(error.message);
    } else {
        console.log('Connection Succuessfully!');
    }
});

// route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// CREATE DATA
app.post('/user', (req, res) => {
    let formData = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    }
    dbPool.query('INSERT INTO users SET ?', formData, function (err, result) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: result[0]
            })
        }
    })
});

// READ DATA
app.get('/users', (req, res) => {
    dbPool.query('SELECT * FROM users', (error, result) => {
        if(error) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }else {
            return res.status(200).json({
                status: true,
                message: 'List Data Users',
                data: result
            })
        }
    });
});

// READ DATA BY ID
app.get('/user/:id', (req, res) => {
    let id = req.params.id;

    dbPool.query(`SELECT * FROM users WHERE id = ${id}`, (error, result) => {
        if(error) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } if (result.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data User Not Found!',
            })
        }else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data User',
                data: result[0]
            })
        }
    });
});

// UPDATE DATA
app.put('/user/:id', (req, res) => {
    let id = req.params.id;

    let formData = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    }
    dbPool.query(`UPDATE users SET ? WHERE id = ${id}`, formData, function (err, result) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Data Successfully',
                data: result[0]
            })
        }
    })
});

app.delete('/user/:id', (req, res) => {
    let id = req.params.id;

    let formData = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    }
    dbPool.query(`DELETE FROM users WHERE id = ${id}`, formData, function (err, result) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
                data: result[0]
            })
        }
    })
});

app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`)
})
