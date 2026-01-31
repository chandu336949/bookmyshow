import { useState, useEffect } from "react";
import { Monitor } from "lucide-react";

interface SeatSelectorProps {
  totalSeats: number;
  availableSeats: number;
  requiredSeats: number;
  selectedSeats: string[];
  onSeatsChange: (seats: string[]) => void;
}

// Generate a theater layout with rows and columns
const generateTheaterLayout = (totalSeats: number, availableSeats: number) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = Math.ceil(totalSeats / rows.length);
  const filledCount = totalSeats - availableSeats;
  
  // Randomly mark some seats as filled (for demo purposes)
  const filledSeats = new Set<string>();
  const allSeats: string[] = [];
  
  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      allSeats.push(`${row}${i}`);
    }
  });
  
  // Randomly fill some seats
  const shuffled = [...allSeats].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(filledCount, shuffled.length); i++) {
    filledSeats.add(shuffled[i]);
  }
  
  return { rows, seatsPerRow, filledSeats };
};

const SeatSelector = ({
  totalSeats,
  availableSeats,
  requiredSeats,
  selectedSeats,
  onSeatsChange,
}: SeatSelectorProps) => {
  const [layout, setLayout] = useState<{
    rows: string[];
    seatsPerRow: number;
    filledSeats: Set<string>;
  } | null>(null);

  useEffect(() => {
    // Generate layout once on mount
    setLayout(generateTheaterLayout(totalSeats, availableSeats));
  }, [totalSeats, availableSeats]);

  const handleSeatClick = (seatId: string) => {
    if (!layout || layout.filledSeats.has(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      // Deselect
      onSeatsChange(selectedSeats.filter((s) => s !== seatId));
    } else if (selectedSeats.length < requiredSeats) {
      // Select if we haven't reached the limit
      onSeatsChange([...selectedSeats, seatId]);
    }
  };

  if (!layout) return null;

  const { rows, seatsPerRow, filledSeats } = layout;

  return (
    <div className="space-y-4">
      {/* Screen */}
      <div className="text-center mb-6">
        <div className="relative">
          <div className="w-3/4 mx-auto h-2 bg-gradient-to-b from-primary/60 to-transparent rounded-t-full" />
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mt-1">
            <Monitor className="w-4 h-4" />
            <span>SCREEN</span>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center gap-2 overflow-x-auto pb-4">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-1">
            {/* Row Label */}
            <span className="w-6 text-center text-sm font-medium text-muted-foreground">
              {row}
            </span>
            
            {/* Seats */}
            <div className="flex gap-1">
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seatNumber = i + 1;
                const seatId = `${row}${seatNumber}`;
                const isFilled = filledSeats.has(seatId);
                const isSelected = selectedSeats.includes(seatId);

                // Add aisle gap in the middle
                const hasAisle = seatNumber === Math.floor(seatsPerRow / 2);

                return (
                  <div key={seatId} className="flex items-center">
                    <button
                      type="button"
                      disabled={isFilled}
                      onClick={() => handleSeatClick(seatId)}
                      className={`
                        w-8 h-8 rounded-t-lg text-xs font-medium transition-all
                        flex items-center justify-center
                        ${
                          isFilled
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : isSelected
                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1 ring-offset-background"
                            : "bg-background border-2 border-green-500 text-green-500 hover:bg-green-500/10 cursor-pointer"
                        }
                      `}
                      title={isFilled ? "Seat unavailable" : `Seat ${seatId}`}
                    >
                      {seatNumber}
                    </button>
                    {hasAisle && <div className="w-4" />}
                  </div>
                );
              })}
            </div>

            {/* Row Label (right side) */}
            <span className="w-6 text-center text-sm font-medium text-muted-foreground">
              {row}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg border-2 border-green-500 flex items-center justify-center text-green-500 text-xs">
            1
          </div>
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-primary flex items-center justify-center text-primary-foreground text-xs">
            1
          </div>
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
            1
          </div>
          <span className="text-muted-foreground">Filled</span>
        </div>
      </div>

      {/* Selection Status */}
      <div className="text-center p-3 bg-secondary rounded-lg">
        <p className="text-sm text-foreground">
          {selectedSeats.length === 0 ? (
            <>Select <span className="font-semibold text-primary">{requiredSeats}</span> seat{requiredSeats > 1 ? "s" : ""}</>
          ) : selectedSeats.length < requiredSeats ? (
            <>
              Selected: <span className="font-semibold text-primary">{selectedSeats.join(", ")}</span>
              {" "}({requiredSeats - selectedSeats.length} more to select)
            </>
          ) : (
            <>
              Selected: <span className="font-semibold text-primary">{selectedSeats.join(", ")}</span>
              {" "}✓
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default SeatSelector;
