import { connectDB } from './db/mongo';

const setupIndexes = async () => {
  const db = await connectDB();
  const collection = db.collection('workflows');

  console.log("Creating index on root_id...");
  
  // In MongoDB (and DocumentDB), we use createIndex. 
  // Under the hood, if you're using Microsoft's Postgres DocumentDB extension, 
  // it might map certain JSONB indexes to GIN. We create a standard ascending index here.
  await collection.createIndex({ root_id: 1 });
  
  console.log("Index created successfully!");
  process.exit(0);
};

setupIndexes().catch((error) => {
  console.error("Failed to create index:", error);
  process.exit(1);
});
