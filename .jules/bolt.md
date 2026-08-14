## 2026-08-14 - O(N*M) Category Filtering in Portfolio Page Render Loop
**Learning:** Precomputing category counts at module load time for static datasets replaces O(N*M) array filter passes during render passes with O(1) object lookups.
**Action:** Always precompute aggregate counts or metadata for static collections outside render components or at module level rather than calling `.filter()` repeatedly inside render loops.
