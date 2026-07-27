'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input, Select, Textarea } from '@/components/FormControls';
import { Checkbox, Radio } from '@/components/CheckboxRadio';
import { Badge } from '@/components/Badge';
import { Alert } from '@/components/Alert';
import { Modal } from '@/components/Modal';
import { Toggle } from '@/components/Toggle';
import { Tabs } from '@/components/Tabs';
import { Sparkles, Star, Layers } from 'lucide-react';

export default function ComponentsShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleState, setToggleState] = useState(true);
  const [activeTab, setActiveTab] = useState('buttons');

  const [alertDismissed, setAlertDismissed] = useState(false);

  const tabItems = [
    {
      id: 'buttons',
      label: '1. Buttons',
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-heading font-semibold text-sm text-muted uppercase tracking-wider">
              Primary, Secondary & Ghost Variants
            </h4>
            <div className="flex flex-wrap items-center gap-4 p-6 bg-surface-alt rounded-card border border-gray-100">
              <Button variant="primary">Primary Accent</Button>
              <Button variant="secondary">Secondary Outline</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="primary" disabled>
                Disabled Button
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-heading font-semibold text-sm text-muted uppercase tracking-wider">
              Button Sizes (Small, Medium, Large)
            </h4>
            <div className="flex flex-wrap items-center gap-4 p-6 bg-surface-alt rounded-card border border-gray-100">
              <Button size="sm">Small (sm)</Button>
              <Button size="md">Medium (md)</Button>
              <Button size="lg">Large (lg)</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'cards',
      label: '2. Cards',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Card */}
          <div className="space-y-2">
            <h4 className="font-heading font-semibold text-xs text-muted uppercase">Basic Card</h4>
            <Card variant="default">
              <h4 className="font-heading font-bold text-lg text-primary mb-2">Basic Content Card</h4>
              <p className="font-body text-xs text-muted leading-relaxed">
                Standard card with white background, rounded corners (12px), and subtle shadow.
              </p>
            </Card>
          </div>

          {/* Highlighted Pricing Card */}
          <div className="space-y-2">
            <h4 className="font-heading font-semibold text-xs text-muted uppercase">Highlighted Card</h4>
            <Card variant="highlighted">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-bold text-lg text-primary">Business Plan</h4>
                <Badge variant="accent">Popular</Badge>
              </div>
              <p className="font-heading font-bold text-xl text-accent">₹25,000</p>
            </Card>
          </div>

          {/* Testimonial Card */}
          <div className="space-y-2">
            <h4 className="font-heading font-semibold text-xs text-muted uppercase">Testimonial Card</h4>
            <Card variant="alt">
              <div className="flex text-amber-400 gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="font-body text-xs text-primary italic mb-3">
                &ldquo;Dev Krafters built our site in 4 days!&rdquo;
              </p>
              <p className="font-heading font-semibold text-xs text-primary">— Priya S., Salon Owner</p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'forms',
      label: '3. Form Inputs',
      content: (
        <div className="max-w-xl space-y-6 bg-surface-alt p-6 rounded-card border border-gray-100">
          <Input label="Text Input" placeholder="Type something..." helperText="Standard text input field" />
          <Select
            label="Dropdown Select"
            options={[
              { value: '1', label: 'Option One' },
              { value: '2', label: 'Option Two' },
            ]}
          />
          <Textarea label="Textarea" placeholder="Multiline input area..." rows={3} />
          <div className="flex items-center gap-6 pt-2">
            <Checkbox label="Remember me" />
            <Radio label="Radio Option A" name="demo-radio" defaultChecked />
            <Radio label="Radio Option B" name="demo-radio" />
          </div>
        </div>
      ),
    },
    {
      id: 'overlays',
      label: '4. Alerts, Badges & Overlays',
      content: (
        <div className="space-y-6">
          {/* Badges */}
          <div className="space-y-2">
            <h4 className="font-heading font-semibold text-sm text-muted uppercase tracking-wider">
              Status Badges & Pills
            </h4>
            <div className="flex flex-wrap items-center gap-3 p-4 bg-surface-alt rounded-card">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="accent">New</Badge>
              <Badge variant="emerald">Popular</Badge>
              <Badge variant="amber">In Progress</Badge>
              <Badge variant="muted">Archived</Badge>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-sm text-muted uppercase tracking-wider">
              Alert Notifications
            </h4>
            <Alert type="success" title="Success Alert">
              Your changes have been saved successfully.
            </Alert>

            {!alertDismissed && (
              <Alert
                type="error"
                title="Error Alert"
                onClose={() => setAlertDismissed(true)}
              >
                Dismissible error alert — click X to close.
              </Alert>
            )}

            <Alert type="info" title="Information Alert">
              System maintenance scheduled for midnight.
            </Alert>
            <Alert type="warning" title="Warning Alert">
              Please check your input values before proceeding.
            </Alert>
          </div>

          {/* Interactive Modal & Toggle */}
          <div className="p-6 bg-surface-alt rounded-card border border-gray-100 flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-base text-primary">Interactive Controls</h4>
              <p className="font-body text-xs text-muted">Test modal overlays & switch state</p>
            </div>

            <div className="flex items-center gap-6">
              <Toggle
                checked={toggleState}
                onChange={setToggleState}
                label={`Switch is ${toggleState ? 'ON' : 'OFF'}`}
              />

              <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO (SURFACE-ALT BG) */}
      <section className="bg-surface-alt py-16 sm:py-24">
        <div className="max-w-content mx-auto px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Living UI System & Style Guide</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-primary tracking-tight">
            UI Components Showcase
          </h1>
          <p className="font-body text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Every reusable button, card, form input, badge, alert, and overlay built into Dev Krafters.
          </p>
        </div>
      </section>

      {/* SECTION 2: SHOWCASE TABS (WHITE BG) */}
      <section className="py-20 bg-white">
        <div className="max-w-content mx-auto px-6">
          <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </section>

      {/* DEMO MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Interactive Modal Showcase"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Confirm Action
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="font-body text-sm text-primary">
            This is a clean, accessible overlay dialog component with background backdrop blur, ESC key dismiss, and close button trigger.
          </p>
          <div className="p-3 bg-surface-alt rounded-lg border border-gray-100 text-xs text-muted">
            <Sparkles className="w-4 h-4 text-accent inline mr-1" />
            Reusable across quote popups, lead triggers, or confirmations.
          </div>
        </div>
      </Modal>
    </div>
  );
}
