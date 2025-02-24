# 📝 TPC2

Neste trabalho, utilizou-se o JSON `db.json` fornecido pelo docente, que foi processado pelo script `normalizer.py` para alterar todas as chaves `#text` para `text`, criando uma estrutura válida para o `json-server`. O objetivo foi criar um serviço web que disponibiliza informações sobre alunos, cursos e instrumentos da escola de música. Os dados são servidos por um `json-server` ao servidor `server.js`.

## Author
<p><strong>Name:</strong> Fábio Magalhães</p>
<p><strong>Number:</strong> A104365</p>

## Results
Firstly we need to have installed the node json-server:
```bash
npm install -g json-server
```

and use, to start the json-server on `port 3000`:
```bash
npm run json-server
```

Next we need to pick the given json file for this TPC and parse it into a better format for the json-server. That can be achieved using:
```bash
npm run json
```

And finally to start and check the web page served via nodejs and http server we can use:
```bash
npm start
```