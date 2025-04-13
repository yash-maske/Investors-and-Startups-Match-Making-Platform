from pymongo import MongoClient

client = MongoClient('mongodb+srv://rahulbhai:1234567890@cluster0.z5dm7ad.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
mongo_db = client['test']  # or any name you prefer