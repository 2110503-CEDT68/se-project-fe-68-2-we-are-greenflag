import React from 'react';
import { IdCard, CheckCircle2, CreditCard, Clock } from 'lucide-react';

export default function UserMembership() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Membership</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">Manage your plan and credits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                  <IdCard className="w-3 h-3" /> Active Plan
                </div>
                <h2 className="text-2xl font-bold">Resident Plan</h2>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Billed monthly. Next billing date: Apr 15, 2026</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">$399</div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">/month</div>
              </div>
            </div>

            <div className="border-t border-border-light dark:border-border-dark pt-6">
              <h3 className="font-semibold mb-4">Included in your plan:</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['24/7 access', 'Dedicated desk', '10 Meeting room credits', 'Mail handling', 'Printing services', 'Community events'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex gap-3">
              <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Upgrade Plan
              </button>
              <button className="border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-medium transition-colors">
                Cancel Membership
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <h3 className="font-semibold mb-4">Available Credits</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Meeting Rooms</div>
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Resets in 14 days</div>
                  </div>
                </div>
                <div className="text-xl font-bold">8 hrs</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Printing</div>
                    <div className="text-xs text-text-muted-light dark:text-text-muted-dark">Resets in 14 days</div>
                  </div>
                </div>
                <div className="text-xl font-bold">150 pgs</div>
              </div>
            </div>
            <button className="w-full mt-4 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              Buy More Credits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
