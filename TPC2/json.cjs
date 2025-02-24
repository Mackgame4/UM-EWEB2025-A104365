const fs = require('fs');

function renameKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(renameKeys);
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key === '#text' ? 'text' : key,
                renameKeys(value)
            ])
        );
    }
    return obj;
}

const filePath = 'public/db.json';
const filePathOutput = 'public/db_output.json';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Erro ao ler o arquivo:", err);
        return;
    }
    
    let jsonData;
    try {
        jsonData = JSON.parse(data);
    } catch (parseErr) {
        console.error("Erro ao analisar JSON:", parseErr);
        return;
    }
    
    const updatedData = renameKeys(jsonData);
    
    fs.writeFile(filePathOutput, JSON.stringify(updatedData, null, 4), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error("Erro ao escrever no arquivo:", writeErr);
            return;
        }
        console.log("As chaves '#text' foram renomeadas para 'text' no arquivo db_output.json.");
    });
});