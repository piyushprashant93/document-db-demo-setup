import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://admin:password123@localhost:10260/?retryWrites=false";
const client = new MongoClient(uri);

let dbInstance: Db | null = null;

export const connectDB = async (): Promise<Db> => {
  if (dbInstance) {
    return dbInstance;
  }
  
  try {
    await client.connect();
    console.log("Connected successfully to DocumentDB");
    // You can customize the database name here
    dbInstance = client.db("documentdb_demo");
    return dbInstance;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!dbInstance) {
    throw new Error("Database not connected! Call connectDB first.");
  }
  return dbInstance;
};
