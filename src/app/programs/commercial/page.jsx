// src/app/programs/commercial/page.jsx
'use client';

import Link from 'next/link';
import { Building2, ArrowLeft, CheckCircle2, Users, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const specializations = [
  {
    name: 'Accounting',
    description: 'Financial record-keeping, bookkeeping, and accounting principles',
    subjects: ['Financial Accounting', 'Cost Accounting', 'Taxation', 'Auditing', 'Business Mathematics'],
    careers: ['Accountant', 'Bookkeeper', 'Tax Consultant', 'Auditor', 'Financial Analyst'],
  },
  {
    name: 'Secretarial Studies',
    description: 'Office management, typing, and administrative skills',
    subjects: ['Typing', 'Shorthand', 'Office Practice', 'Business Communication', 'Computer Applications'],
    careers: ['Secretary', 'Executive Assistant', 'Office Manager', 'Administrative Officer'],
  },
  {
    name: 'Business Management',
    description: 'Principles of business organization and management',
    subjects: ['Business Management', 'Marketing', 'Entrepreneurship', 'Economics', 'Business Law'],
    careers: ['Business Manager', 'Marketing Officer', 'Entrepreneur', 'Sales Manager'],
  },
];

const benefits = [
  'Practical business skills',
  'Computer training included',
  'Internship opportunities',
  'Industry-relevant curriculum',
  'GCE Commercial certification',
  'Entrepreneurship development',
  'Job placement assistance',
  'Small business incubation support',
];

const coreSkills = [
  { name: 'Accounting & Bookkeeping', icon: '📊' },
  { name: 'Computer Applications', icon: '💻' },
  { name: 'Business Communication', icon: '✉️' },
  { name: 'Office Management', icon: '📁' },
  { name: 'Entrepreneurship', icon: '💡' },
  { name: 'Marketing & Sales', icon: '📈' },
];

export default function CommercialStudiesPage() {
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
      <section className="bg-gradient-to-br from-commercial to-commercial/80 text-white py-20 mt-6">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Commercial Studies
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Preparing tomorrow's business leaders with practical commercial and entrepreneurial skills
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
                Our Commercial Studies program equips students with essential business skills and knowledge
                needed for careers in commerce, administration, and entrepreneurship. Students receive practical
                training in accounting, office management, and business operations.
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-commercial/20">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 text-commercial mx-auto mb-3" />
                  <div className="text-3xl font-bold text-commercial mb-1">400+</div>
                  <div className="text-sm text-muted-foreground">Students Enrolled</div>
                </CardContent>
              </Card>
              <Card className="border-commercial/20">
                <CardContent className="pt-6 text-center">
                  <Award className="w-8 h-8 text-commercial mx-auto mb-3" />
                  <div className="text-3xl font-bold text-commercial mb-1">88%</div>
                  <div className="text-sm text-muted-foreground">Employment Rate</div>
                </CardContent>
              </Card>
              <Card className="border-commercial/20">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="w-8 h-8 text-commercial mx-auto mb-3" />
                  <div className="text-3xl font-bold text-commercial mb-1">30+</div>
                  <div className="text-sm text-muted-foreground">Student Businesses</div>
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
            <h2 className="text-3xl font-bold mb-12 text-center">Specializations</h2>
            <div className="space-y-6">
              {specializations.map((spec, idx) => (
                <Card key={idx} className="border-commercial/20 hover:border-commercial/40 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl text-commercial">{spec.name}</CardTitle>
                    <CardDescription>{spec.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Key Subjects</p>
                        <div className="flex flex-wrap gap-2">
                          {spec.subjects.map((subject, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-commercial/10 text-commercial text-xs rounded-full"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Career Opportunities</p>
                        <ul className="space-y-1">
                          {spec.careers.map((career, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1 h-1 rounded-full bg-commercial" />
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

      {/* Core Skills */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Skills You'll Develop</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {coreSkills.map((skill, idx) => (
                <Card key={idx} className="border-commercial/20">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-3">{skill.icon}</div>
                    <p className="font-medium">{skill.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Program Benefits</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-commercial flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-commercial text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Launch Your Business Career</h2>
            <p className="text-white/90 mb-8 text-lg">
              Join our Commercial Studies program and develop the skills to succeed in business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-commercial rounded-lg font-medium hover:bg-white/90 transition-colors"
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
