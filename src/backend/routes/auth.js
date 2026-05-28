const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// US-01 : Inscription
router.post('/register', async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;

    if (!nom || !email || !mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Format email invalide' });
    }

    try {
        const [existingUser] = await db.execute(
            'SELECT * FROM users WHERE email = ?', [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        await db.execute(
            'INSERT INTO users (nom, email, mot_de_passe) VALUES (?, ?, ?)',
            [nom, email, hashedPassword]
        );

        res.status(201).json({ message: 'Inscription réussie' });

    } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// US-02 : Connexion email/mot de passe
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    try {
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ?', [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const user = users[0];
        const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

        if (!isValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
    message: 'Connexion réussie',
    token,
    user: {
        id: user.id,
        nom: user.nom,
        email: user.email
    }
});

    } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// US-03 : Redirection vers GitHub
router.get('/github', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
    res.redirect(githubAuthUrl);
});

// US-03 : Callback GitHub
router.get('/github/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const githubUser = userResponse.data;
        const primaryEmail = emailResponse.data.find(e => e.primary)?.email;

        const [existingUser] = await db.execute(
            'SELECT * FROM users WHERE github_id = ? OR email = ?',
            [String(githubUser.id), primaryEmail]
        );

        let userId;

        if (existingUser.length > 0) {
            userId = existingUser[0].id;
        } else {
            const [result] = await db.execute(
                'INSERT INTO users (nom, email, github_id) VALUES (?, ?, ?)',
                [githubUser.login, primaryEmail, String(githubUser.id)]
            );
            userId = result.insertId;
        }

        const token = jwt.sign(
            { id: userId, email: primaryEmail },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

      res.redirect(`${process.env.FRONTEND_URL}/index.html?token=${token}`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur GitHub OAuth' });
    }
});


module.exports = router;