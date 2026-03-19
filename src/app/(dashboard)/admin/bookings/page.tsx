'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, X } from 'lucide-react';

// สร้าง Type สำหรับ Booking เพื่อให้โค้ดอ่านง่ายและลดข้อผิดพลาด
type Booking = {
  id: string;
  user: string;
  space: string;
  date: string;
  duration: string;
  status: string;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'BK-1042', user: 'Alex Johnson', space: 'Meeting Room Alpha', date: 'Today, 2:00 PM', duration: '2 hours', status: 'Upcoming' },
    { id: 'BK-1041', user: 'Sarah Smith', space: 'Hot Desk Area A', date: 'Today, 9:00 AM', duration: 'Full Day', status: 'Active' },
    { id: 'BK-1040', user: 'Michael Chen', space: 'Private Office 101', date: 'Yesterday', duration: 'Full Day', status: 'Completed' },
    { id: 'BK-1039', user: 'Emma Davis', space: 'Meeting Room Beta', date: 'Yesterday', duration: '1 hour', status: 'Completed' },
  ]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLTableSectionElement>(null);

  // State สำหรับควบคุม Popup Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // ปิดเมนูเมื่อคลิกพื้นที่อื่นบนหน้าจอ
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    setOpenMenuId(null);
  };

  // ฟังก์ชันเปิด Modal พร้อมดึงข้อมูลเดิมมาแสดง
  const handleEditClick = (booking: Booking) => {
    setEditingBooking({ ...booking }); // Copy ข้อมูลเดิมมาใส่ State สำหรับแก้ไข
    setIsEditModalOpen(true);          // เปิด Modal
    setOpenMenuId(null);               // ปิดเมนูจุดสามจุด
  };

  // ฟังก์ชันบันทึกข้อมูลที่แก้ไขแล้วลงตาราง
  const handleSaveChanges = () => {
    if (editingBooking) {
      setBookings(bookings.map(b => (b.id === editingBooking.id ? editingBooking : b)));
      setIsEditModalOpen(false); // ปิด Modal
      setEditingBooking(null);   // เคลียร์ข้อมูลที่กำลังแก้
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">View and manage all workspace reservations.</p>
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
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Booking ID</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Member</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Space</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Date & Time</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Duration</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Status</th>
                <th className="p-4 w-14"></th> 
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark" ref={menuRef}>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 font-medium text-sm">{booking.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {booking.user.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{booking.user}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark">{booking.space}</td>
                  <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark">{booking.date}</td>
                  <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark">{booking.duration}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === booking.id ? null : booking.id)}
                      className="p-1.5 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openMenuId === booking.id && (
                      <div className="absolute right-8 top-10 w-32 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg z-10 py-1 overflow-hidden">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Popup Modal สำหรับ Edit --- */}
      {isEditModalOpen && editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header ของ Modal */}
            <div className="flex justify-between items-center p-6 border-b border-border-light dark:border-border-dark">
              <h2 className="text-xl font-bold">Edit Booking</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* เนื้อหาฟอร์มแก้ไข */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Space</label>
                <input 
                  type="text" 
                  value={editingBooking.space}
                  onChange={(e) => setEditingBooking({...editingBooking, space: e.target.value})}
                  className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Date & Time</label>
                  <input 
                    type="text" 
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
                    className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Duration</label>
                  <input 
                    type="text" 
                    value={editingBooking.duration}
                    onChange={(e) => setEditingBooking({...editingBooking, duration: e.target.value})}
                    className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Status</label>
                <select 
                  value={editingBooking.status}
                  onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}
                  className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Footer ของ Modal (ปุ่มบันทึก/ยกเลิก) */}
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