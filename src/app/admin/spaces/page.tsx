import React from 'react';
import { Building, Plus, MoreVertical } from 'lucide-react';

export default function AdminSpaces() {
  const spaces = [
    { id: 1, name: 'Hot Desk Area A', type: 'Hot Desk', capacity: 20, status: 'Active' },
    { id: 2, name: 'Private Office 101', type: 'Private Office', capacity: 4, status: 'Occupied' },
    { id: 3, name: 'Meeting Room Alpha', type: 'Meeting Room', capacity: 8, status: 'Active' },
    { id: 4, name: 'Quiet Zone B', type: 'Dedicated Desk', capacity: 12, status: 'Maintenance' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Spaces Management</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">Manage your workspace inventory and availability.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Space
        </button>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Space Name</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Type</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Capacity</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Status</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {spaces.map((space) => (
                <tr key={space.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Building className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{space.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-muted-light dark:text-text-muted-dark">{space.type}</td>
                  <td className="p-4 text-text-muted-light dark:text-text-muted-dark">{space.capacity} people</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      space.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      space.status === 'Occupied' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {space.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-text-muted-light dark:text-text-muted-dark" />
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
