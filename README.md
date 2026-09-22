# DocumentDB API

A high-performance Node.js REST API built with [Hono](https://hono.dev/) and MongoDB/DocumentDB. It demonstrates a setup for managing workflow documents, along with scripts for seeding the database, setting up indexes, and running performance benchmarks and load tests.

## Features

- **Hono Web Framework**: Fast, lightweight, web-standard REST API.
- **MongoDB / DocumentDB**: Uses `mongodb` driver to connect to a DocumentDB/MongoDB instance.
- **TypeScript**: fully typed codebase.
- **Performance Testing Suite**: Includes scripts for seeding 100,000+ records, setting up indexes, load testing, and benchmarking.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) or AWS DocumentDB instance

## Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:

```bash
npm install
```

3. Configure your environment variables. Create a `.env` file in the root directory based on the following:

```env
MONGO_URI=mongodb://admin:password123@localhost:10260/?retryWrites=false
PORT=3000
```

*Note: If `MONGO_URI` is not provided, it will fallback to the default URI used in `src/db/mongo.ts`.*

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Starts the development server using `tsx watch` for hot-reloading on `http://localhost:3000`.

### `npm run build`
Compiles the TypeScript code into JavaScript in the `dist/` directory.

### `npm start`
Runs the compiled JavaScript application in production mode.

### `npm run seed`
Seeds the database with 100,000 dummy workflow documents for testing. (Warning: this will drop the existing `workflows` collection first).

### `npm run setup-index`
Creates necessary database indexes to optimize queries on the `workflows` collection.

### `npm run load-test`
Executes a load testing script against your database to evaluate read/write performance.

### `npm run benchmark`
Runs benchmarking scripts to measure API or database response times under different conditions.

## API Endpoints

### `GET /`
Health check endpoint.
**Response**: `Hello Hono + DocumentDB!`

### `POST /workflows`
Create a new workflow document.
**Body**:
```json
{
  "root_id": "1",
  "tableName": "Workflows",
  "rows": [
    {
      "workflowID": "W01_1",
      "ns_id": null,
      "ws_id": null,
      "createPermission": true,
      "readPermission": true,
      "updatePermission": true,
      "deletePermission": true
    }
  ]
}
```

### `GET /workflows/:id`
Fetch a specific workflow document by its `_id`.

## Project Structure

```
├── .env
├── src/
│   ├── db/
│   │   └── mongo.ts           # MongoDB Connection configuration
│   ├── models/
│   │   └── Workflow.ts        # TypeScript interfaces for Workflow data
│   ├── index.ts               # Main Hono application setup
│   ├── seed.ts                # Database seeder script
│   ├── setup_indexes.ts       # Database indexing script
│   ├── benchmark.ts           # Benchmarking tool
│   └── load_test.ts           # Load testing tool
├── package.json
└── tsconfig.json
```

## License

ISC
