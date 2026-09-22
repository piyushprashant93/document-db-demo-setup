import { connectDB } from './db/mongo';
import type { WorkflowDocument } from './models/Workflow';

const seedDatabase = async () => {
  const db = await connectDB();
  const collection = db.collection<WorkflowDocument>('workflows');

  // Drop the collection first to start with a clean slate
  await collection.drop().catch(() => { });

  console.log("Connected to DB. Starting to seed 100,000 documents...");

  const totalRecords = 100000;
  const batchSize = 5000;

  for (let i = 0; i < totalRecords; i += batchSize) {
    const batch: WorkflowDocument[] = [];

    for (let j = 0; j < batchSize; j++) {
      const index = i + j + 1; // start doc_1 to doc_100000
      batch.push({
        root_id: `${index % 100}`,
        tableName: "Workflows",
        columns: ["workflowID", "ns_id", "ws_id", "createPermission", "readPermission", "updatePermission", "deletePermission"],
        rows: [
          { workflowID: `W01_${index}`, ns_id: null, ws_id: null, createPermission: true, readPermission: true, updatePermission: true, deletePermission: true },
          { workflowID: `W02_${index}`, ns_id: null, ws_id: null, createPermission: true, readPermission: false, updatePermission: true, deletePermission: true },
          { workflowID: `W03_${index}`, ns_id: null, ws_id: null, createPermission: true, readPermission: true, updatePermission: true, deletePermission: true }
        ]
      } as any);
    }

    await collection.insertMany(batch as any);
    console.log(`Inserted ${i + batchSize} / ${totalRecords}`);
  }

  console.log("Seeding complete!");
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
