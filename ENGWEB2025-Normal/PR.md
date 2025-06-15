# Persistência de Dados com Docker
A persistência de dados neste exercício é feita através do MongoDB, que é executado num container Docker. O dataset utilizado é o atribuido pelo professor, mas será passado por um script python e convertido para JSON, de forma a ser importado para o MongoDB.

# Setup
```sh
# Iniciar o Docker
$ docker run -d --name mongoEW -p 27017:27017 mongo
$ docker start mongoEW
# Importar o dataset para o MongoDB
$ cd enunciado
$ docker cp output_dataset.json mongoEW:/tmp
$ docker exec -it mongoEW sh
$ mongoimport -d eurovisao -c edicoes /tmp/output_dataset.json --jsonArray
# Testar a importação
$ mongosh
> show dbs
> use eurovisao
> show collections
> db.edicoes.find().pretty()
```

Se pretender compilar o dataset, pode utilizar o seguinte comando antes de importar para o MongoDB:
```sh
$ cd enunciado
$ python3 prepare_dataset.py
```

Este script irá ler o ficheiro `dataset.json` e gerar o ficheiro `output_dataset.json` com o formato adequado para ser importado no MongoDB.

# Queries
Ver [ficheiro](/ex1/queries.txt) `queries.txt` para as queries que devem ser implementadas.

# How to Run

Para `ex1`, deve instalar as dependências e iniciar o servidor Node.js. Certifique-se de que o MongoDB está a correr no container Docker.
```sh
$ cd ex1
$ npm i
$ npm start
```

No `ex2`, deve instalar as dependências e iniciar o servidor Node.js. **Certifique-se de que a aplicação/api de dados anterior está a correr.**
```sh
$ cd ex2
$ npm i
$ npm start
```