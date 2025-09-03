import CallToAction from "../components/CallToAction";
import FeaturedCollections from "../components/FeaturedCollections";
import HeroSection from "../components/HeroSection";
import Testimonials from "../components/Testimonials";


export default function Home() {
  return (
    <main className="home-page">
      <HeroSection />
      <FeaturedCollections />
      <Testimonials />
      <CallToAction />
    </main>
  );
}