import { performance } from 'perf_hooks';

const toolCatalog = [
  { id: 'whatsapp', cost: 0 },
  { id: 'maps', cost: 0 },
  { id: 'reviews', cost: 0 },
  { id: 'form', cost: 0 },
  { id: 'booking', cost: 499 },
  { id: 'calculator', cost: 999 },
  { id: 'theme', cost: 299 },
  { id: 'marquee', cost: 199 },
];

const selectedTools = ['whatsapp', 'maps', 'reviews', 'form', 'booking', 'calculator', 'theme', 'marquee'];

// Baseline
function baselineCalc(selected: string[]) {
  return selected.reduce((acc, id) => {
    const item = toolCatalog.find((t) => t.id === id);
    return acc + (item ? item.cost : 0);
  }, 1499);
}

// Optimized
const TOOL_COST_MAP = new Map(toolCatalog.map((t) => [t.id, t.cost]));

function optimizedCalc(selected: string[]) {
  return selected.reduce((acc, id) => {
    return acc + (TOOL_COST_MAP.get(id) ?? 0);
  }, 1499);
}

const ITERATIONS = 1_000_000;

// Warmup
for (let i = 0; i < 10_000; i++) {
  baselineCalc(selectedTools);
  optimizedCalc(selectedTools);
}

// Measure Baseline
const startBaseline = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  baselineCalc(selectedTools);
}
const baselineTime = performance.now() - startBaseline;

// Measure Optimized
const startOptimized = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  optimizedCalc(selectedTools);
}
const optimizedTime = performance.now() - startOptimized;

console.log(`Baseline (O(N*M)): ${baselineTime.toFixed(2)} ms`);
console.log(`Optimized (O(N) with O(1) lookup): ${optimizedTime.toFixed(2)} ms`);
console.log(`Speedup: ${(baselineTime / optimizedTime).toFixed(2)}x faster`);
