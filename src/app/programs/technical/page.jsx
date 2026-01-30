// src/app/programs/technical/page.jsx
'use client';

import Link from 'next/link';
import { Wrench, ArrowLeft, CheckCircle2, Users, Award, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const specializations = [
  {
    name: 'Electrical Power System (EPS)',
    description: 'Installation, maintenance, and repair of electrical systems',
    duration: '3-5 years',
    careers: ['Electrician', 'Power Systems Technician', 'Electrical Inspector'],
  },
  {
    name: 'Building & Construction (BC)',
    description: 'Practical skills in construction, masonry, and carpentry',
    duration: '3-5 years',
    careers: ['Builder', 'Construction Supervisor', 'Quantity Surveyor'],
  },
  {
    name: 'Motor Vehicle Mechanics (MVM)',
    description: 'Automobile repair, maintenance, and diagnostics',
    duration: '3-5 years',
    careers: ['Auto Mechanic', 'Vehicle Inspector', 'Workshop Manager'],
  },
  {
    name: 'Electronics',
    description: 'Electronic circuits, devices, and digital systems',
    duration: '3-5 years',
    careers: ['Electronics Technician', 'Repair Specialist', 'Systems Installer'],
  },
  {
    name: 'Metalwork & Fabrication',
    description: 'Welding, metal cutting, and structural fabrication',
    duration: '3-5 years',
    careers: ['Welder', 'Fabricator', 'Metal Workshop Supervisor'],
  },
];

const benefits = [
  'Hands-on practical training',
  'Industry-standard equipment',
  'Experienced instructors',
  'Internship opportunities',
  'GCE Technical certification',
  'Job placement support',
];

export default function TechnicalEducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <Link 
          href="/programs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programs
        </Link>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-technical to-technical/80 text-white py-20 mt-6">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Technical Education
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Empowering students with practical technical skills for successful careers in engineering and vocational trades
            </p>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Program Overview</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-center mb-12">
                Our Technical Education program provides comprehensive hands-on training in various technical fields,
                preparing students for immediate employment or further technical education. Students gain practical
                skills using industry-standard equipment while earning their GCE Technical qualification.
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-technical/20">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 text-technical mx-auto mb-3" />
                  <div className="text-3xl font-bold text-technical mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Students Enrolled</div>
                </CardContent>
              </Card>
              <Card className="border-technical/20">
                <CardContent className="pt-6 text-center">
                  <Award className="w-8 h-8 text-technical mx-auto mb-3" />
                  <div className="text-3xl font-bold text-technical mb-1">85%</div>
                  <div className="text-sm text-muted-foreground">Job Placement Rate</div>
                </CardContent>
              </Card>
              <Card className="border-technical/20">
                <CardContent className="pt-6 text-center">
                  <Briefcase className="w-8 h-8 text-technical mx-auto mb-3" />
                  <div className="text-3xl font-bold text-technical mb-1">50+</div>
                  <div className="text-sm text-muted-foreground">Industry Partners</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Specializations Offered</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {specializations.map((spec, idx) => (
                <Card key={idx} className="border-technical/20 hover:border-technical/40 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl text-technical">{spec.name}</CardTitle>
                    <CardDescription>{spec.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
                        <p className="text-sm">{spec.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Career Opportunities</p>
                        <ul className="space-y-1">
                          {spec.careers.map((career, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1 h-1 rounded-full bg-technical" />
                              {career}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Program Benefits</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-technical flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-technical text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Future?</h2>
            <p className="text-white/90 mb-8 text-lg">
              Join our Technical Education program and gain the skills needed for a successful career
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-technical rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Apply Now
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Explore Other Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
