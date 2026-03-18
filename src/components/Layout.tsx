'use client';

import Link from 'next/link';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <header className="sticky top-0 z-50 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="font-bold text-xl tracking-tight">WorkSpace</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Hot Desks</Link>
              <Link href="/" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Private Offices</Link>
              <Link href="/" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Meeting Rooms</Link>
              <Link href="/" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Amenities</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary font-medium">Sign In</Link>
              <Link href="/signup" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full font-medium transition-colors">Join Now</Link>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Hot Desks</Link>
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Private Offices</Link>
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Meeting Rooms</Link>
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Sign In</Link>
              <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-primary">Join Now</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <span className="font-bold text-xl tracking-tight">WorkSpace</span>
              </Link>
              <p className="text-text-muted-light dark:text-text-muted-dark max-w-sm">
                Redefining the way you work. Premium co-working spaces designed for productivity, collaboration, and growth.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Locations</h3>
              <ul className="space-y-2 text-text-muted-light dark:text-text-muted-dark">
                <li>Downtown Hub</li>
                <li>Creative District</li>
                <li>Tech Park</li>
                <li>Financial Center</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-text-muted-light dark:text-text-muted-dark">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border-light dark:border-border-dark text-center text-text-muted-light dark:text-text-muted-dark">
            <p>&copy; {new Date().getFullYear()} WorkSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
