const express = require('express');
const router = express.Router();
const db = require('../config/db');

// US-07 : Ajouter un commentaire
router.post('/', async (req, res) => {
    const { contenu, code_id, user_id } = req.body;

    if (!contenu) {
        return res.status(400).json({
            message: 'Le commentaire ne peut pas être vide'
        });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO commentaires (contenu, code_id, user_id) VALUES (?, ?, ?)',
            [contenu, code_id, user_id]
        );
        res.status(201).json({
            message: 'Commentaire ajouté avec succès',
            id: result.insertId
        });
    } catch (error) {
        console.error('Erreur commentaire:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// US-07 : Récupérer les commentaires d'un code
router.get('/:code_id', async (req, res) => {
    const { code_id } = req.params;
    try {
        const [commentaires] = await db.execute(
            `SELECT commentaires.*, users.nom as auteur 
             FROM commentaires 
             JOIN users ON commentaires.user_id = users.id 
             WHERE commentaires.code_id = ?
             ORDER BY commentaires.created_at ASC`,
            [code_id]
        );
        res.json(commentaires);
    } catch (error) {
        console.error('Erreur récupération commentaires:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;