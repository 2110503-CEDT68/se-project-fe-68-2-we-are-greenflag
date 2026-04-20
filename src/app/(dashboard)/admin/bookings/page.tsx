'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Filter, MoreVertical, Edit, Trash2, X, Calendar as CalendarIcon, 
  Clock, MapPin, CheckCircle2, Activity, DollarSign, TrendingUp,
  ChevronLeft, ChevronRight, FilterX, ArrowUp, ArrowDown, ArrowUpDown
} from 'lucide-react';
import axios from 'axios';
import { validateBookingSchedule } from '@/lib/bookingValidation';

type Booking = {
  id: string;
  user: string;
  userId: string;
  type: string;
  location: string;
  date: string; // วันที่เข้าใช้งาน
  createdAt: string; // วันที่ทำรายการจอง
  startTime: string;
  endTime: string;
  status: string;
  desk?: string; 
  amount: number;
};

// Type สำหรับการทำ Multi-sort
type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof Booking;
  direction: SortDirection;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLTableSectionElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // --- Search & Filter & Sort States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([
    { key: 'createdAt', direction: 'desc' }
  ]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isCustomRows, setIsCustomRows] = useState(false);
  const [customRowsValue, setCustomRowsValue] = useState<number | ''>('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-august-pen-gay.onrender.com/api/v1';

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      const formattedBookings = res.data.data.map((r: any) => {
      const dateStr = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
      const createdAtStr = r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : 'N/A';
      
      return {
        id: r._id,
        user: r.user?.name || 'Unknown User',
        userId: r.user?._id || '', 
        type: r.coworking?.type ? r.coworking.type.charAt(0).toUpperCase() + r.coworking.type.slice(1) : 'Workspace',
        location: r.coworking?.name || 'Unknown Location',
        date: dateStr,
        createdAt: createdAtStr,
        startTime: r.startTime || '09:00',
        endTime: r.endTime || '18:00',
        desk: r.desk || '',
        status: 'Active', // เปลี่ยนเป็นดึงจาก API หากมีฟิลด์ status
        amount: r.totalPrice || r.amount || 1500
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

  // ดึงรายชื่อ Location ทั้งหมดที่มีในระบบเพื่อเอาไปทำ Dropdown
  const uniqueLocations = useMemo(() => {
    const locs = bookings.map(b => b.location).filter(l => l !== 'Unknown Location');
    return Array.from(new Set(locs)).sort();
  }, [bookings]);

  // --- Logic การกด Sort หัวตาราง ---
  const handleSort = (key: keyof Booking) => {
    setSortConfigs((prev) => {
      const existingIndex = prev.findIndex((config) => config.key === key);
      
      if (existingIndex >= 0) {
        const currentDirection = prev[existingIndex].direction;
        if (currentDirection === 'asc') {
          const newConfigs = [...prev];
          newConfigs[existingIndex].direction = 'desc';
          return newConfigs;
        } else {
          return prev.filter((_, index) => index !== existingIndex);
        }
      } else {
        return [...prev, { key, direction: 'asc' }];
      }
    });
  };

  // --- ประมวลผลข้อมูล (Search -> Filters -> Sort) ---
  const processedBookings = useMemo(() => {
    let result = [...bookings];

    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.userId.toLowerCase().includes(lowerQuery) ||
          b.user.toLowerCase().includes(lowerQuery) ||
          b.id.toLowerCase().includes(lowerQuery) ||
          b.location.toLowerCase().includes(lowerQuery)
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter((b) => b.status === filterStatus);
    }

    if (filterType !== 'all') {
      result = result.filter((b) => b.type.toLowerCase() === filterType.toLowerCase());
    }

    if (filterLocation !== 'all') {
      result = result.filter((b) => b.location === filterLocation);
    }

    if (minDate) {
      result = result.filter((b) => b.date >= minDate);
    }
    if (maxDate) {
      result = result.filter((b) => b.date <= maxDate);
    }

    if (sortConfigs.length > 0) {
      result.sort((a, b) => {
        for (const config of sortConfigs) {
          const { key, direction } = config;
          const valA = a[key] ?? '';
          const valB = b[key] ?? '';

          if (typeof valA === 'string' && typeof valB === 'string') {
            const comparison = valA.localeCompare(valB);
            if (comparison !== 0) {
              return direction === 'asc' ? comparison : -comparison;
            }
          } else if (typeof valA === 'number' && typeof valB === 'number') {
            if (valA !== valB) {
              return direction === 'asc' ? valA - valB : valB - valA;
            }
          }
        }
        return 0;
      });
    }

    return result;
  }, [bookings, searchTerm, filterStatus, minDate, maxDate, sortConfigs, filterType, filterLocation]);

  // รีเซ็ตหน้ากลับไปหน้า 1 เสมอเมื่อฟิลเตอร์เปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, minDate, maxDate, sortConfigs, filterType, filterLocation]);

  // --- Pagination Logic ---
  const safeRowsPerPage = Math.max(1, rowsPerPage);
  const totalPages = Math.ceil(processedBookings.length / safeRowsPerPage);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [processedBookings.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * safeRowsPerPage;
  const endIndex = startIndex + safeRowsPerPage;
  const displayedBookings = processedBookings.slice(startIndex, endIndex);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
    setFilterLocation('all');
    setMinDate('');
    setMaxDate('');
    setSortConfigs([{ key: 'createdAt', direction: 'desc' }]);
  };

  const renderSortIcon = (key: keyof Booking) => {
    const config = sortConfigs.find((c) => c.key === key);
    if (!config) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 opacity-40 group-hover:opacity-100 transition-opacity" />;
    return config.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />;
  };

  // การคำนวณสถิติ
  const activeBookingsCount = processedBookings.filter(b => b.status === 'Active').length;
  const totalRevenue = processedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const locationCounts = processedBookings.reduce((acc, curr) => {
    if(curr.location !== 'Unknown Location') {
      acc[curr.location] = (acc[curr.location] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const popularSpace = Object.keys(locationCounts).length > 0 
    ? Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b) 
    : 'No Data Found';

  const handleDelete = async (id: string) => { 
    if (!confirm('คุณแน่ใจใช่ไหมที่จะลบการจองนี้? (การลบในฐานะ Admin)')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/reservations/${id}`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      setBookings(bookings.filter(booking => booking.id !== id));
      setOpenMenuId(null);
    } catch (err) { alert('ไม่สามารถลบรายการได้'); }
  };

  const handleEditClick = (booking: Booking) => { 
    setEditingBooking({ ...booking });
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveChanges = async () => { 
    if (!editingBooking) return;
    const scheduleCheck = validateBookingSchedule(editingBooking.date, editingBooking.startTime, editingBooking.endTime);
    if (scheduleCheck.ok === false) return alert(scheduleCheck.message);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/reservations/${editingBooking.id}`, 
        { date: editingBooking.date, startTime: editingBooking.startTime, endTime: editingBooking.endTime },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setIsEditModalOpen(false); setEditingBooking(null); fetchBookings(); alert('อัปเดตการจองสำเร็จ!');
    } catch (err) { alert('ไม่สามารถแก้ไขข้อมูลได้ โปรดตรวจสอบว่าข้อมูลถูกต้อง'); }
  };

  const getDisplayTime = (start: string, end: string) => { 
    const format12h = (time24: string) => {
      if (!time24) return '';
      const [h, m] = time24.split(':');
      const hours = parseInt(h);
      const suffix = hours >= 12 ? 'PM' : 'AM';
      return `${(hours % 12 || 12).toString().padStart(2, '0')}:${m} ${suffix}`;
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">Active Bookings</p>
            <h3 className="text-2xl font-bold">{activeBookingsCount}</h3>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">Estimated Revenue</p>
            <h3 className="text-2xl font-bold">฿{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">Popular Space</p>
            <h3 className="text-lg font-bold truncate max-w-[150px]">{popularSpace}</h3>
          </div>
        </div>
      </div>

      {/* --- Search & Filter Bar --- */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by User ID, Name, Booking ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <option value="all">All Types</option>
            <option value="desk">Desk</option>
            <option value="room">Room</option>
            <option value="meeting">Meeting</option>
            <option value="private">Private</option>
          </select>

          <select 
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-2 max-w-[200px] truncate rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={minDate}
              onChange={(e) => setMinDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm"
              title="Start Date"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="date" 
              value={maxDate}
              onChange={(e) => setMaxDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm"
              title="End Date"
            />
          </div>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {(searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterLocation !== 'all' || minDate || maxDate || sortConfigs.length > 0) && (
            <button 
              onClick={resetFilters}
              className="p-2 flex items-center justify-center rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Clear all filters & sorts"
            >
              <FilterX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
        
        {/* --- Pagination Controls --- */}
        {processedBookings.length > 0 && (
          <div className="p-4 border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4 bg-background-light dark:bg-background-dark/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Rows:</span>
              <select
                value={isCustomRows ? 'custom' : rowsPerPage}
                onChange={(e) => {
                  if (e.target.value === 'custom') { setIsCustomRows(true); setCustomRowsValue(''); } 
                  else { setIsCustomRows(false); setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }
                }}
                className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/60 text-gray-900 dark:text-white cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value="custom">Custom</option>
              </select>
              {isCustomRows && (
                <input
                  type="number" min="1" value={customRowsValue}
                  onChange={(e) => {
                    const val = e.target.value; setCustomRowsValue(val ? parseInt(val, 10) : '');
                    if (val && !isNaN(parseInt(val, 10))) { setRowsPerPage(parseInt(val, 10)); setCurrentPage(1); }
                  }}
                  className="w-20 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                Page <span className="font-medium text-gray-900 dark:text-white">{totalPages === 0 ? 0 : currentPage}</span> of <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
                <span className="hidden sm:inline"> ({processedBookings.length} items)</span>
              </span>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || totalPages === 0} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}    

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                <th onClick={() => handleSort('id')} className="p-4 font-semibold text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none">
                  <div className="flex items-center gap-2">Booking ID {renderSortIcon('id')}</div>
                </th>
                <th onClick={() => handleSort('createdAt')} className="p-4 font-semibold text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none">
                  <div className="flex items-center gap-2">Booking Date {renderSortIcon('createdAt')}</div>
                </th>
                <th onClick={() => handleSort('user')} className="p-4 font-semibold text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none">
                  <div className="flex items-center gap-2">Member {renderSortIcon('user')}</div>
                </th>
                <th onClick={() => handleSort('type')} className="p-4 font-semibold text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none">
                  <div className="flex items-center gap-2">Space Type {renderSortIcon('type')}</div>
                </th>
                <th onClick={() => handleSort('location')} className="p-4 font-semibold text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none">
                  <div className="flex items-center gap-2">Location {renderSortIcon('location')}</div>
                </th>
                <th onClick={() => handleSort('date')} className="p-4 font-semibold text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none">
                  <div className="flex items-center gap-2">Usage Date & Time {renderSortIcon('date')}</div>
                </th>
                <th onClick={() => handleSort('amount')} className="p-4 font-semibold text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none">
                  <div className="flex items-center gap-2">Amount {renderSortIcon('amount')}</div>
                </th>
                <th onClick={() => handleSort('status')} className="p-4 font-semibold text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 select-none">
                  <div className="flex items-center gap-2">Status {renderSortIcon('status')}</div>
                </th>
                <th className="p-4 w-14"></th> 
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark" ref={menuRef}>
              {displayedBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-text-muted-light dark:text-text-muted-dark">
                      <Search className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No bookings found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                      {(searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterLocation !== 'all' || minDate || maxDate) && (
                        <button onClick={resetFilters} className="mt-4 text-primary hover:underline">Clear all filters</button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                displayedBookings.map((booking, index) => {
                  const isBottomRow = index >= displayedBookings.length - 2 && displayedBookings.length > 3;
                  return (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-medium text-sm whitespace-nowrap">
                      <span className="text-xs text-gray-400">ID:</span> {booking.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                      {booking.createdAt}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {booking.user.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{booking.user}</span>
                          <span className="text-[10px] text-gray-400">uid: {booking.userId.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                      {booking.type} {booking.desk && <span className="text-[#ea580c] dark:text-[#ea580c] font-medium ml-1">({booking.desk})</span>}
                    </td>
                    <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">{booking.location}</td>
                    <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                      {booking.date} <br/>
                      <span className="text-xs opacity-70">{getDisplayTime(booking.startTime, booking.endTime)}</span>
                    </td>
                    <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark whitespace-nowrap">
                      ฿{(booking.amount).toLocaleString()}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Edit Modal --- */}
      {isEditModalOpen && editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
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

            <div className="px-6 pb-6 space-y-5">
              
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Space Type</label>
                  <input 
                    type="text" 
                    value={editingBooking.desk ? `${editingBooking.type} (${editingBooking.desk})` : editingBooking.type}
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
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="date" 
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="time" 
                      value={editingBooking.startTime}
                      onChange={(e) => setEditingBooking({...editingBooking, startTime: e.target.value})}
                      className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
                      className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-border-dark rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="w-full h-[1px] bg-gray-100 dark:bg-border-dark"></div>

            <div className="p-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold border border-gray-300 dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChanges}
                className="px-5 py-2.5 text-sm font-semibold bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg transition-colors shadow-sm"
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