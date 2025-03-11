var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
const axios = require('axios');

const router = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// custom routes
router.get('/hello', function(req, res) {
  res.send('Hello World!');
});

router.get('/filmes', function(req, res) {
  axios.get('http://localhost:3001/filmes')
    .then(function(response) {
      //res.send(response.data);
      res.render('filmes', { filmes: response.data, titulo: 'Lista de Filmes' });
    })
    .catch(function(error) {
      console.log(error);
    });
});

router.get('/atores', function(req, res) {
  axios.get('http://localhost:3001/filmes')
    .then(function(response) {
      const filmes = response.data;
      let atores = [];

      filmes.forEach(filme => {
        atores = atores.concat(filme.cast);
      });

      atores = [...new Set(atores)];

      res.render('atores', { atores: atores, titulo: 'Lista de Atores' });
    })
    .catch(function(error) {
      console.log(error);
    });
});


router.get('/atores/:nome', function(req, res) {
  const atorNome = req.params.nome;
  console.log(atorNome);

  axios.get('http://localhost:3001/filmes')
    .then(function(response) {
      const filmes = response.data;

      // Filtrando filmes onde o ator está presente no array de cast
      const filmesDoAtor = filmes.filter(filme => 
        Array.isArray(filme.cast) && filme.cast.includes(atorNome)
      );

      console.log(filmesDoAtor);
      console.log(filmesDoAtor.length);

      res.render('ator', { ator: atorNome, filmes: filmesDoAtor, titulo: 'Filmes de ' + atorNome });
    })
    .catch(function(error) {
      console.log(error);
    });
});

router.get('/filmes/editar/:id', function(req, res) {
  const id = req.params.id;

  // Aqui você pode buscar o filme pelo título ou ID no seu banco de dados (ou array)
  axios.get('http://localhost:3001/filmes')
    .then(function(response) {
      const filme = response.data.find(f => f.id === id); // Encontrar o filme pelo título
      if (filme) {
        res.render('editarFilme', { filme: filme, titulo: 'Editar Filme' });
      } else {
        res.status(404).send('Filme não encontrado');
      }
    })
    .catch(function(error) {
      console.log(error);
    });
});
// Rota POST para processar a edição de um filme
router.post('/filmes/editar/:id', function (req, res, next) {
  const updatedFilm = {
      title: req.body.title,
      year: req.body.year,
      genres: req.body.genres.split(',').map(g => g.trim()), // Transformar string de gêneros em array
      cast: req.body.cast.split(',').map(a => a.trim()),  // Transformar string de atores em array
      id: req.params.id,
  };
  console.log(updatedFilm);

  // Atualizando o filme via API com axios
  const id = req.params.id;
  console.log(id);
  axios.put(`http://localhost:3001/filmes/${req.params.id}`, updatedFilm)
      .then(response => {
          res.redirect('/filmes'); // Redireciona para a lista de filmes após a edição
      })
      .catch(error => {
          res.render('error', { error: error, message: 'Erro ao atualizar o filme' });
      });
});

// Rota para excluir um filme
router.get('/filmes/excluir/:id', function (req, res) {
  const id = req.params.id;

  // Enviar o pedido DELETE para a API que irá excluir o filme
  axios.delete(`http://localhost:3001/filmes/${id}`)
    .then(response => {
      // Redireciona de volta para a lista de filmes após a exclusão
      res.redirect('/filmes');
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: error, message: 'Erro ao excluir o filme' });
    });
});

module.exports = app;