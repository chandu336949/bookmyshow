-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'paid', 'cancelled', 'expired');

-- Create movie availability status enum
CREATE TYPE public.availability_status AS ENUM ('available', 'sold_out', 'coming_soon', 'ended');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create movies table
CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  poster_url TEXT NOT NULL,
  banner_url TEXT,
  rating NUMERIC(3,1) DEFAULT 0.0,
  votes TEXT DEFAULT '0',
  duration TEXT,
  release_date DATE,
  genres TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  cast_members TEXT[] DEFAULT '{}',
  director TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 299.00,
  availability_status public.availability_status NOT NULL DEFAULT 'available',
  total_seats INTEGER NOT NULL DEFAULT 100,
  available_seats INTEGER NOT NULL DEFAULT 100,
  showtimes JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
  showtime TEXT NOT NULL,
  seats INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC(10,2) NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  favorite_genres TEXT[] DEFAULT '{}',
  favorite_languages TEXT[] DEFAULT '{}',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Movies policies (public read, no user modification)
CREATE POLICY "Anyone can view movies" 
ON public.movies FOR SELECT 
USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings FOR UPDATE 
USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_movies_updated_at
BEFORE UPDATE ON public.movies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration (auto-create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Insert sample movies data
INSERT INTO public.movies (title, description, poster_url, banner_url, rating, votes, duration, genres, languages, cast_members, director, price, availability_status, showtimes) VALUES
('Pushpa 2: The Rule', 'The sequel to the blockbuster Pushpa follows Pushpa Raj as he rises to become a dangerous syndicate leader.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=800&fit=crop', 9.2, '2.5M', '3h 20m', ARRAY['Action', 'Drama', 'Thriller'], ARRAY['Telugu', 'Hindi', 'Tamil'], ARRAY['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil'], 'Sukumar', 350.00, 'available', '["10:00 AM", "1:30 PM", "5:00 PM", "9:00 PM"]'),
('Kalki 2898 AD', 'A sci-fi epic set in a dystopian future where the last hope for humanity lies in an ancient prophecy.', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=800&fit=crop', 8.8, '1.8M', '2h 58m', ARRAY['Sci-Fi', 'Action', 'Fantasy'], ARRAY['Telugu', 'Hindi', 'Tamil'], ARRAY['Prabhas', 'Deepika Padukone', 'Amitabh Bachchan'], 'Nag Ashwin', 400.00, 'available', '["11:00 AM", "3:00 PM", "7:00 PM", "10:30 PM"]'),
('Stree 2', 'The horror-comedy sequel returns with more scares and laughs as the town faces a new supernatural threat.', 'https://images.unsplash.com/photo-1509248961895-40c8c8e4a0ec?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1509248961895-40c8c8e4a0ec?w=1920&h=800&fit=crop', 8.5, '1.2M', '2h 30m', ARRAY['Horror', 'Comedy'], ARRAY['Hindi'], ARRAY['Rajkummar Rao', 'Shraddha Kapoor', 'Pankaj Tripathi'], 'Amar Kaushik', 299.00, 'available', '["12:00 PM", "4:00 PM", "8:00 PM"]'),
('Devara: Part 1', 'An action-packed saga of a fearless warrior protecting his coastal community from powerful enemies.', 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&h=800&fit=crop', 8.3, '950K', '2h 52m', ARRAY['Action', 'Drama'], ARRAY['Telugu', 'Hindi'], ARRAY['Jr. NTR', 'Janhvi Kapoor', 'Saif Ali Khan'], 'Koratala Siva', 375.00, 'available', '["10:30 AM", "2:00 PM", "6:00 PM", "9:30 PM"]'),
('Singham Again', 'Inspector Singham returns in an all-new action thriller facing his biggest challenge yet.', 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1920&h=800&fit=crop', 8.1, '1.5M', '2h 45m', ARRAY['Action', 'Crime', 'Drama'], ARRAY['Hindi'], ARRAY['Ajay Devgn', 'Kareena Kapoor', 'Ranveer Singh'], 'Rohit Shetty', 325.00, 'available', '["11:30 AM", "3:30 PM", "7:30 PM", "10:00 PM"]'),
('The Batman 2', 'Bruce Wayne continues his crusade against crime in Gotham as new threats emerge from the shadows.', 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop', 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1920&h=800&fit=crop', 8.7, '2.1M', '2h 55m', ARRAY['Action', 'Crime', 'Drama'], ARRAY['English', 'Hindi'], ARRAY['Robert Pattinson', 'Zoe Kravitz'], 'Matt Reeves', 450.00, 'coming_soon', '["11:00 AM", "2:30 PM", "6:30 PM", "10:00 PM"]');