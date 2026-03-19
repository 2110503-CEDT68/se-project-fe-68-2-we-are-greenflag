'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// เอา useRouter ออกเพราะเราไม่ได้เปลี่ยนหน้าแล้ว
import { 
  Calendar, Clock, MapPin, CreditCard, ArrowRight, 
  MoreHorizontal, Users, IdCard, CalendarCheck, 
  CalendarPlus, UserPlus, Map, 
  Edit, Trash2, X 
} from 'lucide-react';

// สร้าง Type เผื่อไว้ให้โค้ดอ่านง่าย
type Booking = {
  id: number;
  type: string;
  day: number;
  month: string;
  time: string;
  location: string;
};

export default function Dashboard() {
  // 1. สร้าง State เก็บข้อมูลการจอง
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 1, type: 'Hot Desk', day: 15, month: 'Sep', time: '09:00 AM - 05:00 PM', location: 'Downtown Hub' },
    { id: 2, type: 'Meeting Room A', day: 16, month: 'Sep', time: '09:00 AM - 05:00 PM', location: 'Downtown Hub' }
  ]);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // State สำหรับควบคุม Popup Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // 2. ฟังก์ชันเปิด Modal แก้ไข
  const handleEditClick = (booking: Booking) => {
    setEditingBooking({ ...booking }); // ก๊อปปี้ข้อมูลเดิมมาใส่ฟอร์ม
    setIsEditModalOpen(true);          // เปิด Modal
    setOpenMenuId(null);               // ปิดเมนูจุดสามจุด
  };

  // ฟังก์ชันบันทึกข้อมูลหลังจากแก้ใน Modal เสร็จ
  const handleSaveChanges = () => {
    if (editingBooking) {
      setBookings(bookings.map(b => (b.id === editingBooking.id ? editingBooking : b)));
      setIsEditModalOpen(false);
      setEditingBooking(null);
    }
  };

  // 3. ฟังก์ชัน Delete
  const handleDelete = (id: number) => {
    setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, Alex</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">Here's what's happening with your workspace today.</p>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <IdCard className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Membership</h3>
          </div>
          <p className="text-2xl font-bold mb-1">Resident Plan</p>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Renews on Oct 1, 2023</p>
        </div>
        
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Credits</h3>
          </div>
          <p className="text-2xl font-bold mb-1">12 Hours</p>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Meeting room time remaining</p>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Next Booking</h3>
          </div>
          <p className="text-2xl font-bold mb-1">Tomorrow</p>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Hot Desk • Downtown Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Bookings */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upcoming Bookings</h2>
              <Link href="/book" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark">
              
              {/* 4. วนลูปจาก State bookings */}
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-light dark:border-border-dark last:border-0 relative">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase">{booking.month}</span>
                        <span className="text-xl font-bold">{booking.day}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{booking.type}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {booking.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* ปุ่มจุดสามจุดและ Dropdown Menu */}
                    <div>
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === booking.id ? null : booking.id)}
                        className="p-2 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === booking.id && (
                        <div className="absolute right-6 top-14 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-border-light dark:border-border-dark py-1 z-10 overflow-hidden">
                          <button
                            onClick={() => handleEditClick(booking)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Booking
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-text-muted-light dark:text-text-muted-dark">
                  No upcoming bookings.
                </div>
              )}
            </div>
          </section>

          {/* Current Hub Location */}
          <section>
            <h2 className="text-xl font-bold mb-4">Current Hub Location</h2>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                <img src="https://picsum.photos/seed/map/800/400" alt="Map" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white dark:bg-surface-dark p-3 rounded-xl shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Downtown Hub</p>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">123 Business Ave, Suite 100</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-medium">Open until 10:00 PM</span>
                <button className="text-sm font-medium text-primary hover:underline">Get Directions</button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/book" className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-border-dark hover:border-primary transition-colors flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">Book Desk</span>
              </Link>
              <button className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-border-dark hover:border-primary transition-colors flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">Invite Guest</span>
              </button>
              <button className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-border-dark hover:border-primary transition-colors flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">Buy Credits</span>
              </button>
              <button className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-border-dark hover:border-primary transition-colors flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center">
                  <Map className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">View Map</span>
              </button>
            </div>
          </section>

          {/* Community Events */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Community</h2>
              <Link href="/community" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-4 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                  <img src="https://picsum.photos/seed/event1/100/100" alt="Event" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Networking Mixer</h4>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">Today, 5:00 PM • Main Lounge</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                  <img src="https://picsum.photos/seed/event2/100/100" alt="Event" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Founder's Talk: Scaling Up</h4>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">Tomorrow, 12:00 PM • Room A</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* --- Popup Modal สำหรับ Edit --- */}
      {isEditModalOpen && editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border-light dark:border-border-dark">
              <h2 className="text-xl font-bold">Edit Booking</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ฟอร์มแก้ไข */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Space Type</label>
                <input 
                  type="text" 
                  value={editingBooking.type}
                  onChange={(e) => setEditingBooking({...editingBooking, type: e.target.value})}
                  className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Day</label>
                  <input 
                    type="number" 
                    value={editingBooking.day}
                    onChange={(e) => setEditingBooking({...editingBooking, day: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Month</label>
                  <input 
                    type="text" 
                    value={editingBooking.month}
                    onChange={(e) => setEditingBooking({...editingBooking, month: e.target.value})}
                    className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Time</label>
                <input 
                  type="text" 
                  value={editingBooking.time}
                  onChange={(e) => setEditingBooking({...editingBooking, time: e.target.value})}
                  className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Location</label>
                <input 
                  type="text" 
                  value={editingBooking.location}
                  onChange={(e) => setEditingBooking({...editingBooking, location: e.target.value})}
                  className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChanges}
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}