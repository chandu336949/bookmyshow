import MovieCard from "./MovieCard";

const movies = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80",
    rating: 8.7,
    votes: "125.8K",
    genres: ["Action", "Drama"],
    language: "Telugu",
  },
  {
    id: 2,
    title: "Kalki 2898 AD",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    rating: 8.2,
    votes: "98.4K",
    genres: ["Sci-Fi", "Action"],
    language: "Hindi",
  },
  {
    id: 3,
    title: "Fighter",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    rating: 7.8,
    votes: "76.2K",
    genres: ["Action", "Patriotic"],
    language: "Hindi",
  },
  {
    id: 4,
    title: "Devara: Part 1",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    rating: 7.9,
    votes: "54.1K",
    genres: ["Action", "Thriller"],
    language: "Telugu",
  },
  {
    id: 5,
    title: "Animal",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    rating: 8.1,
    votes: "210.5K",
    genres: ["Drama", "Crime"],
    language: "Hindi",
  },
  {
    id: 6,
    title: "Jawan",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    rating: 8.4,
    votes: "189.3K",
    genres: ["Action", "Thriller"],
    language: "Hindi",
  },
  {
    id: 7,
    title: "Pathaan",
    poster: "https://images.unsplash.com/photo-1460881680093-7571fc643d21?w=400&q=80",
    rating: 8.0,
    votes: "156.7K",
    genres: ["Action", "Spy"],
    language: "Hindi",
  },
  {
    id: 8,
    title: "Dunki",
    poster: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&q=80",
    rating: 7.5,
    votes: "87.9K",
    genres: ["Comedy", "Drama"],
    language: "Hindi",
  },
];

const genres = ["All", "Action", "Drama", "Comedy", "Thriller", "Sci-Fi", "Romance"];

const MovieListings = () => {
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
            {genres.map((genre, index) => (
              <button
                key={genre}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MovieCard
                title={movie.title}
                poster={movie.poster}
                rating={movie.rating}
                votes={movie.votes}
                genres={movie.genres}
                language={movie.language}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-10 md:mt-14">
          <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            View All Movies
          </button>
        </div>
      </div>
    </section>
  );
};

export default MovieListings;
