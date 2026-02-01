import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentStepProps {
  movieTitle: string;
  theaterName: string;
  theaterLocation: string;
  showtime: string;
  selectedSeats: string[];
  totalAmount: number;
  isProcessing: boolean;
  onPay: () => void;
  onBack: () => void;
}

type PaymentMethod = "debit" | "credit" | "upi";

const PaymentStep = ({
  movieTitle,
  theaterName,
  theaterLocation,
  showtime,
  selectedSeats,
  totalAmount,
  isProcessing,
  onPay,
  onBack,
}: PaymentStepProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("debit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const isFormValid = () => {
    if (paymentMethod === "upi") {
      return upiId.includes("@") && upiId.length >= 5;
    }
    return (
      cardNumber.replace(/\s/g, "").length === 16 &&
      cardName.length >= 3 &&
      expiryDate.length === 5 &&
      cvv.length >= 3
    );
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-2"
        disabled={isProcessing}
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Seat Selection
      </Button>

      {/* Booking Summary */}
      <div className="p-4 bg-secondary rounded-lg space-y-2">
        <h3 className="font-semibold text-foreground text-lg">Booking Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Movie:</span>
          <span className="text-foreground font-medium">{movieTitle}</span>
          
          <span className="text-muted-foreground">Theater:</span>
          <span className="text-foreground">{theaterName}</span>
          
          <span className="text-muted-foreground">Location:</span>
          <span className="text-foreground">{theaterLocation}</span>
          
          <span className="text-muted-foreground">Showtime:</span>
          <span className="text-foreground">{showtime}</span>
          
          <span className="text-muted-foreground">Seats:</span>
          <span className="text-foreground font-medium">{selectedSeats.join(", ")}</span>
        </div>
        <div className="border-t border-border pt-2 mt-2 flex justify-between items-center">
          <span className="text-foreground font-semibold">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Select Payment Method</h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          className="space-y-2"
        >
          <div
            className={cn(
              "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
              paymentMethod === "debit"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setPaymentMethod("debit")}
          >
            <RadioGroupItem value="debit" id="debit" />
            <Label htmlFor="debit" className="flex items-center gap-2 cursor-pointer flex-1">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span>Debit Card</span>
            </Label>
          </div>

          <div
            className={cn(
              "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
              paymentMethod === "credit"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setPaymentMethod("credit")}
          >
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer flex-1">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <span>Credit Card</span>
            </Label>
          </div>

          <div
            className={cn(
              "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
              paymentMethod === "upi"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => setPaymentMethod("upi")}
          >
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
              <Smartphone className="w-5 h-5 text-green-500" />
              <span>UPI</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Payment Form */}
      <div className="space-y-4 p-4 bg-secondary/50 rounded-lg">
        {(paymentMethod === "debit" || paymentMethod === "credit") && (
          <>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                />
              </div>
            </div>
          </>
        )}

        {paymentMethod === "upi" && (
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter your UPI ID (e.g., yourname@paytm, yourname@gpay)
            </p>
          </div>
        )}
      </div>

      {/* Pay Button */}
      <Button
        className="w-full"
        size="lg"
        onClick={onPay}
        disabled={!isFormValid() || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Processing Payment...
          </>
        ) : (
          <>Pay ₹{totalAmount.toFixed(2)}</>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        🔒 Your payment information is secure and encrypted
      </p>
    </div>
  );
};

export default PaymentStep;
