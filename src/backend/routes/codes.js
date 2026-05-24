const express = require('express');
const router = express.Router();
const db = require('../config/db');

// US-04 : Publication de code
router.post('/', async (req, res) => {
    const { titre, description, code, langage, user_id } = req.body;

    // Valider les champs obligatoires
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

// US-06 : Récupérer tous les codes
router.get('/', async (req, res) => {
    try {
        const [codes] = await db.execute(
            `SELECT codes.id, codes.titre, codes.description, 
            codes.code, codes.langage, codes.created_at,
            users.nom as auteur
            FROM codes 
            JOIN users ON codes.user_id = users.id
            ORDER BY codes.created_at DESC`
        );

        res.status(200).json(codes);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;