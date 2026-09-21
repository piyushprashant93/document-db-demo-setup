import { connectDB } from './db/mongo';
import { performance } from 'perf_hooks';

const runBenchmark = async () => {
  const db = await connectDB();
  const collection = db.collection('workflows');

  console.log("=== DocumentDB Benchmark ===");
  
  // Helper to run test and calculate percentiles
  const runTest = async (testName: string, queryFn: () => Promise<any>, iterations: number) => {
    console.log(`\nStarting test: ${testName} (${iterations} queries)`);
    const latencies: number[] = [];
    
    const startTime = performance.now();
    for (let i = 0; i < iterations; i++) {
      const qStart = performance.now();
      await queryFn();
      latencies.push(performance.now() - qStart);
      
      // Print progress bar
      if ((i + 1) % Math.max(1, Math.floor(iterations / 10)) === 0) {
        process.stdout.write('.');
      }
    }
    const totalTime = performance.now() - startTime;
    
    latencies.sort((a, b) => a - b);
    const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const p50 = latencies[Math.floor(latencies.length * 0.5)];
    const p90 = latencies[Math.floor(latencies.length * 0.9)];
    const p99 = latencies[Math.floor(latencies.length * 0.99)];
    const opsPerSec = (iterations / totalTime) * 1000;
    
    console.log(`\n--- Results for ${testName} ---`);
    console.log(`Total Time: ${totalTime.toFixed(2)} ms`);
    console.log(`Throughput: ${opsPerSec.toFixed(2)} ops/sec`);
    console.log(`Avg Latency: ${avg.toFixed(2)} ms`);
    console.log(`p50 Latency: ${p50.toFixed(2)} ms`);
    console.log(`p90 Latency: ${p90.toFixed(2)} ms`);
    console.log(`p99 Latency: ${p99.toFixed(2)} ms`);
  };

  // Test 1: Indexed Query
  // We search for `root_id` which we indexed previously.
  await runTest(
    "Indexed Query (root_id)", 
    async () => {
      const randomRootId = `${Math.floor(Math.random() * 100)}`;
      return collection.find({ root_id: randomRootId }).limit(1).toArray();
    }, 
    500
  );

  // Test 2: Unindexed Query (Full Collection Scan)
  // We search for `rows.workflowID`, which has no index and requires scanning deep JSON arrays.
  // We do far fewer iterations because it will be extremely slow.
  await runTest(
    "Unindexed Query (rows.workflowID)", 
    async () => {
      const randomId = Math.floor(Math.random() * 100000) + 1;
      return collection.find({ "rows.workflowID": `W01_${randomId}` }).limit(1).toArray();
    }, 
    20 // Just 20 queries, since each might take hundreds of milliseconds or more
  );

  console.log("\nBenchmark complete!");
  process.exit(0);
};

runBenchmark().catch((error) => {
  console.error("Benchmark failed:", error);
  process.exit(1);
});
