var express = require('express');
var router = express.Router();
var edicoesController = require('../controllers/edicoes');

/* GET /interpretes */
router.get('/', function(req, res, next) {
    edicoesController.list()
        .then(edicoes => {
            // Extract all unique interpreters
            const interpretesMap = new Map();
            
            edicoes.forEach(edicao => {
                if (edicao.musicas && Array.isArray(edicao.musicas)) {
                    edicao.musicas.forEach(musica => {
                        if (musica.interprete && musica.pais) {
                            // Use interpreter name as key to avoid duplicates
                            if (!interpretesMap.has(musica.interprete)) {
                                interpretesMap.set(musica.interprete, {
                                    nome: musica.interprete,
                                    pais: musica.pais
                                });
                            }
                        }
                    });
                }
            });

            // Convert to array and sort alphabetically
            const sortedInterpretes = Array.from(interpretesMap.values())
                .sort((a, b) => a.nome.localeCompare(b.nome));
            
            res.json(sortedInterpretes);
        })
        .catch(err => {
            console.error('Error finding interpretes:', err);
            res.status(500).json({ 
                error: 'Error finding interpretes!',
                details: err.message 
            });
        });
});

module.exports = router;