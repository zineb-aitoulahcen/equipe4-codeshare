const express = require('express');
const router = express.Router();
const db = require('../config/db');

// US-06 : Récupérer tous les codes
router.get('/', async (req, res) => {
    try {
        const [codes] = await db.execute(
            `SELECT codes.*, users.nom as auteur 
             FROM codes 
             JOIN users ON codes.user_id = users.id 
             ORDER BY codes.created_at DESC`
        );
        res.json(codes);
    } catch (error) {
        console.error('Erreur récupération codes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// US-04 : Publication de code
router.post('/', async (req, res) => {
    const { titre, description, code, langage, user_id } = req.body;

    if (!titre || !code || !user_id) {
        return res.status(400).json({
            message: 'Titre et code sont obligatoires'
        });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO codes (titre, description, code, langage, user_id) VALUES (?, ?, ?, ?, ?)',
            [titre, description, code, langage, user_id]
        );
        res.status(201).json({
            message: 'Code publié avec succès',
            id: result.insertId
        });
    } catch (error) {
        console.error('Erreur publication:', error);
        res.status(500).json({
            message: 'Erreur serveur', error: error.message
        });
    }
});

// US-05 : Récupérer un code par ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [codes] = await db.execute(
            `SELECT codes.*, users.nom as auteur 
             FROM codes 
             JOIN users ON codes.user_id = users.id 
             WHERE codes.id = ?`,
            [id]
        );
        if (codes.length === 0) {
            return res.status(404).json({ message: 'Code non trouvé' });
        }
        res.json(codes[0]);
    } catch (error) {
        console.error('Erreur récupération code:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;