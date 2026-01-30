import { useState } from "react";
import { useMovies, type Movie } from "@/hooks/useMovies";
import MovieCard from "./MovieCard";
import BookingModal from "./BookingModal";
import { Skeleton } from "@/components/ui/skeleton";

const genres = ["All", "Action", "Drama", "Comedy", "Thriller", "Sci-Fi", "Horror", "Fantasy"];

const MovieListings = () => {
  const { data: movies, isLoading, error } = useMovies();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const filteredMovies = movies?.filter(movie => {
    if (selectedGenre === "All") return true;
    return movie.genres?.includes(selectedGenre);
  }) || [];

  const handleBookClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsBookingOpen(true);
  };

  if (error) {
    return (
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Failed to load movies. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="movies" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Recommended Movies
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Discover the best movies in theaters now
            </p>
          </div>

          {/* Genre Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  genre === selectedGenre
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Movie Grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MovieCard
                  movie={movie}
                  onBookClick={() => handleBookClick(movie)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No movies found in this genre.</p>
          </div>
        )}

        {/* Load More */}
        {!isLoading && filteredMovies.length > 0 && (
          <div className="flex justify-center mt-10 md:mt-14">
            <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              View All Movies
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        movie={selectedMovie}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </section>
  );
};

export default MovieListings;
