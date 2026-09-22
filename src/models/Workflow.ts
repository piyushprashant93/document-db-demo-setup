export interface WorkflowRow {
  workflowID: string;
  ns_id: string | null;
  ws_id: string | null;
  createPermission: boolean;
  readPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
}

export interface WorkflowDocument {
  _id?: string | any; // MongoDB will auto-generate an ObjectId if omitted
  root_id: string;
  tableName: string;
  rows: WorkflowRow[];
}
