-- Create theaters table
CREATE TABLE public.theaters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Mumbai',
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;

-- Anyone can view theaters
CREATE POLICY "Anyone can view theaters" ON public.theaters FOR SELECT USING (true);

-- Create movie_theater_showtimes junction table
CREATE TABLE public.movie_theater_showtimes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  theater_id UUID NOT NULL REFERENCES public.theaters(id) ON DELETE CASCADE,
  showtime TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 299.00,
  available_seats INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.movie_theater_showtimes ENABLE ROW LEVEL SECURITY;

-- Anyone can view showtimes
CREATE POLICY "Anyone can view movie showtimes" ON public.movie_theater_showtimes FOR SELECT USING (true);

-- Update bookings to reference theater
ALTER TABLE public.bookings ADD COLUMN theater_id UUID REFERENCES public.theaters(id);

-- Insert sample theaters
INSERT INTO public.theaters (name, location, city, amenities) VALUES
  ('PVR Cinemas', 'Phoenix Mall, Lower Parel', 'Mumbai', ARRAY['Dolby Atmos', 'IMAX', 'Recliner Seats']),
  ('INOX', 'R City Mall, Ghatkopar', 'Mumbai', ARRAY['4DX', 'Dolby Atmos', 'Premium Lounge']),
  ('Cinepolis', 'Viviana Mall, Thane', 'Mumbai', ARRAY['VIP Seats', 'Dolby Sound', 'Food Court']),
  ('Carnival Cinemas', 'Andheri West', 'Mumbai', ARRAY['3D', 'Dolby Atmos']);