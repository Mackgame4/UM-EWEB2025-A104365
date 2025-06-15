var express = require('express');
var router = express.Router();
var edicoesController = require('../controllers/edicoes');

/* GET '/paises' */
router.get('/', function(req, res, next) {
    const papel = req.query.papel;
    // GET /paises?papel=org: devolve a lista dos países organizadores, ordenada alfabeticamente por nome e sem repetições (lista de pares: país, lista de anos em que organizou);
    if (papel === 'org') {
        edicoesController.list()
            .then(edicoes => {
                const organizadores = edicoes.reduce((acc, edicao) => {
                    if (edicao.organizacao) {
                        if (!acc[edicao.organizacao]) {
                            acc[edicao.organizacao] = [];
                        }
                        acc[edicao.organizacao].push(edicao.anoEdicao);
                    }
                    return acc;
                }, {});

                const sortedOrganizadores = Object.entries(organizadores)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([pais, anos]) => ({ pais, anos }));

                res.json(sortedOrganizadores);
            })
            .catch(err => {
                console.error('Error finding edicoes:', err);
                res.status(500).json({ error: 'Error finding edicoes!' });
            });
    // GET /paises?papel=venc: dos países vencedores, ordenada alfabeticamente por nome e sem repetições(lista de pares: país, lista de anos em que venceu);
    } else if (papel == 'venc') {
        edicoesController.list()
            .then(edicoes => {
                const vencedores = edicoes.reduce((acc, edicao) => {
                    if (edicao.vencedor) {
                        if (!acc[edicao.vencedor]) {
                            acc[edicao.vencedor] = [];
                        }
                        acc[edicao.vencedor].push(edicao.anoEdicao);
                    }
                    return acc;
                }, {});

                const sortedVencedores = Object.entries(vencedores)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([pais, anos]) => ({ pais, anos }));

                res.json(sortedVencedores);
            })
            .catch(err => {
                console.error('Error finding edicoes:', err);
                res.status(500).json({ error: 'Error finding edicoes!' });
            });
    }
});

module.exports = router;