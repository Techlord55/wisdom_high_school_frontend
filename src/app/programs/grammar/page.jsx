// src/app/programs/grammar/page.jsx
'use client';

import Link from 'next/link';
import { BookOpen, ArrowLeft, CheckCircle2, Users, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const streams = [
  {
    name: 'Science Stream',
    description: 'Focus on Mathematics, Physics, Chemistry, and Biology',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language', 'French'],
    careers: ['Medicine', 'Engineering', 'Pharmacy', 'Laboratory Science', 'Nursing'],
  },
  {
    name: 'Arts Stream',
    description: 'Emphasis on humanities, languages, and social sciences',
    subjects: ['Literature', 'History', 'Geography', 'Economics', 'English Language', 'French'],
    careers: ['Law', 'Journalism', 'Teaching', 'Public Administration', 'Social Work'],
  },
];

const benefits = [
  'Comprehensive O-Level curriculum',
  'Experienced teaching staff',
  'Modern science laboratories',
  'Well-stocked library',
  'University preparation focus',
  'Co-curricular activities',
  'Academic excellence track record',
  'Small class sizes for personalized attention',
];

const coreSubjects = [
  'English Language',
  'Mathematics',
  'French',
  'Computer Science',
  'Physical Education',
  'Religious Studies',
];

export default function GrammarSchoolPage() {
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
      <section className="bg-gradient-to-br from-grammar to-grammar/80 text-white py-20 mt-6">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grammar School
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Traditional academic excellence preparing students for O-Levels and university education
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
                Our Grammar School program provides a solid academic foundation through a comprehensive curriculum
                that prepares students for the GCE Ordinary Level examinations. Students choose between Science
                and Arts streams based on their interests and career aspirations.
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-grammar/20">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 text-grammar mx-auto mb-3" />
                  <div className="text-3xl font-bold text-grammar mb-1">800+</div>
                  <div className="text-sm text-muted-foreground">Students Enrolled</div>
                </CardContent>
              </Card>
              <Card className="border-grammar/20">
                <CardContent className="pt-6 text-center">
                  <Award className="w-8 h-8 text-grammar mx-auto mb-3" />
                  <div className="text-3xl font-bold text-grammar mb-1">92%</div>
                  <div className="text-sm text-muted-foreground">O-Level Pass Rate</div>
                </CardContent>
              </Card>
              <Card className="border-grammar/20">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="w-8 h-8 text-grammar mx-auto mb-3" />
                  <div className="text-3xl font-bold text-grammar mb-1">75%</div>
                  <div className="text-sm text-muted-foreground">University Admission</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Streams */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Academic Streams</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {streams.map((stream, idx) => (
                <Card key={idx} className="border-grammar/20 hover:border-grammar/40 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl text-grammar">{stream.name}</CardTitle>
                    <CardDescription>{stream.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Core Subjects</p>
                        <div className="flex flex-wrap gap-2">
                          {stream.subjects.map((subject, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-grammar/10 text-grammar text-xs rounded-full"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Career Pathways</p>
                        <ul className="space-y-1">
                          {stream.careers.map((career, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1 h-1 rounded-full bg-grammar" />
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

      {/* Core Subjects */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Core Subjects for All Students</h2>
            <p className="text-muted-foreground text-center mb-8">
              Regardless of stream, all students study these essential subjects:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {coreSubjects.map((subject, idx) => (
                <Card key={idx} className="border-grammar/20">
                  <CardContent className="pt-6 text-center">
                    <BookOpen className="w-6 h-6 text-grammar mx-auto mb-2" />
                    <p className="font-medium">{subject}</p>
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
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Grammar School?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-grammar flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-grammar text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Start Your Academic Journey</h2>
            <p className="text-white/90 mb-8 text-lg">
              Join Wisdom High School's Grammar program and build a strong foundation for your future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-grammar rounded-lg font-medium hover:bg-white/90 transition-colors"
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
