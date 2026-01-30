// src/app/programs/alevel/page.jsx
'use client';

import Link from 'next/link';
import { Trophy, ArrowLeft, CheckCircle2, Users, Award, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const combinations = [
  {
    category: 'Science Combinations',
    color: 'alevel',
    streams: [
      {
        code: 'S1',
        name: 'Physical Sciences',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science/Biology'],
        careers: ['Engineering', 'Physics', 'Chemistry', 'Computer Science', 'Applied Sciences'],
      },
      {
        code: 'S2',
        name: 'Biological Sciences',
        subjects: ['Mathematics', 'Biology', 'Chemistry', 'Physics/Geography'],
        careers: ['Medicine', 'Pharmacy', 'Nursing', 'Laboratory Science', 'Biotechnology'],
      },
      {
        code: 'S3',
        name: 'Mathematics & Computer Science',
        subjects: ['Mathematics', 'Further Mathematics', 'Physics', 'Computer Science'],
        careers: ['Computer Engineering', 'Software Development', 'Data Science', 'Mathematics'],
      },
      {
        code: 'S4',
        name: 'Engineering Sciences',
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Technical Drawing/Further Maths'],
        careers: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Architecture'],
      },
    ],
  },
  {
    category: 'Arts Combinations',
    color: 'grammar',
    streams: [
      {
        code: 'A1',
        name: 'Arts with Languages',
        subjects: ['Literature', 'History', 'French', 'English Language/Geography'],
        careers: ['Law', 'Journalism', 'Translation', 'International Relations', 'Diplomacy'],
      },
      {
        code: 'A2',
        name: 'Arts with Social Sciences',
        subjects: ['Economics', 'History', 'Geography', 'Literature/Government'],
        careers: ['Economics', 'Political Science', 'Sociology', 'Public Administration', 'Development Studies'],
      },
      {
        code: 'A3',
        name: 'Arts with Mathematics',
        subjects: ['Economics', 'Mathematics', 'Geography', 'Accounting/Business Management'],
        careers: ['Business Administration', 'Finance', 'Accounting', 'Economics', 'Management'],
      },
      {
        code: 'A4',
        name: 'Arts with Science',
        subjects: ['Geography', 'Economics', 'Biology/Chemistry', 'Mathematics'],
        careers: ['Environmental Science', 'Geography', 'Agricultural Economics', 'Resource Management'],
      },
    ],
  },
];

const benefits = [
  'GCE A-Level certification',
  'University admission preparation',
  'Subject specialization',
  'Research skills development',
  'Critical thinking emphasis',
  'University counseling',
  'Scholarship guidance',
  'International standard curriculum',
];

export default function ALevelProgramsPage() {
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
      <section className="bg-gradient-to-br from-alevel to-alevel/80 text-white py-20 mt-6">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              A-Level Programs
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Advanced Level education for university preparation with specialized academic streams
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
                Our A-Level program (Lower Sixth and Upper Sixth) offers rigorous academic preparation for
                university admission. Students specialize in subject combinations aligned with their intended
                university programs, following the Cameroon GCE Advanced Level curriculum.
              </p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-alevel/20">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 text-alevel mx-auto mb-3" />
                  <div className="text-3xl font-bold text-alevel mb-1">300+</div>
                  <div className="text-sm text-muted-foreground">A-Level Students</div>
                </CardContent>
              </Card>
              <Card className="border-alevel/20">
                <CardContent className="pt-6 text-center">
                  <Award className="w-8 h-8 text-alevel mx-auto mb-3" />
                  <div className="text-3xl font-bold text-alevel mb-1">95%</div>
                  <div className="text-sm text-muted-foreground">A-Level Pass Rate</div>
                </CardContent>
              </Card>
              <Card className="border-alevel/20">
                <CardContent className="pt-6 text-center">
                  <GraduationCap className="w-8 h-8 text-alevel mx-auto mb-3" />
                  <div className="text-3xl font-bold text-alevel mb-1">85%</div>
                  <div className="text-sm text-muted-foreground">University Admission</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Combinations */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Subject Combinations</h2>
            
            {combinations.map((category, catIdx) => (
              <div key={catIdx} className="mb-12 last:mb-0">
                <h3 className={`text-2xl font-bold mb-6 text-${category.color}`}>
                  {category.category}
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {category.streams.map((stream, idx) => (
                    <Card 
                      key={idx} 
                      className={`border-${category.color}/20 hover:border-${category.color}/40 transition-colors`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <CardTitle className={`text-xl text-${category.color}`}>
                              {stream.code} - {stream.name}
                            </CardTitle>
                          </div>
                          <span className={`px-3 py-1 bg-${category.color}/10 text-${category.color} text-xs rounded-full font-semibold`}>
                            {stream.code}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Subject Combination</p>
                            <div className="flex flex-wrap gap-2">
                              {stream.subjects.map((subject, i) => (
                                <span
                                  key={i}
                                  className={`px-2 py-1 bg-${category.color}/10 text-${category.color} text-xs rounded`}
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
                                  <div className={`w-1 h-1 rounded-full bg-${category.color}`} />
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
            ))}
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
                  <CheckCircle2 className="w-6 h-6 text-alevel flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Duration Info */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-alevel/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Program Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-alevel mb-2">2 Years</div>
                    <p className="text-muted-foreground">Lower Sixth + Upper Sixth</p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-alevel mb-2">3-4</div>
                    <p className="text-muted-foreground">Subjects per Combination</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-alevel text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Prepare for University Success</h2>
            <p className="text-white/90 mb-8 text-lg">
              Join our A-Level program and take the next step toward your university education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-alevel rounded-lg font-medium hover:bg-white/90 transition-colors"
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
