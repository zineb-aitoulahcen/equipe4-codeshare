const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const codesRoutes = require('./routes/codes');
const commentairesRoutes = require('./routes/commentaires');

const app = express();

// Middlewares
app.use(cors({
    origin: 'https://equipe4-codeshare.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Servir les fichiers frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/codes', codesRoutes);
app.use('/api/commentaires', commentairesRoutes);

// Route de test
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});