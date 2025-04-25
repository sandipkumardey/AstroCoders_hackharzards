from pymongo import MongoClient, DESCENDING
from pymongo.collection import Collection
from pymongo.cursor import Cursor
from pymongo.results import InsertOneResult, DeleteResult
from bson import ObjectId
from typing import Dict, Any, Optional
from utils.config.config import config

class Database:
    def __init__(self):
        self.database_uri = config["database"]["url"]
        self.Mclient = MongoClient(self.database_uri)
        self.db = self.Mclient[config["database"]["database_name"]]
        self.users_collection = self.db['users']

    def count_documents(self, filter: Dict[str, Any], collection: Optional[Collection] = None) -> int:
        if collection is None:
            collection = self.users_collection
        try:
            return collection.count_documents(filter)
        except Exception as e:
            print(f"Error counting documents: {e}")
            raise

    def find_documents(self, query_data: Dict[str, Any], collection: Optional[Collection] = None) -> Cursor:
        if collection is None:
            collection = self.users_collection
        try:
            return collection.find(query_data)
        except Exception as e:
            print(f"Error finding documents: {e}")
            raise

    def find_one(self, query_data: Dict[str, Any], collection: Optional[Collection] = None, use_sort: bool = False) -> Optional[Dict[str, Any]]:
        if collection is None:
            collection = self.users_collection
        try:
            if use_sort:
                return collection.find_one(query_data, sort=[("_id", DESCENDING)])
            return collection.find_one(query_data)
        except Exception as e:
            print(f"Error finding one document: {e}")
            raise

    def find_one_and_update(
        self,
        query_data: Dict[str, Any],
        update: Dict[str, Any],
        collection: Optional[Collection] = None,
        use_sort: bool = False
    ) -> Optional[Dict[str, Any]]:
        if collection is None:
            collection = self.users_collection
        try:
            options = {
                "sort": [("_id", DESCENDING)]
            } if use_sort else {}
            return collection.find_one_and_update(query_data, update, **options)
        except Exception as e:
            print(f"Error in find_one_and_update: {e}")
            raise

    def insert_one(self, data: Dict[str, Any], collection: Optional[Collection] = None) -> InsertOneResult:
        if collection is None:
            collection = self.users_collection
        try:
            return collection.insert_one(data)
        except Exception as e:
            print(f"Error inserting document: {e}")
            raise

    def delete_one(self, query_data: Dict[str, Any], collection: Optional[Collection] = None) -> DeleteResult:
        if collection is None:
            collection = self.users_collection
        try:
            return collection.delete_one(query_data)
        except Exception as e:
            print(f"Error deleting document: {e}")
            raise

    def get_user(self, public_key: str) -> Optional[Dict[str, Any]]:
        return self.find_one({"public_key": public_key}, self.users_collection)


DB = Database()