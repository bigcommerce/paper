'use strict';

/**
 * LTRAC-633 — Performance benchmark for MF library candidates
 *
 * Strategy (Jairo): measure three costs separately —
 *   1) compile only        — parse/build per iteration; no format / no substitution
 *   2) render only         — compile once per (lib, fixture); timed body is format only
 *   3) compile + render    — both steps every iteration (no reuse of compiled handle)
 *
 * Libraries under test:
 *   Current  — messageformat@0.3.1
 *   C1       — @messageformat/icu-messageformat-1
 *   C2       — intl-messageformat
 *   C3       — icu-minify
 *
 * Fixtures: real strings from Cornerstone theme lang/en.json
 *   https://github.com/bigcommerce/cornerstone/blob/master/lang/en.json
 */

const { Bench } = require('tinybench');
const MessageFormat = require('messageformat');
const { mf1ToMessage } = require('@messageformat/icu-messageformat-1');
const IntlMessageFormat = require('intl-messageformat').default;
const icuCompile = require('icu-minify/compile').default;
const icuFormat = require('icu-minify/format').default;

// Intl factories required by icu-minify/format
const ICU_FORMATTERS = {
    formatters: {
        getPluralRules:    function(l, o) { return new Intl.PluralRules(l, o); },
        getNumberFormat:   function(l, o) { return new Intl.NumberFormat(l, o); },
        getDateTimeFormat: function(l, o) { return new Intl.DateTimeFormat(l, o); },
    },
};

// ---------------------------------------------------------------------------
// Fixtures — real Cornerstone strings
// https://github.com/bigcommerce/cornerstone/blob/master/lang/en.json
// ---------------------------------------------------------------------------
const FIXTURES = [
    {
        name: 'simple {variable}',
        key:  'header.welcome_back',
        str:  'Welcome back, {name}',
        params: { name: 'Joe' },
    },
    {
        name: 'plural one/other',
        key:  'cart.label',
        str:  'Your Cart ({quantity, plural, one {# item} other {# items}})',
        params: { quantity: 3 },
    },
    {
        name: 'plural =0 exact match',
        key:  'cart.items',
        str:  '{NUM, plural, =0{(0 items)} one {(# item)} other {(# items)}}',
        params: { NUM: 0 },
    },
    {
        name: 'plural + variable combo',
        key:  'search.results.count',
        str:  "{ count, plural, one {# result} other {# results} } for '{ search_query }'",
        params: { count: 3, search_query: 'shoes' },
    },
    {
        name: "single quotes around '{var}'",
        key:  'cart.reconfigure_product',
        str:  "Configure '{name}'",
        params: { name: 'Shirt' },
    },
    {
        // Synthetic — no select/gender pattern exists in spec/fixtures/lang.json
        name: 'select (gender)',
        key:  'synthetic.gender',
        str:  '{gender, select, male {He placed} female {She placed} other {They placed}} an order',
        params: { gender: 'female' },
    },
    {
        // Static string with no ICU tokens — baseline / no-op for format step
        name: 'static string (no params)',
        key:  'products.add_to_cart',
        str:  'Add to Cart',
        params: {},
    },
    {
        // Synthetic — messageformat@0.3.1 does not support {date} ICU type;
        // Current is skipped for this fixture (marked via skipLibs).
        name: 'date formatting',
        key:  'synthetic.date',
        str:  'Order placed on {date, date, short}',
        params: { date: new Date('2024-01-15') },
        skipLibs: ['Current (messageformat@0.3.1)'],
    },
    {
        // Error case: missing param. Each lib handles it differently —
        // Current/C3: return "undefined" silently; C1: returns original token;
        // C2: throws at render time. All wrapped in try/catch in the runners.
        name: 'error: missing param',
        key:  'synthetic.missing_param',
        str:  'Welcome back, {name}',
        params: {},
        isErrorFixture: true,
    },
    {
        // Error case: invalid ICU syntax — all libs throw at compile time.
        // render-only is skipped for all libs (skipLibs = all) since precompile
        // always throws and there is no handle to cache.
        name: 'error: invalid syntax',
        key:  'synthetic.invalid_syntax',
        str:  '{count, plural, broken syntax',
        params: { count: 3 },
        isErrorFixture: true,
        skipLibs: [
            'Current (messageformat@0.3.1)',
            'C1 (@messageformat/icu-messageformat-1)',
            'C2 (intl-messageformat)',
            'C3 (icu-minify)',
        ],
    },
];

// Sink for benchmark callback return values. If a result is unused, the engine may
// drop the call (dead code elimination) and skew timings. Assigning here keeps the
// work observable; we never read _benchSink for application logic.
let _benchSink;

// ---------------------------------------------------------------------------
// Library adapters — three steps matching the benchmark strategy:
//   compile(str)       — parse/build only; returns a reusable compiled handle
//   renderOnly(c, p)   — substitute params into an existing handle
//   full(str, p)       — one-shot compile then render (same as render after compile)
// ---------------------------------------------------------------------------
const LIBRARIES = [
    {
        name: 'Current (messageformat@0.3.1)',
        compile: function(str) {
            return new MessageFormat('en').compile(str);
        },
        renderOnly: function(compiled, params) {
            return compiled(params);
        },
        full: function(str, params) {
            return this.renderOnly(this.compile(str), params);
        },
    },
    {
        name: 'C1 (@messageformat/icu-messageformat-1)',
        compile: function(str) {
            return mf1ToMessage('en', str);
        },
        renderOnly: function(compiled, params) {
            return compiled.format(params);
        },
        full: function(str, params) {
            return this.renderOnly(this.compile(str), params);
        },
    },
    {
        name: 'C2 (intl-messageformat)',
        compile: function(str) {
            return new IntlMessageFormat(str, 'en');
        },
        renderOnly: function(compiled, params) {
            return compiled.format(params);
        },
        full: function(str, params) {
            return this.renderOnly(this.compile(str), params);
        },
    },
    {
        name: 'C3 (icu-minify)',
        compile: function(str) {
            return icuCompile(str);
        },
        renderOnly: function(compiled, params) {
            return icuFormat(compiled, 'en', params, ICU_FORMATTERS);
        },
        full: function(str, params) {
            return this.renderOnly(this.compile(str), params);
        },
    },
];

// ---------------------------------------------------------------------------
// tinybench runner shared by compile-only and full-cycle passes: everything timed
// lives in the callback (either compile only or compile+render each iteration).
// ---------------------------------------------------------------------------
async function runBenchmark(bodyFn) {
    const DURATION_MS = 2000;
    const results = [];

    for (const fixture of FIXTURES) {
        for (const lib of LIBRARIES) {
            if (fixture.skipLibs && fixture.skipLibs.includes(lib.name)) {
                results.push({
                    library:   lib.name,
                    fixture:   fixture.name,
                    opsPerSec: 'n/a',
                    meanMs:    'n/a',
                });
                continue;
            }

            const bench = new Bench({ time: DURATION_MS });
            // Error fixtures: wrap body in try/catch so throws are measured too.
            const wrappedBody = fixture.isErrorFixture
                ? function() { try { bodyFn(lib, fixture); } catch(e) { _benchSink = e; } }
                : bodyFn.bind(null, lib, fixture);
            bench.add(`${lib.name} | ${fixture.name}`, wrappedBody);
            await bench.run();

            const task = bench.tasks[0];
            const opsPerSec = task.result.throughput.mean;
            const meanMs    = task.result.latency.mean;

            results.push({
                library:   lib.name,
                fixture:   fixture.name,
                opsPerSec: Math.round(opsPerSec).toLocaleString(),
                meanMs:    meanMs.toFixed(4),
            });
        }
    }

    return results;
}

// Render-only runner: compile once per (lib, fixture) before the timer; timed
// callback is renderOnly only. _benchSink in the callback avoids DCE on the result.
async function runBenchmarkRenderOnly() {
    const DURATION_MS = 2000;
    const results = [];

    for (const fixture of FIXTURES) {
        for (const lib of LIBRARIES) {
            if (fixture.skipLibs && fixture.skipLibs.includes(lib.name)) {
                results.push({
                    library:   lib.name,
                    fixture:   fixture.name,
                    opsPerSec: 'n/a',
                    meanMs:    'n/a',
                });
                continue;
            }

            const compiled = lib.compile(fixture.str);
            const bench = new Bench({ time: DURATION_MS });
            // Error fixtures: some libs throw on render (e.g. C2 on missing param).
            const callback = fixture.isErrorFixture
                ? function() { try { _benchSink = lib.renderOnly(compiled, fixture.params); } catch(e) { _benchSink = e; } }
                : function() { _benchSink = lib.renderOnly(compiled, fixture.params); };
            bench.add(`${lib.name} | ${fixture.name}`, callback);
            await bench.run();

            const task = bench.tasks[0];
            const opsPerSec = task.result.throughput.mean;
            const meanMs    = task.result.latency.mean;

            results.push({
                library:   lib.name,
                fixture:   fixture.name,
                opsPerSec: Math.round(opsPerSec).toLocaleString(),
                meanMs:    meanMs.toFixed(4),
            });
        }
    }

    return results;
}

function printTable(title, results) {
    const libWidth = 45;
    const fixWidth = 35;
    const opsWidth = 15;
    const msWidth  = 12;

    const header =
        'Library'.padEnd(libWidth) +
        'Fixture'.padEnd(fixWidth) +
        'ops/sec'.padStart(opsWidth) +
        'mean (ms)'.padStart(msWidth);

    const divider = '-'.repeat(libWidth + fixWidth + opsWidth + msWidth);

    console.log('');
    console.log(title);
    console.log(divider);
    console.log(header);
    console.log(divider);

    let lastFixture = '';
    for (const r of results) {
        if (r.fixture !== lastFixture) {
            if (lastFixture !== '') {
                console.log('');
            }
            lastFixture = r.fixture;
        }
        const row =
            r.library.padEnd(libWidth) +
            r.fixture.padEnd(fixWidth) +
            r.opsPerSec.padStart(opsWidth) +
            r.meanMs.padStart(msWidth);
        console.log(row);
    }

    console.log(divider);
}

async function run() {
    console.log('Running benchmarks (2s per case)...\n');

    // 1) Compile on every iteration; no parameter substitution.
    const resultsCompileOnly = await runBenchmark(function(lib, fixture) {
        _benchSink = lib.compile(fixture.str);
    });

    // 2) Compile outside the timer; timed loop is render only (see runBenchmarkRenderOnly).
    const resultsRenderOnly = await runBenchmarkRenderOnly();

    // 3) Full cycle each iteration: compile then render again every time.
    // Assign to _benchSink so the engine does not drop the whole call as unused.
    const resultsCompileAndRender = await runBenchmark(function(lib, fixture) {
        _benchSink = lib.full(fixture.str, fixture.params);
    });

    printTable(
        'compile only — parse/build per iteration (no substitution)',
        resultsCompileOnly,
    );
    printTable(
        'render only — compile once per case; timed: format / substitution only',
        resultsRenderOnly,
    );
    printTable(
        'compile + render — full cycle every iteration (fresh compile each time)',
        resultsCompileAndRender,
    );

    // Satisfy no-unused-vars after many assignments inside benchmark callbacks.
    void _benchSink;

    console.log('\nDone.');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
