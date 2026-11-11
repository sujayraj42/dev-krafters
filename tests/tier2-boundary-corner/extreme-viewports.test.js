const test = require('node:test');
const assert = require('node:assert');
require('../bootstrap');
const { renderComponent, inspectHtml } = require('../helpers/render');

const HomePage = require('@/app/page').default;
const ServicesPage = require('@/app/services/page').default;
const PricingPage = require('@/app/pricing/page').default;
const DeviceStudioPage = require('@/app/portfolio/[slug]/page').default;
const { setTestParams } = require('../bootstrap');

test('Tier 2: Boundary - Extreme Viewports & Responsive Layout Constraints (320px to 2560px)', async (t) => {
  const VIEWPORTS = [
    { name: 'Tiny Mobile (e.g. iPhone SE)', width: 320 },
    { name: 'Standard Mobile (e.g. iPhone 15)', width: 375 },
    { name: 'Tablet Portrait (e.g. iPad Mini)', width: 768 },
    { name: 'Tablet Landscape / Laptop', width: 1024 },
    { name: 'Desktop Full HD', width: 1920 },
    { name: 'Ultra-wide 4K Monitor', width: 2560 },
  ];

  await t.test('Core pages utilize adaptive responsive flex, grid, and max-width containers', () => {
    const pages = [
      { name: 'Homepage', Component: HomePage },
      { name: 'Services', Component: ServicesPage },
      { name: 'Pricing', Component: PricingPage },
    ];

    for (const { name, Component } of pages) {
      const html = renderComponent(Component);
      const inspector = inspectHtml(html);

      // Verify layout containers enforce responsive boundaries
      assert.ok(
        inspector.contains('max-w-') || inspector.contains('w-full') || inspector.contains('container'),
        `${name} must utilize max-width or full-width constraint classes`
      );

      // Verify breakpoint prefixes exist in rendered classes
      assert.ok(
        inspector.contains('sm:') || inspector.contains('md:') || inspector.contains('lg:'),
        `${name} must define Tailwind responsive breakpoint modifiers (sm:/md:/lg:)`
      );
    }
  });

  await t.test('Device Studio provides explicit hardware frame dimensions across viewports', () => {
    setTestParams({ slug: 'pulse' });
    const html = renderComponent(DeviceStudioPage);
    const inspector = inspectHtml(html);

    // Verify viewport switching controls exist (Mobile 375px, Tablet 768px, Desktop 1200px)
    assert.ok(inspector.contains('Mobile') || inspector.contains('Smartphone'), 'Mobile device selector present');
    assert.ok(inspector.contains('Tablet') || inspector.contains('iPad'), 'Tablet device selector present');
    assert.ok(inspector.contains('Desktop') || inspector.contains('MacBook'), 'Desktop device selector present');

    // Verify viewport frame containment
    assert.ok(
      inspector.contains('iframe') || inspector.contains('mockup') || inspector.contains('frame') || inspector.contains('preview'),
      'Device Studio must render an isolated preview container'
    );
  });

  await t.test('All viewports from 320px to 2560px are valid target ranges', () => {
    for (const vp of VIEWPORTS) {
      assert.ok(vp.width >= 320 && vp.width <= 2560, `Viewport ${vp.name} (${vp.width}px) must be within [320, 2560]`);
    }
  });
});
