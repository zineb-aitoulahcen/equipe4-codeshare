const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// US-01 : Inscription avec validation email unique
router.post('/register', async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;

    // Vérifier que tous les champs sont remplis
    if (!nom || !email || !mot_de_passe) {
        return res.status(400).json({ 
            message: 'Tous les champs sont obligatoires' 
        });
    }

    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            message: 'Format email invalide' 
        });
    }

    try {
        // Vérifier si l'email existe déjà
        const [existingUser] = await db.execute(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ 
                message: 'Cet email est déjà utilisé' 
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Insérer l'utilisateur dans la base de données
        await db.execute(
            'INSERT INTO users (nom, email, mot_de_passe) VALUES (?, ?, ?)',
            [nom, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Inscription réussie' 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur serveur', error 
        });
    }
});

module.exports = router;