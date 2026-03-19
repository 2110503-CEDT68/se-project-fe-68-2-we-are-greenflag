import Link from 'next/link';
import { MapPin, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/workspace/1920/1080" 
            alt="Workspace" 
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background-light/50 to-background-light dark:from-background-dark/50 dark:to-background-dark"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your Office,<br />
            <span className="text-primary">Redefined.</span>
          </h1>
          <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto mb-10">
            Premium co-working spaces designed for productivity, collaboration, and growth. Find your perfect spot today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-medium text-lg transition-colors">
              Start Free Trial
            </Link>
            <Link href="/dashboard" className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-full font-medium text-lg transition-colors">
              Explore Locations
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Near You */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Popular Near You</h2>
            <p className="text-text-muted-light dark:text-text-muted-dark">Discover highly-rated spaces in your area.</p>
          </div>
          <Link href="/" className="text-primary font-medium flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar snap-x">
          {[
            { id: 1, img: 'https://s3-ap-southeast-1.amazonaws.com/motoristprod/editors%2Fimages%2F1689670717070-empty-room-with-chairs-desks.jpg' },
            { id: 2, img: 'https://assets.doodecoapp.com/official-website/blog/logo_DSC03117.png' },
            { id: 3, img: 'https://www.ananda.co.th/blog/thegenc/wp-content/uploads/2016/10/BO4A3388-800x535.jpg' },
            { id: 4, img: 'https://lh7-rt.googleusercontent.com/docsz/AD_4nXfp93FvpNyFNJYliUefJsTmGB_7olTAN7RIsUT-mvnaXkxIk0lHgWmJtOx_j-OjkpfqSIXs7LUxcpikmJqWwU8LZpJ312tfLAEj16oSqOoUo60daEc9yoi6z5wvd8HdQbtywAwpTQ?key=5IkK3l0jMefwq_4tgHCsDw' }
          ].map((space) => (
            <div key={space.id} className="min-w-[300px] sm:min-w-[350px] bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-border-light dark:border-border-dark snap-start">
              <div className="h-48 relative">
                {/* เปลี่ยนการดึง src มาใช้ space.img แทน */}
                <img src={space.img} alt={`Office ${space.id}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-sm font-medium">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  4.{9 - space.id}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">Downtown Hub {space.id}</h3>
                <div className="flex items-center gap-1 text-text-muted-light dark:text-text-muted-dark text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  1.{space.id} miles away
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">From $25/day</span>
                  <Link href="/book" className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Focus & Quiet Zones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-2xl font-bold mb-8">Focus & Quiet Zones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              title: 'Private Pods', 
              desc: 'Soundproof booths for deep work', 
              img: 'https://framery.com/wp-content/uploads/2022/12/framery-one-privacy-booth-768x589.jpg' 
            },
            { 
              title: 'Library Area', 
              desc: 'Silent zone with natural light', 
              img: 'https://www.hdrinc.com/sites/default/files/2022-12/belmar-public-library-reading-room-d1200-628.png'             },
            { 
              title: 'Executive Suites', 
              desc: 'Premium private offices', 
              img: 'https://www.servcorp.co.th/media/42528/mercury-tower-thailand_02-1.jpg' 
            }
          ].map((zone, i) => (
            <div key={i} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer">
              <img src={zone.img} alt={zone.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-white font-bold text-xl mb-1">{zone.title}</h3>
                <p className="text-gray-300 text-sm">{zone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Stream</h2>
          <p className="text-text-muted-light dark:text-text-muted-dark max-w-2xl mx-auto">Flexible plans designed to scale with you and your team.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: 'Nomad', price: '199', desc: 'Perfect for drop-ins and flexible schedules.', features: ['5 days access per month', 'Hot desk seating', 'High-speed Wi-Fi', 'Coffee & Tea'] },
            { name: 'Resident', price: '399', desc: 'Your dedicated spot in our vibrant community.', features: ['24/7 access', 'Dedicated desk', 'Meeting room credits', 'Mail handling', 'Printing services'], popular: true },
            { name: 'Team', price: '999', desc: 'Private offices for growing companies.', features: ['Private office space', 'Custom branding', 'Unlimited meeting rooms', 'Priority support', 'Event space access'] }
          ].map((plan, i) => (
            <div key={i} className={`relative bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border-light dark:border-border-dark'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-6 h-10">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-text-muted-light dark:text-text-muted-dark">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-medium transition-colors ${plan.popular ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}