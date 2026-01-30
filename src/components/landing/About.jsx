// src/components/landing/About.jsx
'use client';

export default function About() {
  return (
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
  );
}