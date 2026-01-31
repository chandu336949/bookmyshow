import { MapPin, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Theater, MovieTheaterShowtime } from "@/hooks/useTheaters";

interface TheaterShowtimesProps {
  theater: Theater;
  showtimes: MovieTheaterShowtime[];
  selectedShowtime: MovieTheaterShowtime | null;
  onSelectShowtime: (showtime: MovieTheaterShowtime) => void;
}

const TheaterShowtimes = ({
  theater,
  showtimes,
  selectedShowtime,
  onSelectShowtime,
}: TheaterShowtimesProps) => {
  return (
    <div className="p-4 bg-secondary/50 rounded-lg border border-border">
      {/* Theater Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{theater.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {theater.location}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {theater.city}
        </Badge>
      </div>

      {/* Amenities */}
      {theater.amenities && theater.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {theater.amenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
            >
              <Sparkles className="w-3 h-3" />
              {amenity}
            </span>
          ))}
        </div>
      )}

      {/* Showtimes Grid */}
      <div className="flex flex-wrap gap-2">
        {showtimes.map((st) => {
          const isSelected = selectedShowtime?.id === st.id;
          return (
            <Button
              key={st.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectShowtime(st)}
              className={`flex flex-col h-auto py-2 px-3 ${
                isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
              }`}
            >
              <span className="flex items-center gap-1 text-sm font-medium">
                <Clock className="w-3 h-3" />
                {st.showtime}
              </span>
              <span className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                ₹{st.price}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export const TheaterShowtimesSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-4 bg-secondary/50 rounded-lg border border-border">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex gap-1.5 mb-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export default TheaterShowtimes;
