import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useMovieShowtimes, groupShowtimesByTheater, type MovieTheaterShowtime } from "@/hooks/useTheaters";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, CreditCard, Ticket, ArrowLeft, Film, Armchair } from "lucide-react";
import TheaterShowtimes, { TheaterShowtimesSkeleton } from "./TheaterShowtimes";
import SeatSelector from "./SeatSelector";
import type { Movie } from "@/hooks/useMovies";

interface BookingModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = "theaters" | "seats" | "seatSelection" | "payment" | "processing" | "success";

const BookingModal = ({ movie, isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState<BookingStep>("theaters");
  const [selectedShowtime, setSelectedShowtime] = useState<MovieTheaterShowtime | null>(null);
  const [seatCount, setSeatCount] = useState<string>("1");
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const updateBookingStatus = useUpdateBookingStatus();
  const { data: showtimes, isLoading: isLoadingShowtimes } = useMovieShowtimes(movie?.id);

  const groupedShowtimes = showtimes ? groupShowtimesByTheater(showtimes) : [];
  const totalAmount = selectedShowtime ? selectedShowtime.price * parseInt(seatCount) : 0;

  const handleClose = () => {
    setStep("theaters");
    setSelectedShowtime(null);
    setSeatCount("1");
    setSelectedSeatIds([]);
    setBookingId(null);
    onClose();
  };

  const handleSelectShowtime = (showtime: MovieTheaterShowtime) => {
    setSelectedShowtime(showtime);
  };

  const handleProceedToSeats = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to book tickets.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedShowtime) {
      toast({
        title: "Select Showtime",
        description: "Please select a theater and showtime to continue.",
        variant: "destructive",
      });
      return;
    }

    setStep("seats");
  };

  const handleProceedToSeatSelection = () => {
    setSelectedSeatIds([]); // Reset seat selection
    setStep("seatSelection");
  };

  const handleProceedToPayment = async () => {
    if (!selectedShowtime || !movie) return;

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        theater_id: selectedShowtime.theater_id,
        showtime: selectedShowtime.showtime,
        seats: parseInt(seatCount),
        total_amount: totalAmount,
        status: "pending",
      });
      
      setBookingId(booking.id);
      setStep("payment");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to create booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMockPayment = async () => {
    if (!bookingId) return;

    setStep("processing");

    // Simulate payment processing delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Generate mock payment ID
      const mockPaymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await updateBookingStatus.mutateAsync({
        bookingId,
        status: "paid",
        paymentId: mockPaymentId,
      });

      setStep("success");
      
      toast({
        title: "🎉 Payment Successful!",
        description: `Your tickets for ${movie?.title} have been booked. Payment ID: ${mockPaymentId}`,
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setStep("payment");
    }
  };

  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            {step === "theaters" && (
              <>
                <Film className="w-5 h-5 text-primary" />
                Theaters Showing {movie.title}
              </>
            )}
            {step === "seats" && (
              <>
                <Ticket className="w-5 h-5 text-primary" />
                Select Number of Seats
              </>
            )}
            {step === "seatSelection" && (
              <>
                <Armchair className="w-5 h-5 text-primary" />
                Choose Your Seats
              </>
            )}
            {step === "payment" && (
              <>
                <CreditCard className="w-5 h-5 text-primary" />
                Payment
              </>
            )}
            {step === "processing" && "Processing..."}
            {step === "success" && (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Booking Confirmed!
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1: Theater & Showtime Selection */}
          {step === "theaters" && (
            <>
              {/* Movie Info Banner */}
              <div className="flex gap-4 p-3 bg-secondary rounded-lg">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">{movie.duration}</p>
                  <p className="text-sm text-muted-foreground">{movie.genres?.join(", ")}</p>
                </div>
              </div>

              {/* Theaters List */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Select Theater & Showtime
                </h2>
                
                {isLoadingShowtimes ? (
                  <TheaterShowtimesSkeleton />
                ) : groupedShowtimes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No showtimes available for this movie.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {groupedShowtimes.map(({ theater, showtimes }) => (
                      <TheaterShowtimes
                        key={theater.id}
                        theater={theater}
                        showtimes={showtimes}
                        selectedShowtime={selectedShowtime}
                        onSelectShowtime={handleSelectShowtime}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Summary */}
              {selectedShowtime && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Selected:</span>{" "}
                    {selectedShowtime.theaters.name} at {selectedShowtime.showtime}
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    ₹{selectedShowtime.price} per ticket
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleProceedToSeats}
                disabled={!selectedShowtime}
              >
                Continue to Seat Selection
              </Button>
            </>
          )}

          {/* Step 2: Number of Seats Selection */}
          {step === "seats" && selectedShowtime && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("theaters")}
                className="mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Theaters
              </Button>

              {/* Booking Summary */}
              <div className="p-4 bg-secondary rounded-lg space-y-2">
                <h3 className="font-semibold text-foreground">{movie.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedShowtime.theaters.name} • {selectedShowtime.showtime}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedShowtime.theaters.location}
                </p>
              </div>

              {/* Seat Count Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  How many seats do you want to book?
                </label>
                <Select value={seatCount} onValueChange={setSeatCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Seat" : "Seats"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                <span className="text-foreground font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
              </div>

              <Button
                className="w-full"
                onClick={handleProceedToSeatSelection}
              >
                Choose Seats
              </Button>
            </>
          )}

          {/* Step 3: Visual Seat Selection */}
          {step === "seatSelection" && selectedShowtime && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("seats")}
                className="mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Seat Count
              </Button>

              {/* Booking Summary */}
              <div className="p-3 bg-secondary rounded-lg text-sm">
                <p className="font-semibold text-foreground">{movie.title}</p>
                <p className="text-muted-foreground">
                  {selectedShowtime.theaters.name} • {selectedShowtime.showtime}
                </p>
              </div>

              {/* Seat Grid */}
              <SeatSelector
                totalSeats={selectedShowtime.available_seats + 20} // Mock some filled seats
                availableSeats={selectedShowtime.available_seats}
                requiredSeats={parseInt(seatCount)}
                selectedSeats={selectedSeatIds}
                onSeatsChange={setSelectedSeatIds}
              />

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                <span className="text-foreground font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
              </div>

              <Button
                className="w-full"
                onClick={handleProceedToPayment}
                disabled={selectedSeatIds.length !== parseInt(seatCount) || createBooking.isPending}
              >
                {createBooking.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Booking...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </>
          )}

          {/* Step 4: Payment */}
          {step === "payment" && selectedShowtime && (
            <>
              <div className="text-center space-y-4">
                <CreditCard className="w-16 h-16 mx-auto text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Mock Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Click below to simulate payment processing
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">Seats: {selectedSeatIds.join(", ")}</p>
                  <p className="text-sm text-muted-foreground">Amount to pay</p>
                  <p className="text-3xl font-bold text-primary">₹{totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleMockPayment}
              >
                Pay Now (Mock)
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep("seatSelection")}
              >
                Back
              </Button>
            </>
          )}

          {/* Step 5: Processing */}
          {step === "processing" && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
              <div>
                <h3 className="font-semibold text-foreground">Processing Payment...</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we confirm your payment
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Success */}
          {step === "success" && selectedShowtime && (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
              <div>
                <h3 className="text-xl font-bold text-foreground">Booking Confirmed!</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {parseInt(seatCount)} {parseInt(seatCount) === 1 ? "ticket" : "tickets"} for {movie.title}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg text-left space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Booking Details</p>
                <p className="text-sm text-foreground"><strong>Movie:</strong> {movie.title}</p>
                <p className="text-sm text-foreground"><strong>Theater:</strong> {selectedShowtime.theaters.name}</p>
                <p className="text-sm text-foreground"><strong>Location:</strong> {selectedShowtime.theaters.location}</p>
                <p className="text-sm text-foreground"><strong>Showtime:</strong> {selectedShowtime.showtime}</p>
                <p className="text-sm text-foreground"><strong>Seats:</strong> {selectedSeatIds.join(", ")}</p>
                <p className="text-sm font-semibold text-primary"><strong>Total:</strong> ₹{totalAmount.toFixed(2)}</p>
              </div>
              <Button className="w-full" onClick={handleClose}>
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
