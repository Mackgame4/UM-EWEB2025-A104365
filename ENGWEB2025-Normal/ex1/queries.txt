# 1. Quantos registos estão na base de dados;
```sh
$ db.edicoes.countDocuments()
```

# 2. Quantos edições têm "Ireland" como vencedor?
```sh
$ db.edicoes.find({vencedor: "Ireland"}).count()
```

# 3. Qual a lista de intérpretes (ordenada alfabeticamente e sem repetições)?
```sh
$ db.edicoes.aggregate([
  { $unwind: "$musicas" },
  { $group: { _id: "$musicas.interprete" } },
  { $sort: { _id: 1 } },
  { $project: { _id: 0, interprete: "$_id" } }
])
```

# 4. Qual a distribuição de músicas por edição (quantas músicas há em cada edição)?
```sh
$ db.edicoes.aggregate([
  {
    $project: {
      anoEdicao: 1,
      totalMusicas: {
        $cond: {
          if: { $isArray: "$musicas" },
          then: { $size: "$musicas" },
          else: 0
        }
      }
    }
  },
  { $sort: { anoEdicao: 1 } }
])
```

# 5. Qual a distribuição de vitórias por país (quantas vitórias tem cada país)?
```sh
$ db.edicoes.aggregate([
  { $match: { vencedor: { $exists: true } } },
  { $group: { _id: "$vencedor", total: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $project: { _id: 0, pais: "$_id", vitorias: "$total" } }
])
```