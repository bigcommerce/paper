# Changelog

## 2.0.12 (2019-03-18)
-- Bump handlebars-helpers to 0.10.0 [#152](https://github.com/bigcommerce/paper/pull/152)

## 2.0.11 (2018-12-19)
-- Use https for font providers and resource hints [#144](https://github.com/bigcommerce/paper/pull/144)

## 2.0.10 (2018-05-09)
-- Fix `cdnify` to avoid double slash in the genrated url [#141](https://github.com/bigcommerce/paper/pull/141)

## 2.0.9 (2018-08-14)
-- Adds to `if` helper `gtnum` to determine greater than for numbers [#138](https://github.com/bigcommerce/paper/pull/138)

## 2.0.8 (2018-05-09)
- Add resourceHints and getFontLoaderConfig helpers [#133](https://github.com/bigcommerce/paper/pull/133)

## 2.0.7 (2017-10-17)
- Always render region wrapper even if no content is present [#128](https://github.com/bigcommerce/paper/pull/128)

## 2.0.6 (2017-09-20)
- Fix a bug in the `replace` helper [#127](https://github.com/bigcommerce/paper/pull/127)

## 2.0.5 (2017-09-15)
- Fix a bug in the `replace` helper [#125](https://github.com/bigcommerce/paper/pull/125)
- Added support to use operators in the `unless` helper [#126](https://github.com/bigcommerce/paper/pull/126)

## 2.0.4 (2017-08-21)
- Added a test to `first` helper [#120](https://github.com/bigcommerce/paper/pull/120)
- Lodash deprecated method replaced [#121](https://github.com/bigcommerce/paper/pull/121)

## 2.0.3 (2017-06-21)
- Adds `region` helper [#118](https://github.com/bigcommerce/paper/pull/118)
- Bug fix in the `stylesheet` helper [#116](https://github.com/bigcommerce/paper/pull/116)

## 2.0.2 (2017-04-20)
- Bug fix in the `stylesheet` helper [#116](https://github.com/bigcommerce/paper/pull/116)

## 2.0.1 (2017-04-12)
- Adds the `{{thumbnailImage}}` helper and removes the non-existent `{{thumbnail}}` helper [#114](https://github.com/bigcommerce/paper/pull/114)

## 2.0.0 (2017-04-11)
- Adds and exposes the helpers we've selected from the handlebars-helpers library [#110](https://github.com/bigcommerce/paper/pull/110)
- Update docs to describe the interface required by paper for assembler and callbacks [#111](https://github.com/bigcommerce/paper/pull/111)
- Remove configId from cdn/assets urls for preventing busting the cached assets when configId changes [#112](https://github.com/bigcommerce/paper/pull/112)

## 1.2.0 (2017-02-23)
- Add a helper that can truncate text. [#106](https://github.com/bigcommerce/paper/pull/106), [#108](https://github.com/bigcommerce/paper/pull/108)
- Add a helper that can render language strings as a JSON object. [#103](https://github.com/bigcommerce/paper/pull/103)
- Fix an issue where language strings may not be formatted properly (i.e.: pluralization and gender) when they are cascaded. [#103](https://github.com/bigcommerce/paper/pull/103)
