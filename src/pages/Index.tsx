import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MovieListings from "@/components/MovieListings";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <HeroSection />
        <MovieListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
