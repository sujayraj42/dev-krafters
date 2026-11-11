const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
require('../bootstrap');

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '').trim();
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test('Tier 2: Boundary - Dark Mode & Theme Contrast Ratios (WCAG AAA Verification)', async (t) => {
  const cssPath = path.resolve(__dirname, '../../src/app/globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  const THEMES = [
    {
      name: 'light',
      selector: '[data-theme="light"]',
      expectedBg: '#FFFFFF',
      expectedText: '#0F4C4C',
    },
    {
      name: 'dark',
      selector: '[data-theme="dark"]',
      expectedBg: '#090D16',
      expectedText: '#E2E8F0',
    },
    {
      name: 'copper',
      selector: '[data-theme="copper"]',
      expectedBg: '#FAF5F0',
      expectedText: '#1F110B',
    },
    {
      name: 'emerald',
      selector: '[data-theme="emerald"]',
      expectedBg: '#F0FDF4',
      expectedText: '#022C22',
    },
  ];

  await t.test('All 4 themes declare complete design token palettes in globals.css', () => {
    for (const theme of THEMES) {
      assert.ok(css.includes(theme.selector), `Theme selector ${theme.selector} must be defined in globals.css`);
      assert.ok(css.includes(theme.expectedBg), `Theme ${theme.name} must declare bg ${theme.expectedBg}`);
      assert.ok(css.includes(theme.expectedText), `Theme ${theme.name} must declare text ${theme.expectedText}`);
    }
  });

  await t.test('Every theme satisfies WCAG AAA contrast standard (>= 7.0:1) for primary text on background', () => {
    for (const theme of THEMES) {
      const contrast = calculateContrastRatio(theme.expectedText, theme.expectedBg);
      assert.ok(
        contrast >= 7.0,
        `Theme ${theme.name} contrast ratio ${contrast.toFixed(2)}:1 must meet or exceed WCAG AAA standard (7.0:1)`
      );
    }
  });
});
