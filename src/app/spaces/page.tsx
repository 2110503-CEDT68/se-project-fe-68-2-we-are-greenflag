import React from 'react';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';


export default function UserSpaces() {
  const spaces = [
    { id: 1, name: 'Downtown Hub', type: 'Hot Desk', price: '$25/day', rating: 4.8, distance: '1.2 miles', image: 'office1' },
    { id: 2, name: 'Creative District', type: 'Private Office', price: '$120/day', rating: 4.9, distance: '2.5 miles', image: 'office2' },
    { id: 3, name: 'Tech Park', type: 'Meeting Room', price: '$45/hour', rating: 4.7, distance: '3.1 miles', image: 'office3' },
    { id: 4, name: 'Financial Center', type: 'Dedicated Desk', price: '$40/day', rating: 4.6, distance: '0.8 miles', image: 'office4' },
    { id: 5, name: 'Innovation Lab', type: 'Hot Desk', price: '$30/day', rating: 4.9, distance: '4.2 miles', image: 'office5' },
    { id: 6, name: 'Startup Garage', type: 'Meeting Room', price: '$35/hour', rating: 4.5, distance: '1.5 miles', image: 'office6' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Browse Spaces</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">Find and book the perfect workspace for your needs.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>All Types</option>
            <option>Hot Desk</option>
            <option>Private Office</option>
            <option>Meeting Room</option>
          </select>
          <select className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Sort by: Distance</option>
            <option>Sort by: Rating</option>
            <option>Sort by: Price (Low to High)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <div key={space.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-border-light dark:border-border-dark flex flex-col">
            <div className="h-48 relative">
              <img src={`https://picsum.photos/seed/${space.image}/600/400`} alt={space.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-sm font-medium">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {space.rating}
              </div>
              <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
                {space.type}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-1">{space.name}</h3>
              <div className="flex items-center gap-1 text-text-muted-light dark:text-text-muted-dark text-sm mb-4">
                <MapPin className="w-4 h-4" />
                {space.distance} away
              </div>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-border-light dark:border-border-dark">
                <span className="font-semibold">{space.price}</span>
                <Link href="/book" className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
