// File: src/app/layout.jsx

// ==================== src/app/layout.jsx ====================
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers';
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Wisdom High School',
  description: 'School Management System',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning>
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
