-- =============================================
-- VAYNO PARKING MANAGEMENT - SEED DATA
-- =============================================
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- This will populate your database with realistic test data

-- =============================================
-- CLEAR EXISTING DATA (Optional - uncomment if needed)
-- =============================================
-- Note: We're not clearing profiles since they're linked to auth.users
DELETE FROM public.notifications;
DELETE FROM public.activity_logs;
DELETE FROM public.reservations;
DELETE FROM public.payments;
DELETE FROM public.parking_sessions;
DELETE FROM public.parking_spots;
DELETE FROM public.parking_lots;

-- =============================================
-- USER PROFILES NOTE
-- =============================================

-- IMPORTANT: User profiles are created automatically when users sign up via Supabase Auth
-- The handle_new_user() trigger function in the schema will create profiles for new users
-- 
-- To create test users:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" and create users with emails like:
--    - admin@vayno.com (role: admin)
--    - manager@vayno.com (role: manager) 
--    - operator@vayno.com (role: operator)
--    - customer@example.com (role: customer)
-- 3. The profiles will be created automatically with the trigger
--
-- For now, we'll seed the parking data without user references

-- =============================================
-- ENHANCED PARKING LOTS
-- =============================================

-- Insert enhanced parking lots with more realistic data
-- Note: created_by is set to NULL since we don't have actual user IDs yet
-- Using uuid_generate_v4() to generate proper UUIDs
INSERT INTO public.parking_lots (name, description, address, city, state, zip_code, latitude, longitude, total_spots, hourly_rate, daily_rate, monthly_rate, operating_hours, amenities, created_by) VALUES
('Downtown Plaza Premium', 'Premium parking in the heart of downtown with valet service', '123 Main St', 'Downtown', 'CA', '90210', 34.0522, -118.2437, 50, 3.50, 20.00, 250.00, 
 '{"monday": {"open": "06:00", "close": "23:00"}, "tuesday": {"open": "06:00", "close": "23:00"}, "wednesday": {"open": "06:00", "close": "23:00"}, "thursday": {"open": "06:00", "close": "23:00"}, "friday": {"open": "06:00", "close": "24:00"}, "saturday": {"open": "08:00", "close": "24:00"}, "sunday": {"open": "08:00", "close": "22:00"}}',
 '["valet", "security", "covered", "electric_charging", "handicap_accessible"]', NULL),

('Shopping Center Express', 'Convenient parking for shoppers with easy access to stores', '456 Oak Ave', 'Midtown', 'CA', '90211', 34.0736, -118.4004, 30, 2.50, 15.00, 180.00,
 '{"monday": {"open": "07:00", "close": "22:00"}, "tuesday": {"open": "07:00", "close": "22:00"}, "wednesday": {"open": "07:00", "close": "22:00"}, "thursday": {"open": "07:00", "close": "22:00"}, "friday": {"open": "07:00", "close": "23:00"}, "saturday": {"open": "08:00", "close": "23:00"}, "sunday": {"open": "09:00", "close": "21:00"}}',
 '["security", "covered", "handicap_accessible"]', NULL),

('Business District Professional', 'Professional parking for business district with monthly passes', '789 Pine St', 'Uptown', 'CA', '90212', 34.0928, -118.3287, 75, 4.00, 25.00, 320.00,
 '{"monday": {"open": "05:30", "close": "20:00"}, "tuesday": {"open": "05:30", "close": "20:00"}, "wednesday": {"open": "05:30", "close": "20:00"}, "thursday": {"open": "05:30", "close": "20:00"}, "friday": {"open": "05:30", "close": "20:00"}, "saturday": {"open": "07:00", "close": "18:00"}, "sunday": "closed"}',
 '["security", "covered", "electric_charging", "handicap_accessible", "monthly_passes"]', NULL),

('Airport Terminal Long-Term', 'Long-term parking near airport with shuttle service', '100 Airport Blvd', 'Airport City', 'CA', '90213', 33.9425, -118.4081, 200, 1.50, 12.00, 150.00,
 '{"monday": {"open": "24/7"}, "tuesday": {"open": "24/7"}, "wednesday": {"open": "24/7"}, "thursday": {"open": "24/7"}, "friday": {"open": "24/7"}, "saturday": {"open": "24/7"}, "sunday": {"open": "24/7"}}',
 '["security", "shuttle_service", "handicap_accessible", "luggage_cart"]', NULL),

('University Campus', 'Student and faculty parking with discounted rates', '500 University Dr', 'College Town', 'CA', '90214', 34.0689, -118.4452, 120, 1.00, 8.00, 100.00,
 '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "08:00", "close": "20:00"}, "sunday": {"open": "08:00", "close": "20:00"}}',
 '["security", "student_discount", "handicap_accessible"]', NULL);

-- =============================================
-- PARKING SPOTS WITH VARIED TYPES
-- =============================================

-- Downtown Plaza spots (A1-A50) - Mixed vehicle types
INSERT INTO public.parking_spots (lot_id, spot_number, spot_type, status, is_handicap_accessible, is_electric_charging, width, length)
SELECT 
  pl.id,
  'A' || LPAD(s.spot_num::text, 2, '0'),
  CASE 
    WHEN s.spot_num <= 40 THEN 'car'::vehicle_type
    WHEN s.spot_num <= 45 THEN 'motorcycle'::vehicle_type
    WHEN s.spot_num <= 48 THEN 'van'::vehicle_type
    ELSE 'truck'::vehicle_type
  END,
  CASE 
    WHEN s.spot_num % 7 = 0 THEN 'occupied'::parking_status
    WHEN s.spot_num % 11 = 0 THEN 'reserved'::parking_status
    WHEN s.spot_num % 13 = 0 THEN 'maintenance'::parking_status
    ELSE 'available'::parking_status
  END,
  s.spot_num % 10 = 0,
  s.spot_num % 15 = 0,
  CASE 
    WHEN s.spot_num <= 40 THEN 8.5
    WHEN s.spot_num <= 45 THEN 4.0
    WHEN s.spot_num <= 48 THEN 9.0
    ELSE 10.0
  END,
  CASE 
    WHEN s.spot_num <= 40 THEN 18.0
    WHEN s.spot_num <= 45 THEN 12.0
    WHEN s.spot_num <= 48 THEN 20.0
    ELSE 22.0
  END
FROM public.parking_lots pl 
CROSS JOIN generate_series(1, 50) AS s(spot_num)
WHERE pl.name = 'Downtown Plaza Premium';

-- Shopping Center spots (B1-B30)
INSERT INTO public.parking_spots (lot_id, spot_number, spot_type, status, is_handicap_accessible, is_electric_charging, width, length)
SELECT 
  pl.id,
  'B' || LPAD(s.spot_num::text, 2, '0'),
  'car'::vehicle_type,
  CASE 
    WHEN s.spot_num % 5 = 0 THEN 'occupied'::parking_status
    WHEN s.spot_num % 8 = 0 THEN 'reserved'::parking_status
    ELSE 'available'::parking_status
  END,
  s.spot_num % 8 = 0,
  s.spot_num % 12 = 0,
  8.5,
  18.0
FROM public.parking_lots pl 
CROSS JOIN generate_series(1, 30) AS s(spot_num)
WHERE pl.name = 'Shopping Center Express';

-- Business District spots (C1-C75)
INSERT INTO public.parking_spots (lot_id, spot_number, spot_type, status, is_handicap_accessible, is_electric_charging, width, length)
SELECT 
  pl.id,
  'C' || LPAD(s.spot_num::text, 2, '0'),
  CASE 
    WHEN s.spot_num <= 60 THEN 'car'::vehicle_type
    WHEN s.spot_num <= 70 THEN 'van'::vehicle_type
    ELSE 'truck'::vehicle_type
  END,
  CASE 
    WHEN s.spot_num % 6 = 0 THEN 'occupied'::parking_status
    WHEN s.spot_num % 9 = 0 THEN 'reserved'::parking_status
    WHEN s.spot_num % 15 = 0 THEN 'maintenance'::parking_status
    ELSE 'available'::parking_status
  END,
  s.spot_num % 10 = 0,
  s.spot_num % 20 = 0,
  CASE 
    WHEN s.spot_num <= 60 THEN 8.5
    WHEN s.spot_num <= 70 THEN 9.0
    ELSE 10.0
  END,
  CASE 
    WHEN s.spot_num <= 60 THEN 18.0
    WHEN s.spot_num <= 70 THEN 20.0
    ELSE 22.0
  END
FROM public.parking_lots pl 
CROSS JOIN generate_series(1, 75) AS s(spot_num)
WHERE pl.name = 'Business District Professional';

-- Airport Terminal spots (D1-D200)
INSERT INTO public.parking_spots (lot_id, spot_number, spot_type, status, is_handicap_accessible, is_electric_charging, width, length)
SELECT 
  pl.id,
  'D' || LPAD(s.spot_num::text, 3, '0'),
  'car'::vehicle_type,
  CASE 
    WHEN s.spot_num % 4 = 0 THEN 'occupied'::parking_status
    WHEN s.spot_num % 7 = 0 THEN 'reserved'::parking_status
    ELSE 'available'::parking_status
  END,
  s.spot_num % 15 = 0,
  s.spot_num % 25 = 0,
  8.5,
  18.0
FROM public.parking_lots pl 
CROSS JOIN generate_series(1, 200) AS s(spot_num)
WHERE pl.name = 'Airport Terminal Long-Term';

-- University Campus spots (E1-E120)
INSERT INTO public.parking_spots (lot_id, spot_number, spot_type, status, is_handicap_accessible, is_electric_charging, width, length)
SELECT 
  pl.id,
  'E' || LPAD(s.spot_num::text, 3, '0'),
  CASE 
    WHEN s.spot_num <= 100 THEN 'car'::vehicle_type
    WHEN s.spot_num <= 110 THEN 'motorcycle'::vehicle_type
    ELSE 'van'::vehicle_type
  END,
  CASE 
    WHEN s.spot_num % 3 = 0 THEN 'occupied'::parking_status
    WHEN s.spot_num % 5 = 0 THEN 'reserved'::parking_status
    ELSE 'available'::parking_status
  END,
  s.spot_num % 12 = 0,
  s.spot_num % 30 = 0,
  CASE 
    WHEN s.spot_num <= 100 THEN 8.5
    WHEN s.spot_num <= 110 THEN 4.0
    ELSE 9.0
  END,
  CASE 
    WHEN s.spot_num <= 100 THEN 18.0
    WHEN s.spot_num <= 110 THEN 12.0
    ELSE 20.0
  END
FROM public.parking_lots pl 
CROSS JOIN generate_series(1, 120) AS s(spot_num)
WHERE pl.name = 'University Campus';

-- =============================================
-- PARKING SESSIONS (ACTIVE AND COMPLETED)
-- =============================================

-- Note: For demo purposes, we'll create sessions without user_id references
-- In a real application, these would be linked to actual authenticated users

-- Active parking sessions (without user_id for now)
INSERT INTO public.parking_sessions (spot_id, vehicle_plate, vehicle_type, check_in_time, hourly_rate, daily_rate, monthly_rate, payment_status, notes)
SELECT 
  ps.id,
  'ABC123',
  'car'::vehicle_type,
  NOW() - INTERVAL '2 hours',
  pl.hourly_rate,
  pl.daily_rate,
  pl.monthly_rate,
  'pending'::payment_status,
  'Customer parking session'
FROM public.parking_spots ps
JOIN public.parking_lots pl ON ps.lot_id = pl.id
WHERE ps.status = 'occupied' AND ps.spot_number LIKE 'A%'
LIMIT 5;

INSERT INTO public.parking_sessions (spot_id, vehicle_plate, vehicle_type, check_in_time, hourly_rate, daily_rate, monthly_rate, payment_status, notes)
SELECT 
  ps.id,
  'XYZ789',
  'car'::vehicle_type,
  NOW() - INTERVAL '1 hour',
  pl.hourly_rate,
  pl.daily_rate,
  pl.monthly_rate,
  'pending'::payment_status,
  'Customer parking session'
FROM public.parking_spots ps
JOIN public.parking_lots pl ON ps.lot_id = pl.id
WHERE ps.status = 'occupied' AND ps.spot_number LIKE 'B%'
LIMIT 3;

-- Completed parking sessions (without user_id for now)
INSERT INTO public.parking_sessions (spot_id, vehicle_plate, vehicle_type, check_in_time, check_out_time, hourly_rate, daily_rate, monthly_rate, total_amount, payment_status, notes)
SELECT 
  ps.id,
  'DEF456',
  'car'::vehicle_type,
  NOW() - INTERVAL '1 day' - INTERVAL '3 hours',
  NOW() - INTERVAL '1 day',
  pl.hourly_rate,
  pl.daily_rate,
  pl.monthly_rate,
  pl.hourly_rate * 3,
  'completed'::payment_status,
  'Completed session'
FROM public.parking_spots ps
JOIN public.parking_lots pl ON ps.lot_id = pl.id
WHERE ps.status = 'available' AND ps.spot_number LIKE 'C%'
LIMIT 8;

-- =============================================
-- PAYMENTS
-- =============================================

-- Insert payments for completed sessions
INSERT INTO public.payments (session_id, amount, payment_method, payment_provider, transaction_id, status, processed_at)
SELECT 
  ps.id,
  ps.total_amount,
  CASE 
    WHEN random() < 0.6 THEN 'card'
    WHEN random() < 0.8 THEN 'mobile'
    ELSE 'cash'
  END,
  CASE 
    WHEN random() < 0.7 THEN 'stripe'
    WHEN random() < 0.9 THEN 'paypal'
    ELSE NULL
  END,
  'txn_' || substr(md5(random()::text), 1, 10),
  'completed'::payment_status,
  ps.check_out_time + INTERVAL '5 minutes'
FROM public.parking_sessions ps
WHERE ps.payment_status = 'completed' AND ps.total_amount IS NOT NULL;

-- =============================================
-- RESERVATIONS
-- =============================================

-- Note: For demo purposes, we'll create reservations without user_id references
-- In a real application, these would be linked to actual authenticated users

-- Future reservations (without user_id for now)
INSERT INTO public.reservations (spot_id, start_time, end_time, status, amount, payment_id)
SELECT 
  ps.id,
  NOW() + INTERVAL '1 day' + INTERVAL '9 hours',
  NOW() + INTERVAL '1 day' + INTERVAL '17 hours',
  'active',
  pl.hourly_rate * 8,
  NULL
FROM public.parking_spots ps
JOIN public.parking_lots pl ON ps.lot_id = pl.id
WHERE ps.status = 'reserved' AND ps.spot_number LIKE 'A%'
LIMIT 3;

INSERT INTO public.reservations (spot_id, start_time, end_time, status, amount, payment_id)
SELECT 
  ps.id,
  NOW() + INTERVAL '2 days' + INTERVAL '8 hours',
  NOW() + INTERVAL '2 days' + INTERVAL '18 hours',
  'active',
  pl.hourly_rate * 10,
  NULL
FROM public.parking_spots ps
JOIN public.parking_lots pl ON ps.lot_id = pl.id
WHERE ps.status = 'reserved' AND ps.spot_number LIKE 'B%'
LIMIT 2;

-- =============================================
-- NOTIFICATIONS
-- =============================================

-- Note: For demo purposes, we'll create notifications without user_id references
-- In a real application, these would be linked to actual authenticated users

-- Sample notifications (without user_id for now)
INSERT INTO public.notifications (title, message, type, is_read, data)
VALUES
('Parking Session Started', 'Your parking session has started at Downtown Plaza Premium', 'info', false, '{"lot_name": "Downtown Plaza Premium", "spot": "A01"}'),
('Payment Due', 'Your parking session payment is due', 'warning', false, '{"amount": 7.00, "session_id": "session_123"}'),
('Session Completed', 'Your parking session has been completed successfully', 'success', true, '{"total_amount": 12.50, "duration": "3 hours"}'),
('Reservation Confirmed', 'Your parking reservation has been confirmed', 'success', false, '{"reservation_id": "res_456", "start_time": "2024-01-15T09:00:00Z"}'),
('Reservation Reminder', 'Your parking reservation starts in 2 hours', 'info', false, '{"reservation_id": "res_789", "start_time": "2024-01-16T08:00:00Z"}');

-- =============================================
-- ACTIVITY LOGS
-- =============================================

-- Note: For demo purposes, we'll create activity logs without user_id references
-- In a real application, these would be linked to actual authenticated users

-- Sample activity logs (without user_id for now)
INSERT INTO public.activity_logs (action, description, table_name, record_id, old_values, new_values, ip_address)
VALUES
('INSERT', 'Created new parking lot: Downtown Plaza Premium', 'parking_lots', (SELECT id FROM public.parking_lots WHERE name = 'Downtown Plaza Premium' LIMIT 1), NULL, '{"name": "Downtown Plaza Premium", "total_spots": 50}', '192.168.1.100'),
('INSERT', 'Created new parking lot: Shopping Center Express', 'parking_lots', (SELECT id FROM public.parking_lots WHERE name = 'Shopping Center Express' LIMIT 1), NULL, '{"name": "Shopping Center Express", "total_spots": 30}', '192.168.1.101'),
('UPDATE', 'Updated parking spot status to occupied', 'parking_spots', (SELECT id FROM public.parking_spots WHERE spot_number = 'A01' LIMIT 1), '{"status": "available"}', '{"status": "occupied"}', '192.168.1.102'),
('INSERT', 'Created new parking session', 'parking_sessions', (SELECT id FROM public.parking_sessions LIMIT 1), NULL, '{"vehicle_plate": "ABC123", "check_in_time": "2024-01-14T10:00:00Z"}', '192.168.1.103');

-- =============================================
-- UPDATE PARKING LOT TOTAL SPOTS COUNT
-- =============================================

-- Update the total_spots count in parking_lots to match actual spots created
UPDATE public.parking_lots 
SET total_spots = (
  SELECT COUNT(*) 
  FROM public.parking_spots 
  WHERE parking_spots.lot_id = parking_lots.id
);

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

SELECT 
  'Database seeded successfully! 🎉' as message,
  (SELECT COUNT(*) FROM public.parking_lots) as total_parking_lots,
  (SELECT COUNT(*) FROM public.parking_spots) as total_parking_spots,
  (SELECT COUNT(*) FROM public.parking_sessions) as total_sessions,
  (SELECT COUNT(*) FROM public.payments) as total_payments,
  (SELECT COUNT(*) FROM public.reservations) as total_reservations,
  (SELECT COUNT(*) FROM public.notifications) as total_notifications,
  (SELECT COUNT(*) FROM public.activity_logs) as total_activity_logs;

-- Note: Profiles will be created automatically when users sign up via Supabase Auth
-- The handle_new_user() trigger function will create profiles for new users
