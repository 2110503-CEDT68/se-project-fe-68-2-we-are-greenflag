import React from 'react';
import { User, Bell, Lock, Globe } from 'lucide-react';

export default function UserSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">Manage your account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-medium rounded-lg text-left">
            <User className="w-5 h-5" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left transition-colors">
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left transition-colors">
            <Lock className="w-5 h-5" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left transition-colors">
            <Globe className="w-5 h-5" /> Preferences
          </button>
        </div>

        <div className="md:col-span-3">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <img src="https://picsum.photos/seed/user/80/80" alt="Profile" className="w-20 h-20 rounded-full" referrerPolicy="no-referrer" />
              <div>
                <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm mb-2">
                  Change Photo
                </button>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input type="text" defaultValue="Alex" className="w-full px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input type="text" defaultValue="Johnson" className="w-full px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input type="email" defaultValue="alex@example.com" className="w-full px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea rows={4} className="w-full px-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" defaultValue="Software Engineer based in San Francisco."></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
