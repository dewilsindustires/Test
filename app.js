// app.js
const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Temporary user storage (In a real app, use a database)
let users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

// Home route to serve login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).send('Invalid username or password.');
  }

  // Compare password with hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      res.send('Login successful!');
    } else {
      res.status(401).send('Invalid username or password.');
    }
  });
});

// Route to register a new user (for testing)
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).send('Error registering user.');
    }

    // Store the user (For now, in users.json)
    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    fs.writeFileSync('users.json', JSON.stringify(users));

    res.send('User registered successfully!');
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});