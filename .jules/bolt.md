## 2026-09-30 - Optimize Array.find lookups inside reduces and renders with Map

**Learning:** Calling `Array.prototype.find()` inside iteration loops (like `Array.prototype.reduce` or JSX `.map()`) results in $O(N \cdot M)$ complexity and unnecessary callback closure allocations on every evaluation. Transforming static arrays into a module-scoped `Map` reduces lookup time from $O(M)$ to $O(1)$, yielding up to ~4x speedups as array size grows.

**Action:** Whenever lookup operations by ID occur inside loop iterations or React render paths, construct a static module-scoped `Map` for constant-time $O(1)$ access.
