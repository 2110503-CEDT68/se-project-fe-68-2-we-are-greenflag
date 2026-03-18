import React from 'react';
import { Receipt, Download } from 'lucide-react';

export default function UserInvoices() {
  const invoices = [
    { id: 'INV-2026-003', date: 'Mar 01, 2026', amount: '$399.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Feb 01, 2026', amount: '$399.00', status: 'Paid' },
    { id: 'INV-2026-001', date: 'Jan 01, 2026', amount: '$399.00', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Invoices & Billing</h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">View your billing history and download invoices.</p>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Invoice ID</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Date</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Amount</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Status</th>
                <th className="p-4 font-medium text-sm text-text-muted-light dark:text-text-muted-dark">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{invoice.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-muted-light dark:text-text-muted-dark">{invoice.date}</td>
                  <td className="p-4 text-sm font-medium">{invoice.amount}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                      <Download className="w-4 h-4" /> Download
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
