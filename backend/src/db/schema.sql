-- Database schema for SmartSeason Field Monitoring System.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'agent')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fields (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  crop_type VARCHAR(100) NOT NULL,
  planting_date DATE NOT NULL,
  stage VARCHAR(20) CHECK (stage IN ('Planted', 'Growing', 'Ready', 'Harvested')) DEFAULT 'Planted',
  agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_updates (
  id SERIAL PRIMARY KEY,
  field_id INTEGER REFERENCES fields(id) ON DELETE CASCADE,
  agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  stage VARCHAR(20),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
