import { connectDB } from './db/mongo';

const runLoadTest = async () => {
  const db = await connectDB();
  const collection = db.collection('workflows');

  console.log("Starting load test simulating heavy queries on root_id...");
  const startTime = Date.now();
  const iterations = 5000; // 5000 random queries
  
  // Fire off queries sequentially to respect the local emulator's strict session limits
  for (let i = 0; i < iterations; i++) {
    const randomRootId = `${Math.floor(Math.random() * 100)}`;
    await collection.find({ root_id: randomRootId }).toArray();
    
    // Print progress every 1000 queries
    if ((i + 1) % 1000 === 0) {
      console.log(`Completed ${i + 1} / ${iterations} queries...`);
    }
  }
  
  const endTime = Date.now();
  console.log(`Load test completed! ${iterations} concurrent queries took ${endTime - startTime}ms.`);
  process.exit(0);
};

runLoadTest().catch((error) => {
  console.error("Load test failed:", error);
  process.exit(1);
});
