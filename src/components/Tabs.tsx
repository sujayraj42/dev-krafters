'use client';

import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tab Nav List */}
      <div className="flex border-b border-gray-200 overflow-x-auto" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`px-5 py-3 font-heading font-semibold text-sm transition-colors relative whitespace-nowrap focus-ring rounded-t-lg ${
                isActive
                  ? 'text-accent border-b-2 border-accent font-bold'
                  : 'text-muted hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div role="tabpanel" className="animate-in fade-in duration-150">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
};
