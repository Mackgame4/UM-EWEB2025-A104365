import json

INPUT_FILE = 'dataset.json'
OUTPUT_FILE = 'output_dataset.json'

def safe_json_loads(value):
    """Tenta carregar um JSON válido, corrigindo aspas se necessário."""
    if isinstance(value, list):  # Já está no formato correto
        return value
    if not isinstance(value, str) or not value.strip():  # Se for None ou string vazia
        return []
    try:
        return json.loads(value.replace("'", '"'))  # Corrigir aspas antes de carregar
    except json.JSONDecodeError:
        return []  # Se falhar, retorna lista vazia

def prepare_dataset():
    # Carregar o dataset original
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        dataset = json.load(f)

    modified_data = []

    for item in dataset:
        modified_item = {
            "_id": item.get("bookId", ""),
            "title": item.get("title", ""),
            "series": item.get("series", ""),
            "author": item.get("author", ""),
            "rating": float(item.get("rating", "0")),  # Converter rating para float
            "description": item.get("description", ""),
            "language": item.get("language", ""),
            "isbn": item.get("isbn", ""),
            "genres": safe_json_loads(item.get("genres", "[]")),  # Corrigir e carregar lista
            "characters": safe_json_loads(item.get("characters", "[]")),  # Corrigir e carregar lista
            "bookFormat": item.get("bookFormat", ""),
            "edition": item.get("edition", ""),
            "pages": int(item["pages"]) if item.get("pages") and item["pages"].isdigit() else None,
            "publisher": item.get("publisher", ""),
            "publishDate": item.get("publishDate", ""),
            "firstPublishDate": item.get("firstPublishDate", ""),
            "awards": safe_json_loads(item.get("awards", "[]")),  # Corrigir e carregar lista
            "ratingsByStars": [int(x) for x in safe_json_loads(item.get("ratingsByStars", "[]"))],  # Corrigir e converter para lista de inteiros
            "likedPercent": float(item["likedPercent"]) if item.get("likedPercent") and item["likedPercent"].replace('.', '', 1).isdigit() else 0.0,
            "setting": safe_json_loads(item.get("setting", "[]")),  # Corrigir e carregar lista
            "coverImg": item.get("coverImg", ""),
            "bbeScore": int(item.get("bbeScore", "0")),  # Converter para inteiro
            "bbeVotes": int(item.get("bbeVotes", "0")),  # Converter para inteiro
            "price": float(item["price"]) if item.get("price") and item["price"].replace('.', '', 1).isdigit() else None  # Converter para float
        }

        modified_data.append(modified_item)

    # Mostrar número de itens
    print(f"Total de itens no dataset original: {len(dataset)}")
    print(f"Total de itens no dataset modificado: {len(modified_data)}")

    # Guardar o dataset modificado
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(modified_data, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    prepare_dataset()