var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates')          // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var alunosServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /alunos --------------------------------------------------------------------
                if (req.url == "/alunos" || req.url == "/"){
                    axios.get('http://localhost:3000/alunos')
                        .then(response => {
                            var alunos = response.data;
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write(templates.studentsListPage(alunos, d));
                            res.end();
                        })
                        .catch(error => {
                            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write("<p>Erro na obtenção da lista de alunos: " + error + "</p>");
                            res.end();
                        });
                }
                
                // GET /alunos/:id --------------------------------------------------------------------
                else if (req.url.match(/\/alunos\/A[0-9]{4,6}$/)){
                    const id = req.url.split("/")[2];
                    axios.get('http://localhost:3000/alunos/' + id)
                        .then(response => {
                            const aluno = response.data;
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write(templates.studentPage(aluno, d));
                            res.end();
                        })
                        .catch(error => {
                            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write("<p>Aluno não encontrado: " + id + "</p>");
                            res.end();
                        });
                }
                
                // GET /alunos/registo --------------------------------------------------------------------
                else if (req.url == "/alunos/registo"){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(templates.studentFormPage(d));
                    res.end();
                }
               
                // GET /alunos/edit/:id --------------------------------------------------------------------
                else if (req.url.match(/\/alunos\/edit\/A[0-9]{4,6}$/)){
                    const id = req.url.split("/")[3];
                    axios.get('http://localhost:3000/alunos/' + id)
                        .then(response => {
                            const aluno = response.data;
                            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write(templates.studentFormEditPage(aluno, d));
                            res.end();
                        })
                        .catch(error => {
                            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write("<p>Aluno não encontrado: " + id + "</p>");
                            res.end();
                        });
                }
               
                // GET /alunos/delete/:id --------------------------------------------------------------------
                else if (req.url.match(/\/alunos\/delete\/A[0-9]{4,6}$/)){
                    const id = req.url.split("/")[3];
                    axios.delete('http://localhost:3000/alunos/' + id)
                        .then(response => {
                            res.writeHead(302, {'Location': '/alunos'});
                            res.end();
                        })
                        .catch(error => {
                            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
                            res.write("<p>Erro ao eliminar o aluno: " + error + "</p>");
                            res.end();
                        });
                }
                
                // GET ? -> Lancar um erro
                else {
                    res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write("<p>Bad Request</p>");
                    res.end();
                }
                break;
                
            case "POST":
                console.log("POST " + req.url)
                // POST /alunos/registo --------------------------------------------------------------------
                if (req.url == "/alunos/registo"){
                    collectRequestBodyData(req, result => {
                        if (result){
                            axios.post("http://localhost:3000/alunos", result)
                            .then (resp => {
                                res.writeHead(201, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(' <p> Registo Inserido </p>' )
                                res.end()
                            })
                            .catch(erro => {
                                console.log("ERRO: " + erro)
                                res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Erro na inserção do aluno: " + erro + "</p>")
                                res.end()
                            })
                        }
                        else {
                            console.log("ERRO: POST sem dados")
                            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                            res.end()
                        }
                    })
                }
                
                // POST /alunos/edit/:id --------------------------------------------------------------------
                else if (req.url.match(/\/alunos\/edit\/A[0-9]{4,6}$/)){
                    const id = req.url.split("/")[3];
                    collectRequestBodyData(req, result => {
                        if (result){
                            axios.put("http://localhost:3000/alunos/" + id, result)
                            .then (resp => {
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(' <p> Registo Atualizado </p>' )
                                res.end()
                            })
                            .catch(erro => {
                                console.log("ERRO: " + erro)
                                res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Erro na atualização do aluno: " + erro + "</p>")
                                res.end()
                            })
                        }
                        else {
                            console.log("ERRO: POST sem dados")
                            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                            res.end()
                        }
                    })
                }
                
                // POST ? -> Lancar um erro
                else {
                    res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write("<p>Bad Request</p>");
                    res.end();
                }
                break;
                
            case "PUT":
                //put for postamn test


                // no postman os codigos vao no body no x-www-form-urlencoded e metemos os parametros que ja tem no form ou que nao queremos 
                console.log("PUT " + req.url)
                if (req.url.match(/\/alunos\/edit\/A[0-9]{4,6}$/)){
                    const id = req.url.split("/")[3];
                    collectRequestBodyData(req, result => {
                        if (result){
                            axios.put("http://localhost:3000/alunos/" + id, result)
                            .then (resp => {
                                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write(' <p> Registo Atualizado </p>' )
                                res.end()
                            })
                            .catch(erro => {
                                console.log("ERRO: " + erro)
                                res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                                res.write("<p>Erro na atualização do aluno: " + erro + "</p>")
                                res.end()
                            })
                        }
                        else {
                            console.log("ERRO: POST sem dados")
                            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                            res.end()
                        }
                    })
                }
                else {
                    res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write("<p>Bad Request</p>");
                    res.end();
                }
                // PUT /alunos/edit/:id --------------------------------------------------------------------
                break;
            case "DELETE":
            default: 
                res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                res.write("<p>Método não suportado: " + req.method + "</p>") 
                res.end();
                break;
        }
    }
})

alunosServer.listen(7777, ()=>{
    console.log("Server listening on http://localhost:7777/")
})