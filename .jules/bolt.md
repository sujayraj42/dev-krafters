## 2026-08-14 - In-Place Boundary Checking for Chronological Rate-Limit Cleanup

**Learning:** Array `.filter()` inside high-frequency or batch cleanup routines allocates new array objects and invokes callback functions per element on every pass. When stored data (e.g. request timestamps) is naturally ordered monotonically, array boundary checks (`array[0]` and `array[len - 1]`) combined with binary search (`O(log N)`) allow identifying expired ranges without allocating memory. In-place array mutation (`splice(0, index)` or `length = 0`) avoids object recreation and garbage collection overhead.

**Action:** Whenever pruning strictly sorted temporal data (such as rate limits, metrics windows, or event queues), use boundary comparison to handle full-retention or full-expiration cases in O(1) time, and use binary search plus in-place mutation for mixed cases rather than `.filter()`.
