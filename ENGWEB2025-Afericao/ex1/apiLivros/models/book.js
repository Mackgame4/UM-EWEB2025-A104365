var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    _id: String, // bookId
    title: { type: String, required: true },
    series: String,
    author: { type: String, required: true },
    rating: { type: Number, default: 0 },
    description: String,
    language: String,
    isbn: String,
    genres: { type: [String], default: [] }, // Lista de géneros
    characters: { type: [String], default: [] }, // Lista de personagens
    bookFormat: String,
    edition: String,
    pages: { type: Number, default: null },
    publisher: String,
    publishDate: String,
    firstPublishDate: String,
    awards: { type: [String], default: [] }, // Lista de prémios
    numRatings: { type: Number, default: 0 },
    ratingsByStars: { type: [Number], default: [] },
    likedPercent: { type: Number, default: 0 },
    setting: { type: [String], default: [] },
    coverImg: String,
    bbeScore: { type: Number, default: 0 },
    bbeVotes: { type: Number, default: 0 },
    price: { type: Number, default: 0.0 }
}, { collection: 'livros', versionKey: false });

// Criar e exportar o modelo Book
module.exports = mongoose.model('Book', bookSchema);