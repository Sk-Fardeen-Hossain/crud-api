const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const Item = require('./models/item'); // Import the Item model
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your MongoDB connection string
const uri = 'mongodb+srv://evad8886:1btBGPtr1qlnd4a3@cluster0.ufg5bwh.mongodb.net/crudApp?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware to parse JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt: username=${username}, password=${password}`);

    try {
        const user = await User.findOne({ username, password });
        console.log('User found:', user);

        if (user) {
            console.log('Login successful');
            res.json({ success: true }); // Send JSON response on successful login
        } else {
            console.log('Invalid username/password');
            res.json({ success: false, message: 'Invalid username/password' }); // JSON response on invalid login
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' }); // JSON response on server error
    }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); // Serve the dashboard HTML file
});

// CRUD operations for items
app.post('/items', async (req, res) => {
    const { itemname, details } = req.body;
    try {
        const newItem = new Item({ itemname, details });
        await newItem.save();
        res.json({ success: true });
    } catch (err) {
        console.error('Error adding item:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
