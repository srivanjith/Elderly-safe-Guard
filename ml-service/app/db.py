import os
from pymongo import MongoClient

def get_mongo_client():
    uri = os.getenv(
        "MONGODB_URI", 
        "mongodb+srv://srivanjiththangaraj48_db_user:<db_password>@cluster0.wlkglrs.mongodb.net/safepay_guardian?retryWrites=true&w=majority&appName=Cluster0"
    )
    
    client = MongoClient(uri)
    try:
        client.admin.command("ping")
        print("[MongoDB] Connected successfully to MongoDB Atlas Cluster!")
        return client
    except Exception as e:
        print(f"[MongoDB] Connection error: {e}")
        return None

def test_connection():
    client = get_mongo_client()
    if client:
        client.close()
        return True
    return False

if __name__ == "__main__":
    test_connection()
