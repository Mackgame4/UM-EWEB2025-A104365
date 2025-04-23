// controler for the alunos
//
const Aluno = require('../modules/aluno');
// get all the alunos

module.exports.list = () => {
    console.log("Listar todos os alunos...");
    
    return Aluno.find().exec()
        .then(data => {
            return data;
        })
        .catch(err => {
            throw err;
        });
};

// get aluno by id
module.exports.lookUp = id => {
    console.log("Procurar aluno com id:", id);
    
    return Aluno.findById(id).exec()
        .then(data => {
            console.log("Aluno encontrado:", data);
            return data;
        })
        .catch(err => {
            console.error("Erro ao buscar aluno:", err);
            throw err;
        });
}

// create a new aluno, only if the id is not already in use, need to check if there is any _id with the same id , and puting the the db

module.exports.insert = (aluno) => {
    console.log("Inserir aluno:", aluno);

    // Verificar se o ID já existe
    return Aluno.findById(aluno._id).exec()
        .then(existingAluno => {
            if (existingAluno) {
                console.error("Erro ao inserir aluno:", "ID já em uso");
                throw "ID já em uso"; // Lança um erro se o aluno já existir
            }

            // Se não existir, cria um novo aluno
            return Aluno.create(aluno);
        })
        .then(newAluno => {
            console.log("Aluno inserido:", newAluno);
            return newAluno; // Retorna o aluno inserido
        })
        .catch(err => {
            console.error("Erro ao inserir aluno:", err);
            throw err; // Lança o erro para ser tratado em outra parte
        });
}

// No controller de alunos ou no ponto de atualização
module.exports.update = (id, aluno) => {
    console.log("Atualizando aluno com id:", id, "com dados:", aluno);

    // Objeto de atualização
    let updatedAluno = {};

    // Atualiza o nome, se fornecido
    if (aluno.nome) {
        updatedAluno.nome = aluno.nome;
    }

    // Atualiza o gitlink, se fornecido
    if (aluno.gitlink) {
        updatedAluno.gitlink = aluno.gitlink;
    }

    // Inicializa os campos tpcX com false (default)
    const tpcs = ['tpc1', 'tpc2', 'tpc3', 'tpc4', 'tpc5', 'tpc6', 'tpc7', 'tpc8'];

    // Inicializa todos os TPCs como false
    tpcs.forEach(tpc => updatedAluno[tpc] = false);

    // Para cada tpcX, se o campo existir no corpo da requisição (indica que o checkbox foi marcado), marca como true
    tpcs.forEach(tpc => {
        if (aluno[tpc] === '1') {
            updatedAluno[tpc] = true;  // Marca o TPC como verdadeiro
        }
    });

    // Atualiza o aluno no banco de dados, se existir
    return Aluno.findByIdAndUpdate(id, updatedAluno, { new: true }).exec()
        .then(updatedAluno => {
            console.log("Aluno atualizado:", updatedAluno);
            return updatedAluno;
        })
        .catch(err => {
            console.error("Erro ao atualizar aluno:", err);
            throw err;
        });
};




module.exports.delete = id => {
    console.log("Deletar aluno com id:", id);
    return Aluno.findByIdAndDelete(id).exec();
}

module.exports.invertTPC = (id, idTPC) => {
    return Aluno.findOne({ _id: id }).exec()
        .then(aluno => {
            if (!aluno) {
                throw new Error("Aluno não encontrado");
            }

            var tpc = `tpc${idTPC}`;
            if (aluno[tpc] != null) {
                aluno[tpc] = !aluno[tpc];
                return aluno.save();
            } else {
                throw new Error("TPC não encontrado");
            }
        })
        .then(updatedAluno => {
            console.log("Aluno atualizado:", updatedAluno);
            return updatedAluno;
        })
        .catch(err => {
            console.error("Erro ao inverter TPC:", err);
            throw err;
        });
}



