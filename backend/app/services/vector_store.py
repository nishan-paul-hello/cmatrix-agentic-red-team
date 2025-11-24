"""Vector store service for long-term memory using Qdrant."""

import uuid
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from loguru import logger
from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer

from app.core.config import settings


class VectorStoreService:
    """Service for managing vector embeddings and search in Qdrant."""
    
    _instance: Optional['VectorStoreService'] = None
    _client: Optional[QdrantClient] = None
    _model: Optional[SentenceTransformer] = None
    
    def __new__(cls):
        """Singleton pattern."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize vector store service."""
        if not hasattr(self, '_initialized'):
            self._initialized = True
            self.collection_name = settings.QDRANT_COLLECTION_NAME
            self._setup_client()
            # Lazy load model to speed up startup
            # self._setup_model() 
            logger.info("Vector store service initialized")
    
    def _setup_client(self):
        """Initialize Qdrant client."""
        try:
            self._client = QdrantClient(url=settings.QDRANT_URL)
            logger.info(f"Connected to Qdrant at {settings.QDRANT_URL}")
        except Exception as e:
            logger.error(f"Failed to connect to Qdrant: {e}")
            self._client = None

    def _setup_model(self):
        """Initialize embedding model."""
        if self._model is None:
            try:
                logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
                self._model = SentenceTransformer(
                    settings.EMBEDDING_MODEL, 
                    device=settings.EMBEDDING_DEVICE
                )
                logger.info("Embedding model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load embedding model: {e}")
                self._model = None

    def ensure_collection(self):
        """Ensure the vector collection exists."""
        if not self._client:
            return False
            
        try:
            # Check if collection exists
            collections = self._client.get_collections()
            exists = any(c.name == self.collection_name for c in collections.collections)
            
            if not exists:
                # Ensure model is loaded to get dimension
                self._setup_model()
                if not self._model:
                    raise RuntimeError("Cannot create collection without embedding model")
                    
                dimension = self._model.get_sentence_embedding_dimension()
                
                logger.info(f"Creating collection '{self.collection_name}' with dimension {dimension}")
                self._client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=dimension,
                        distance=models.Distance.COSINE
                    )
                )
                logger.info("Collection created successfully")
            return True
        except Exception as e:
            logger.error(f"Error ensuring collection: {e}")
            return False

    def add_memory(self, text: str, metadata: Dict[str, Any] = None) -> bool:
        """
        Add a text memory to the vector store.
        
        Args:
            text: The text content to store
            metadata: Optional metadata (e.g., user_id, conversation_id, type)
            
        Returns:
            bool: True if successful
        """
        if not self._client:
            logger.warning("Qdrant client not available, skipping memory storage")
            return False
            
        try:
            self._setup_model()
            if not self._model:
                return False
                
            # Generate embedding
            embedding = self._model.encode(text).tolist()
            
            # Prepare payload
            payload = {
                "content": text,
                "created_at": datetime.utcnow().isoformat(),
                **(metadata or {})
            }
            
            # Upload to Qdrant
            self._client.upsert(
                collection_name=self.collection_name,
                points=[
                    models.PointStruct(
                        id=str(uuid.uuid4()),
                        vector=embedding,
                        payload=payload
                    )
                ]
            )
            logger.debug(f"Stored memory: {text[:50]}...")
            return True
        except Exception as e:
            logger.error(f"Failed to add memory: {e}")
            return False

    def search_memory(
        self, 
        query: str, 
        limit: int = 5, 
        score_threshold: float = 0.7,
        filter_metadata: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for similar memories.
        
        Args:
            query: Search query text
            limit: Maximum number of results
            score_threshold: Minimum similarity score (0-1)
            filter_metadata: Optional metadata filter (e.g., {"user_id": 1})
            
        Returns:
            List of matches with content and metadata
        """
        if not self._client:
            return []
            
        try:
            self._setup_model()
            if not self._model:
                return []
                
            # Generate query embedding
            query_vector = self._model.encode(query).tolist()
            
            # Build filter if provided
            query_filter = None
            if filter_metadata:
                must_conditions = []
                for key, value in filter_metadata.items():
                    must_conditions.append(
                        models.FieldCondition(
                            key=key,
                            match=models.MatchValue(value=value)
                        )
                    )
                if must_conditions:
                    query_filter = models.Filter(must=must_conditions)
            
            # Search
            results = self._client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                query_filter=query_filter,
                limit=limit,
                score_threshold=score_threshold
            )
            
            # Format results
            memories = []
            for hit in results:
                memories.append({
                    "content": hit.payload.get("content", ""),
                    "score": hit.score,
                    "metadata": {k: v for k, v in hit.payload.items() if k != "content"}
                })
                
            return memories
        except Exception as e:
            logger.error(f"Memory search failed: {e}")
            return []


# Global instance
_vector_store: Optional[VectorStoreService] = None


def get_vector_store() -> VectorStoreService:
    """Get global vector store service instance."""
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStoreService()
    return _vector_store
