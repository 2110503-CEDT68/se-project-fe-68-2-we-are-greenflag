'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios'; 

import { User, Mail, Lock, ArrowRight, Phone } from 'lucide-react';

export default function SignUp() {
  const navigate = useRouter();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 🌟 1. สร้างตัวแปร URL ดึงจาก Environment หรือ Render URL ของเรา
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-august-pen-gay.onrender.com/api/v1';

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString() || '';
    const telephone = formData.get('telephone')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    if (!/^[0-9]{9,10}$/.test(telephone)) {
      setError('เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลักเท่านั้น');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      setIsLoading(false);
      return;
    }

    try {
      // 🌟 2. เปลี่ยน localhost เป็น API_URL
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        telephone,
        role: 'user' 
      }, {
        withCredentials: true
      });

      const token = res.data.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', 'user');
      }

      navigate.push('/dashboard');

    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || err.response?.data?.msg || 'ไม่สามารถสมัครสมาชิกได้ อีเมลนี้อาจมีผู้ใช้งานแล้ว');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <img 
          src="https://picsum.photos/seed/signup/1000/1200" 
          alt="Workspace" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Join our community of innovators.</h2>
          <p className="text-lg text-gray-300 max-w-md">
            Get access to premium workspaces, networking events, and a global community of professionals.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
              Start your 7-day free trial today. No credit card required.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
            <div className="space-y-4">
              
              {/* --- Full Name --- */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors text-text-light dark:text-text-dark"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              {/* --- Telephone --- */}
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium mb-1">Telephone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
                  </div>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    required
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors text-text-light dark:text-text-dark"
                    placeholder="0812345678"
                  />
                </div>
              </div>

              {/* --- Email --- */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors text-text-light dark:text-text-dark"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              
              {/* --- Password --- */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors text-text-light dark:text-text-dark"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-colors ${
                  isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                }`}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>

          {/* ... (ส่วนปุ่มอื่นๆ) ... */}

          <p className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}