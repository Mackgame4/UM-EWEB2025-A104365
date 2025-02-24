const http = require('http');
const url = require('url');
const axios = require('axios');

function renderPage(res, title, content) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f9;
                    color: #333;
                }
                .header {
                    background-color: #1e3d58;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                .header h2 {
                    margin: 0;
                }
                .nav-bar a {
                    text-decoration: none;
                    color: white;
                    margin: 0 10px;
                    padding: 10px 20px;
                    background-color: #3b4f7f;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                }
                .nav-bar a:hover {
                    background-color: #1e3d58;
                }
                .content {
                    padding: 20px;
                }
                table {
                    width: 100%;
                    margin-top: 20px;
                    border-collapse: collapse;
                }
                table th, table td {
                    padding: 10px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                .btn {
                    background-color: #3b4f7f;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    margin-top: 20px;
                    display: inline-block;
                    transition: background-color 0.3s;
                }
                .btn:hover {
                    background-color: #1e3d58;
                }
                .icon {
                    margin-right: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2><a href="/" style="color: white; text-decoration: none;">SoundRhythm</a></h2>
            </div>
            <div class="content">
                ${content}
            </div>
        </body>
        </html>
    `);
}

function renderMainPage(res) {
    renderPage(res, 'Escola de Música', `
        <h3>Bem-vindo à nossa Escola de Música!</h3>
        <p>Explore os alunos, cursos e instrumentos disponíveis.</p>
        <p><a href="/alunos" class="btn"><i class="fas fa-users"></i> Ver Alunos</a></p>
        <p><a href="/cursos" class="btn"><i class="fas fa-book-open"></i> Ver Cursos</a></p>
        <p><a href="/instrumentos" class="btn"><i class="fas fa-guitar"></i> Ver Instrumentos</a></p>
    `);
}

function renderAlunosPage(res) {
    axios.get('http://localhost:3000/alunos')
        .then(resp => {
            const alunos = resp.data.map(a => 
                `<tr><td><a href="/alunos/${a.id}">${a.id}</a></td><td>${a.nome}</td><td><a href="/cursos/${a.curso}">${a.curso}</a></td></tr>`
            ).join('');
            renderPage(res, 'Alunos', `
                <h3>Lista de Alunos</h3>
                <table class="w3-table w3-striped w3-bordered">
                    <tr><th>ID</th><th>Nome</th><th>Curso</th></tr>
                    ${alunos}
                </table>
            `);
        })
        .catch(err => renderPage(res, 'Erro', `<p>Erro ao carregar alunos.</p>`));
}

function renderAlunoPage(res, id) {
    axios.get(`http://localhost:3000/alunos/${id}`)
        .then(resp => {
            const a = resp.data;
            axios.get(`http://localhost:3000/instrumentos?text=${a.instrumento}`)
                .then(resp => {
                    const instrumento = resp.data[0];
                    renderPage(res, `Aluno ${a.id}`, `
                        <h3>Aluno: ${a.nome}</h3>
                        <p><strong>ID:</strong> ${a.id}</p>
                        <p><strong>Curso:</strong> <a href="/cursos/${a.curso}">${a.curso}</a></p>
                        <p><strong>Instrumento:</strong> <a href="/instrumentos/${instrumento.id}">${a.instrumento}</a></p>
                    `);
                })
                .catch(err => renderPage(res, 'Erro', `<p>Erro ao carregar o instrumento ${a.instrumento}.</p>`));
        })
        .catch(err => renderPage(res, 'Erro', `<p>Erro ao carregar o aluno ${id}.</p>`));
}

function renderCursosPage(res) {
    axios.get('http://localhost:3000/cursos')
        .then(resp => {
            const cursos = resp.data.map(c => 
                `<tr><td><a href="/cursos/${c.id}">${c.id}</a></td><td>${c.designacao}</td></tr>`
            ).join('');
            renderPage(res, 'Cursos', `
                <h3>Lista de Cursos</h3>
                <table class="w3-table w3-striped w3-bordered">
                    <tr><th>ID</th><th>Nome</th></tr>
                    ${cursos}
                </table>
            `);
        })
        .catch(err => renderPage(res, 'Erro', `<p>Erro ao carregar cursos.</p>`));
}

function renderCursoPage(res, id) {
    axios.get(`http://localhost:3000/cursos/${id}`)
        .then(resp => {
            const curso = resp.data;
            axios.get('http://localhost:3000/alunos')
                .then(resp => {
                    const alunos = resp.data.filter(a => a.curso === id)
                        .map(a => `<li><a href="/alunos/${a.id}">${a.nome}</a></li>`).join('');
                    renderPage(res, `Curso ${curso.designacao}`, `
                        <h3>${curso.designacao}</h3>
                        <p><strong>ID:</strong> ${curso.id}</p>
                        <h4>Alunos inscritos:</h4>
                        <ul>${alunos}</ul>
                    `);
                });
        })
        .catch(err => renderPage(res, 'Erro', `<p>Erro ao carregar o curso ${id}.</p>`));
}

function renderInstrumentosPage(res) {
    axios.get('http://localhost:3000/instrumentos')
        .then(resp => {
            const instrumentos = resp.data.map(i => 
                `<tr><td><a href="/instrumentos/${i.id}">${i.id}</a></td><td>${i.text}</td></tr>`
            ).join('');
            renderPage(res, 'Instrumentos', `
                <h3>Lista de Instrumentos</h3>
                <table class="w3-table w3-striped w3-bordered">
                    <tr><th>ID</th><th>Nome</th></tr>
                    ${instrumentos}
                </table>
            `);
        })
        .catch(err => renderPage(res, 'Erro', `<p>Erro ao carregar instrumentos.</p>`));
}

function renderInstrumentoPage(res, id) {
    axios.get(`http://localhost:3000/instrumentos/${id}`)
        .then(resp => {
            const instrumento = resp.data;
            axios.get(`http://localhost:3000/alunos?instrumento=${instrumento.text}`)
                .then(resp => {
                    const alunos = resp.data.map(a => 
                        `<li><a href="/alunos/${a.id}">${a.nome}</a></li>`
                    ).join('');
                    renderPage(res, `Instrumento ${instrumento.text}`, `
                        <h3>${instrumento.text}</h3>
                        <p><strong>ID:</strong> ${instrumento.id}</p>
                        <h4>Alunos que tocam este instrumento:</h4>
                        <ul>${alunos}</ul>
                    `);
                })
                .catch(err => renderPage(res, 'Erro', `<p>Erro ao carregar alunos para o instrumento ${instrumento.text}.</p>`));
        })
        .catch(err => renderPage(res, 'Erro', `<p>Erro ao carregar o instrumento ${id}.</p>`));
}

const server = http.createServer((req, res) => {
    const q = url.parse(req.url, true);
    if (q.pathname === '/') renderMainPage(res);
    else if (q.pathname === '/alunos') renderAlunosPage(res);
    else if (q.pathname.startsWith('/alunos/')) renderAlunoPage(res, q.pathname.split('/')[2]);
    else if (q.pathname === '/cursos') renderCursosPage(res);
    else if (q.pathname.startsWith('/cursos/')) renderCursoPage(res, q.pathname.split('/')[2]);
    else if (q.pathname === '/instrumentos') renderInstrumentosPage(res);
    else if (q.pathname.startsWith('/instrumentos/')) renderInstrumentoPage(res, q.pathname.split('/')[2]);
    else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('Página não encontrada');
    }
});

server.listen(8000, () => console.log('Server is running on http://localhost:8000/'));