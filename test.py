
def parse_dialogue_file(file_path: str, numlines: int = None):
    parsed_dialogues = []

    with open(file_path, 'r') as file:
        for i, line in enumerate(file):    
            if numlines is not None and i == numlines:  break
            turns = line.strip().split('__eou__')
            turns = [turn.strip() for turn in turns if turn.strip()]
            parsed_dialogues.append(turns)

    return parsed_dialogues

def make_chunks(dialogues, chunk_size=8, padding=2):
    all_sentences = [' ']*padding + [sentence for line in dialogues for sentence in line] + [' ']*padding
    return [
        ' '.join(all_sentences[i - padding:i + chunk_size + padding])
        for i in range(padding, len(all_sentences)+padding, chunk_size)
    ]

from sentence_transformers import SentenceTransformer

embed_model = SentenceTransformer("sentence-transformers/msmarco-MiniLM-L12-cos-v5", trust_remote_code=True)
embed_model_dims = embed_model.get_sentence_embedding_dimension()

def encode_chunks(chunks):
    embeddings = embed_model.encode(chunks)
    return embeddings.tolist()

file_path = 'dialogues_train.txt'
parsed = parse_dialogue_file(file_path)
chunks = make_chunks(parsed)
query = "Say , Jim , how about going for a few beers after dinner?"
print(encode_chunks(query))
