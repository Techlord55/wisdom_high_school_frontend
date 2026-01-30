// src/app/contact/page.jsx
import Navbar from '@/components/landing/Navbar';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Contact />
      <Footer />
    </div>
  );
}
