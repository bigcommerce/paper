# Changelog

## 2.0.5 (2017-09-15)
- Fix a bug in the `replace` helper [#125](https://github.com/bigcommerce/paper/pull/125)
- Added support to use operators in the `unless` helper [#126](https://github.com/bigcommerce/paper/pull/126)

## 2.0.4 (2017-08-21)
- Added a test to `first` helper [#120](https://github.com/bigcommerce/paper/pull/120)
- Lodash deprecated method replaced [#121](https://github.com/bigcommerce/paper/pull/121)

## 2.0.3 (2017-06-21)
- Adds `region` helper [#118](https://github.com/bigcommerce/paper/pull/118)
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
