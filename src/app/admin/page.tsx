import { Users, Calendar, CreditCard, Activity, ArrowUpRight, ArrowDownRight, MoreVertical, Download, Filter, Banknote, CalendarCheck, Building, UserPlus, CalendarPlus, Receipt, BarChart } from 'lucide-react';

export default function Admin() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard Overview</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* System Overview */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { title: 'Active Members', value: '2,350', change: '+15.5%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { title: 'Bookings Today', value: '142', change: '+12.3%', icon: CalendarCheck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { title: 'Space Occupancy', value: '78%', change: '-2.4%', icon: Building, color: 'text-orange-500', bg: 'bg-orange-500/10', negative: true },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${stat.negative ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {stat.negative ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-text-muted-light dark:text-text-muted-dark font-medium text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart (Mock) */}
          <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold">Revenue Overview</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Monthly revenue for the current year</p>
              </div>
              <select className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-light dark:text-text-dark">
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>
            <div className="h-72 flex items-end justify-between gap-2 pt-4">
              {[40, 55, 45, 70, 65, 85, 90, 75, 80, 95, 85, 100].map((height, i) => (
                <div key={i} className="w-full h-full flex flex-col justify-end items-center gap-3 group">
                  <div 
                    className="w-full bg-primary/20 hover:bg-primary/40 dark:bg-primary/20 dark:hover:bg-primary/40 rounded-t-md transition-all relative"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-medium shadow-lg z-10">
                      ${(height * 450).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs text-text-muted-light dark:text-text-muted-dark font-medium uppercase tracking-wider">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">Recent Transactions</h2>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Latest payments and bookings</p>
              </div>
              <button className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background-light dark:bg-background-dark text-text-muted-light dark:text-text-muted-dark">
                  <tr>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {[
                    { user: 'Sarah Jenkins', email: 'sarah.j@example.com', amount: '$299.00', time: 'Today, 10:42 AM', status: 'Completed', statusColor: 'bg-emerald-500/10 text-emerald-500' },
                    { user: 'Michael Chen', email: 'm.chen@example.com', amount: '$1,200.00', time: 'Today, 09:15 AM', status: 'Completed', statusColor: 'bg-emerald-500/10 text-emerald-500' },
                    { user: 'Emma Watson', email: 'emma.w@example.com', amount: '$45.00', time: 'Yesterday, 04:30 PM', status: 'Refunded', statusColor: 'bg-gray-500/10 text-gray-500 dark:text-gray-400' },
                    { user: 'David Miller', email: 'david.m@example.com', amount: '$150.00', time: 'Yesterday, 02:10 PM', status: 'Failed', statusColor: 'bg-red-500/10 text-red-500' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://picsum.photos/seed/user${i}/40/40`} alt={row.user} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-medium">{row.user}</div>
                            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{row.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{row.amount}</td>
                      <td className="px-6 py-4 text-text-muted-light dark:text-text-muted-dark">{row.time}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-text-muted-light dark:text-text-muted-dark hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add User', icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'New Booking', icon: CalendarPlus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { label: 'Create Invoice', icon: Receipt, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Generate Report', icon: BarChart, color: 'text-orange-500', bg: 'bg-orange-500/10' },
              ].map((tool, i) => (
                <button key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-border-light dark:border-border-dark hover:border-primary dark:hover:border-primary hover:bg-background-light dark:hover:bg-background-dark transition-all group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{tool.label}</span>
                </button>
              ))}
            </div>
          </section>
          
          {/* System Alerts */}
          <section className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">System Alerts</h2>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">2 New</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-start p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-sm text-red-600 dark:text-red-400">Payment Gateway Error</h4>
                  <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">Stripe connection timeout. 3 payments failed in the last hour.</p>
                  <button className="mt-2 text-xs font-medium text-red-600 dark:text-red-400 hover:underline">Resolve Issue</button>
                </div>
              </div>
              <div className="flex gap-3 items-start p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange-500 shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-sm text-orange-600 dark:text-orange-400">High Occupancy Warning</h4>
                  <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">Downtown Hub is at 95% capacity for tomorrow.</p>
                  <button className="mt-2 text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline">View Schedule</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
