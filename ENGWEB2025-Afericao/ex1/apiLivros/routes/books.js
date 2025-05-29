var express = require('express');
var router = express.Router();
var booksController = require('../controllers/books');

/* GET books page. */
// GET /books
router.get('/', function(req, res, next) {
  const { genre, character } = req.query; // Extrai parâmetros da URL
  if (genre) {
    // Se o parâmetro "genre" foi passado, chama a função correta
    booksController.getBooksByGenre(genre)
      .then(books => {
        if (books.length > 0) res.status(200).jsonp(books);
        else res.status(404).send('No books found for this genre.');
      })
      .catch(err => {
        console.error('Error finding books by genre:', err);
        res.status(500).send('Error finding books!');
      });
  } else if (character) {
    // Se o parâmetro "character" foi passado, chama a função correta
    booksController.getBooksByCharacter(character)
    .then(books => {
      if (books.length > 0) res.status(200).jsonp(books);
      else res.status(404).send('No books found for this character.');
    })
    .catch(err => {
      console.error('Error finding books by character:', err);
      res.status(500).send('Error finding books!');
    });
  } else {
    // Se nenhum parâmetro foi passado, retorna todos os livros
    booksController.list()
      .then(books => {
        if (books.length > 0) res.status(200).jsonp(books);
        else res.status(404).send('No books found.');
      })
      .catch(err => {
        console.error('Error finding books:', err);
        res.status(500).send('Error finding books!');
      });
  }
});

// or:
/*
// GET /books?charater=EEEE
router.get('/', function(req, res, next) {
  const character = req.query.character;
  if (!character) {
    return res.status(400).send('Character query parameter is required.');
  }
  booksController.getBooksByCharacter(character)
    .then(books => {
      if (books.length > 0) res.status(200).jsonp(books);
      else res.status(404).send('No books found for the specified character.');
    })
    .catch(err => {
      console.error('Error finding books by character:', err);
      res.status(500).send('Error finding books!');
    });
});
*/

// GET /books/genres
router.get('/genres', function(req, res, next) {
  booksController.getGenres()
    .then(genres => {
      if (genres) res.status(200).jsonp(genres);
      else res.status(404).send('Not found.');
    })
    .catch(err => {
      console.error('Error finding genres:', err);
      res.status(500).send('Error finding books!');
    });
});

// GET /books/genres/:genre
router.get('/genres/:genre', function(req, res, next) {
  const genre = req.params.genre;
  booksController.getBooksByGenre(genre)
    .then(books => {
      if (books) res.status(200).jsonp(books);
      else res.status(404).send('Not found.');
    })
    .catch(err => {
      console.error('Error finding books:', err);
      res.status(500).send('Error finding books!');
    });
});

// GET /books/characters/:character
router.get('/characters/:character', function(req, res, next) {
  const character = req.params.character;
  booksController.getBooksByCharacter(character)
    .then(books => {
      if (books) res.status(200).jsonp(books);
      else res.status(404).send('Not found.');
    })
    .catch(err => {
      console.error('Error finding books:', err);
      res.status(500).send('Error finding books!');
    });
});

// GET /books/:id (esta rota deve vir por último)
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  booksController.getBookById(id)
    .then(book => {
      if (book) res.status(200).jsonp(book);
      else res.status(404).send('Not found.');
    })
    .catch(err => {
      console.error('Error finding book:', err);
      res.status(500).send('Error finding book!');
    });
});

module.exports = router;