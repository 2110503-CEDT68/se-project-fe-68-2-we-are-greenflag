'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, X, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

type Booking = {
  id: string;
  user: string;
  type: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLTableSectionElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // ✅ 1. ดึงข้อมูลการจองของ "ทุกคน" (Admin View Any Booking - ข้อ 10)
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      // แอดมินยิง GET /reservations ระบบ Backend จะรู้จาก Token ว่าเป็น Admin และคืนค่าของทุกคนมาให้
      const res = await axios.get('http://localhost:5000/api/v1/reservations', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      // แมปข้อมูลจาก Backend เข้าฟอร์แมตของตาราง UI
      const formattedBookings = res.data.data.map((r: any) => {
        const d = new Date(r.date);
        return {
          id: r._id,
          user: r.user?.name || 'Unknown User', // ดึงชื่อ User จาก Populated data
          type: r.coworking?.type ? r.coworking.type.charAt(0).toUpperCase() + r.coworking.type.slice(1) : 'Workspace',
          location: r.coworking?.name || 'Unknown Location',
          date: !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '', 
          startTime: !isNaN(d.getTime()) ? d.toTimeString().slice(0, 5) : '09:00',
          endTime: !isNaN(d.getTime()) ? new Date(d.getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5) : '11:00',
          status: 'Active' // จำลอง Status เนื่องจากใน Model ของคุณอาจจะยังไม่มี Field status ของ Reservation
        };
      });
      setBookings(formattedBookings);
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ 2. ลบการจองของใครก็ได้ (Admin Delete Any Booking - ข้อ 12)
  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจใช่ไหมที่จะลบการจองนี้? (การลบในฐานะ Admin)')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/v1/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      // ลบออกจาก State ทันทีที่ลบใน DB สำเร็จ
      setBookings(bookings.filter(booking => booking.id !== id));
      setOpenMenuId(null);
    } catch (err) {
      alert('ไม่สามารถลบรายการได้');
    }
  };

  const handleEditClick = (booking: Booking) => {
    setEditingBooking({ ...booking });
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  // ✅ 3. แก้ไขการจองของใครก็ได้ (Admin Edit Any Booking - ข้อ 11)
  const handleSaveChanges = async () => {
    if (editingBooking) {
      try {
        const token = localStorage.getItem('token');
        // นำ Date และ Time มาประกอบกันเป็น ISO String เพื่อส่งให้ Backend
        const isoDate = new Date(`${editingBooking.date}T${editingBooking.startTime}:00`).toISOString();

        await axios.put(`http://localhost:5000/api/v1/reservations/${editingBooking.id}`, 
          { date: isoDate }, // อัปเดตฟิลด์วันที่
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );

        setIsEditModalOpen(false);
        setEditingBooking(null);
        fetchBookings(); // ดึงข้อมูลใหม่มาแสดง
        alert('อัปเดตการจองสำเร็จ!');
      } catch (err) {
        console.error(err);
        alert('ไม่สามารถแก้ไขข้อมูลได้ โปรดตรวจสอบว่าวันที่ถูกต้องและไม่ขัดเงื่อนไข');
      }
    }
  };

  const getDisplayTime = (start: string, end: string) => {
    const format12h = (time24: string) => {
      if (!time24) return '';
      const [h, m] = time24.split(':');
      const hours = parseInt(h);
      const suffix = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12.toString().padStart(2, '0')}:${m} ${suffix}`;
    };
    return `${format12h(start)} - ${format12h(end)}`;
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings Management</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">View and manage all workspace reservations across the system.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="w-full pl-9 pr-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="p-2 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">Booking ID</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">Member</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">Space Type</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">Location</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">Date & Time</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">Status</th>
                <th className="p-4 w-14"></th> 
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark" ref={menuRef}>
              {bookings.map((booking, index) => {
                const isBottomRow = index >= bookings.length - 2;
                return (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium text-sm whitespace-nowrap">
                    <span className="text-xs text-gray-400">ID:</span> {booking.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {booking.user.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{booking.user}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">{booking.type}</td>
                  <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">{booking.location}</td>
                  <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                    {booking.date} <br/>
                    <span className="text-xs opacity-70">{getDisplayTime(booking.startTime, booking.endTime)}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right relative whitespace-nowrap">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === booking.id ? null : booking.id)}
                      className="p-1.5 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openMenuId === booking.id && (
                      <div className={`absolute right-8 w-32 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg z-50 py-1 overflow-hidden ${
                        isBottomRow ? 'bottom-8' : 'top-10'
                      }`}>
                        <button 
                          onClick={() => handleEditClick(booking)}
                          className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(booking.id)}
                          className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )})}
              
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-muted-light">
                    ไม่พบข้อมูลการจองในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Popup Modal สำหรับ Edit (Admin) --- */}
      {isEditModalOpen && editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4">
              <h2 className="text-xl font-bold">Edit Booking (Admin)</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="w-full h-[1px] bg-gray-100 dark:bg-border-dark mb-4"></div>

            {/* ฟอร์มแก้ไข */}
            <div className="px-6 pb-6 space-y-5">
              
              {/* 1. Location (Disabled for safety, shows correct name) */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    value={editingBooking.location}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-border-dark rounded-lg text-sm text-gray-500 appearance-none cursor-not-allowed"
                    disabled
                  >
                    <option value={editingBooking.location}>{editingBooking.location}</option>
                  </select>
                </div>
              </div>

              {/* 2. Space Type & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Space Type</label>
                  <input 
                    type="text" 
                    value={editingBooking.type}
                    className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-border-dark rounded-lg text-sm text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Status</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      value={editingBooking.status}
                      onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* 3. Date */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="date" 
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  />
                </div>
              </div>

              {/* 4. Time (Start & End) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="time" 
                      value={editingBooking.startTime}
                      onChange={(e) => setEditingBooking({...editingBooking, startTime: e.target.value})}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="time" 
                      value={editingBooking.endTime}
                      onChange={(e) => setEditingBooking({...editingBooking, endTime: e.target.value})}
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="w-full h-[1px] bg-gray-100 dark:bg-border-dark"></div>

            {/* Footer Buttons */}
            <div className="p-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold border border-gray-300 dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChanges}
                className="px-5 py-2.5 text-sm font-semibold bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors shadow-sm"
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