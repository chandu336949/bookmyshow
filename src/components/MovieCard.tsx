import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Movie } from "@/hooks/useMovies";

interface MovieCardProps {
  movie: Movie;
  onBookClick: () => void;
  className?: string;
}

const MovieCard = ({
  movie,
  onBookClick,
  className,
}: MovieCardProps) => {
  const isAvailable = movie.availability_status === "available";
  const statusLabel = movie.availability_status === "coming_soon" 
    ? "Coming Soon" 
    : movie.availability_status === "sold_out" 
    ? "Sold Out" 
    : movie.availability_status === "ended"
    ? "Ended"
    : null;

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden bg-card cursor-pointer transition-all duration-300 hover:-translate-y-2",
        className
      )}
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-xs font-semibold text-foreground">{Number(movie.rating).toFixed(1)}</span>
        </div>

        {/* Status Badge */}
        {statusLabel && (
          <div className={cn(
            "absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold",
            movie.availability_status === "coming_soon" && "bg-blue-500/80 text-white",
            movie.availability_status === "sold_out" && "bg-destructive/80 text-destructive-foreground",
            movie.availability_status === "ended" && "bg-muted text-muted-foreground"
          )}>
            {statusLabel}
          </div>
        )}

        {/* Hover Overlay */}
        {isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onBookClick();
              }}
              className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 hover:glow-primary"
            >
              Book Now
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        <h3 className="font-semibold text-foreground text-sm md:text-base truncate group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span>{Number(movie.rating).toFixed(1)}/10</span>
          </div>
          <span>•</span>
          <span>{movie.votes} Votes</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {movie.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 text-[10px] font-medium bg-secondary text-muted-foreground rounded-full"
            >
              {genre}
            </span>
          ))}
          {movie.languages?.[0] && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
              {movie.languages[0]}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="pt-1">
          <span className="text-sm font-semibold text-primary">₹{movie.price}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
