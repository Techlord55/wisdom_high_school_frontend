// src/components/landing/Services.jsx
'use client';

import { BookOpen, Users, Award, GraduationCap } from 'lucide-react';

export default function Services() {
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

  return (
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
  );
}