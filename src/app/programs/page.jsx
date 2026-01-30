// src/app/programs/page.jsx
'use client';

import Link from 'next/link';
import { GraduationCap, Wrench, Building2, Trophy, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const programs = [
  {
    id: 'technical',
    title: 'Technical Education',
    description: 'Hands-on technical training in various engineering and vocational fields',
    icon: Wrench,
    color: 'technical',
    href: '/programs/technical',
    features: [
      'Electrical Power Systems',
      'Building & Construction',
      'Motor Vehicle Mechanics',
      'Electronics',
      'Metalwork & Fabrication',
    ],
  },
  {
    id: 'grammar',
    title: 'Grammar School',
    description: 'Traditional academic education with focus on sciences and humanities',
    icon: BookOpen,
    color: 'grammar',
    href: '/programs/grammar',
    features: [
      'Science Stream',
      'Arts Stream',
      'Balanced Curriculum',
      'O-Level Preparation',
      'Strong Academic Foundation',
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial Studies',
    description: 'Business and commerce education preparing students for the business world',
    icon: Building2,
    color: 'commercial',
    href: '/programs/commercial',
    features: [
      'Accounting',
      'Business Management',
      'Secretarial Studies',
      'Economics',
      'Entrepreneurship',
    ],
  },
  {
    id: 'alevel',
    title: 'A-Level Programs',
    description: 'Advanced Level education for university preparation in specialized streams',
    icon: Trophy,
    color: 'alevel',
    href: '/programs/alevel',
    features: [
      'Science Combinations (S1-S4)',
      'Arts Combinations (A1-A4)',
      'University Preparation',
      'GCE A-Level Certification',
      'Subject Specialization',
    ],
  },
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Academic Programs
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Wisdom High School offers diverse educational pathways tailored to student interests and career goals
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {programs.map((program) => {
              const Icon = program.icon;
              return (
                <Card 
                  key={program.id}
                  className={`group hover:shadow-xl transition-all duration-300 border-2 hover:border-${program.color} overflow-hidden`}
                >
                  <CardHeader className={`bg-${program.color}/5`}>
                    <div className={`w-14 h-14 rounded-xl bg-${program.color}/10 flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 text-${program.color}`} />
                    </div>
                    <CardTitle className="text-2xl">{program.title}</CardTitle>
                    <CardDescription className="text-base">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                      Key Features
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {program.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${program.color} mt-2 flex-shrink-0`} />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href={program.href}
                      className={`inline-flex items-center gap-2 text-${program.color} font-medium hover:gap-3 transition-all`}
                    >
                      Learn More 
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-muted-foreground mb-8">
              Join Wisdom High School and embark on an educational journey tailored to your aspirations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Admissions
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
