-- Create drivers table first (referenced by emergencies)
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  vehicle_id TEXT,
  status TEXT DEFAULT 'offline' CHECK (status IN ('available', 'busy', 'offline')),
  current_location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emergencies table
CREATE TABLE IF NOT EXISTS emergencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  patient_name TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  incident_type TEXT DEFAULT 'Medical Emergency',
  location_address TEXT,
  patient_info JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_emergencies_status ON emergencies(status);
CREATE INDEX IF NOT EXISTS idx_emergencies_created_at ON emergencies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);

-- Enable Row Level Security
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drivers
DROP POLICY IF EXISTS "Drivers can view their own profile" ON drivers;
CREATE POLICY "Drivers can view their own profile" ON drivers
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Drivers can update their own profile" ON drivers;
CREATE POLICY "Drivers can update their own profile" ON drivers
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow driver registration" ON drivers;
CREATE POLICY "Allow driver registration" ON drivers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for emergencies
DROP POLICY IF EXISTS "Anyone can create emergencies" ON emergencies;
CREATE POLICY "Anyone can create emergencies" ON emergencies
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view pending emergencies" ON emergencies;
CREATE POLICY "Authenticated users can view pending emergencies" ON emergencies
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Drivers can update assigned emergencies" ON emergencies;
CREATE POLICY "Drivers can update assigned emergencies" ON emergencies
  FOR UPDATE USING (
    assigned_driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
    OR status = 'pending'
  );

-- Enable Realtime for emergencies table
ALTER PUBLICATION supabase_realtime ADD TABLE emergencies;
