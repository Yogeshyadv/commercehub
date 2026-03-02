import Navbar from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { TrustBar } from '../components/landing/TrustBar';
import { IndustryCategories } from '../components/landing/IndustryCategories';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { CustomerReviews } from '../components/landing/CustomerReviews';
import { GlobalReach } from '../components/landing/GlobalReach';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-[#E8FFF3] dark:from-[#09090b] dark:to-[#050c14] overflow-x-hidden relative font-sans transition-colors duration-300">
      {/* Decorative Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-200/30 dark:bg-green-500/10 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-normal filter"></div>
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-500/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-normal filter"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-green-100/50 dark:bg-green-600/10 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-normal filter"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <TrustBar />
          <IndustryCategories />
          <FeaturesGrid />
          <CustomerReviews />
          <GlobalReach />
        </main>
        <Footer />
      </div>
    </div>
  );
}
