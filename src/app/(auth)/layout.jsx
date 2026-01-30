// File: src/app/(auth)/layout.jsx


// ==================== src/app/(auth)/layout.jsx ====================
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Wisdom High School</h1>
          <p className="text-gray-600 mt-2">School Management System</p>
        </div>
        {children}
      </div>
    </div>
  );
}