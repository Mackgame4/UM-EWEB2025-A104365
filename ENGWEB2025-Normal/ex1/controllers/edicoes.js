const Edicoes = require("../models/edicoes");

module.exports.list = async () => {
    return await Edicoes.find().exec()
        .then((edicoes) => {
            return edicoes;
        })
        .catch((err) => {
            console.error('Error finding edicoes:', err);
            throw err;
        });
};

module.exports.findById = async (id) => {
    return await Edicoes.findById(id).exec()
        .then((edicao) => {
            return edicao;
        })
        .catch((err) => {
            console.error('Error finding edicao:', err);
            throw err;
        });
}

module.exports.create = async (edicaoData) => {
    const edicao = new Edicoes(edicaoData);
    return await edicao.save()
        .then((savedEdicao) => {
            return savedEdicao;
        })
        .catch((err) => {
            console.error('Error creating edicao:', err);
            throw err;
        });
};

module.exports.update = async (id, edicaoData) => {
    return await Edicoes.findByIdAndUpdate(id, edicaoData, { new: true }).exec()
        .then((updatedEdicao) => {
            return updatedEdicao;
        })
        .catch((err) => {
            console.error('Error updating edicao:', err);
            throw err;
        });
};

module.exports.delete = async (id) => {
    return await Edicoes.findByIdAndDelete(id).exec()
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.error('Error deleting edicao:', err);
            throw err;
        });
};