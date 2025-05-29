const Book = require('../models/book');
const mongoose = require('mongoose');

// Controller for the "Book" model
const CAP = 1000 // cap the search to 1000 documents for debug purposes

// List all books
module.exports.list = async () => {
    return await Book.find().limit(CAP).exec()
        .then((books) => {
            return books;
        })
        .catch((err) => {
            console.error('Error finding books:', err);
            throw err;
        });
};

// GET /books/:id devolve o registo com identificador id (em PR.md deves indicar o que vais usar como id, isto é, usar _id como id)
module.exports.getBookById = async (id) => {
    return await Book.findById(id).exec()
        .then((book) => {
            if (!book) {
                throw new Error(`Book with ID ${id} not found`);
            }
            console.log("found book", book);
            return book;
        })
        .catch((err) => {
            console.error('Error finding book by ID:', err);
            throw err;
        });
};


// GET /books?charater=EEEE devolve a lista dos livros em que EEEE faz parte do nome de um dos personagens
module.exports.getBooksByCharacter = async (character) => {
    return await Book.find({ characters: { $regex: character, $options: 'i' } }).exec()
        .then((books) => {
            if (!books || books.length === 0) {
                throw new Error(`No books found with character containing '${character}'`);
            }
            console.log(`Found ${books.length} books with character containing '${character}'`);
            return books;
        })
        .catch((err) => {
            console.error('Error finding books by character:', err);
            throw err;
        });
};

// GET /books?genre=AAA devolve a lista dos livros associados ao género (genre) AAA
module.exports.getBooksByGenre = async (genre) => {
    return await Book.find({ genres: { $regex: genre, $options: 'i' } }).limit(CAP).exec()
        .then((books) => {
            if (!books) {
                throw new Error('Books not found.');
            }
            return books;
        })
        .catch((err) => {
            console.error('Error finding books:', err);
            throw err;
        });
}
//GET /books/genres devolve a lista de géneros ordenada alfabeticamente e sem repetições
module.exports.getGenres = async () => {
    return await Book.distinct('genres').exec()
        .then((genres) => {
            if (!genres) {
                throw new Error('Genres not found.');
            }
            return genres.sort();
        })
        .catch((err) => {
            console.error('Error finding genres:', err);
            throw err;
        });
}