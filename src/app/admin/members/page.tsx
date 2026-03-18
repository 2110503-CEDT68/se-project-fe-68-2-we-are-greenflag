import React from 'react';
import { Users, Mail, Phone, MoreHorizontal } from 'lucide-react';

export default function AdminMembers() {
  const members = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', plan: 'Resident', joined: 'Jan 15, 2026', status: 'Active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', plan: 'Nomad', joined: 'Feb 02, 2026', status: 'Active' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', plan: 'Team', joined: 'Nov 10, 2025', status: 'Active' },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com', plan: 'Nomad', joined: 'Mar 01, 2026', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Members Directory</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">Manage your community members and their plans.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
          <div className="text-text-muted-light dark:text-text-muted-dark text-sm mb-1">Total Members</div>
          <div className="text-2xl font-bold">1,248</div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
          <div className="text-text-muted-light dark:text-text-muted-dark text-sm mb-1">Active Now</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">142</div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
          <div className="text-text-muted-light dark:text-text-muted-dark text-sm mb-1">New This Month</div>
          <div className="text-2xl font-bold">+38</div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
          <div className="text-text-muted-light dark:text-text-muted-dark text-sm mb-1">Churn Rate</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">2.4%</div>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Member</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Contact</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Plan</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Joined</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Status</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/${member.name}/40/40`} alt={member.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                        <Mail className="w-3 h-3" /> {member.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium">{member.plan}</td>
                  <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark">{member.joined}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
                    </button>
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
