import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Theater = Tables<"theaters">;
export type MovieTheaterShowtime = Tables<"movie_theater_showtimes"> & {
  theaters: Theater;
};

export const useTheaters = () => {
  return useQuery({
    queryKey: ["theaters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theaters")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Theater[];
    },
  });
};

export const useMovieShowtimes = (movieId: string | undefined) => {
  return useQuery({
    queryKey: ["movie-showtimes", movieId],
    queryFn: async () => {
      if (!movieId) return [];
      
      const { data, error } = await supabase
        .from("movie_theater_showtimes")
        .select("*, theaters(*)")
        .eq("movie_id", movieId)
        .order("showtime");
      
      if (error) throw error;
      return data as MovieTheaterShowtime[];
    },
    enabled: !!movieId,
  });
};

// Group showtimes by theater
export const groupShowtimesByTheater = (showtimes: MovieTheaterShowtime[]) => {
  const grouped: Record<string, { theater: Theater; showtimes: MovieTheaterShowtime[] }> = {};
  
  showtimes.forEach((st) => {
    const theaterId = st.theater_id;
    if (!grouped[theaterId]) {
      grouped[theaterId] = {
        theater: st.theaters,
        showtimes: [],
      };
    }
    grouped[theaterId].showtimes.push(st);
  });
  
  return Object.values(grouped);
};
