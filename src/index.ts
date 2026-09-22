import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { connectDB, getDB } from './db/mongo';
import { ObjectId } from 'mongodb';
import type { WorkflowDocument } from './models/Workflow';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono + DocumentDB!');
});

// Create a workflow document
app.post('/workflows', async (c) => {
  try {
    const body = await c.req.json<WorkflowDocument>();
    const db = getDB();
    const collection = db.collection<WorkflowDocument>('workflows');

    // Insert the document as provided by the user
    const result = await collection.insertOne(body as any);

    return c.json({
      success: true,
      message: 'Workflow created',
      insertedId: result.insertedId
    }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get a workflow document by _id
app.get('/workflows/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = getDB();
    const collection = db.collection<WorkflowDocument>('workflows');

    // Query DocumentDB for the specific document
    const workflow = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!workflow) {
      return c.json({ success: false, message: 'Not found' }, 404);
    }

    return c.json({ success: true, data: workflow });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Start the server
const port = parseInt(process.env.PORT || '3000', 10);
console.log(`Server will run on port ${port}`);

// Connect to DB then start server
connectDB().then(() => {
  serve({
    fetch: app.fetch,
    port
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
});
