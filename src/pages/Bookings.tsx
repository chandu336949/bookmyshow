import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket, Calendar, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

const Bookings = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: bookings, isLoading } = useBookings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
      case "expired":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-green-500/10 text-green-500 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      cancelled: "bg-destructive/10 text-destructive border-destructive/20",
      expired: "bg-muted text-muted-foreground border-border",
    };
    
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Ticket className="w-8 h-8 text-primary" />
            My Bookings
          </h1>

          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          )}

          {!isLoading && (!bookings || bookings.length === 0) && (
            <div className="text-center py-16">
              <Ticket className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Bookings Yet</h2>
              <p className="text-muted-foreground mb-6">Start by booking your favorite movie!</p>
              <button 
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
              >
                Browse Movies
              </button>
            </div>
          )}

          {!isLoading && bookings && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="bg-card border border-border rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4"
                >
                  {/* Movie Poster */}
                  <img
                    src={booking.movies?.poster_url}
                    alt={booking.movies?.title}
                    className="w-24 h-36 object-cover rounded-lg"
                  />

                  {/* Booking Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-foreground">
                        {booking.movies?.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{booking.showtime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Ticket className="w-4 h-4" />
                        <span>{booking.seats} {booking.seats === 1 ? "seat" : "seats"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span className="text-sm text-muted-foreground">
                          {booking.status === "paid" && "Payment confirmed"}
                          {booking.status === "pending" && "Awaiting payment"}
                          {booking.status === "cancelled" && "Booking cancelled"}
                          {booking.status === "expired" && "Booking expired"}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        ₹{Number(booking.total_amount).toFixed(2)}
                      </span>
                    </div>

                    {booking.payment_id && (
                      <p className="text-xs text-muted-foreground">
                        Payment ID: {booking.payment_id}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;
