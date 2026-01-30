import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, CreditCard, Clock, Ticket } from "lucide-react";
import type { Movie } from "@/hooks/useMovies";

interface BookingModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = "select" | "payment" | "processing" | "success";

const BookingModal = ({ movie, isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState<BookingStep>("select");
  const [selectedShowtime, setSelectedShowtime] = useState<string>("");
  const [seatCount, setSeatCount] = useState<string>("1");
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const updateBookingStatus = useUpdateBookingStatus();

  const showtimes = movie?.showtimes ? (movie.showtimes as string[]) : [];
  const totalAmount = movie ? movie.price * parseInt(seatCount) : 0;

  const handleClose = () => {
    setStep("select");
    setSelectedShowtime("");
    setSeatCount("1");
    setBookingId(null);
    onClose();
  };

  const handleProceedToPayment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to book tickets.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!selectedShowtime || !movie) {
      toast({
        title: "Select Showtime",
        description: "Please select a showtime to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        showtime: selectedShowtime,
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
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            {step === "success" ? "Booking Confirmed!" : `Book: ${movie.title}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === "select" && (
            <>
              {/* Movie Info */}
              <div className="flex gap-4">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">{movie.duration}</p>
                  <p className="text-sm text-muted-foreground">{movie.genres?.join(", ")}</p>
                  <p className="text-primary font-semibold mt-2">₹{movie.price} per ticket</p>
                </div>
              </div>

              {/* Showtime Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Showtime
                </label>
                <Select value={selectedShowtime} onValueChange={setSelectedShowtime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a showtime" />
                  </SelectTrigger>
                  <SelectContent>
                    {showtimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seat Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Number of Seats</label>
                <Select value={seatCount} onValueChange={setSeatCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
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
                className="w-full glow-primary"
                onClick={handleProceedToPayment}
                disabled={!selectedShowtime || createBooking.isPending}
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

          {step === "payment" && (
            <>
              <div className="text-center space-y-4">
                <CreditCard className="w-16 h-16 mx-auto text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Mock Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Click below to simulate payment processing
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Amount to pay</p>
                  <p className="text-3xl font-bold text-primary">₹{totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <Button
                className="w-full glow-primary"
                onClick={handleMockPayment}
              >
                Pay Now (Mock)
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep("select")}
              >
                Back
              </Button>
            </>
          )}

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

          {step === "success" && (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
              <div>
                <h3 className="text-xl font-bold text-foreground">Booking Confirmed!</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {parseInt(seatCount)} {parseInt(seatCount) === 1 ? "ticket" : "tickets"} for {movie.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Showtime: {selectedShowtime}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg text-left">
                <p className="text-xs text-muted-foreground">Booking Details</p>
                <p className="text-sm text-foreground">Movie: {movie.title}</p>
                <p className="text-sm text-foreground">Time: {selectedShowtime}</p>
                <p className="text-sm text-foreground">Seats: {seatCount}</p>
                <p className="text-sm font-semibold text-primary">Total: ₹{totalAmount.toFixed(2)}</p>
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
