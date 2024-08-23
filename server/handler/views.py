
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import sys
import os

sys.path.append(os.path.abspath('..'))
from encoder.encoder import encode_chunk
from db.vec_db import vector_store

def fetch(data):
    """ retrieve from db """
    chunks = vector_store.query(data, k=3)
    resp = []
    for chunk in chunks:
        resp.append({
            'text': chunk.document,
            'distance': chunk.distance,
            'update_time': chunk.update_time
        })
    return resp

@api_view(['POST'])
def process_data(request):
    """ encode to embedding """
    data = encode_chunk(request.data.get('text',''))
    resp = fetch(data)
    return Response(resp, status=status.HTTP_200_OK)

@api_view(['POST'])
def store_data(request):
    processed_data = {
        'text': f"Processed: {request.data.get('text', '')}",
    }
    return Response(processed_data, status=status.HTTP_200_OK)

