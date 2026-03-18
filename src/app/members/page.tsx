import React from 'react';
import { Users, MessageSquare, Calendar as CalendarIcon } from 'lucide-react';

export default function UserMembers() {
  const members = [
    { id: 1, name: 'Sarah Smith', role: 'UX Designer', company: 'DesignCo', status: 'Online' },
    { id: 2, name: 'Michael Chen', role: 'Software Engineer', company: 'TechStart', status: 'Offline' },
    { id: 3, name: 'Emma Davis', role: 'Marketing Director', company: 'GrowthInc', status: 'Online' },
    { id: 4, name: 'James Wilson', role: 'Freelance Writer', company: 'Self-Employed', status: 'Online' },
  ];

  const events = [
    { id: 1, title: 'Networking Breakfast', date: 'Tomorrow, 9:00 AM', location: 'Main Lounge' },
    { id: 2, title: 'Tech Talk: AI Trends', date: 'Friday, 4:00 PM', location: 'Event Space A' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">Connect with other members and join events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Member Directory</h2>
              <button className="text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/${member.name}/48/48`} alt={member.name} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface-light dark:border-surface-dark ${member.status === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{member.name}</h3>
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">{member.role} @ {member.company}</p>
                  </div>
                  <button className="p-2 text-text-muted-light dark:text-text-muted-dark hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Upcoming Events</h2>
              <button className="text-primary text-sm font-medium hover:underline">Calendar</button>
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <h3 className="font-medium mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark mb-1">
                    <CalendarIcon className="w-4 h-4" /> {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
                    <Users className="w-4 h-4" /> {event.location}
                  </div>
                  <button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                    RSVP
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
