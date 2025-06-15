const mongoose = require("mongoose");

const musicaSchema = new mongoose.Schema({
  id: String,
  titulo: String,
  pais: String,
  compositor: String,
  interprete: String,
  link: String,
  letra: { type: String, required: false } // Optional field
}, { _id: false }); // Prevent automatic _id creation for subdocuments

const edicoesSchema = new mongoose.Schema({
  _id: String, // Using the existing ID (e.g., "ed1956")
  anoEdicao: Number,
  organizacao: String, // Host country
  vencedor: String, // Winner country
  musicas: {
    type: [musicaSchema], // Array of song subdocuments
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "Each edition must have at least one song"
    }
  }
}, {
  timestamps: false, // Disable automatic createdAt/updatedAt
  versionKey: false // Disable __v field
});

module.exports = mongoose.model("Edicoes", edicoesSchema);