-- Enable required extensions if available (safe to ignore if already present)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE IF NOT EXISTS user_role AS ENUM ('CLEANER', 'SUPERVISOR');
CREATE TYPE IF NOT EXISTS task_status AS ENUM ('pending', 'done');

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'CLEANER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cleaning_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ppu TEXT NOT NULL,
    bus_number TEXT NOT NULL,
    terminal TEXT NOT NULL,
    cleaning_type TEXT NOT NULL,
    stickers_removed BOOLEAN DEFAULT false,
    graffiti_removed BOOLEAN DEFAULT false,
    image_front_url TEXT,
    image_back_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cleaning_records_user_idx ON cleaning_records(user_id);
CREATE INDEX IF NOT EXISTS cleaning_records_ppu_idx ON cleaning_records(ppu);
CREATE INDEX IF NOT EXISTS cleaning_records_terminal_idx ON cleaning_records(terminal);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    cleaner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supervisor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    status task_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS tasks_cleaner_idx ON tasks(cleaner_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);

CREATE TABLE IF NOT EXISTS inspections (
    id TEXT PRIMARY KEY,
    cleaning_id TEXT NOT NULL REFERENCES cleaning_records(id) ON DELETE CASCADE,
    supervisor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    passed BOOLEAN NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inspections_cleaning_idx ON inspections(cleaning_id);

CREATE TABLE IF NOT EXISTS break_assignments (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    break_time TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple seed supervisor for first run
INSERT INTO users (id, name, role)
SELECT 'supervisor-seed', 'Supervisor', 'SUPERVISOR'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 'supervisor-seed');
