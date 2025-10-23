-- =============================================
-- VAYNO PARKING MANAGEMENT DATABASE SCHEMA
-- =============================================
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CUSTOM TYPES (ENUMS)
-- =============================================

-- User roles for the system
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'customer');

-- Parking spot status
CREATE TYPE parking_status AS ENUM ('available', 'occupied', 'reserved', 'maintenance');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Vehicle types
CREATE TYPE vehicle_type AS ENUM ('car', 'motorcycle', 'truck', 'van', 'other');

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'customer',
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PARKING LOTS TABLE
-- =============================================
CREATE TABLE public.parking_lots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  total_spots INTEGER NOT NULL DEFAULT 0,
  hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  daily_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  monthly_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  operating_hours JSONB, -- Store hours as JSON
  amenities JSONB, -- Store amenities as JSON array
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PARKING SPOTS TABLE
-- =============================================
CREATE TABLE public.parking_spots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lot_id UUID REFERENCES public.parking_lots(id) ON DELETE CASCADE,
  spot_number TEXT NOT NULL,
  spot_type vehicle_type DEFAULT 'car',
  status parking_status DEFAULT 'available',
  is_reserved BOOLEAN DEFAULT false,
  is_handicap_accessible BOOLEAN DEFAULT false,
  is_electric_charging BOOLEAN DEFAULT false,
  width DECIMAL(5,2), -- in feet
  length DECIMAL(5,2), -- in feet
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lot_id, spot_number)
);

-- =============================================
-- PARKING SESSIONS TABLE
-- =============================================
CREATE TABLE public.parking_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  spot_id UUID REFERENCES public.parking_spots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  vehicle_plate TEXT,
  vehicle_type vehicle_type DEFAULT 'car',
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  check_out_time TIMESTAMP WITH TIME ZONE,
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  payment_status payment_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PAYMENTS TABLE
-- =============================================
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.parking_sessions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'card', 'cash', 'mobile', etc.
  payment_provider TEXT, -- 'stripe', 'paypal', etc.
  transaction_id TEXT,
  status payment_status DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- RESERVATIONS TABLE
-- =============================================
CREATE TABLE public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  spot_id UUID REFERENCES public.parking_spots(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'completed'
  amount DECIMAL(10,2),
  payment_id UUID REFERENCES public.payments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ACTIVITY LOGS TABLE
-- =============================================
CREATE TABLE public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  description TEXT,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'success'
  is_read BOOLEAN DEFAULT false,
  data JSONB, -- Additional data for the notification
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parking lots policies
CREATE POLICY "Authenticated users can view parking lots" ON public.parking_lots
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and admins can manage parking lots" ON public.parking_lots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Parking spots policies
CREATE POLICY "Authenticated users can view parking spots" ON public.parking_spots
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Managers and admins can manage parking spots" ON public.parking_spots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Parking sessions policies
CREATE POLICY "Users can view own sessions" ON public.parking_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Operators can manage sessions" ON public.parking_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'operator')
    )
  );

-- Payments policies
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parking_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Operators can manage payments" ON public.payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'operator')
    )
  );

-- Reservations policies
CREATE POLICY "Users can view own reservations" ON public.reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reservations" ON public.reservations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Operators can view all reservations" ON public.reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager', 'operator')
    )
  );

-- Activity logs policies
CREATE POLICY "Authenticated users can view activity logs" ON public.activity_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parking_lots_updated_at BEFORE UPDATE ON public.parking_lots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parking_spots_updated_at BEFORE UPDATE ON public.parking_spots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parking_sessions_updated_at BEFORE UPDATE ON public.parking_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log activity
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    action,
    description,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_OP || ' on ' || TG_TABLE_NAME,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activity logging triggers
CREATE TRIGGER log_parking_lots_activity AFTER INSERT OR UPDATE OR DELETE ON public.parking_lots
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER log_parking_spots_activity AFTER INSERT OR UPDATE OR DELETE ON public.parking_spots
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

CREATE TRIGGER log_parking_sessions_activity AFTER INSERT OR UPDATE OR DELETE ON public.parking_sessions
  FOR EACH ROW EXECUTE FUNCTION public.log_activity();

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample parking lots
INSERT INTO public.parking_lots (name, description, address, city, state, zip_code, total_spots, hourly_rate, daily_rate, monthly_rate) VALUES
('Downtown Plaza', 'Premium parking in the heart of downtown', '123 Main St', 'Downtown', 'CA', '90210', 50, 2.50, 15.00, 200.00),
('Shopping Center', 'Convenient parking for shoppers', '456 Oak Ave', 'Midtown', 'CA', '90211', 30, 3.00, 18.00, 250.00),
('Business District', 'Professional parking for business district', '789 Pine St', 'Uptown', 'CA', '90212', 75, 4.00, 25.00, 300.00),
('Airport Terminal', 'Long-term parking near airport', '100 Airport Blvd', 'Airport City', 'CA', '90213', 200, 1.50, 12.00, 150.00);

-- Insert sample parking spots using a simpler approach
-- Downtown Plaza spots (A1-A50)
INSERT INTO public.parking_spots (lot_id, spot_number, spot_type, is_handicap_accessible, is_electric_charging)
SELECT 
  pl.id,
  'A' || s.spot_num,
  'car',
  s.spot_num % 10 = 0,
  s.spot_num % 20 = 0
FROM public.parking_lots pl 
CROSS JOIN generate_series(1, 50) AS s(spot_num)
WHERE pl.name = 'Downtown Plaza';

-- Shopping Center spots (B1-B30)
INSERT INTO public.parking_spots (lot_id, spot_number, spot_type, is_handicap_accessible, is_electric_charging)
SELECT 
  pl.id,
  'B' || s.spot_num,
  'car',
  s.spot_num % 10 = 0,
  s.spot_num % 20 = 0
FROM public.parking_lots pl 
CROSS JOIN generate_series(1, 30) AS s(spot_num)
WHERE pl.name = 'Shopping Center';

-- Business District spots (C1-C75)
INSERT INTO public.parking_spots (lot_id, spot_number, spot_type, is_handicap_accessible, is_electric_charging)
SELECT 
  pl.id,
  'C' || s.spot_num,
  'car',
  s.spot_num % 10 = 0,
  s.spot_num % 20 = 0
FROM public.parking_lots pl 
CROSS JOIN generate_series(1, 75) AS s(spot_num)
WHERE pl.name = 'Business District';

-- Airport Terminal spots (D1-D200)
INSERT INTO public.parking_spots (lot_id, spot_number, spot_type, is_handicap_accessible, is_electric_charging)
SELECT 
  pl.id,
  'D' || s.spot_num,
  'car',
  s.spot_num % 10 = 0,
  s.spot_num % 20 = 0
FROM public.parking_lots pl 
CROSS JOIN generate_series(1, 200) AS s(spot_num)
WHERE pl.name = 'Airport Terminal';

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes for common queries
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_parking_spots_lot_id ON public.parking_spots(lot_id);
CREATE INDEX idx_parking_spots_status ON public.parking_spots(status);
CREATE INDEX idx_parking_sessions_user_id ON public.parking_sessions(user_id);
CREATE INDEX idx_parking_sessions_spot_id ON public.parking_sessions(spot_id);
CREATE INDEX idx_parking_sessions_check_in_time ON public.parking_sessions(check_in_time);
CREATE INDEX idx_payments_session_id ON public.payments(session_id);
CREATE INDEX idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX idx_reservations_start_time ON public.reservations(start_time);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for parking lot statistics
CREATE VIEW public.parking_lot_stats AS
SELECT 
  pl.id,
  pl.name,
  pl.total_spots,
  COUNT(ps.id) as total_spots_created,
  COUNT(CASE WHEN ps.status = 'available' THEN 1 END) as available_spots,
  COUNT(CASE WHEN ps.status = 'occupied' THEN 1 END) as occupied_spots,
  COUNT(CASE WHEN ps.status = 'reserved' THEN 1 END) as reserved_spots,
  COUNT(CASE WHEN ps.status = 'maintenance' THEN 1 END) as maintenance_spots,
  ROUND(
    (COUNT(CASE WHEN ps.status = 'occupied' THEN 1 END)::DECIMAL / COUNT(ps.id)) * 100, 
    2
  ) as occupancy_percentage
FROM public.parking_lots pl
LEFT JOIN public.parking_spots ps ON pl.id = ps.lot_id
GROUP BY pl.id, pl.name, pl.total_spots;

-- View for active sessions
CREATE VIEW public.active_sessions AS
SELECT 
  ps.*,
  pl.name as lot_name,
  pl.address as lot_address,
  pr.full_name as user_name,
  pr.email as user_email
FROM public.parking_sessions ps
JOIN public.parking_spots psp ON ps.spot_id = psp.id
JOIN public.parking_lots pl ON psp.lot_id = pl.id
LEFT JOIN public.profiles pr ON ps.user_id = pr.id
WHERE ps.check_out_time IS NULL;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================
SELECT 'Database schema created successfully! 🎉' as message;
