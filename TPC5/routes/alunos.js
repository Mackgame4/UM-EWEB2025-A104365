  var express = require('express');
  var router = express.Router();
  var alunosController = require('../controllers/alunos');

  /* GET alunos listing. */
  router.get('/', function(req, res, next) {
    alunosController.list()
      .then(alunos => {
        res.status(200).render('alunos', { alunos: alunos });
      })
      .catch(err => res.status(500).render('error', { error: err.message }));
  });



  /* GET aluno by id. */
  router.get('/:id', function(req, res, next) {
    alunosController.lookUp(req.params.id)
      .then(dados => {
        if (dados) res.status(200).jsonp(dados); // 200 OK
        else res.status(404).jsonp({ error: "Aluno não encontrado" }); // 404 Not Found
      })
      .catch(err => res.status(500).jsonp({ error: err.message }));
  });

  /* POST aluno */
  router.post('/', function(req, res, next) {
    alunosController.insert(req.body)
      .then(dados => res.status(201).jsonp(dados)) // 201 Created
      .catch(err => res.status(500).jsonp({ error: err.message }));
  });

  /* UPDATE aluno */
  router.put('/:id', function(req, res, next) {
    alunosController.update(req.params.id, req.body)
      .then(dados => {
        if (dados) res.status(200).jsonp(dados); // 200 OK
        else res.status(404).jsonp({ error: "Aluno não encontrado" }); // 404 Not Found
      })
      .catch(err => res.status(500).jsonp({ error: err.message }));
  });

  /* DELETE aluno */
  router.get('/delete/:id', function(req, res, next) {
    alunosController.delete(req.params.id)
      .then(dados => {
        if (dados) res.redirect('/alunos'); // Redireciona para a lista após apagar
        else res.status(404).render('error', { error: "Aluno não encontrado" });
      })
      .catch(err => res.status(500).render('error', { error: err.message }));
  });

  /* Inverter TPC */
  router.put('/:id/:idTPC', function(req, res, next) {
    alunosController.invertTPC(req.params.id, req.params.idTPC)
      .then(dados => {
        if (dados) res.status(200).jsonp(dados); // 200 OK
        else res.status(404).jsonp({ error: "Aluno ou TPC não encontrado" }); // 404 Not Found
      })
      .catch(err => res.status(500).jsonp({ error: err.message }));
  });


// /edit/:id
router.get('/edit/:id', function(req, res, next) {
  alunosController.lookUp(req.params.id)
    .then(dados => {
      if (dados) res.status(200).render('editar_aluno', { aluno: dados });
      else res.status(404).render('error', { error: "Aluno não encontrado" });
    })
    .catch(err => res.status(500).render('error', { error: err.message }));
}
);

router.post('/edit/:id', function(req, res, next) {
  console.log(req.body); // Imprime os dados que estão sendo enviados
  alunosController.update(req.params.id, req.body)
    .then(dados => {
      if (dados) res.redirect('/alunos');
      else res.status(404).render('error', { error: "Aluno não encontrado" });
    })
    .catch(err => res.status(500).render('error', { error: err.message }));
});







  module.exports = router;
