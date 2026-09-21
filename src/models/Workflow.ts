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
  _id: string; // The doc_id mentioned in user's prompt (e.g. "doc_101")
  root_id: string;
  tableName: string;
  columns: string[];
  rows: WorkflowRow[];
}
