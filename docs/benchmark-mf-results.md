# MessageFormat Library Benchmark — Results & Conclusions

**Ticket:** LTRAC-633  
**Script:** `npm run benchmark:mf` (`scripts/benchmark-mf.js`)  
**Duration per case:** 2 s (tinybench)

---

## What are we measuring and why?

When a page is rendered, every translation string (e.g. `{{lang 'cart.label' quantity=3}}`) goes through two steps:

1. **Compile** — the library reads the ICU string, understands its structure (variables, plural rules, etc.) and produces a ready-to-use function/object.
2. **Render** — the compiled function is called with actual values (`{quantity: 3}`) to produce the final translated string.

In the current implementation the compiled result is **cached within one request**: the first call to a key triggers compile + render; all subsequent calls to the same key within that request do render only. Between requests the cache is reset.

Both scenarios are therefore relevant:
- **Compile + render** — first call to any key (most common case, happens for every key on every request).
- **Render only** — repeated call to the same key on the same page (e.g. a product list showing the same label many times).

**Compile only** is also measured in isolation to identify where the cost sits.

An additional scenario matters for **CF Worker (stencil-renderer-worker)**: there is a technical possibility to compile translations at theme deploy time, leaving only render in the runtime hot path (if such a pipeline is implemented). For that scenario **render only** is the key test.

---

## Libraries under test

| Label | Package | Notes |
|-------|---------|-------|
| **Current** | `messageformat@0.3.1` | Currently in production |
| **C1** | `@messageformat/icu-messageformat-1@0.12.0` | Candidate |
| **C2** | `intl-messageformat@11.2.4` | Candidate |
| **C3** | `icu-minify@4.11.0` | Candidate |

---

## Fixtures

Real ICU strings from the Cornerstone theme (`spec/fixtures/lang.json`) plus synthetic patterns not present in the repo:

| # | Name | ICU string |
|---|------|------------|
| 1 | simple `{variable}` | `Welcome back, {name}` |
| 2 | plural one/other | `Your Cart ({quantity, plural, one {# item} other {# items}})` |
| 3 | plural `=0` exact match | `{NUM, plural, =0{(0 items)} one {(# item)} other {(# items)}}` |
| 4 | plural + variable combo | `{ count, plural, one {# result} other {# results} } for '{ search_query }'` |
| 5 | single quotes around `'{var}'` | `Configure '{name}'` |
| 6 | select (gender) ¹ | `{gender, select, male {He placed} female {She placed} other {They placed}} an order` |
| 7 | static string (no params) | `Add to Cart` |
| 8 | date formatting ¹ | `Order placed on {date, date, short}` — Current does not support this ICU type → `n/a` |
| 9 | error: missing param ¹ | Same string as #1, called without params — tests graceful degradation |
| 10 | error: invalid syntax ¹ | `{count, plural, broken syntax` — all libs throw at compile → `n/a` everywhere |

¹ Synthetic — not found in existing lang files.

---

## Results

### Compile only (ops/sec — higher is better)

First isolated cost: how fast can each library parse and build the ICU string?

| Fixture | Current | C1 | C2 | C3 |
|---------|--------:|---:|---:|---:|
| simple `{variable}` | 422,486 | 240,978 | 355,038 | **2,048,377** |
| plural one/other | 108,600 | 136,695 | 225,300 | **501,471** |
| plural `=0` | 94,611 | 126,482 | 201,607 | **402,411** |
| plural + variable | 96,938 | 130,967 | 207,287 | **468,209** |
| single quotes | 391,267 | 240,488 | 353,007 | **2,758,617** |
| select (gender) | 92,824 | 126,874 | 197,421 | **388,255** |
| static string | 493,343 | 244,443 | 367,264 | **3,695,106** |
| date formatting | n/a | 201,648 | 305,243 | **1,227,201** |
| error: missing param | 426,873 | 232,792 | 339,080 | **1,970,609** |
| error: invalid syntax | n/a | n/a | n/a | n/a |

### Render only (ops/sec — higher is better)

Second isolated cost: how fast is substitution when the compiled handle is already cached?

| Fixture | Current | C1 | C2 | C3 |
|---------|--------:|---:|---:|---:|
| simple `{variable}` | **24,441,262** | 6,342,935 | 9,894,910 | 18,137,069 |
| plural one/other | **9,619,537** | 40,444 | 708,990 | 57,088 |
| plural `=0` | **22,020,454** | 191,771 | 9,910,454 | 8,068,283 |
| plural + variable | **8,498,484** | 41,431 | 741,855 | 58,389 |
| single quotes | **25,808,895** | 19,102,700 | 26,477,022 | 24,146,816 |
| select (gender) | **23,244,980** | 2,268,634 | 7,983,345 | 11,992,048 |
| static string | 24,099,949 | 19,839,508 | **26,392,706** | 24,436,844 |
| date formatting | n/a | 29,235 | **697,159** | 38,117 |
| error: missing param | **24,152,192** | 193,388 | 121,895 | 15,959,897 |
| error: invalid syntax | n/a | n/a | n/a | n/a |

### Compile + render — full cycle (ops/sec — higher is better)

Most common scenario: compile and render happen together on the first call to each key.

| Fixture | Current | C1 | C2 | C3 |
|---------|--------:|---:|---:|---:|
| simple `{variable}` | 425,347 | 218,699 | 318,975 | **1,692,534** |
| plural one/other | **111,280** | 30,257 | 40,675 | 49,594 |
| plural `=0` | 96,507 | 71,600 | 194,415 | **392,961** |
| plural + variable | **105,466** | 29,936 | 40,221 | 49,346 |
| single quotes | 399,493 | 237,251 | 345,523 | **2,571,788** |
| select (gender) | 94,762 | 123,531 | 192,017 | **402,709** |
| static string | 519,510 | 251,597 | 363,740 | **3,482,812** |
| date formatting | n/a | 24,209 | 32,266 | **36,407** |
| error: missing param | 425,347 | 92,215 | 112,957 | **1,680,949** |
| error: invalid syntax | n/a | n/a | n/a | n/a |

---

## Error handling behavior

How each library behaves when something goes wrong — independent of performance:

| Scenario | Current | C1 | C2 | C3 |
|----------|---------|----|----|-----|
| Missing param (`{name}` called without `name`) | Silently returns `"…undefined"` | Returns raw token `{$name}` — visible in UI | **Throws exception** — fail-fast | Silently returns `"…undefined"` |
| Invalid ICU syntax | Throws at compile | Throws at compile | Throws at compile | Throws at compile |

---

## Conclusions

### Compile speed

**C3 is the fastest to compile** across all fixture types — 4–7× faster than Current on simple strings, 4–5× on plural and select. **C2 is second** — consistently faster than Current on plural, select, and date. Current is competitive only on simple variable substitution.

### Render speed (when compile is cached)

**Current dominates** on every supported fixture:
- Plural: **230× faster than C1**, **13× faster than C2**, **165× faster than C3**.
- Select: **10× faster than C3**, **3× faster than C2**.
- Simple strings and static text: gap is smaller but Current still leads.

**C1 and C3 have a significant render bottleneck on plural** (~40–58k ops/sec vs ~9.6M for Current). **C2 is the closest alternative**: ~720k ops/sec on plural (13× behind Current, but 17× ahead of C1 and 12× ahead of C3).

### Compile + render (most common scenario)

**C3 wins** on simple strings, static text, select, and single quotes — its very cheap compile compensates for slower render on non-plural patterns. **Current wins on plural** even with compile in the loop. **C2 is the best alternative on plural** in the full cycle (~40k vs ~111k for Current).

### Date support

**Current does not support the `{date, date, short}` ICU type at all.** Among candidates: C3 compiles date fastest; C2 renders date fastest (~700k ops/sec vs ~38k for C1/C3).

### Missing param behavior

Current and C3 **silently return `undefined`** — production bugs are invisible. C1 returns the raw token visible in the UI. **C2 throws an exception** — strictest validation, requires error handling in the caller wrapper.

---

## Summary — winner per scenario

| Fixture | Compile only | Render only | Full cycle |
|---------|:---:|:---:|:---:|
| simple `{variable}` | C3 | Current | C3 |
| plural one/other | C3 | Current | Current |
| plural `=0` | C3 | Current | C3 |
| plural + variable | C3 | Current | Current |
| single quotes | C3 | Current ≈ C2 | C3 |
| select (gender) | C3 | Current | C3 |
| static string | C3 | Current ≈ all | C3 |
| date formatting | C3 | C2 | C3 |

---

## Final candidates: C2 vs C3

**C1 is eliminated** due to critical plural regression: ~40k ops/sec on render-only and ~30k on full cycle — 230× slower than Current on render and 3.7× on full cycle.

| | C2 | C3 |
|-|----|----|
| Compile speed | ⚠️ Average | ✅ Fastest |
| Render plural (repeated calls) | ✅ ~720k (best among candidates) | ❌ ~58k |
| Full cycle plural | ⚠️ ~40k | ⚠️ ~50k |
| Full cycle simple strings | ⚠️ ~320k | ✅ ~1.7M |
| Date ICU support | ✅ | ✅ |
| `translator.js` wrapper changes needed | Minimal | Required (single quotes, missing param, error messages) |

**C2** — if priority is render plural (repeated calls to the same key on one page).  
**C3** — if priority is compile speed and the workload is mostly simple/static strings.

**Recommendation:** given that CF Worker with possible pre-compile is the priority direction for this migration — **C2 is the recommended library**. For SFR-2 where compile happens at runtime, C3 is faster in the full cycle, but that scenario is not the priority for the current migration.

---

## Full Cornerstone translation file benchmark

**Script:** `scripts/benchmark-mf-cornerstone.js`  
**File:** `scripts/cornerstone-en.json` (real Cornerstone theme `lang/en.json`)  
**File size:** 778 strings  
**One iteration = processing all 778 strings** — closest to a real full-page render cycle.

### Methodology

Instead of individual fixtures, each library is run over **all strings in the file** in a single pass. This gives a realistic picture of performance on mixed content: simple strings, plural, variables, select — all together.

### Results (ops/sec — higher is better)

| Library | Compile only | Render only | Compile + render |
|---------|-------------:|------------:|----------------:|
| **Current** | 438 | **108,502** | 428 |
| C1 | 307 | 841 | 214 |
| C2 | 400 | 12,689 | 334 |
| **C3** | **2,396** | 3,047 | **1,240** |

**mean (ms) per full-file pass:**

| Library | Compile only | Render only | Compile + render |
|---------|-------------:|------------:|----------------:|
| Current | 2.314 ms | **0.010 ms** | 2.347 ms |
| C1 | 3.267 ms | 1.261 ms | 4.729 ms |
| C2 | 2.659 ms | 0.082 ms | 3.195 ms |
| **C3** | **0.545 ms** | 0.339 ms | **0.924 ms** |

### Full-file conclusions

**Compile all strings:**  
C3 compiles 778 strings in **0.54 ms** — **4.2×** faster than Current (2.31 ms) and **4.9×** faster than C2. Cold-start / first request with C3 is substantially faster.

**Render all strings (compile cached):**  
Current renders the whole file in **0.01 ms** — **8.5×** faster than C2, **34×** faster than C3. This confirms Current is untouchable on the hot render path. However this scenario only applies when the same key appears multiple times on the same page.

**Compile + render (typical scenario — first call per key):**  
C3 processes the whole file in **0.92 ms** vs **2.35 ms** for Current — **2.5× faster**. C2 at 3.19 ms is slightly slower than Current. For pages where each key appears once, C3 gives a real throughput gain.

### C2 vs C3 on the real file

| Scenario | C2 | C3 | Winner |
|----------|---:|---:|:---:|
| Compile whole file | 2.66 ms | **0.54 ms** | C3 (4.9×) |
| Render whole file | **0.08 ms** | 0.34 ms | C2 (4.2×) |
| Compile + render (typical) | 3.19 ms | **0.92 ms** | C3 (3.5×) |

C3 wins on compile and full cycle on the real file. C2 wins on render-only — the priority scenario for CF Worker, where there is a technical possibility to compile translations at theme deploy time and execute only render at runtime (if such a pipeline is implemented).
