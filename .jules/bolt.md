## 2026-09-30 - Optimize Array Lookups in React Component Reductions
**Learning:** Performing linear searches (`Array.prototype.find`) inside iterative functions like `reduce` or `map` in React component renders introduces O(N*M) time complexity. Converting static lookup arrays to module-level `Map` objects reduces lookup overhead to O(1) time complexity (O(M) total).
**Action:** Always construct a top-level `Map` or `Set` for static lookup collections instead of calling `.find()` inside `reduce()`, `filter()`, or `map()` iterations.
