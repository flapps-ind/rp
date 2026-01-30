-- Create emergencies table for real-time emergency dispatch system
-- This table connects the Consumer app with the Driver app

CREATE TABLE IF NOT EXISTS emergencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  patient_name TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  assigned_driver_id UUID REFERENCES drivers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries on status and created_at
CREATE INDEX IF NOT EXISTS idx_emergencies_status ON emergencies(status);
CREATE INDEX IF NOT EXISTS idx_emergencies_created_at ON emergencies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emergencies_assigned_driver ON emergencies(assigned_driver_id);

-- Enable Row Level Security
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert emergencies (consumer app)
CREATE POLICY "Anyone can create emergencies" ON emergencies
  FOR INSERT
  WITH CHECK (true);

-- Policy: Authenticated drivers can read all pending emergencies
CREATE POLICY "Drivers can read pending emergencies" ON emergencies
  FOR SELECT
  USING (status = 'pending' OR assigned_driver_id = auth.uid());

-- Policy: Assigned driver can update their emergency
CREATE POLICY "Assigned driver can update emergency" ON emergencies
  FOR UPDATE
  USING (assigned_driver_id = auth.uid() OR status = 'pending');

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE emergencies;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_emergencies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS emergencies_updated_at ON emergencies;
CREATE TRIGGER emergencies_updated_at
  BEFORE UPDATE ON emergencies
  FOR EACH ROW
  EXECUTE FUNCTION update_emergencies_updated_at();
