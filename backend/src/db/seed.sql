-- Seed data for SmartSeason with demo users and sample fields.

INSERT INTO users (name, email, password, role)
VALUES
  ('Admin User', 'admin@smartseason.com', '$2a$10$g2M6ODShjTw3LuJCfpc1HOJdAQPYjqCUKsOuRMGjG7gLaPm5xr/Cq', 'admin'),
  ('Jane Agent', 'agent@smartseason.com', '$2a$10$g2M6ODShjTw3LuJCfpc1HOJdAQPYjqCUKsOuRMGjG7gLaPm5xr/Cq', 'agent')
ON CONFLICT (email) DO NOTHING;

INSERT INTO fields (name, crop_type, planting_date, stage, agent_id)
VALUES
  ('North Field', 'Maize', '2026-01-15', 'Growing', 2),
  ('South Field', 'Wheat', '2025-11-01', 'Ready', 2),
  ('East Block', 'Sorghum', '2026-03-10', 'Planted', 2);
