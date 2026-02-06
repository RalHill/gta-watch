-- GTA Watch Incidents Table
-- Anonymous incident reporting for GTA emergency awareness

-- Create incidents table
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('shooting', 'medical', 'fire', 'accident', 'assault', 'suspicious', 'theft', 'other')),
    description TEXT CHECK (length(description) <= 200),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(11, 7) NOT NULL,
    location_label TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient querying by time
CREATE INDEX IF NOT EXISTS incidents_created_at_idx ON public.incidents(created_at DESC);

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS incidents_location_idx ON public.incidents(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to INSERT incidents
CREATE POLICY "Allow anonymous insert"
ON public.incidents
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow anonymous users to SELECT incidents from last 24 hours only
CREATE POLICY "Allow read incidents from last 24h"
ON public.incidents
FOR SELECT
TO anon, authenticated
USING (created_at > NOW() - INTERVAL '24 hours');

-- Policy: No UPDATE allowed (incidents are immutable once created)
CREATE POLICY "No updates allowed"
ON public.incidents
FOR UPDATE
USING (false);

-- Policy: No DELETE allowed for anonymous users
CREATE POLICY "No deletes allowed"
ON public.incidents
FOR DELETE
USING (false);

-- Seed data: Mock incidents across GTA
-- Coordinates are approximate locations in Toronto

INSERT INTO public.incidents (category, description, latitude, longitude, location_label, created_at) VALUES
-- Recent incidents (last 2 hours)
('fire', 'Heavy smoke visible from third floor. Multiple units on scene.', 43.65107, -79.38426, 'Warden & Sheppard, Scarborough', NOW() - INTERVAL '2 minutes'),
('medical', 'Cardiac arrest reported. EMS en route.', 43.64722, -79.37976, 'Bay St, Downtown Toronto', NOW() - INTERVAL '8 minutes'),
('accident', 'Multi-vehicle collision blocking eastbound lanes.', 43.68261, -79.31574, 'Hwy 401, Leslie St Express', NOW() - INTERVAL '14 minutes'),
('shooting', 'Shots fired reported near apartment complex.', 43.66478, -79.31973, 'Victoria Park & Danforth', NOW() - INTERVAL '32 minutes'),
('suspicious', 'Suspicious vehicle parked near school zone.', 43.70092, -79.41689, 'Yonge St & Eglinton Ave', NOW() - INTERVAL '45 minutes'),
('theft', 'Break-in reported at commercial property.', 43.65487, -79.50429, 'Islington Ave, Etobicoke', NOW() - INTERVAL '1 hour 12 minutes'),
('assault', 'Physical altercation involving multiple individuals.', 43.64273, -79.38718, 'Queen St W & Spadina', NOW() - INTERVAL '1 hour 34 minutes'),

-- Earlier today (2-12 hours ago)
('fire', 'Small structure fire contained by residents before FD arrival.', 43.77120, -79.41120, 'Finch Ave W, North York', NOW() - INTERVAL '3 hours'),
('medical', 'Slip and fall injury near transit station.', 43.65323, -79.38318, 'Union Station, Downtown', NOW() - INTERVAL '4 hours 20 minutes'),
('accident', 'Single vehicle collision with utility pole.', 43.78447, -79.18230, 'Steeles Ave, Scarborough', NOW() - INTERVAL '5 hours 45 minutes'),
('suspicious', 'Unattended package reported near public building.', 43.65322, -79.38325, '100 Queen St W, Toronto', NOW() - INTERVAL '7 hours'),
('other', 'Power lines down blocking roadway. Hydro notified.', 43.60927, -79.49707, 'Lake Shore Blvd W, Etobicoke', NOW() - INTERVAL '8 hours 30 minutes'),
('medical', 'Person requiring medical assistance at subway platform.', 43.66623, -79.38318, 'Bloor-Yonge Station', NOW() - INTERVAL '10 hours'),
('theft', 'Vehicle break-in reported in parking structure.', 43.64692, -79.40053, 'Liberty Village, Toronto', NOW() - INTERVAL '11 hours 15 minutes'),

-- Earlier incidents (12-23 hours ago)
('fire', 'Kitchen fire in residential building, no injuries.', 43.67832, -79.34652, 'Pape Ave & Danforth', NOW() - INTERVAL '14 hours'),
('shooting', 'Shots heard near park area late evening.', 43.72947, -79.49850, 'Jane St & Finch Ave W', NOW() - INTERVAL '16 hours'),
('accident', 'Pedestrian struck at crosswalk. Serious injuries reported.', 43.66478, -79.40224, 'Dundas St W & Bathurst', NOW() - INTERVAL '18 hours'),
('assault', 'Domestic disturbance call, police attended.', 43.61523, -79.51420, 'Browns Line, Etobicoke', NOW() - INTERVAL '20 hours'),
('suspicious', 'Loitering reported near commercial plaza after hours.', 43.76447, -79.41140, 'Sheppard Ave & Yonge St', NOW() - INTERVAL '22 hours 30 minutes'),
('other', 'Hazardous material spill on roadway, cleanup in progress.', 43.65892, -79.34420, 'Don Valley Parkway', NOW() - INTERVAL '23 hours 45 minutes');

-- Comment: This seed data provides realistic incident distribution across Toronto
-- Coordinates cover various neighborhoods: Downtown, Scarborough, Etobicoke, North York
-- Incidents span the full 24-hour window to test time-based filtering
