'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Calendar, ChevronDown, Loader2, Download, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SalesDashboardUIProps {
  role?: string;
}

export default function SalesDashboardUI({ role }: SalesDashboardUIProps) {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('All Year');
  const [selectedCoworking, setSelectedCoworking] = useState('all');
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [coworkingSpaces, setCoworkingSpaces] = useState<any[]>([]);
  
  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [exportSort, setExportSort] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [exportLimit, setExportLimit] = useState<'10' | '50' | 'all' | 'custom'>('all');
  const [customLimit, setCustomLimit] = useState<string>('');
  const [exportData, setExportData] = useState<any[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const API_URL = 'https://backend-august-pen-gay.onrender.com/api/v1';

  const years = ['2026', '2025', '2024'];

  // Fetch coworking spaces on component mount
  useEffect(() => {
    const fetchCoworkingSpaces = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
        const res = await axios.get(`${API_URL}/coworkings`, config);
        if (res.data.success) {
          setCoworkingSpaces(res.data.data || []);
        }
      } catch (error) {
        // Error fetching coworking spaces
      }
    };
    fetchCoworkingSpaces();
  }, [API_URL]);
  const months = [
    'All Year',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // Fetch sales data when filters change
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
        
        // Convert month name to number for API (All Year = 'all')
        const monthParam = selectedMonth === 'All Year' ? 'all' : (new Date(`${selectedMonth} 1, 2000`).getMonth() + 1).toString();
        const coworkingParam = selectedCoworking === 'all' ? '' : `&coworking=${selectedCoworking}`;
        const res = await axios.get(`${API_URL}/sales?year=${selectedYear}&month=${monthParam}${coworkingParam}`, config);
        
        if (res.data.success) {
          setSalesData(res.data.data || []);
        }
      } catch (error) {
        setSalesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedYear, selectedMonth, selectedCoworking, API_URL]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
  };

  const handleCoworkingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coworking = e.target.value;
    setSelectedCoworking(coworking);
  };

  // Fetch detailed data for export
  const fetchExportData = async () => {
    setExportLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
      
      // Fetch all reservations with coworking data
      const res = await axios.get(`${API_URL}/reservations`, config);
      
      if (res.data.success) {
        let data = res.data.data || [];
        
        // Filter by year
        const startDate = new Date(`${selectedYear}-01-01`);
        const endDate = new Date(`${selectedYear}-12-31`);
        endDate.setHours(23, 59, 59, 999);
        
        data = data.filter((item: any) => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        });
        
        // Filter by month if not "All Year"
        if (selectedMonth !== 'All Year') {
          const monthNum = new Date(`${selectedMonth} 1, 2000`).getMonth() + 1;
          data = data.filter((item: any) => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() + 1 === monthNum;
          });
        }
        
        // Filter by coworking if not "all"
        if (selectedCoworking !== 'all') {
          data = data.filter((item: any) => {
            // Handle both string and ObjectId formats
            const itemCoworkingId = item.coworking?._id || item.coworking;
            return String(itemCoworkingId) === String(selectedCoworking);
          });
        }
        
        // Calculate amount for each reservation
        data = data.map((item: any) => {
          let amount = 0;
          if (item.coworking && item.coworking.price_per_hour && item.startTime && item.endTime) {
            const [startH, startM] = item.startTime.split(':').map(Number);
            const [endH, endM] = item.endTime.split(':').map(Number);
            let hours = (endH + (endM / 60)) - (startH + (startM / 60));
            if (hours < 0) hours += 24;
            if (hours > 0) amount = hours * item.coworking.price_per_hour;
          }
          return { ...item, amount };
        });
        
        setExportData(data);
      }
    } catch (error) {
      console.error('Error fetching export data:', error);
      setExportData([]);
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportClick = () => {
    fetchExportData();
    setIsExportModalOpen(true);
  };

  const handleExport = () => {
    // Apply sorting and limiting immediately before export
    let dataToExport = [...exportData];
    
    // Apply sorting
    dataToExport = dataToExport.sort((a: any, b: any) => {
      if (exportSort === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (exportSort === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (exportSort === 'amount-desc') return (b.amount || 0) - (a.amount || 0);
      if (exportSort === 'amount-asc') return (a.amount || 0) - (b.amount || 0);
      return 0;
    });
    
    // Apply limit
    let limitValue = exportLimit === 'all' ? dataToExport.length : (exportLimit === 'custom' ? parseInt(customLimit) || dataToExport.length : parseInt(exportLimit));
    if (limitValue > 0 && limitValue < dataToExport.length) {
      dataToExport = dataToExport.slice(0, limitValue);
    }
    
    // Update export data with sorted/limited data for export functions
    setExportData(dataToExport);
    
    // Small delay to ensure state update before export
    setTimeout(() => {
      if (exportFormat === 'csv') {
        exportToCSV(dataToExport);
      } else {
        exportToPDF(dataToExport);
      }
      setIsExportModalOpen(false);
    }, 50);
  };

  const exportToCSV = (data: any[] = exportData) => {
    const headers = ['Date/Month', 'Coworking Space Name', 'Total Sales'];
    const rows = data.map(item => [
      selectedMonth === 'All Year' ? item.date : item.date,
      item.coworking?.name || 'N/A',
      item.amount?.toFixed(2) || '0'
    ]);
    
    const totalRevenue = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    rows.push(['', 'Total Revenue', totalRevenue.toFixed(2)]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales-report-${selectedYear}-${selectedMonth}.csv`;
    link.click();
  };

  const exportToPDF = (data: any[] = exportData) => {
    // Create a printable PDF template
    const totalRevenue = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    const generatedDate = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print PDF');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sales Summary Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap');
          body {
            font-family: 'Sarabun', sans-serif;
            padding: 40px;
            margin: 0;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #ea580c;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #ea580c;
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: 700;
          }
          .header p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #ea580c;
            color: white;
            font-weight: 600;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .total-row {
            background-color: #ea580c !important;
            color: white;
            font-weight: 700;
          }
          .total-row td {
            border: 2px solid #ea580c;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sales Summary Report</h1>
          <p>Selected Year/Month: ${selectedMonth === 'All Year' ? `All Year ${selectedYear}` : `${selectedMonth} ${selectedYear}`}</p>
          <p>Generated Date: ${generatedDate}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date/Month</th>
              <th>Coworking Space Name</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td>${selectedMonth === 'All Year' ? item.date : item.date}</td>
                <td>${item.coworking?.name || 'N/A'}</td>
                <td>฿${(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="2">Total Revenue</td>
              <td>฿${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Only show for admin users
  if (role !== 'admin' && role !== 'Admin') {
    return null;
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
            Sales Dashboard Filters
          </h3>
        </div>
        <button
          onClick={handleExportClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Year Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
            Year
          </label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="w-full pl-4 pr-10 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark pointer-events-none" />
          </div>
        </div>

        {/* Month Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
            Month
          </label>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-full pl-4 pr-10 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark pointer-events-none" />
          </div>
        </div>

        {/* Co-working Space Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
            Co-working Space
          </label>
          <div className="relative">
            <select
              value={selectedCoworking}
              onChange={handleCoworkingChange}
              className="w-full pl-4 pr-10 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none"
            >
              <option value="all">All Spaces</option>
              {coworkingSpaces.map((space) => (
                <option key={space._id} value={space._id}>
                  {space.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Selected Filters Display */}
      <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
          Current Filter: <span className="font-medium text-text-light dark:text-text-dark">
            {selectedMonth} {selectedYear}
          </span>
        </p>
      </div>

      {/* Dynamic Sales Chart */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-semibold text-text-light dark:text-text-dark">
            {selectedMonth === 'All Year' ? 'Monthly Revenue' : 'Daily Revenue'}
          </h4>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>
        
        <div className="w-full h-96 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#d1d5db' }} 
                  dy={10} 
                  interval={0} 
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#d1d5db' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 dark:bg-gray-800 border border-gray-600 px-3 py-2 rounded-lg shadow-xl">
                          <p className="text-sm font-bold text-white">
                            ฿{payload[0].value?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </p>
                          <p className="text-xs text-gray-400">{payload[0].payload?.name}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {salesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="#ea580c" 
                      className="transition-all duration-300 hover:opacity-80" 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted-light dark:text-text-muted-dark">
              <p className="text-sm">No sales data available for the selected period</p>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                Export Report
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Format Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
                Format
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}
                    className="text-primary"
                  />
                  <span className="text-sm text-text-light dark:text-text-dark">CSV</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="pdf"
                    checked={exportFormat === 'pdf'}
                    onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}
                    className="text-primary"
                  />
                  <span className="text-sm text-text-light dark:text-text-dark">PDF</span>
                </label>
              </div>
            </div>

            {/* Sorting Options */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
                Sort By
              </label>
              <select
                value={exportSort}
                onChange={(e) => setExportSort(e.target.value as any)}
                className="w-full px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
              </select>
            </div>

            {/* Row Limit */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
                Row Limit
              </label>
              <select
                value={exportLimit}
                onChange={(e) => setExportLimit(e.target.value as any)}
                className="w-full px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="10">Top 10</option>
                <option value="50">Top 50</option>
                <option value="all">All</option>
                <option value="custom">Custom</option>
              </select>
              {exportLimit === 'custom' && (
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={customLimit}
                  onChange={(e) => setCustomLimit(e.target.value)}
                  placeholder="Enter number of rows"
                  className="mt-2 w-full px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={exportLoading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportLoading ? 'Loading...' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
