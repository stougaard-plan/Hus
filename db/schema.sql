CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  frequency TEXT NOT NULL,
  season TEXT,
  estimated_minutes INT,
  assigned_to TEXT[] DEFAULT '{}',
  child_friendly BOOLEAN DEFAULT false,
  steps JSONB DEFAULT '[]',
  note TEXT
);

CREATE TABLE task_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'done')),
  planned_date DATE,
  done_date DATE,
  assigned_to TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_task_instances_task_id ON task_instances(task_id);
CREATE INDEX idx_task_instances_status ON task_instances(status);
CREATE INDEX idx_task_instances_planned_date ON task_instances(planned_date);
