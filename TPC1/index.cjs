const http = require('http');
const axios = require('axios');
const color = require('./utils.cjs').TCOLORS;
const fs = require('fs');
const path = require('path');

const pages = {
    '/': 'Clientes',
    '/viaturas': 'Viaturas'
};

function buildHTML(url, title, body) {
    return `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <title>${title}</title>
        </head>
        <body>
            <div class="w3-top w3-bar w3-black">
                <span class="w3-left w3-bar-item">Sistema de Gestão de Reparações</span>
                <div class="w3-right">
                    ${Object.entries(pages).map(([link, title]) => `
                        <a href="${link}" class="w3-bar-item w3-button">${title}</a>
                    `).join('')}
                </div>
            </div>
            <div class="w3-padding-48">
                ${body}
            </div>
        </body>
        </html>
    `;
}

http.createServer((req, res) => {
    if (req.url === '/') {
        axios.get('http://localhost:3000/clientes')
            .then(apiRes => {
                const clientes = apiRes.data;
                const html = buildHTML(req.url, pages[req.url], `
                    <table class="w3-table w3-striped w3-bordered w3-centered w3-hoverable">
                        <tr>
                            <th>Nome</th>
                            <th>NIF</th>
                        </tr>
                        ${clientes.map(cliente => `
                            <tr>
                                <td>${cliente.nome}</td>
                                <td>${cliente.nif}</td>
                            </tr>
                        `).join('')}
                    </table>
                `);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            })
            .catch(err => {
                console.error(color.RED, err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Failed to fetch data from API.');
            });
    }
    else if (req.url === '/viaturas') {
        axios.get('http://localhost:3000/viaturas')
            .then(viaturasData => {
                const viaturas = viaturasData.data;
                axios.get('http://localhost:3000/clientes')
                    .then(clientesData => {
                        const clientes = clientesData.data;
                        const html = buildHTML(req.url, pages[req.url], `
                            <table class="w3-table w3-striped w3-bordered w3-centered w3-hoverable">
                                <tr>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Matrícula</th>
                                    <th>Cliente</th>
                                    <th>NIF</th>
                                </tr>
                                ${viaturas.map(viatura => {
                                    const cliente = clientes.find(c => c.nif === viatura.cliente);
                                    return `
                                        <tr>
                                            <td>${viatura.marca}</td>
                                            <td>${viatura.modelo}</td>
                                            <td>${viatura.matricula}</td>
                                            <td>${cliente ? cliente.nome : 'Unknown'}</td>
                                            <td>${viatura.cliente}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </table>
                        `);
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(html);
                    })
                    .catch(err => {
                        console.error(color.RED, err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Failed to fetch data from API.');
                    });
            })
            .catch(err => {
                console.error(color.RED, err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Failed to fetch data from API.');
            });
    } else {
        fs.readFile(path.join(__dirname, 'public', '404.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading page.');
                return;
            }
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(data);
        });
    }
}).listen(8000, () => {
    console.log(color.BLUE, 'ℹ️ Server running at http://localhost:8000');
});