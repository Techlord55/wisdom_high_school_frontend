'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, Users, BookOpen, Award, Mail, Phone, MapPin, Menu, X } from 'lucide-react';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
      title: 'Excellence in Education',
      subtitle: 'Shaping Future Leaders'
    },
    {
      url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
      title: 'Modern Learning Facilities',
      subtitle: 'State-of-the-Art Infrastructure'
    },
    {
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
      title: 'Dedicated Teachers',
      subtitle: 'Quality Education for All'
    }
  ];

  const services = [
    {
      icon: BookOpen,
      title: 'Academic Programs',
      description: 'Technical, Grammar, and Commercial education streams',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Users,
      title: 'Qualified Teachers',
      description: 'Experienced educators dedicated to student success',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Award,
      title: 'Modern Facilities',
      description: 'Well-equipped laboratories and workshops',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: GraduationCap,
      title: 'Career Guidance',
      description: 'Preparing students for university and professional life',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-full p-2">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-600">Wisdom High School</h1>
                <p className="text-xs text-gray-600">Excellence in Education</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition">Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About Us</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
              <a href="/sign-in" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Login
              </a>
              <a href="/sign-up" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                Register
              </a>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-3">
              <a href="#home" className="block text-gray-700 hover:text-blue-600">Home</a>
              <a href="#about" className="block text-gray-700 hover:text-blue-600">About Us</a>
              <a href="#services" className="block text-gray-700 hover:text-blue-600">Services</a>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600">Contact</a>
              <a href="/sign-in" className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                Login
              </a>
              <a href="/sign-up" className="block bg-green-600 text-white px-4 py-2 rounded-lg text-center">
                Register
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Carousel */}
      <section id="home" className="relative h-[600px] overflow-hidden">
        {carouselImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-2xl mb-8">{slide.subtitle}</p>
                <a href="/sign-up" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition inline-block">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Wisdom High School</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600"
                alt="School building"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Leading Education Institution in Cameroon
              </h3>
              <p className="text-gray-600 mb-4">
                Wisdom High School is dedicated to providing quality education across Technical, Grammar, and Commercial streams, following the Cameroon Ministry of Secondary Education (MINESEC) curriculum.
              </p>
              <p className="text-gray-600 mb-4">
                We offer comprehensive programs from Form 1 through Upper Sixth, preparing students for both national examinations and future careers.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Students</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">Teachers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive educational services to ensure every student reaches their full potential
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                  <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-600">Buea, South-West Region, Cameroon</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+237 XXX XXX XXX</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">info@wisdomhighschool.cm</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  onClick={handleContactSubmit}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
