// src/app/about/page.jsx
import Navbar from '@/components/landing/Navbar';
import About from '@/components/landing/About';
import Footer from '@/components/landing/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <About />
      <Footer />
    </div>
  );
}
