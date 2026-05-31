-- =====================================================
-- EngiHub Supabase Schema (Complete - English Only)
-- Last Updated: Enhanced with 30+ projects + Auto Profile Trigger
-- =====================================================

-- Drop existing objects so this schema file can be used to reset the database.
-- WARNING: This will remove all current data in these tables.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS user_saved_projects CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS pyqs CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS doubts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

create extension if not exists "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  college text not null default 'Your University',
  branch text not null default 'CSE',
  year int not null default 2 check (year between 1 and 4),
  semester int not null default 3 check (semester between 1 and 8),
  is_pro boolean default false,
  ai_uses_today int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);


-- =====================================================
-- 2. DOUBTS TABLE (EngiAI)
-- =====================================================
create table if not exists doubts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  image_url text,
  question_text text not null,
  response text not null,
  created_at timestamptz default now()
);

alter table doubts enable row level security;
create policy "Users can manage own doubts" on doubts for all using (auth.uid() = user_id);


-- =====================================================
-- 3. PYQS TABLE
-- =====================================================
create table if not exists pyqs (
  id serial primary key,
  subject text not null,
  branch text not null,
  year int,
  semester int,
  question text not null,
  marks int check (marks in (2, 5, 10, 15)),
  importance text check (importance in ('high', 'medium', 'low')),
  year_asked text,
  created_at timestamptz default now()
);


-- =====================================================
-- 4. PROJECTS TABLE (Static + AI Generated)
-- =====================================================
create table if not exists projects (
  id serial primary key,
  title text not null,
  description text not null,
  branch text[] not null,
  difficulty text not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  tech_stack text[] not null,
  estimated_cost_inr text,
  madurai_price_range text,
  components text[],
  is_ai_generated boolean default false,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);


-- =====================================================
-- 5. USER SAVED PROJECTS (For AI Generator)
-- =====================================================
create table if not exists user_saved_projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  project_id int references projects(id) on delete set null,
  title text not null,
  description text not null,
  tech_stack text[],
  estimated_cost text,
  difficulty text,
  why_good text,
  components text[],
  saved_at timestamptz default now()
);

alter table user_saved_projects enable row level security;
create policy "Users can manage their saved projects" on user_saved_projects for all using (auth.uid() = user_id);


-- =====================================================
-- 6. NOTES TABLE
-- =====================================================
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  file_url text,
  subject text,
  is_public boolean default false,
  created_at timestamptz default now()
);

alter table notes enable row level security;
create policy "Users can manage own notes" on notes for all using (auth.uid() = user_id);


-- =====================================================
-- 7. ATTENDANCE TABLE
-- =====================================================
create table if not exists attendance (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  subject text not null,
  present int default 0,
  total int default 0,
  updated_at timestamptz default now()
);

alter table attendance enable row level security;
create policy "Users can manage own attendance" on attendance for all using (auth.uid() = user_id);


-- =====================================================
-- INDEXES
-- =====================================================
create index if not exists idx_doubts_user_id on doubts(user_id);
create index if not exists idx_user_saved_projects_user_id on user_saved_projects(user_id);
create index if not exists idx_projects_branch on projects using gin(branch);
create index if not exists idx_pyqs_branch on pyqs(branch);


-- =====================================================
-- AUTO CREATE PROFILE TRIGGER (Very Important for Google Sign-in)
-- =====================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, college, branch, year, semester)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    'Your University',
    'CSE',
    2,
    3
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists and create new one
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =====================================================
-- SEED DATA - PYQs
-- =====================================================
insert into pyqs (subject, branch, year, semester, question, marks, importance, year_asked) values
('Operating Systems', 'CSE', 3, 5, 'Explain Bankers Algorithm for Deadlock Avoidance with a suitable example.', 10, 'high', 'Nov 2023'),
('Computer Networks', 'CSE', 3, 5, 'Differentiate between TCP and UDP. When would you prefer one over the other?', 5, 'high', 'Apr 2024'),
('DBMS', 'CSE', 3, 5, 'Explain Normalization (1NF, 2NF, 3NF) with examples.', 10, 'high', 'Nov 2023'),
('Data Structures', 'CSE', 2, 4, 'Write a program to implement a Circular Queue using arrays.', 5, 'medium', 'Apr 2023'),
('Computer Networks', 'CSE', 3, 5, 'Explain the working of CSMA/CD protocol with a neat diagram.', 2, 'medium', 'Nov 2022');


-- =====================================================
-- SEED DATA - 30+ High Quality Projects (English Only)
-- =====================================================
insert into projects (title, description, branch, difficulty, tech_stack, estimated_cost_inr, madurai_price_range, components, is_ai_generated) values

-- Agriculture & IoT
('Smart Irrigation System using ESP32 + Soil Sensors', 'Automatic watering based on soil moisture + mobile alerts. Very popular in Tamil Nadu villages.', ARRAY['CSE','ECE'], 'Intermediate', ARRAY['ESP32','IoT'], '₹2,400 – ₹3,100', 'Madurai: ₹2,500 – ₹3,000', ARRAY['ESP32 DevKit', 'Capacitive Soil Sensor', 'Relay Module', 'Water Pump'], false),

('AI-Based Crop Disease Detection using Mobile Camera', 'Detects diseases in paddy, banana and tomato leaves using TensorFlow Lite. Works offline.', ARRAY['CSE','AIML'], 'Advanced', ARRAY['Flutter','TensorFlow Lite'], '₹800 – ₹1,500', 'Low cost', ARRAY['Mobile Phone'], false),

('Automated Poultry Farm Monitoring & Control', 'Monitors temperature, ammonia, humidity with auto fan and water control + SMS alerts.', ARRAY['ECE','EEE'], 'Intermediate', ARRAY['ESP32','IoT'], '₹3,200 – ₹4,100', 'Madurai: ₹3,400 – ₹3,900', ARRAY['ESP32', 'DHT22', 'MQ-135', 'Relay Board'], false),

-- EV & Energy
('IoT based EV Battery Monitoring & Theft Detection', 'Real-time voltage, current, temperature monitoring with GPS and auto cut-off relay.', ARRAY['EEE','ECE'], 'Advanced', ARRAY['ESP32','IoT','GSM'], '₹4,200 – ₹5,800', 'Madurai: ₹4,500 – ₹5,400', ARRAY['ESP32', 'INA219', 'DHT22', 'GSM Module', 'Relay'], false),

('Smart Energy Meter with Theft Detection', 'Monitors power consumption, detects bypass, and sends monthly bill via SMS.', ARRAY['EEE','ECE'], 'Intermediate', ARRAY['ESP32','IoT'], '₹2,100 – ₹2,850', 'Madurai: ₹2,250 – ₹2,700', ARRAY['ESP32', 'PZEM-004T'], false),

-- Healthcare & Assistive
('Smart Blind Stick with GPS + Voice + Obstacle Detection', 'Ultrasonic + water + fire detection with Tamil/English voice feedback and emergency location sharing.', ARRAY['ECE','CSE'], 'Intermediate', ARRAY['Arduino','GSM'], '₹1,850 – ₹2,600', 'Madurai: ₹2,000 – ₹2,450', ARRAY['Arduino', 'Ultrasonic Sensors', 'GPS', 'Voice Module'], false),

('IoT Patient Health Monitoring System (SpO2 + Temp)', 'Real-time heart rate, SpO2 and temperature monitoring with emergency SMS alerts.', ARRAY['ECE','EEE'], 'Intermediate', ARRAY['ESP32','IoT'], '₹2,400 – ₹3,300', 'Madurai: ₹2,600 – ₹3,100', ARRAY['ESP32', 'MAX30102', 'DS18B20'], false),

('Gesture Controlled Wheelchair using MPU6050', 'Hand gesture based wheelchair control for physically challenged people.', ARRAY['ECE','Mechanical'], 'Intermediate', ARRAY['ESP32','MPU6050'], '₹3,100 – ₹4,200', 'Coimbatore: ₹3,400 – ₹3,950', ARRAY['ESP32', 'MPU6050', 'Motor Driver'], false),

-- Smart City & Environment
('Real-time Air Quality Monitoring for Textile Hubs', 'PM2.5, PM10, CO and noise monitoring system with public dashboard. Ideal for Tirupur & Coimbatore.', ARRAY['ECE','CSE'], 'Advanced', ARRAY['ESP32','IoT','React'], '₹3,800 – ₹5,100', 'Madurai: ₹4,100 – ₹4,800', ARRAY['ESP32', 'PMS5003', 'MQ-7', 'Sound Sensor'], false),

('Smart Waste Segregation Bin for Apartments', 'Uses sensors and servo motor to automatically segregate wet and dry waste with full bin alerts.', ARRAY['ECE','CSE'], 'Intermediate', ARRAY['Arduino','IoT'], '₹2,150 – ₹2,900', 'Madurai: ₹2,300 – ₹2,750', ARRAY['Arduino', 'Ultrasonic Sensors', 'Servo Motor'], false),

('Smart Bus Stop Display with Real-time ETA', 'Shows next bus arrival time using GPS. Can be solar powered.', ARRAY['ECE','CSE'], 'Intermediate', ARRAY['ESP32','GPS','IoT'], '₹2,600 – ₹3,400', 'Coimbatore: ₹2,800 – ₹3,200', ARRAY['ESP32', 'GPS Module', 'OLED Display'], false),

-- Industrial & Mechanical
('Automated Industrial Conveyor with Color Sorting', 'Sorts objects by color using TCS3200 sensor and counts production. Good for mechanical + ECE.', ARRAY['Mechanical','ECE'], 'Intermediate', ARRAY['Arduino'], '₹3,600 – ₹4,800', 'Coimbatore: ₹3,900 – ₹4,500', ARRAY['Arduino', 'TCS3200', 'Conveyor Motor', 'Servo'], false),

('Smart Helmet for Construction Workers', 'Detects fall, harmful gases and sends location to supervisor automatically.', ARRAY['ECE','Mechanical'], 'Intermediate', ARRAY['ESP32','IoT'], '₹2,300 – ₹3,100', 'Madurai: ₹2,500 – ₹2,900', ARRAY['ESP32', 'MPU6050', 'MQ-2', 'GPS'], false),

-- CSE / AIML Focused
('AI-Powered Resume Screening & Job Matching System', 'NLP based resume parser + job recommendation engine tailored for Anna University placements.', ARRAY['CSE','AIML'], 'Advanced', ARRAY['Python','React','NLP'], '₹1,200 – ₹2,000', 'Low cost', ARRAY['Laptop'], false),

('Smart Attendance System using Face Recognition + QR', 'Hybrid face recognition and QR code attendance system with auto report generation.', ARRAY['CSE','AIML'], 'Intermediate', ARRAY['Python','OpenCV','Flutter'], '₹1,500 – ₹2,400', 'Low cost', ARRAY['Webcam'], false),

('Campus Navigation App with Indoor AR Mapping', 'AR-based indoor navigation for large college campuses (Anna University style).', ARRAY['CSE'], 'Advanced', ARRAY['Flutter','ARCore'], '₹1,800 – ₹2,800', 'Medium', ARRAY['Mobile Phone'], false),

-- More Practical Projects
('IoT Smart Water Level Monitoring for Apartments', 'Prevents motor dry run and water overflow. Extremely useful in Tamil Nadu apartments.', ARRAY['ECE','EEE'], 'Beginner', ARRAY['ESP32','IoT'], '₹1,650 – ₹2,300', 'Madurai: ₹1,800 – ₹2,150', ARRAY['ESP32', 'Ultrasonic Sensor', 'Relay'], false),

('Home Automation using Voice + Mobile App', 'Control lights, fans and AC using voice commands and mobile app.', ARRAY['CSE','ECE'], 'Intermediate', ARRAY['ESP32','Flutter'], '₹2,200 – ₹3,000', 'Madurai: ₹2,400 – ₹2,850', ARRAY['ESP32', 'Relays'], false),

('Automatic Number Plate Recognition (ANPR) for Campus', 'Detects and logs vehicle number plates at college gates using camera.', ARRAY['CSE','ECE'], 'Advanced', ARRAY['Raspberry Pi','OpenCV'], '₹4,800 – ₹6,500', 'Chennai: ₹5,200 – ₹6,100', ARRAY['Raspberry Pi', 'Camera'], false),

('Smart Fire Detection & Suppression System', 'Multi-sensor fire detection with automatic water spray and instant alerts.', ARRAY['ECE','EEE'], 'Intermediate', ARRAY['Arduino','IoT'], '₹2,700 – ₹3,600', 'Madurai: ₹2,950 – ₹3,400', ARRAY['Arduino', 'Flame Sensor', 'Smoke Sensor', 'Pump'], false),

('Weather Station with Rain Prediction using ML', 'Local weather station that predicts rain using sensor data + machine learning.', ARRAY['CSE','ECE'], 'Advanced', ARRAY['ESP32','Python','ML'], '₹3,400 – ₹4,600', 'Coimbatore: ₹3,700 – ₹4,300', ARRAY['ESP32', 'BME280', 'Rain Sensor'], false),

('Automated Hydroponics System with pH & EC Monitoring', 'Soil-less farming system with automatic nutrient dosing.', ARRAY['ECE','Mechanical'], 'Advanced', ARRAY['Arduino','IoT'], '₹5,200 – ₹7,100', 'Chennai: ₹5,600 – ₹6,800', ARRAY['Arduino', 'pH Sensor', 'EC Sensor', 'Pumps'], false),

('Smart Parking System with Mobile Slot Booking', 'Detects empty parking slots and allows booking through mobile app.', ARRAY['CSE','ECE'], 'Intermediate', ARRAY['ESP32','React'], '₹2,800 – ₹3,700', 'Madurai: ₹3,000 – ₹3,500', ARRAY['ESP32', 'IR Sensors', 'Servo'], false),

('IoT LPG Leakage Detection with Auto Cylinder Cut-off', 'Detects gas leakage, automatically closes valve and sends SMS alert.', ARRAY['EEE','ECE'], 'Intermediate', ARRAY['ESP32','IoT'], '₹2,100 – ₹2,850', 'Madurai: ₹2,300 – ₹2,700', ARRAY['ESP32', 'MQ-6', 'Solenoid Valve'], false),

('Portable ECG Monitoring Device with Bluetooth', 'Low-cost 3-lead ECG monitor for rural health camps.', ARRAY['ECE','EEE'], 'Advanced', ARRAY['ESP32'], '₹3,900 – ₹5,400', 'Coimbatore: ₹4,200 – ₹5,100', ARRAY['ESP32', 'AD8232', 'Electrodes'], false),

('Smart Classroom Automation System', 'Auto controls lights, fans and projector + attendance using RFID/face.', ARRAY['ECE','CSE'], 'Intermediate', ARRAY['ESP32','IoT'], '₹3,500 – ₹4,700', 'Madurai: ₹3,800 – ₹4,400', ARRAY['ESP32', 'PIR', 'RFID', 'Relay'], false),

('Drone-based Crop Health Monitoring System', 'Camera drone + image processing for large farms.', ARRAY['ECE','CSE'], 'Advanced', ARRAY['Raspberry Pi','OpenCV'], '₹8,500 – ₹12,000', 'Chennai: ₹9,200 – ₹11,500', ARRAY['Drone Frame', 'Raspberry Pi', 'Camera'], false),

('Automatic Fish Feeder & Water Quality Monitoring', 'Very useful for aquaculture in coastal and inland Tamil Nadu.', ARRAY['ECE','EEE'], 'Intermediate', ARRAY['Arduino','IoT'], '₹2,600 – ₹3,500', 'Madurai: ₹2,800 – ₹3,300', ARRAY['Arduino', 'Servo', 'pH Sensor', 'TDS Sensor'], false),

('Smart Helmet for Two-Wheeler Riders with Accident Detection', 'Detects accident and automatically sends location + calls emergency contact.', ARRAY['ECE'], 'Intermediate', ARRAY['ESP32','MPU6050'], '₹2,400 – ₹3,200', 'Madurai: ₹2,600 – ₹3,000', ARRAY['ESP32', 'MPU6050', 'GSM Module'], false),

('Low-Cost CNC Plotter using Arduino + Stepper Motors', 'Can draw circuit diagrams and posters. Good mechanical + ECE combo project.', ARRAY['Mechanical','ECE'], 'Intermediate', ARRAY['Arduino'], '₹3,200 – ₹4,300', 'Coimbatore: ₹3,500 – ₹4,100', ARRAY['Arduino', 'Stepper Motors', 'CNC Shield'], false),

('Smart Flood Monitoring & Early Warning System', 'Water level + rainfall monitoring with SMS alerts for low-lying areas.', ARRAY['ECE','CSE'], 'Intermediate', ARRAY['ESP32','IoT'], '₹2,900 – ₹3,800', 'Madurai: ₹3,100 – ₹3,600', ARRAY['ESP32', 'Ultrasonic', 'Rain Sensor', 'GSM'], false);


-- =====================================================
-- HELPFUL VIEWS
-- =====================================================

create or replace view user_project_stats as
select 
  user_id,
  count(*) as total_saved_projects
from user_saved_projects
group by user_id;


-- =====================================================
-- DONE
-- =====================================================
-- After running this SQL:
-- 1. Enable Google provider in Authentication → Providers
-- 2. Add redirect URL: http://localhost:3000/auth/callback
-- 3. The trigger will automatically create profiles on signup
