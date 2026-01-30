import { Play, Star, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface FeaturedMovie {
  id: number;
  title: string;
  tagline: string;
  backdrop: string;
  rating: number;
  duration: string;
  releaseDate: string;
  genres: string[];
}

const featuredMovies: FeaturedMovie[] = [
  {
    id: 1,
    title: "Pushpa 2: The Rule",
    tagline: "The Wildfire Returns",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
    rating: 8.7,
    duration: "3h 20min",
    releaseDate: "Dec 2024",
    genres: ["Action", "Drama", "Thriller"],
  },
  {
    id: 2,
    title: "Kalki 2898 AD",
    tagline: "The Future Begins",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80",
    rating: 8.2,
    duration: "2h 45min",
    releaseDate: "Jun 2024",
    genres: ["Sci-Fi", "Action", "Fantasy"],
  },
  {
    id: 3,
    title: "Devara: Part 1",
    tagline: "Fear Him",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80",
    rating: 7.9,
    duration: "2h 58min",
    releaseDate: "Sep 2024",
    genres: ["Action", "Thriller"],
  },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        setIsAnimating(false);
      }, 500);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const currentMovie = featuredMovies[currentIndex];

  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={currentMovie.backdrop}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pb-12 md:pb-20">
        <div
          className={`max-w-2xl transition-all duration-500 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
        >
          {/* Tagline */}
          <p className="text-primary font-semibold text-sm md:text-base mb-2 md:mb-3 tracking-wide uppercase">
            {currentMovie.tagline}
          </p>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
            {currentMovie.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-6 md:mb-8 text-sm md:text-base">
            <div className="flex items-center gap-1.5 text-foreground">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-primary fill-primary" />
              <span className="font-semibold">{currentMovie.rating}/10</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span>{currentMovie.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
              <span>{currentMovie.releaseDate}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
            {currentMovie.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 text-xs md:text-sm font-medium bg-secondary/80 text-foreground rounded-full border border-border"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            <button className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all hover:glow-primary">
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              Book Tickets
            </button>
            <button className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-secondary text-foreground font-semibold rounded-lg border border-border hover:bg-secondary/80 transition-all">
              Watch Trailer
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 md:bottom-12 right-4 md:right-8 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsAnimating(false);
                }, 300);
              }}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-6 md:w-8"
                  : "bg-muted-foreground/50 hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
