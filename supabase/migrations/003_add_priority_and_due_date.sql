-- Add priority and due_date columns to todos table
ALTER TABLE todos ADD COLUMN priority SMALLINT NOT NULL DEFAULT 2
  CHECK (priority >= 1 AND priority <= 3);

ALTER TABLE todos ADD COLUMN due_date DATE;

-- Create indexes for efficient filtering/sorting
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
