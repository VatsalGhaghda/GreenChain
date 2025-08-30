-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('producer','certifier','regulator','consumer')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create batches table
CREATE TABLE batches (
  id SERIAL PRIMARY KEY,
  batch_id TEXT UNIQUE NOT NULL,
  producer_address TEXT NOT NULL,
  amount_kg NUMERIC NOT NULL,
  carbon_intensity NUMERIC,
  metadata_cid TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','issued')),
  token_id INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  tx_hash TEXT NOT NULL,
  batch_id TEXT,
  token_id INT,
  from_address TEXT,
  to_address TEXT,
  amount NUMERIC,
  metadata JSONB,
  block_number BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  token_id INT NOT NULL,
  batch_id TEXT NOT NULL,
  retirement_tx TEXT NOT NULL,
  pdf_ipfs_cid TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create marketplace_listings table
CREATE TABLE marketplace_listings (
  id SERIAL PRIMARY KEY,
  seller_address TEXT NOT NULL,
  token_id INT NOT NULL,
  amount NUMERIC NOT NULL,
  price NUMERIC,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert some sample data for testing
INSERT INTO users (name, address, role) VALUES 
  ('Solar Farm A', '0x1234567890123456789012345678901234567890', 'producer'),
  ('Certifier Corp', '0x2345678901234567890123456789012345678901', 'certifier'),
  ('Regulator Inc', '0x3456789012345678901234567890123456789012', 'regulator'),
  ('Consumer Co', '0x4567890123456789012345678901234567890123', 'consumer');

INSERT INTO batches (batch_id, producer_address, amount_kg, metadata_cid, status) VALUES 
  ('BATCH-2025-0001', '0x1234567890123456789012345678901234567890', 1000, 'QmSampleCID123', 'pending');