'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MapPin, Camera, FileText, Star, QrCode } from 'lucide-react';
import { BusinessCategory, BusinessGoal, ColorTheme, PackageOption } from '../types';

interface LivePhonePreviewProps {
  currentThemeObj: ColorTheme;
  currentCategoryObj: BusinessCategory;
  currentGoalObj: BusinessGoal;
  currentPkgObj: PackageOption;
  businessName: string;
  ownerName: string;
  city: string;
  selectedFeatures: string[];
}

export function LivePhonePreview({
  currentThemeObj,
  currentCategoryObj,
  currentGoalObj,
  currentPkgObj,
  businessName,
  ownerName,
  city,
  selectedFeatures,
}: LivePhonePreviewProps) {
  return (
    <div className="lg:col-span-5 sticky top-24">
      <div className="bg-gray-950 p-4 rounded-[2.5rem] border-4 border-gray-800 shadow-2xl max-w-sm mx-auto">
        <div className="bg-surface-alt rounded-[2rem] overflow-hidden text-gray-900 font-body relative border border-gray-800 space-y-3 pb-6">
          {/* Phone Header Bar */}
          <div className="bg-primary text-white px-4 py-2 flex items-center justify-between text-[10px] font-mono">
            <span>9:41 AM</span>
            <span className="font-bold">DEV KRAFTERS LIVE PREVIEW</span>
            <span>100% 🔋</span>
          </div>

          {/* Dynamic Business Header with Theme Gradient */}
          <div className={`px-4 py-5 bg-gradient-to-r ${currentThemeObj.bg} text-white text-center space-y-1 relative shadow-md`}>
            <span className="text-3xl block">{currentCategoryObj.icon}</span>
            <h3 className="font-heading font-extrabold text-base leading-tight">
              {businessName.trim() || currentCategoryObj.sampleName}
            </h3>
            {ownerName && (
              <span className="text-[10px] text-white/80 block">
                Owner: {ownerName} {city ? `• ${city}` : ''}
              </span>
            )}
            <div className="pt-1 flex items-center justify-center gap-1">
              <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {currentCategoryObj.title}
              </span>
              <span className="text-[9px] bg-accent text-white px-2 py-0.5 rounded-full font-bold">
                {currentGoalObj.title}
              </span>
            </div>
          </div>

          {/* Dynamic Feature List */}
          <div className="px-4 space-y-2.5">
            <span className="text-[10px] font-heading font-bold text-muted uppercase tracking-wider block text-center">
              Installed Features ({selectedFeatures.length}):
            </span>

            <div className="space-y-1.5">
              {selectedFeatures.includes('whatsapp') && (
                <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-heading font-bold text-xs flex items-center justify-between shadow-xs">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={14} /> WhatsApp Order / Inquiry
                  </span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>
                </div>
              )}

              {selectedFeatures.includes('maps') && (
                <div className="p-2 rounded-xl bg-white border border-gray-200 text-xs flex items-center justify-between text-primary font-semibold">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-accent" /> Google Maps Directions
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold">{city || 'Location'}</span>
                </div>
              )}

              {selectedFeatures.includes('gallery') && (
                <div className="p-2 rounded-xl bg-white border border-gray-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-muted flex items-center gap-1">
                    <Camera size={12} /> Work & Photo Showcase
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {['✨', '✨', '✨', '✨'].map((p, i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedFeatures.includes('pricelist') && (
                <div className="p-2 rounded-xl bg-white border border-gray-200 text-[11px] flex items-center justify-between">
                  <span className="font-bold text-primary flex items-center gap-1">
                    <FileText size={12} /> Services & Rate List
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Visible</span>
                </div>
              )}

              {selectedFeatures.includes('reviews') && (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] flex items-center justify-between text-amber-900 font-semibold">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-500 text-amber-500" /> 4.9 ★ Google Reviews
                  </span>
                  <span className="text-[9px] font-bold text-amber-700">120+ Reviews</span>
                </div>
              )}

              {selectedFeatures.includes('upi') && (
                <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-[11px] flex items-center justify-between text-purple-900 font-semibold">
                  <span className="flex items-center gap-1">
                    <QrCode size={12} /> Online Payments & UPI QR
                  </span>
                  <span className="text-[9px] font-bold text-purple-700">Instant</span>
                </div>
              )}
            </div>

            {/* Calculated Price Badge */}
            <div className="pt-2 border-t border-gray-200 text-center space-y-1">
              <span className="text-[10px] text-muted block">Live Calculated Price</span>
              <span className="font-heading font-extrabold text-xl text-accent block">
                ₹{currentPkgObj.price.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                Ready in {currentPkgObj.days}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
