import React from 'react';
import { Calendar, Search, Filter } from 'lucide-react';

export default function AdminBookings() {
  const bookings = [
    { id: 'BK-1042', user: 'Alex Johnson', space: 'Meeting Room Alpha', date: 'Today, 2:00 PM', duration: '2 hours', status: 'Upcoming' },
    { id: 'BK-1041', user: 'Sarah Smith', space: 'Hot Desk Area A', date: 'Today, 9:00 AM', duration: 'Full Day', status: 'Active' },
    { id: 'BK-1040', user: 'Michael Chen', space: 'Private Office 101', date: 'Yesterday', duration: 'Full Day', status: 'Completed' },
    { id: 'BK-1039', user: 'Emma Davis', space: 'Meeting Room Beta', date: 'Yesterday', duration: '1 hour', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
