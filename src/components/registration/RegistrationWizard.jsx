// src/components/registration/RegistrationWizard.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { ChevronRight, ChevronLeft, GraduationCap, Briefcase, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export default function RegistrationWizard() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [formData, setFormData] = useState({
    stream: '',
    classLevel: '',
    specialization: '',
    artOrScience: '',
    aLevelStream: '',
    subjects: []
  });

  const totalSteps = 3; // Reduced from 4 since we removed role selection

  // All class levels apply to ALL streams (Technical, Grammar, Commercial)
  const classLevels = [
    'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5',
    'Lower Sixth', 'Upper Sixth'
  ];

  const technicalSpecs = [
    'Electrical Power System',
    'Building & Construction',
    'Motor Mechanic',
    'Woodwork',
    'Welding',
    'Plumbing',
    'Electronics'
  ];

  const commercialSpecs = [
    'Accounting',
    'Bespoke Tailoring',
    'Secretarial Studies',
    'Marketing',
    'Banking & Finance'
  ];

  const artsStreams = ['A1', 'A2', 'A3', 'A4'];
  const scienceStreams = ['S1', 'S2', 'S3', 'S4'];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Check if user already has a profile on mount
  React.useEffect(() => {
    let mounted = true;
    
    const checkExistingProfile = async () => {
      // Wait for Clerk to be loaded before checking
      if (!isLoaded || !user) {
        return;
      }
      
      try {
        console.log('🔍 Checking for existing profile...');
        
        // Check if user already has a role in Clerk metadata
        const existingRole = user.publicMetadata?.role || user.unsafeMetadata?.role;
        
        if (existingRole) {
          console.log('✅ User already has role in metadata:', existingRole);
          
          // Redirect to appropriate dashboard
          const dashboardUrl = existingRole === 'admin' 
            ? '/dashboard/admin' 
            : existingRole === 'teacher' 
            ? '/dashboard/teacher' 
            : '/dashboard/student';
          
          console.log('🚀 Redirecting to:', dashboardUrl);
          router.replace(dashboardUrl);
          return;
        }
        
        // Check backend for existing profile
        const userResponse = await apiClient.get('/users/me/');
        const userData = userResponse.data;
        
        if (!mounted) return;
        
        console.log('👤 User data:', userData);
        
        if (userData.role === 'student') {
          // Check if student profile exists
          try {
            await apiClient.get('/students/me/');
            
            if (!mounted) return;
            
            console.log('✅ Student profile found, redirecting...');
            router.replace('/dashboard/student');
            return;
          } catch (error) {
            console.log('⚠️ No student profile yet, continue registration');
          }
        } else if (userData.role === 'teacher') {
          console.log('✅ Teacher profile found, redirecting...');
          router.replace('/dashboard/teacher');
          return;
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        if (mounted) {
          setCheckingProfile(false);
        }
      }
    };
    
    checkExistingProfile();
    
    return () => {
      mounted = false;
    };
  }, [isLoaded, user, router]);

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    const result = (() => {
      switch(step) {
      case 1:
        return formData.stream !== '';
      
      case 2:
        // All students must select a class level
        return formData.classLevel !== '';
      
      case 3:
        // Technical students must select specialization
        if (formData.stream === 'technical') {
          return formData.specialization !== '';
        }
        
        // Commercial students must select specialization
        if (formData.stream === 'commercial') {
          return formData.specialization !== '';
        }
        
        // Grammar students have different requirements based on class level
        if (formData.stream === 'grammar') {
          // Form 4/5 must select Arts or Science
          if (formData.classLevel === 'Form 4' || formData.classLevel === 'Form 5') {
            return formData.artOrScience !== '';
          }
          // A-Level must select stream
          if (formData.classLevel === 'Lower Sixth' || formData.classLevel === 'Upper Sixth') {
            return formData.aLevelStream !== '';
          }
          // Form 1-3 can proceed without additional selection
          return true;
        }
        
        return true;
      
      default:
        return false;
    }
    })();
    console.log('canProceed check:', { step, formData, result });
    return result;
  };

  const handleSubmit = async () => {
    console.log('🚀 Submitting registration...', formData);
    setLoading(true);
    
    try {
      // First, update user role to student (only students self-register)
      const updateResponse = await apiClient.patch('/users/update_profile/', {
        role: 'student'
      });
      
      console.log('✅ Backend user updated:', updateResponse.data);
      
      // Request backend to sync role to Clerk's publicMetadata
      try {
        console.log('🔄 Requesting backend to sync role to Clerk...');
        await apiClient.post('/users/sync_clerk_metadata/');
        console.log('✅ Backend initiated Clerk metadata sync');
        
        // Reload the user session to get updated metadata from Clerk
        if (user) {
          await user.reload();
          console.log('🔄 User session reloaded with updated metadata');
        }
      } catch (clerkError) {
        console.warn('⚠️ Could not sync Clerk metadata:', clerkError);
      }

      // Create student profile
      const studentData = {
        class_level: formData.classLevel,
        section: formData.stream,
        education_stream: formData.stream,
        specialization: formData.specialization || null,
        art_or_science: formData.artOrScience || null,
        a_level_stream: formData.aLevelStream || null,
        subjects: []
      };

      console.log('📤 Sending student data:', studentData);
      const response = await apiClient.post('/students/', studentData);
      console.log('✅ Student created:', response.data);

      toast.success('Registration completed successfully!');
      
      // Wait a moment for everything to sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to student dashboard
      console.log('🚀 Redirecting to: /dashboard/student');
      
      // Force a hard navigation to ensure middleware re-evaluates
      window.location.href = '/dashboard/student';
      
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Display the actual backend error message
      const errorMessage = error.response?.data?.detail 
        || error.response?.data?.message
        || (typeof error.response?.data === 'object' ? JSON.stringify(error.response?.data) : error.response?.data)
        || error.message
        || 'Registration failed. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {s < step ? <CheckCircle className="h-5 w-5" /> : s}
          </div>
          {s < 3 && (
            <div className={`w-12 h-1 ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Select Your Educational Stream</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => updateField('stream', 'technical')}
          className={`p-6 rounded-lg border-2 transition ${
            formData.stream === 'technical'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <Briefcase className={`h-12 w-12 mx-auto mb-3 ${
            formData.stream === 'technical' ? 'text-blue-600' : 'text-gray-400'
          }`} />
          <h3 className="font-bold text-lg mb-2">Technical</h3>
          <p className="text-sm text-gray-600">Industrial & Technical Education</p>
        </button>

        <button
          onClick={() => updateField('stream', 'grammar')}
          className={`p-6 rounded-lg border-2 transition ${
            formData.stream === 'grammar'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <GraduationCap className={`h-12 w-12 mx-auto mb-3 ${
            formData.stream === 'grammar' ? 'text-blue-600' : 'text-gray-400'
          }`} />
          <h3 className="font-bold text-lg mb-2">Grammar</h3>
          <p className="text-sm text-gray-600">General Education</p>
        </button>

        <button
          onClick={() => updateField('stream', 'commercial')}
          className={`p-6 rounded-lg border-2 transition ${
            formData.stream === 'commercial'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <Briefcase className={`h-12 w-12 mx-auto mb-3 ${
            formData.stream === 'commercial' ? 'text-blue-600' : 'text-gray-400'
          }`} />
          <h3 className="font-bold text-lg mb-2">Commercial</h3>
          <p className="text-sm text-gray-600">Business & Commerce</p>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-6">Select Your Class Level</h2>
      <p className="text-center text-gray-600 mb-4">
        {formData.stream === 'technical' && 'Technical Education - Select your current class'}
        {formData.stream === 'grammar' && 'Grammar School - Select your current class'}
        {formData.stream === 'commercial' && 'Commercial Education - Select your current class'}
      </p>
      
      <div className="grid md:grid-cols-2 gap-3">
        {classLevels.map((level) => (
          <button
            key={level}
            onClick={() => updateField('classLevel', level)}
            className={`p-4 rounded-lg border-2 transition text-left ${
              formData.classLevel === level
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <h3 className="font-semibold">{level}</h3>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => {
    // TECHNICAL STUDENTS - Select Specialization
    if (formData.stream === 'technical') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6">Select Your Technical Specialization</h2>
          <p className="text-center text-gray-600 mb-4">
            Class: <span className="font-semibold">{formData.classLevel}</span>
          </p>
          
          <div className="grid md:grid-cols-2 gap-3">
            {technicalSpecs.map((spec) => (
              <button
                key={spec}
                onClick={() => updateField('specialization', spec)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  formData.specialization === spec
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold">{spec}</h3>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // COMMERCIAL STUDENTS - Select Specialization
    if (formData.stream === 'commercial') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6">Select Your Commercial Specialization</h2>
          <p className="text-center text-gray-600 mb-4">
            Class: <span className="font-semibold">{formData.classLevel}</span>
          </p>
          
          <div className="grid md:grid-cols-2 gap-3">
            {commercialSpecs.map((spec) => (
              <button
                key={spec}
                onClick={() => updateField('specialization', spec)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  formData.specialization === spec
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold">{spec}</h3>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // GRAMMAR STUDENTS - Different requirements based on class level
    if (formData.stream === 'grammar') {
      // Form 4/5 - Must select Arts or Science
      if (formData.classLevel === 'Form 4' || formData.classLevel === 'Form 5') {
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Select Your Stream</h2>
            <p className="text-center text-gray-600 mb-4">
              Class: <span className="font-semibold">{formData.classLevel}</span>
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => updateField('artOrScience', 'arts')}
                className={`p-6 rounded-lg border-2 transition ${
                  formData.artOrScience === 'arts'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">Arts</h3>
                <p className="text-sm text-gray-600">Arts & Humanities Stream</p>
              </button>

              <button
                onClick={() => updateField('artOrScience', 'science')}
                className={`p-6 rounded-lg border-2 transition ${
                  formData.artOrScience === 'science'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">Science</h3>
                <p className="text-sm text-gray-600">Science Stream</p>
              </button>
            </div>
          </div>
        );
      }

      // Lower/Upper Sixth - Must select A-Level stream
      if (formData.classLevel === 'Lower Sixth' || formData.classLevel === 'Upper Sixth') {
        const streams = formData.artOrScience === 'arts' 
          ? artsStreams 
          : formData.artOrScience === 'science' 
          ? scienceStreams 
          : [...artsStreams, ...scienceStreams];
        
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              {formData.artOrScience 
                ? `Select Your ${formData.artOrScience === 'arts' ? 'Arts' : 'Science'} Stream` 
                : 'Select Arts or Science, Then Your Stream'}
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Class: <span className="font-semibold">{formData.classLevel}</span>
            </p>
            
            {!formData.artOrScience && (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => updateField('artOrScience', 'arts')}
                  className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition"
                >
                  <h3 className="font-bold text-lg mb-2">Arts</h3>
                  <p className="text-sm text-gray-600">A1, A2, A3, A4</p>
                </button>

                <button
                  onClick={() => updateField('artOrScience', 'science')}
                  className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition"
                >
                  <h3 className="font-bold text-lg mb-2">Science</h3>
                  <p className="text-sm text-gray-600">S1, S2, S3, S4</p>
                </button>
              </div>
            )}
            
            {formData.artOrScience && (
              <div className="grid md:grid-cols-4 gap-3">
                {streams.map((stream) => (
                  <button
                    key={stream}
                    onClick={() => updateField('aLevelStream', stream)}
                    className={`p-4 rounded-lg border-2 transition ${
                      formData.aLevelStream === stream
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold text-lg">{stream}</h3>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Form 1-3 - No additional selection needed
      return (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Registration Complete!</h2>
          <p className="text-gray-600 mb-6">Click Finish to access your dashboard</p>
          <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold mb-3">Your Selection:</h3>
            <div className="text-left space-y-2">
              <p><span className="font-medium">Stream:</span> {formData.stream}</p>
              <p><span className="font-medium">Class:</span> {formData.classLevel}</p>
            </div>
          </div>
        </div>
      );
    }

    // Default completion screen
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Registration Complete!</h2>
        <p className="text-gray-600 mb-6">Click Finish to access your dashboard</p>
        <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="font-semibold mb-3">Your Selection:</h3>
          <div className="text-left space-y-2">
            <p><span className="font-medium">Stream:</span> {formData.stream}</p>
            <p><span className="font-medium">Class:</span> {formData.classLevel}</p>
            {formData.specialization && (
              <p><span className="font-medium">Specialization:</span> {formData.specialization}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {checkingProfile ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Checking your profile...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-600 rounded-full p-3">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold ml-3">Complete Your Registration</h1>
          </div>

          {renderStepIndicator()}

          <div className="mb-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>

          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            {step < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Finish Registration
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
