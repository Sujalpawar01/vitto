-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: applications
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    purpose TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: agents
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- Seed Default Agent (Username: agent1, Password: Password123)
-- Hash verified: bcrypt.hash('Password123', 10) → matches bcrypt.compare('Password123', hash) = true
INSERT INTO agents (username, password_hash, name) 
VALUES ('agent1', '$2a$10$ZyXwB6VyClxBqHjhtjRCbu8lhfW6jTWSHMRsPkHw.1G8.oC3vto9C', 'Operations Agent')
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
