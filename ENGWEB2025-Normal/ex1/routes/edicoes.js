var express = require('express');
var router = express.Router();
var edicoesController = require('../controllers/edicoes');

/* GET '/edicoes' */
router.get('/', function(req, res, next) {
    const organizador = req.query.org;
    // GET /edicoes?org=EEEE: devolve a lista das edições que foram organizadas por EEEE (campos: anoEdição, organizador e vencedor);
    if (organizador) {
        edicoesController.list()
            .then(edicoes => {
                const filteredEdicoes = edicoes.filter(edicao => edicao.organizacao === organizador)
                    .map(edicao => ({
                        anoEdicao: edicao.anoEdicao,
                        organizacao: edicao.organizacao,
                        vencedor: edicao.vencedor || 'N/A'
                    }));
                if (filteredEdicoes.length > 0) {
                    res.json(filteredEdicoes);
                } else {
                    res.status(404).json({ error: 'No edicoes found for the specified organizador.' });
                }
            })
            .catch(err => {
                console.error('Error finding edicoes:', err);
                res.status(500).json({ error: 'Error finding edicoes!' });
            });
    } else {
        edicoesController.list()
            .then(edicoes => {
                if (edicoes.length > 0) {
                    // Filter and map the data
                    const filteredEdicoes = edicoes.map(edicao => ({
                        _id: edicao._id, // Include the ID for future reference
                        anoEdicao: edicao.anoEdicao,
                        organizacao: edicao.organizacao,
                        vencedor: edicao.vencedor || 'N/A' // Handle cases where vencedor might be missing
                    }));
                    res.json(filteredEdicoes);
                } else {
                    res.status(404).json({ error: 'No edicoes found.' });
                }
            })
            .catch(err => {
                console.error('Error finding edicoes:', err);
                res.status(500).json({ error: 'Error finding edicoes!' });
            });
    }
});

// GET /edicoes/:id: devolve toda a informação da edição com identificador id
router.get('/:id', function(req, res, next) {
    const id = req.params.id;
    edicoesController.findById(id)
        .then(edicao => {
            if (edicao) {
                res.json(edicao);
            } else {
                res.status(404).json({ error: 'Edicao not found.' });
            }
        })
        .catch(err => {
            console.error('Error finding edicao:', err);
            res.status(500).json({ error: 'Error finding edicao!' });
        });
});

// POST /edicoes: cria uma nova edição
router.post('/', function(req, res, next) {
    const edicaoData = req.body;
    edicoesController.create(edicaoData)
        .then(savedEdicao => {
            res.status(201).json("Edição criada com sucesso: " + savedEdicao);
        })
        .catch(err => {
            console.error('Error creating edicao:', err);
            res.status(500).json({ error: 'Error creating edicao!' });
        });
});

// DELETE /edicoes/:id: elimina da BD o registo correspondente à edição com o identificador id
router.delete('/:id', function(req, res, next) {
    const id = req.params.id;
    edicoesController.findById(id).then(edicao => {
        if (!edicao) {
            return res.status(404).json({ error: 'Edicao not found.' });
        }
        return edicoesController.delete(id);
    }).then(() => {
        res.status(204).send();
    }).catch(err => {
        console.error('Error deleting edicao:', err);
        res.status(500).json({ error: 'Error deleting edicao!' });
    });
});

// PUT /edicoes/:id: atualiza a edição com o identificador id
router.put('/:id', function(req, res, next) {
    const id = req.params.id;
    const edicaoData = req.body;

    edicoesController.findById(id).then(edicao => {
        if (!edicao) {
            return res.status(404).json({ error: 'Edicao not found.' });
        }

        // Update the edicao with the new data
        Object.assign(edicao, edicaoData);

        return edicoesController.update(id, edicao);
    }).then(updatedEdicao => {
        res.json(updatedEdicao);
    }).catch(err => {
        console.error('Error updating edicao:', err);
        res.status(500).json({ error: 'Error updating edicao!' });
    });
});

module.exports = router;