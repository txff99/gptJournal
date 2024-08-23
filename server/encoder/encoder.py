from sentence_transformers import SentenceTransformer

embed_model = SentenceTransformer("sentence-transformers/msmarco-MiniLM-L12-cos-v5", trust_remote_code=True)
embed_model_dims = embed_model.get_sentence_embedding_dimension()

def encode_chunk(chunk):
    embeddings = embed_model.encode(chunk)
    return embeddings.tolist()
