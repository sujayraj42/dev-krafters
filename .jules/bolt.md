## 2026-09-30 - Bulk API Operations vs N+1 Fetch Loops
**Learning:** Performing sequential N+1 HTTP POST requests inside loops for multi-item seeding or insertions causes significant network latency (N roundtrips) and database operational overhead (N `insertOne` calls). Supporting bulk payloads with `insertMany` reduces HTTP requests from N to 1 and database execution overhead by >80%.
**Action:** Always provide array/bulk support in API endpoints that handle entity creation and batch UI actions into a single network payload.
