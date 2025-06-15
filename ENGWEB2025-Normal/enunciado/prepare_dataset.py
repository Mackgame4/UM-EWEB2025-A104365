import json

INPUT_FILE = 'dataset.json'
OUTPUT_FILE = 'output_dataset.json'
DB_COLL_NAME = 'edicoes'

def prepare_dataset():
    # Load the original dataset
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        dataset = json.load(f)

    modified_data = []

    # Process each edition in the dataset
    for edition_id, edition_data in dataset.items():
        # Create base edition document
        modified_item = {
            "_id": edition_data["id"],
            "anoEdicao": int(edition_data["anoEdição"]),
            "organizacao": edition_data["organizacao"],
            "musicas": []
        }

        # Add optional edition fields
        if "vencedor" in edition_data:
            modified_item["vencedor"] = edition_data["vencedor"]

        # Process each song in the edition
        for musica in edition_data["musicas"]:
            song_data = {
                "id": musica["id"],
                "titulo": musica["título"],
                "pais": musica["país"],
                "link": musica["link"],
                "interprete": musica["intérprete"]
            }

            # Add optional song fields
            if "compositor" in musica:
                song_data["compositor"] = musica["compositor"]
            if "letra" in musica:
                song_data["letrista"] = musica["letra"]

            modified_item["musicas"].append(song_data)

        modified_data.append(modified_item)

    # Show stats
    print(f"Total de edições processadas: {len(modified_data)}")
    total_songs = sum(len(edicao["musicas"]) for edicao in modified_data)
    print(f"Total de músicas processadas: {total_songs}")

    # Save the modified dataset
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(modified_data, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    prepare_dataset()