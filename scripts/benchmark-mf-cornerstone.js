'use strict';

/**
 * LTRAC-633 — Cornerstone full lang/en.json benchmark
 *
 * Measures how long each library takes to process the entire Cornerstone
 * translation file (all ~778 strings) in three scenarios:
 *
 *   1) compile only  — parse/build every string, no format call
 *   2) render only   — all strings pre-compiled; timed body is format only
 *   3) compile+render — compile and render every string each iteration
 *
 * "One iteration" = processing ALL strings in the file once, simulating
 * a full page render cycle.
 */

const { Bench } = require('tinybench');
const MessageFormat = require('messageformat');
const { mf1ToMessage } = require('@messageformat/icu-messageformat-1');
const IntlMessageFormat = require('intl-messageformat').default;
const icuCompile = require('icu-minify/compile').default;
const icuFormat = require('icu-minify/format').default;

const ICU_FORMATTERS = {
    formatters: {
        getPluralRules:    (l, o) => new Intl.PluralRules(l, o),
        getNumberFormat:   (l, o) => new Intl.NumberFormat(l, o),
        getDateTimeFormat: (l, o) => new Intl.DateTimeFormat(l, o),
    },
};

// ---------------------------------------------------------------------------
// Load and flatten Cornerstone en.json
// ---------------------------------------------------------------------------
const raw = require('./cornerstone-en.json');

function flatten(obj, prefix) {
    const out = [];
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof val === 'string') {
            out.push({ key: fullKey, str: val });
        } else if (typeof val === 'object' && val !== null) {
            out.push(...flatten(val, fullKey));
        }
    }
    return out;
}

const ALL_STRINGS = flatten(raw, '');

// Generic params that cover every variable name used in Cornerstone strings.
const PARAMS = {
    name: 'Joe', phone_number: '+1 234 567 8900',
    quantity: 3, NUM: 5, num_products: 3, number: 5,
    products: 3, total: 10, current: 1, CODE: 'USD', code: 'USD',
    credit: '$50', store_credit: '$50', store_name: 'My Store',
    limit: 5, store: 'My Store', min: 1, max: 10,
    days: 3, discount: '10%', id: 123, date: '2024-01-15',
    from: '$10', to: '$50', category: 'Electronics',
    rating: 4, title: 'Filters', street: '123 Main St',
    city: 'New York', state: 'NY', zip: '10001', country: 'US',
    card: '4242', last_four: '4242', month: '01', year: '25',
    qty: 2, num_new_messages: 3, num_wishlists: 2,
    shopPath: '/shop', cart_url: '/cart', email: 'user@example.com',
    index: 1, url: 'http://example.com', count: 5,
    search_query: 'shoes', limitTo: 1, limitFrom: 100,
    amount: '$10', tax_label: 'VAT', swatch_name: 'Blue',
    rating_target: 'Product', current_rating: 4, max_rating: 5,
    slide_number: 1, certificate_name: 'My Certificate',
    cost: '$99', cost_total: '$99', num_products_total: 3,
    gender: 'other',
};

// Sink prevents dead-code elimination in tight loops.
let _benchSink;

// ---------------------------------------------------------------------------
// Library adapters
// ---------------------------------------------------------------------------
const LIBRARIES = [
    {
        name: 'Current (messageformat@0.3.1)',
        compile: (str) => new MessageFormat('en').compile(str),
        renderOnly: (compiled, params) => compiled(params),
        full: function(str, params) { return this.renderOnly(this.compile(str), params); },
    },
    {
        name: 'C1 (@messageformat/icu-messageformat-1)',
        compile: (str) => mf1ToMessage('en', str),
        renderOnly: (compiled, params) => compiled.format(params),
        full: function(str, params) { return this.renderOnly(this.compile(str), params); },
    },
    {
        name: 'C2 (intl-messageformat)',
        compile: (str) => new IntlMessageFormat(str, 'en'),
        renderOnly: (compiled, params) => compiled.format(params),
        full: function(str, params) { return this.renderOnly(this.compile(str), params); },
    },
    {
        name: 'C3 (icu-minify)',
        compile: (str) => icuCompile(str),
        renderOnly: (compiled, params) => icuFormat(compiled, 'en', params, ICU_FORMATTERS),
        full: function(str, params) { return this.renderOnly(this.compile(str), params); },
    },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function safeCompile(lib, str) {
    try { return lib.compile(str); } catch(e) { return null; }
}

function safeRender(lib, compiled, params) {
    if (!compiled) { return ''; }
    try { return lib.renderOnly(compiled, params); } catch(e) { return ''; }
}

function safeFull(lib, str, params) {
    try { return lib.full(str, params); } catch(e) { return ''; }
}

// ---------------------------------------------------------------------------
// Benchmark runners — one iteration processes ALL strings
// ---------------------------------------------------------------------------
async function runAllStrings(bodyFn) {
    const DURATION_MS = 3000;
    const results = [];

    for (const lib of LIBRARIES) {
        const bench = new Bench({ time: DURATION_MS });
        bench.add(lib.name, bodyFn.bind(null, lib));
        await bench.run();

        const task = bench.tasks[0];
        const opsPerSec = task.result.throughput.mean;
        const meanMs    = task.result.latency.mean;

        results.push({
            library:    lib.name,
            opsPerSec:  Math.round(opsPerSec).toLocaleString(),
            meanMs:     meanMs.toFixed(3),
            // Time per single string = mean / number of strings
            perStringUs: ((meanMs / ALL_STRINGS.length) * 1000).toFixed(4),
        });
    }
    return results;
}

async function runRenderOnly() {
    const DURATION_MS = 3000;
    const results = [];

    for (const lib of LIBRARIES) {
        // Pre-compile all strings outside the timer
        const compiled = ALL_STRINGS.map(({ str }) => safeCompile(lib, str));

        const bench = new Bench({ time: DURATION_MS });
        bench.add(lib.name, function() {
            for (let i = 0; i < ALL_STRINGS.length; i++) {
                _benchSink = safeRender(lib, compiled[i], PARAMS);
            }
        });
        await bench.run();

        const task = bench.tasks[0];
        const opsPerSec = task.result.throughput.mean;
        const meanMs    = task.result.latency.mean;

        results.push({
            library:    lib.name,
            opsPerSec:  Math.round(opsPerSec).toLocaleString(),
            meanMs:     meanMs.toFixed(3),
            perStringUs: ((meanMs / ALL_STRINGS.length) * 1000).toFixed(4),
        });
    }
    return results;
}

// ---------------------------------------------------------------------------
// Print
// ---------------------------------------------------------------------------
function printTable(title, results) {
    const libW  = 45;
    const opsW  = 14;
    const msW   = 12;
    const perW  = 18;

    const header =
        'Library'.padEnd(libW) +
        'ops/sec'.padStart(opsW) +
        'mean (ms)'.padStart(msW) +
        'µs/string'.padStart(perW);
    const divider = '-'.repeat(libW + opsW + msW + perW);

    console.log('');
    console.log(title);
    console.log(`(${ALL_STRINGS.length} strings per iteration)`);
    console.log(divider);
    console.log(header);
    console.log(divider);
    for (const r of results) {
        console.log(
            r.library.padEnd(libW) +
            r.opsPerSec.padStart(opsW) +
            r.meanMs.padStart(msW) +
            r.perStringUs.padStart(perW),
        );
    }
    console.log(divider);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function run() {
    console.log(`\nCORNERSTONE FULL FILE BENCHMARK — ${ALL_STRINGS.length} strings`);
    console.log('Duration per case: 3 s (tinybench)\n');

    // 1) Compile only
    const resultsCompile = await runAllStrings(function(lib) {
        for (const { str } of ALL_STRINGS) {
            _benchSink = safeCompile(lib, str);
        }
    });

    // 2) Render only (pre-compiled)
    const resultsRender = await runRenderOnly();

    // 3) Compile + render
    const resultsFull = await runAllStrings(function(lib) {
        for (const { str } of ALL_STRINGS) {
            _benchSink = safeFull(lib, str, PARAMS);
        }
    });

    printTable('1) compile only — parse/build all strings per iteration', resultsCompile);
    printTable('2) render only — compile outside timer; timed: format all strings per iteration', resultsRender);
    printTable('3) compile + render — full cycle every iteration', resultsFull);

    void _benchSink;
    console.log('\nDone.');
}

run().catch(err => { console.error(err); process.exit(1); });
