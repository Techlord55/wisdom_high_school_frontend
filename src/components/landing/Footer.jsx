// src/components/landing/Footer.jsx
'use client';

import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 rounded-full p-2">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-bold text-lg">Wisdom High School</span>
            </div>
            <p className="text-gray-400 text-sm">
              Excellence in Education since 1995
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="hover:text-white transition-colors duration-200 inline-block"
                  style={{ cursor: 'pointer' }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-white transition-colors duration-200 inline-block"
                  style={{ cursor: 'pointer' }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/#services" 
                  className="hover:text-white transition-colors duration-200 inline-block"
                  style={{ cursor: 'pointer' }}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-white transition-colors duration-200 inline-block"
                  style={{ cursor: 'pointer' }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Programs</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link 
                  href="/programs/technical" 
                  className="hover:text-white transition-colors duration-200 inline-block"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  Technical Education
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/grammar" 
                  className="hover:text-white transition-colors duration-200 inline-block"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  Grammar School
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/commercial" 
                  className="hover:text-white transition-colors duration-200 inline-block"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  Commercial Studies
                </Link>
              </li>
              <li>
                <Link 
                  href="/programs/alevel" 
                  className="hover:text-white transition-colors duration-200 inline-block"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                >
                  A-Level Programs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Buea, South-West, CM</li>
              <li>+237 XXX XXX XXX</li>
              <li>info@wisdomhighschool.cm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Wisdom High School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
