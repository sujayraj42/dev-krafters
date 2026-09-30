## 2025-09-30 - Optimize Feature Lookup inside Map Callback
**Learning:** Performing `Array.prototype.find()` inside an `.map()` iteration results in an O(N * M) linear search anti-pattern. Pre-computing a static `Record` lookup object reduces lookups to O(1) constant time.
**Action:** Always pre-index static reference arrays into constant-time lookup maps/records when performing lookups inside map, filter, or loop callbacks.
