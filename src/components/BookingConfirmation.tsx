import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Ticket } from "lucide-react";

interface BookingConfirmationProps {
  movieTitle: string;
  theaterName: string;
  theaterLocation: string;
  showtime: string;
  selectedSeats: string[];
  totalAmount: number;
  paymentId: string;
  bookingDate: string;
  onClose: () => void;
}

const BookingConfirmation = ({
  movieTitle,
  theaterName,
  theaterLocation,
  showtime,
  selectedSeats,
  totalAmount,
  paymentId,
  bookingDate,
  onClose,
}: BookingConfirmationProps) => {
  return (
    <div className="text-center py-2 space-y-4">
      {/* Success Icon */}
      <div className="relative">
        <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
            Payment Successful
          </span>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="pt-2">
        <h3 className="text-xl font-bold text-foreground">Booking Confirmed!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your tickets have been booked successfully
        </p>
      </div>

      {/* Booking Receipt */}
      <div className="bg-secondary rounded-lg overflow-hidden">
        {/* Receipt Header */}
        <div className="bg-primary/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">E-Ticket</span>
          </div>
          <span className="text-xs text-muted-foreground">{bookingDate}</span>
        </div>

        {/* Receipt Body */}
        <div className="p-4 space-y-3 text-left">
          <div className="pb-3 border-b border-border">
            <h4 className="text-lg font-bold text-foreground">{movieTitle}</h4>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Theater</span>
            <span className="text-foreground text-right">{theaterName}</span>

            <span className="text-muted-foreground">Location</span>
            <span className="text-foreground text-right">{theaterLocation}</span>

            <span className="text-muted-foreground">Date & Time</span>
            <span className="text-foreground text-right">{showtime}</span>

            <span className="text-muted-foreground">Seats</span>
            <span className="text-foreground text-right font-medium">
              {selectedSeats.join(", ")}
            </span>

            <span className="text-muted-foreground">Tickets</span>
            <span className="text-foreground text-right">{selectedSeats.length}</span>
          </div>

          {/* Payment Details */}
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment ID</span>
              <span className="text-foreground font-mono text-xs">{paymentId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground font-semibold">Total Paid</span>
              <span className="text-xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="bg-muted/50 px-4 py-3">
          <p className="text-xs text-center text-muted-foreground">
            Show this e-ticket at the theater entrance
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <Button className="w-full" onClick={onClose}>
          Done
        </Button>
        <Button variant="outline" className="w-full" onClick={() => window.print()}>
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
