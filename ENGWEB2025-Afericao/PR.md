# Exercicio 1

## 1.1
Preparar o dataset:
```bash
python3 ./prepare_dataset.py
```

Comandos de importação:
```bash
docker run -d --name mongoEx1 -p 27017:27017 mongo
docker cp ./output_dataset.json mongoEx1:/dataset.json
docker exec -it mongoEx1 bash
$ mongoimport -d livros -c livros --type json --file /dataset.json --jsonArray
$ exit
```

Testar a importação:
```bash
docker exec -it mongoEx1 mongosh
$ use livros
$ show collections
$ db.livros.find().pretty()
```

## 1.2
Estrutura de um "livro" no dataset:
```json
_id: '968.The_Da_Vinci_Code',
title: 'The Da Vinci Code',
series: 'Robert Langdon #2',
author: 'Dan Brown (Goodreads Author)',
rating: '3.86',
description: 'ISBN 9780307277671 moved to this edition.While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. The elderly curator of the Louvre has been murdered inside the museum, his body covered in baffling symbols. As Langdon and gifted French cryptologist Sophie Neveu sort through the bizarre riddles, they are stunned to discover a trail of clues hidden in the works of Leonardo da Vinci—clues visible for all to see and yet ingeniously disguised by the painter.Even more startling, the late curator was involved in the Priory of Sion—a secret society whose members included Sir Isaac Newton, Victor Hugo, and Da Vinci—and he guarded a breathtaking historical secret. Unless Langdon and Neveu can decipher the labyrinthine puzzle—while avoiding the faceless adversary who shadows their every move—the explosive, ancient truth will be lost forever.',
language: 'English',
isbn: '9999999999999',
genres: "['Fiction', 'Mystery', 'Thriller', 'Suspense', 'Mystery Thriller', 'Historical Fiction', 'Adventure', 'Novels', 'Crime', 'Adult']",
characters: "['Sophie Neveu', 'Robert Langdon', 'Sir Leigh Teabing', 'Silas (The Da Vinci Code)', 'Bezu Fache', 'Jerome Collet', 'Manuel Aringarosa', 'Rémy Legaludec', 'André Vernet']",
bookFormat: 'Paperback',
edition: '',
pages: '489',
publisher: 'Anchor',
publishDate: '03/28/06',
firstPublishDate: '03/18/03',
awards: `['British Book Award for Book of the Year (2005)', 'Book Sense Book of the Year Award for Adult Fiction (2004)', "Humo's Gouden Bladwijzer (2004)", 'Zilveren Vingerafdruk (2004)', "The Flume: New Hampshire Teen Reader's Choice Award (2006)", 'Teen Buckeye Book Award (2005)', 'Iowa High School Book Award (2006)', 'Puddly Award for Fiction (2007)', 'Missouri Gateway Readers Award for Adult (2006)']`,
numRatings: '1933446',
ratingsByStars: "['645308', '667657', '399278', '142103', '79100']",
likedPercent: '89',
setting: "['Paris (France)', 'London, England', 'France', 'England', 'United Kingdom']",
coverImg: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1579621267l/968.jpg',
bbeScore: '876633',
bbeVotes: '9231',
price: ''
```
###### Attention: A row "bookId" foi utilizada na row "_id" em mongoDB no dataset de output.

### 1.2.1
Quantos livros têm a palavra Love no título?
```bash
$ db.livros.find({title: /Love/}).count()
```

### 1.2.2
Quais os títulos dos livros, em ordem alfabética, em que um dos autores tem apelido Austen?
```bash
$ db.livros.find({author: /Austen/}, {title: 1, author: 1}).sort({title: 1}).pretty()
```

### 1.2.3
Qual a lista de autores (ordenada alfabeticamente e sem repetições)?
```bash
$ db.livros.distinct("author").sort()
```

### 1.2.4
Qual a distribuição de livros por género (genre) (quantos livros tem cada género)?
```bash
$ db.livros.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
]).pretty()
```

### 1.2.5
Quais os títulos dos livros e respetivos isbn, em ordem alfabética de título, em que um dos
personagens (characters) é Sirius Black?
```bash
$ db.livros.find({characters: /Sirius Black/}, {title: 1, isbn: 1}).sort({title: 1}).pretty()
```

## 1.3
Podiamos criar uma API de dados utilizando `JSON-Server`, mas em vez disso vamos usar o `MongoDB` e o `Express` para criar uma API RESTful.
```bash
cd ./ex1
#npx express-generator --views=pug apiLivros
cd apiLivros
npm install
# Install dependencies for mongoDB
npm install mongoose
# Run the project
npm start
```

# Exercicio 2
###### Attention: Para este exercicio foi utilizada a API desenvolvida anterior mente, logo, tenha a certeza que esta se encontra em execução. Para tal também pode utilizar o seguinte script:
```bash
cd ./ex2
npm run api
```

Para iniciar o servidor com as páginas pretendidas pode executar:
```bash
cd ./ex2
npm install
# Install dependencies for remote API fetching
npm install axios
# Run the project
npm start
```