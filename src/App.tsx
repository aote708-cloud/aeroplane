/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Shield, 
  Globe, 
  Clock, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Users,
  Navigation,
  Wrench,
  GraduationCap,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';

// Types
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  onLearnMore: () => void;
}

interface ServiceDetail {
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

interface FleetItemProps {
  image: string;
  name: string;
  capacity: string;
  range: string;
}

interface DestinationCardProps {
  image: string;
  city: string;
  country: string;
}

// Components
const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, tagline, description, onLearnMore }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
      {icon}
    </div>
    <span className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2 block">{tagline}</span>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
    <button 
      onClick={onLearnMore}
      className="mt-6 text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
    >
      Learn More <ArrowRight size={16} />
    </button>
  </motion.div>
);

const FleetItem: React.FC<FleetItemProps> = ({ image, name, capacity, range }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="group overflow-hidden rounded-2xl bg-slate-900 relative aspect-[4/3]"
  >
    <img 
      src={image} 
      alt={name} 
      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
    <div className="absolute bottom-0 left-0 p-8 w-full">
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <div className="flex gap-6 text-slate-300 text-sm">
        <span className="flex items-center gap-2"><Users size={14} /> {capacity}</span>
        <span className="flex items-center gap-2"><Globe size={14} /> {range}</span>
      </div>
    </div>
  </motion.div>
);

const DestinationCard: React.FC<DestinationCardProps> = ({ image, city, country }) => (
  <div className="relative group overflow-hidden rounded-2xl aspect-[3/4]">
    <img 
      src={image} 
      alt={city} 
      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
    <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
      <p className="text-blue-400 font-medium text-sm mb-1 uppercase tracking-widest">{country}</p>
      <h3 className="text-2xl font-bold text-white">{city}</h3>
    </div>
  </div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Form states
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [activeService, setActiveService] = useState<ServiceDetail | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingStatus('loading');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // 1. Save to Supabase
      const { error: supabaseError } = await supabase.from('bookings').insert([data]);
      if (supabaseError) console.error('Supabase error:', supabaseError);

      // 2. Send to Formspree
      const response = await fetch('https://formspree.io/f/xeerknla', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setBookingStatus('success');
        form.reset();
        setTimeout(() => setBookingStatus('idle'), 5000);
      } else {
        const errorData = await response.json();
        console.error('Formspree error:', errorData);
        setBookingStatus('error');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setBookingStatus('error');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactStatus('loading');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // 1. Save to Supabase
      const { error: supabaseError } = await supabase.from('contacts').insert([data]);
      if (supabaseError) console.error('Supabase error:', supabaseError);

      // 2. Send to Formspree
      const response = await fetch('https://formspree.io/f/xeerknla', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setContactStatus('success');
        form.reset();
        setTimeout(() => setContactStatus('idle'), 5000);
      } else {
        const errorData = await response.json();
        console.error('Formspree error:', errorData);
        setContactStatus('error');
      }
    } catch (error) {
      console.error('Error submitting contact:', error);
      setContactStatus('error');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // 1. Save to Supabase (assuming 'newsletters' table exists)
      const { error: supabaseError } = await supabase.from('newsletters').insert([data]);
      if (supabaseError) console.error('Supabase error:', supabaseError);

      // 2. Send to Formspree
      const response = await fetch('https://formspree.io/f/xeerknla', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setNewsletterStatus('success');
        form.reset();
        setTimeout(() => setNewsletterStatus('idle'), 5000);
      } else {
        setNewsletterStatus('error');
      }
    } catch (error) {
      console.error('Error submitting newsletter:', error);
      setNewsletterStatus('error');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Fleet', id: 'fleet' },
    { name: 'Destinations', id: 'destinations' },
    { name: 'Contact', id: 'contact' },
  ];

  const services: ServiceDetail[] = [
    {
      icon: <Plane size={28} />,
      title: "Private Jet Charter",
      tagline: "Bespoke Travel",
      description: "Luxury travel on your schedule. Access thousands of airports worldwide with total privacy.",
      details: [
        "On-demand global availability",
        "Bespoke in-flight catering",
        "Expedited ground handling",
        "Total privacy and security",
        "Access to remote airports"
      ]
    },
    {
      icon: <Box size={28} />,
      title: "Cargo Transport",
      tagline: "Global Logistics",
      description: "Swift and secure global logistics for high-value goods and time-sensitive shipments.",
      details: [
        "High-value asset protection",
        "Temperature-controlled transport",
        "Real-time tracking systems",
        "Customs clearance assistance",
        "Door-to-door logistics"
      ]
    },
    {
      icon: <Wrench size={28} />,
      title: "Aircraft Maintenance",
      tagline: "Precision Care",
      description: "World-class MRO services ensuring your fleet stays in peak operational condition.",
      details: [
        "Scheduled inspections (A, B, C, D checks)",
        "Avionics upgrades and repairs",
        "Engine overhaul management",
        "Interior refurbishment",
        "24/7 AOG support"
      ]
    },
    {
      icon: <GraduationCap size={28} />,
      title: "Pilot Training",
      tagline: "Aviation Excellence",
      description: "Comprehensive flight academy programs for aspiring aviators and professional pilots.",
      details: [
        "PPL to ATPL certification",
        "Type rating courses",
        "Advanced simulator training",
        "Safety management systems",
        "Career placement support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <Plane size={24} />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              SkyWing<span className="text-blue-500">Aviation</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-medium transition-colors hover:text-blue-500 cursor-pointer ${
                  isScrolled ? 'text-slate-600' : 'text-white/80'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('booking')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`md:hidden p-2 ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 md:hidden"
            >
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => scrollToSection(link.id)}
                  className="text-lg font-medium text-slate-600 hover:text-blue-600 py-2 text-left"
                >
                  {link.name}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('booking')}
                className="bg-blue-600 text-white w-full py-4 rounded-xl font-bold mt-4"
              >
                Book a Flight
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Airplane" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/40 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 rounded-full text-blue-400 text-sm font-bold tracking-widest uppercase mb-6">
              Premium Aviation Services
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Fly Beyond the <br />
              <span className="text-blue-500">Horizon</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-lg">
              Experience the pinnacle of luxury and efficiency. From private charters to global logistics, we redefine the way you touch the sky.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('booking')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30"
              >
                Book Flight <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center"
              >
                Explore Services
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=1000" 
                alt="About SkyWing" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 bg-blue-600 p-8 rounded-3xl shadow-xl hidden sm:block">
                <p className="text-4xl font-bold text-white mb-1">25+</p>
                <p className="text-blue-100 font-medium">Years of Excellence</p>
              </div>
            </motion.div>

            <div>
              <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Our Legacy</h2>
              <h3 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Elevating Your Journey with Unmatched Precision
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                SkyWing Aviation has been at the forefront of the aviation industry for over two decades. We combine cutting-edge technology with a human touch to ensure every flight is more than just a trip—it's an experience.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 mb-10">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Safety First</h4>
                    <p className="text-sm text-slate-500">Rigorous maintenance and top-tier pilot training.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Punctuality</h4>
                    <p className="text-sm text-slate-500">Your time is valuable. We respect it above all else.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="italic text-slate-700 font-medium">
                  "Our mission is to bridge the gap between continents while providing a sanctuary in the clouds for our passengers."
                </p>
                <p className="mt-4 font-bold text-slate-900">— Captain James Sterling, CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Our Services</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Comprehensive Aviation Solutions</h3>
            <p className="text-slate-600 text-lg">
              Tailored services designed to meet the diverse needs of modern travelers and businesses worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard 
                key={index}
                icon={service.icon}
                tagline={service.tagline}
                title={service.title}
                description={service.description}
                onLearnMore={() => setActiveService(service)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4">Our Fleet</h2>
              <h3 className="text-4xl font-bold mb-6">Modern Aircraft for Every Mission</h3>
              <p className="text-slate-400 text-lg">
                Our diverse fleet features the latest in aviation technology, comfort, and performance.
              </p>
            </div>
            <button className="text-white font-bold flex items-center gap-2 hover:text-blue-400 transition-colors">
              View All Aircraft <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FleetItem 
              image="https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800"
              name="Gulfstream G650"
              capacity="16 Passengers"
              range="7,500 nm"
            />
            <FleetItem 
              image="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=800"
              name="Bombardier Global 7500"
              capacity="19 Passengers"
              range="7,700 nm"
            />
            <FleetItem 
              image="https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=800"
              name="Cessna Citation Longitude"
              capacity="12 Passengers"
              range="3,500 nm"
            />
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Destinations</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Explore the World Without Limits</h3>
            <p className="text-slate-600 text-lg">
              From bustling financial hubs to remote island paradises, SkyWing takes you exactly where you need to be.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <DestinationCard 
              image="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=600"
              city="Sydney"
              country="Australia"
            />
            <DestinationCard 
              image="https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=600"
              city="London"
              country="United Kingdom"
            />
            <DestinationCard 
              image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600"
              city="Dubai"
              country="UAE"
            />
            <DestinationCard 
              image="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600"
              city="New York"
              country="USA"
            />
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-5">
            <div className="lg:col-span-2 bg-slate-900 p-12 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-6">Ready to Take Off?</h3>
                <p className="text-slate-400 mb-8">
                  Fill out the form and our flight coordinators will get back to you within 30 minutes with a personalized quote.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white"><ArrowRight size={12} /></div>
                    24/7 Concierge Support
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white"><ArrowRight size={12} /></div>
                    Customized In-flight Catering
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white"><ArrowRight size={12} /></div>
                    Ground Transportation Arranged
                  </li>
                </ul>
              </div>
              <div className="mt-12 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Urgent Booking</p>
                  <p className="text-xl font-bold">+1 (800) SKYWING</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 p-12">
              <form className="grid sm:grid-cols-2 gap-6" onSubmit={handleBookingSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                  <input 
                    type="text" 
                    name="full_name"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Destination</label>
                  <select 
                    name="destination"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">Select Destination</option>
                    <option value="London, UK">London, UK</option>
                    <option value="Dubai, UAE">Dubai, UAE</option>
                    <option value="New York, USA">New York, USA</option>
                    <option value="Tokyo, Japan">Tokyo, Japan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Departure Date</label>
                  <input 
                    type="date" 
                    name="departure_date"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Additional Requests</label>
                  <textarea 
                    rows={3}
                    name="additional_requests"
                    placeholder="Catering requirements, ground transport, etc."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={bookingStatus === 'loading'}
                  className="sm:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  {bookingStatus === 'loading' ? 'Submitting...' : 'Request Flight Quote'}
                </button>
                {bookingStatus === 'success' && (
                  <p className="sm:col-span-2 text-green-600 font-bold text-center">Quote request sent successfully!</p>
                )}
                {bookingStatus === 'error' && (
                  <p className="sm:col-span-2 text-red-600 font-bold text-center">Error sending request. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Testimonials</h2>
            <h3 className="text-4xl font-bold text-slate-900">What Our Clients Say</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative">
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 leading-relaxed mb-8 italic">
                  "SkyWing Aviation has completely transformed how we handle our executive travel. The attention to detail and professionalism of the crew is simply unmatched in the industry."
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={`https://i.pravatar.cc/150?u=${i}`} 
                    alt="User" 
                    className="w-12 h-12 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">Robert Chen</h4>
                    <p className="text-sm text-slate-500">CEO, Global Tech Solutions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Contact Us</h2>
              <h3 className="text-4xl font-bold text-slate-900 mb-8">Get in Touch with Our Experts</h3>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                    <p className="text-slate-600">concierge@skywing.com</p>
                    <p className="text-slate-600">support@skywing.com</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                    <p className="text-slate-600">+1 (800) 123-4567</p>
                    <p className="text-slate-600">+1 (555) 987-6543</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Visit Us</h4>
                    <p className="text-slate-600">123 Aviation Way, Sky Harbor</p>
                    <p className="text-slate-600">Phoenix, AZ 85034, USA</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-md transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">First Name</label>
                    <input type="text" name="first_name" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Last Name</label>
                    <input type="text" name="last_name" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Subject</label>
                  <input type="text" name="subject" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Message</label>
                  <textarea rows={4} name="message" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button 
                  type="submit"
                  disabled={contactStatus === 'loading'}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {contactStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                {contactStatus === 'success' && (
                  <p className="text-green-600 font-bold text-center">Message sent successfully!</p>
                )}
                {contactStatus === 'error' && (
                  <p className="text-red-600 font-bold text-center">Error sending message. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div 
                onClick={() => scrollToSection('home')}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Plane size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  SkyWing<span className="text-blue-500">Aviation</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Redefining the standards of global aviation through innovation, luxury, and an unwavering commitment to safety.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-slate-400">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-blue-400 transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors cursor-pointer">About Us</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-blue-400 transition-colors cursor-pointer">Services</button></li>
                <li><button onClick={() => scrollToSection('fleet')} className="hover:text-blue-400 transition-colors cursor-pointer">Our Fleet</button></li>
                <li><button onClick={() => scrollToSection('destinations')} className="hover:text-blue-400 transition-colors cursor-pointer">Destinations</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Private Jet Charter</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cargo Solutions</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Aircraft Sales</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pilot Training</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Maintenance</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Newsletter</h4>
              <p className="text-slate-400 mb-6">Subscribe to get the latest aviation news and exclusive offers.</p>
              <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Email"
                  className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 flex-grow"
                />
                <button 
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? '...' : <ArrowRight size={20} />}
                </button>
              </form>
              {newsletterStatus === 'success' && <p className="text-green-500 text-xs mt-2">Subscribed!</p>}
              {newsletterStatus === 'error' && <p className="text-red-500 text-xs mt-2">Error. Try again.</p>}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
            <p>© 2026 SkyWing Aviation. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToSection('home')}
            className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 transition-all cursor-pointer"
          >
            <ArrowRight size={24} className="-rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {activeService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setActiveService(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
              
              <div className="p-10">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                  {activeService.icon}
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">{activeService.title}</h3>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {activeService.description}
                </p>
                
                <div className="space-y-4 mb-10">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Features</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {activeService.details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setActiveService(null);
                      scrollToSection('booking');
                    }}
                    className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    Inquire Now
                  </button>
                  <button 
                    onClick={() => setActiveService(null)}
                    className="px-8 py-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
