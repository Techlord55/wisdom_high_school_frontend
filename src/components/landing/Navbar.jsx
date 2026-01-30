// src/components/landing/Navbar.jsx
'use client';

import { useState } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-full p-2">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-600">Wisdom High School</h1>
              <p className="text-xs text-gray-600">Excellence in Education</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">About Us</Link>
            <Link href="/#services" className="text-gray-700 hover:text-blue-600 transition">Services</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</Link>
            <Link href="/sign-in" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Login
            </Link>
            <Link href="/sign-up" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Register
            </Link>
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
            <Link href="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/about" className="block text-gray-700 hover:text-blue-600">About Us</Link>
            <Link href="/#services" className="block text-gray-700 hover:text-blue-600">Services</Link>
            <Link href="/contact" className="block text-gray-700 hover:text-blue-600">Contact</Link>
            <Link href="/sign-in" className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
              Login
            </Link>
            <Link href="/sign-up" className="block bg-green-600 text-white px-4 py-2 rounded-lg text-center">
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}