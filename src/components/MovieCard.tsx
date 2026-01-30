import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  title: string;
  poster: string;
  rating: number;
  votes: string;
  genres: string[];
  language: string;
  className?: string;
}

const MovieCard = ({
  title,
  poster,
  rating,
  votes,
  genres,
  language,
  className,
}: MovieCardProps) => {
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
          src={poster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 hover:glow-primary">
            Book Now
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        <h3 className="font-semibold text-foreground text-sm md:text-base truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span>{rating.toFixed(1)}/10</span>
          </div>
          <span>•</span>
          <span>{votes} Votes</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {genres.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 text-[10px] font-medium bg-secondary text-muted-foreground rounded-full"
            >
              {genre}
            </span>
          ))}
          <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
            {language}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
