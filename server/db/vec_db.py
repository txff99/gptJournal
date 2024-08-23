import os
import sys
sys.path.append(os.path.abspath('..'))
from encoder.encoder import embed_model_dims

sys.path.insert(0, os.path.abspath(os.path.join(os.getcwd(),'..','third_party', 'tidb-vector-python')))
from tidb_vector.integrations import TiDBVectorClient
from dotenv import load_dotenv


load_dotenv()

vector_store = TiDBVectorClient(
   table_name='embedded_documents',
   connection_string=os.environ.get('TIDB_DATABASE_URL'),
   vector_dimension=embed_model_dims,
)


