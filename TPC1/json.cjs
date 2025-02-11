const fs = require('fs');
const path = require('path');
const color = require('./utils.cjs').TCOLORS;

const inputFile = path.join(__dirname, 'public', 'dataset_reparacoes.json');
const outputFile = path.join(__dirname, 'public', 'dataset_reparacoes_parsed.json');

fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading input file:', err);
        return;
    }
    try {
        const inputData = JSON.parse(data);
        const oldReparacoes = inputData.reparacoes;

        const reparacoes = [];
        const clientes = [];
        const viaturas = [];
        const intervencoes = [];

        // Use Sets to avoid duplicate entries
        const clientesSet = new Set();
        const viaturasSet = new Set();
        const intervencoesSet = new Set();

        oldReparacoes.forEach(reparacao => {
            // Extract Cliente
            const clienteKey = reparacao.nif;
            if (!clientesSet.has(clienteKey)) {
                clientesSet.add(clienteKey);
                clientes.push({
                    nome: reparacao.nome,
                    nif: reparacao.nif
                });
            }

            // Extract Viatura
            const viaturaKey = `${reparacao.nif}_${reparacao.viatura.matricula}`;
            if (!viaturasSet.has(viaturaKey)) {
                viaturasSet.add(viaturaKey);
                viaturas.push({
                    marca: reparacao.viatura.marca,
                    modelo: reparacao.viatura.modelo,
                    matricula: reparacao.viatura.matricula,
                    cliente: clienteKey // Reference to cliente
                });
            }

            // Extract Intervencoes (Array)
            reparacao.intervencoes.forEach(intervencao => {
                const intervencaoKey = `${reparacao.nif}_${intervencao.codigo}`;
                if (!intervencoesSet.has(intervencaoKey)) {
                    intervencoesSet.add(intervencaoKey);
                    intervencoes.push({
                        codigo: intervencao.codigo,
                        nome: intervencao.nome,
                        descricao: intervencao.descricao,
                        viatura: viaturaKey // Reference to viatura
                    });
                }
            });

            // Reparacoes is a list of objects with Cliente, Viatura and Intervencoes and the data and nr_intervencoes
            reparacoes.push({
                cliente: clienteKey,
                viatura: viaturaKey,
                data: reparacao.data,
                intervencoes: reparacao.intervencoes,
                nr_intervencoes: reparacao.nr_intervencoes // or: reparacao.intervencoes.length
            });
        });

        // Create output JSON structure
        const outputData = {
            reparacoes,
            clientes,
            viaturas,
            intervencoes
        };

        // Write to output.json
        fs.writeFile(outputFile, JSON.stringify(outputData, null, 4), 'utf8', (err) => {
            if (err) {
                console.error('Error writing output file:', err);
            } else {
                console.log(color.GREEN, '✅ Process completed! Output saved to', outputFile);
            }
        });

    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
    }
});
