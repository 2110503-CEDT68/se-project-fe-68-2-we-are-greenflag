'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-august-pen-gay.onrender.com/api/v1';

export default function AdminNewSpacePage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (!token) {
      router.replace('/login');
      return;
    }
    if (role !== 'admin') {
      router.replace('/dashboard');
      return;
    }
    setAllowed(true);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get('name') as string)?.trim();
    const address = (fd.get('address') as string)?.trim();
    const priceRaw = fd.get('price_per_hour') as string;
    const type = (fd.get('type') as string)?.trim() || 'workspace';
    const status = (fd.get('status') as string) || 'available';
    const picture = (fd.get('picture') as string)?.trim();
    const ratingRaw = fd.get('rating') as string;

    const price_per_hour = Number(priceRaw);
    if (!name || !address || Number.isNaN(price_per_hour) || price_per_hour < 0) {
      setError('กรุณากรอกชื่อ ที่อยู่ และราคาต่อชั่วโมงให้ถูกต้อง');
      setSubmitting(false);
      return;
    }

    const payload: Record<string, unknown> = {
      name,
      address,
      price_per_hour,
      type,
      status,
    };
    if (picture) payload.picture = picture;
    if (ratingRaw !== '') {
      const rating = Number(ratingRaw);
      if (!Number.isNaN(rating)) payload.rating = rating;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/coworkings`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      router.push('/admin/spaces');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string; msg?: string } } };
      setError(ax.response?.data?.message || ax.response?.data?.msg || 'ไม่สามารถเพิ่มสถานที่ได้');
    } finally {
      setSubmitting(false);
    }
  };

  if (!allowed) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/spaces"
          className="inline-flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไป Spaces Management
        </Link>
        <h1 className="text-2xl font-bold">เพิ่ม Co-working Space</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark text-sm mt-1">
          กรอกข้อมูลสถานที่ใหม่ (เฉพาะผู้ดูแลระบบ)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm space-y-5"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            ชื่อสถานที่
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1.5">
            ที่อยู่
          </label>
          <input
            id="address"
            name="address"
            required
            className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price_per_hour" className="block text-sm font-medium mb-1.5">
              ราคาต่อชั่วโมง (USD)
            </label>
            <input
              id="price_per_hour"
              name="price_per_hour"
              type="number"
              min={0}
              step={0.01}
              required
              className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1.5">
              ประเภท
            </label>
            <select
              id="type"
              name="type"
              className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="workspace">Workspace</option>
              <option value="private_office">Private office</option>
              <option value="hot_desk">Hot desk</option>
              <option value="meeting_room">Meeting room</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1.5">
            สถานะ
          </label>
          <select
            id="status"
            name="status"
            className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div>
          <label htmlFor="picture" className="block text-sm font-medium mb-1.5">
            URL รูปภาพ (ไม่บังคับ)
          </label>
          <input
            id="picture"
            name="picture"
            type="url"
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium mb-1.5">
            คะแนน (ไม่บังคับ)
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-medium transition-colors min-w-[140px]"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'บันทึก'}
          </button>
          <Link
            href="/admin/spaces"
            className="flex items-center justify-center px-5 py-2.5 rounded-lg font-medium border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  );
}
