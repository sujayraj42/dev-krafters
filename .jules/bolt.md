## 2026-09-30 - O(1) Catalog Map Lookup & Memoization in Components Showcase

**Learning:** Reducing over arrays with nested `.find()` searches on every render creates unnecessary O(N*M) CPU overhead. Extracting static catalogs outside component render scope, building an O(1) `Map` lookup, and memoizing `reduce` with `useMemo` avoids redundant iterations and allocations.

**Action:** Whenever calculating derived state from catalog/array items inside render, define static lookup maps outside the component and wrap calculated results in `useMemo`.
