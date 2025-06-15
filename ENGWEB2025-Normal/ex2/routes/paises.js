var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET '/paises' listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:pais', function(req, res, next) {
  const pais = req.params.pais;

  axios.get('http://localhost:25000/allData')
    .then(response => {
      const edicoes = response.data;

      const participacoes = [];
      const organizacoes = [];

      edicoes.forEach(ed => {
        // Participações
        if (ed.musicas) {
          ed.musicas.forEach(m => {
            if (m.pais === pais) {
              participacoes.push({
                id: ed._id,
                anoEdicao: ed.anoEdicao,
                musica: m.titulo,
                interprete: m.interprete,
                venceu: ed.vencedor === pais
              });
            }
          });
        }

        // Organização
        if (ed.organizacao === pais) {
          organizacoes.push({
            id: ed._id,
            anoEdicao: ed.anoEdicao
          });
        }
      });

      res.render('pais', {
        title: `Informações sobre ${pais}`,
        pais: pais,
        participacoes: participacoes,
        organizacoes: organizacoes
      });
    })
    .catch(error => {
      console.error('Erro ao obter dados das edições:', error);
      res.status(500).send('Erro ao obter dados das edições');
    });
});

module.exports = router;
