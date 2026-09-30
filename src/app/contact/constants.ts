import {
  BusinessFeature,
  BusinessCategory,
  BusinessGoal,
  ColorTheme,
  PackageOption,
  StepInfo,
} from './types';

export const BUSINESS_FEATURES: BusinessFeature[] = [
  { id: 'maps', name: 'Google Maps & Location', icon: '📍', description: 'Directions for customers to visit your address' },
  { id: 'whatsapp', name: 'WhatsApp Order & Inquiry', icon: '📱', description: 'Direct customer orders on your mobile number' },
  { id: 'gallery', name: 'Photo & Work Showcase', icon: '📸', description: 'Show photos of your products, projects or clinic' },
  { id: 'pricelist', name: 'Services & Rate Card', icon: '📋', description: 'Display service packages & item prices' },
  { id: 'reviews', name: 'Customer Ratings & Reviews', icon: '🌟', description: 'Show 5-star Google customer testimonials' },
  { id: 'upi', name: 'Online Payments & UPI QR', icon: '💳', description: 'Instant payment via GPay, PhonePe or Paytm' },
  { id: 'chatbot', name: 'AI 24/7 Auto-Replier', icon: '🤖', description: 'Automated replies to customer queries 24/7' },
  { id: 'multilang', name: 'Hindi & English Dual Mode', icon: '🌐', description: 'Bilingual support for local & national clients' },
];

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  { value: 'retail', title: 'Local Business & Retail', icon: '🏪', sampleName: 'Amrjeet Hardware Store' },
  { value: 'salon', title: 'Salon, Beauty & Wellness', icon: '💇', sampleName: 'Aura Hair & Beauty Studio' },
  { value: 'restaurant', title: 'Restaurant, Cafe & Food', icon: '🍽️', sampleName: 'Spice Craft Bistro' },
  { value: 'clinic', title: 'Clinic, Doctor & Healthcare', icon: '🏥', sampleName: 'BrightSmile Dental Clinic' },
  { value: 'realestate', title: 'Builder, Real Estate & Interior', icon: '🏗️', sampleName: 'Apex Properties & Builders' },
  { value: 'services', title: 'Lawyer, CA & Consulting', icon: '💼', sampleName: 'Vanguard Legal Advisors' },
  { value: 'creator', title: 'Startup, Agency & Portfolio', icon: '🚀', sampleName: 'Nova Digital Studio' },
  { value: 'other', title: 'Other Custom Business', icon: '🌐', sampleName: 'My Custom Business' },
];

export const BUSINESS_GOALS: BusinessGoal[] = [
  { value: 'calls', title: 'Get More Calls & Store Visits', icon: '📞', description: 'Local customers call or navigate via Maps' },
  { value: 'whatsapp-orders', title: 'Receive Orders on WhatsApp', icon: '📲', description: 'Direct WhatsApp checkout & catalog' },
  { value: 'showcase', title: 'Showcase Portfolio & Work', icon: '📸', description: 'Build trust with high quality photos & videos' },
  { value: 'appointments', title: 'Book Client Appointments', icon: '📅', description: 'Patients or clients book available slots' },
  { value: 'ecommerce', title: 'Sell Products Online with UPI', icon: '🛒', description: 'Full storefront with online payments' },
];

export const COLOR_THEMES: ColorTheme[] = [
  { id: 'teal-coral', name: 'Modern Teal & Coral', bg: 'from-teal-600 to-emerald-700', accent: '#E85A3C' },
  { id: 'dark-gold', name: 'Luxury Dark & Gold', bg: 'from-gray-900 to-black', accent: '#F59E0B' },
  { id: 'royal-blue', name: 'Trust Blue & Clean White', bg: 'from-blue-700 to-indigo-900', accent: '#3B82F6' },
  { id: 'fresh-green', name: 'Fresh Green & Earthy', bg: 'from-emerald-700 to-teal-900', accent: '#10B981' },
  { id: 'vibrant-purple', name: 'Vibrant Purple & Pink', bg: 'from-purple-800 to-indigo-950', accent: '#EC4899' },
];

export const PACKAGE_OPTIONS: PackageOption[] = [
  { value: 'express', title: '1-Page Express Site', price: 5000, days: '3 Days', badge: 'Fast Launch' },
  { value: 'standard', title: 'Full Business Website', price: 15000, days: '7 Days', badge: 'Most Popular', popular: true },
  { value: 'store', title: 'E-commerce & Online Store', price: 35000, days: '14 Days', badge: 'Full Online Store' },
];

export const STEPS: StepInfo[] = [
  { id: 1, label: 'Identity & Contact', icon: '👤' },
  { id: 2, label: 'Category & Goals', icon: '🎯' },
  { id: 3, label: 'Features & Package', icon: '⚙️' },
  { id: 4, label: 'Photos & Launch', icon: '🚀' },
];

export const QUICK_NOTE_CHIPS: string[] = [
  '📸 I have product photos ready to upload',
  '📍 Put my shop on Google Maps location',
  '📋 Add my complete price menu & services',
  '💬 Direct WhatsApp order button on phone',
  '🌟 Show Google reviews & customer ratings',
  '🎨 Make my website look ultra modern & fast',
];
