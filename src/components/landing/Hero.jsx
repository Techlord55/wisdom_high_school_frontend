// src/components/landing/Hero.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  return (
    <section id="home" className="relative h-[600px] overflow-hidden">
      {carouselImages.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
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

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition">
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
          />
        ))}
      </div>
    </section>
  );
}