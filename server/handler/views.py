
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def process_data(request):
    # Process the incoming data
    # Example: add some prefix to field1
    processed_data = {
        'field1': f"Processed: {request.data.get('field1', '')}",
        'field2': request.data.get('field2', '')
    }
    return Response(processed_data, status=status.HTTP_200_OK)

@api_view(['POST'])
def store_data(request):
    processed_data = {
        'field1': f"Processed: {request.data.get('field1', '')}",
        'field2': request.data.get('field2', '')
    }
    return Response(processed_data, status=status.HTTP_200_OK)
