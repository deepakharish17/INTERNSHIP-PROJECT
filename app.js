const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Hyderabad ltts', // Replace with your MySQL password
    database: 'emplo', // Ensure this database exists
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// === User Authentication Endpoints ===

// Register a new user
app.post('/api/signup', async (req, res) => {
    const { username, psNo, email, password } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, psNo, email, password) VALUES (?, ?, ?, ?)';
    
    db.query(query, [username, psNo, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, username });
    });
});

// Sign in an existing user
app.post('/api/signin', async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token, username: user.username });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Forgot password functionality
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';

    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).json({ message: 'No user found with this email' });

        // Placeholder for email sending logic
        res.json({ message: 'Password reset link sent to your email' });
    });
});

// === Project Management Endpoints ===

// Get all projects
app.get('/api/projects', (req, res) => {
    const query = 'SELECT * FROM projects';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Create a new project
app.post('/api/projects', (req, res) => {
    const { title, description, employeeNames, image } = req.body;
    const query = 'INSERT INTO projects (title, description, employeeNames, image) VALUES (?, ?, ?, ?)';
    db.query(query, [title, description, employeeNames.join(','), image], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, title, description, employeeNames, image });
    });
});

// Get a specific project
app.get('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const query = 'SELECT * FROM projects WHERE id = ?';
    db.query(query, [projectId], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    });
});

// Update a project
app.put('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const { title, description, employeeNames, image } = req.body;
    const query = 'UPDATE projects SET title = ?, description = ?, employeeNames = ?, image = ? WHERE id = ?';
    db.query(query, [title, description, employeeNames.join(','), image, projectId], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ id: projectId, title, description, employeeNames, image });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    });
});

// Delete a project
app.delete('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const query = 'DELETE FROM projects WHERE id = ?';
    db.query(query, [projectId], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'Project deleted' });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    });
});

// === Employee Management Endpoints ===

// Get all employees
app.get('/api/employees', (req, res) => {
    const query = 'SELECT * FROM employees';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Get a specific employee by name
app.get('/api/employees/:name', (req, res) => {
    const employeeName = req.params.name;
    const query = 'SELECT * FROM employees WHERE name = ?';
    db.query(query, [employeeName], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    });
});

// Create a new employee
app.post('/api/employees', (req, res) => {
    const { name, position, department, email, phone, projects } = req.body;
    const query = 'INSERT INTO employees (name, position, department, email, phone, projects) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, position, department, email, phone, projects.join(', ')], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, name, position, department, email, phone, projects });
    });
});

// Update an employee's details
app.put('/api/employees/:name', (req, res) => {
    const employeeName = req.params.name;
    const { position, department, email, phone, projects } = req.body;
    const query = 'UPDATE employees SET position = ?, department = ?, email = ?, phone = ?, projects = ? WHERE name = ?';
    db.query(query, [position, department, email, phone, projects.join(','), employeeName], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ name: employeeName, position, department, email, phone, projects });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    });
});

// Delete an employee
app.delete('/api/employees/:name', (req, res) => {
    const employeeName = req.params.name;
    const query = 'DELETE FROM employees WHERE name = ?';
    db.query(query, [employeeName], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'Employee deleted' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});