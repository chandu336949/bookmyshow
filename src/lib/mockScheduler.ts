import { supabase } from "@/integrations/supabase/client";

// Mock background scheduler that updates movie availability
// In production, this would be a cron job or edge function

export const updateMovieAvailability = async () => {
  console.log("[Mock Scheduler] Checking movie availability...");

  try {
    // Get all movies
    const { data: movies, error } = await supabase
      .from("movies")
      .select("id, available_seats, availability_status");

    if (error) {
      console.error("[Mock Scheduler] Error fetching movies:", error);
      return;
    }

    // Update movies based on available seats
    for (const movie of movies || []) {
      let newStatus = movie.availability_status;

      if (movie.available_seats === 0 && movie.availability_status === "available") {
        newStatus = "sold_out";
      } else if (movie.available_seats > 0 && movie.availability_status === "sold_out") {
        newStatus = "available";
      }

      if (newStatus !== movie.availability_status) {
        await supabase
          .from("movies")
          .update({ availability_status: newStatus })
          .eq("id", movie.id);
        
        console.log(`[Mock Scheduler] Updated movie ${movie.id} status to ${newStatus}`);
      }
    }

    console.log("[Mock Scheduler] Availability check complete");
  } catch (error) {
    console.error("[Mock Scheduler] Error:", error);
  }
};

// Start the mock scheduler (runs every 30 seconds in development)
let schedulerInterval: NodeJS.Timeout | null = null;

export const startMockScheduler = () => {
  if (schedulerInterval) return;
  
  console.log("[Mock Scheduler] Started - checking every 30 seconds");
  schedulerInterval = setInterval(updateMovieAvailability, 30000);
  
  // Run immediately on start
  updateMovieAvailability();
};

export const stopMockScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("[Mock Scheduler] Stopped");
  }
};
