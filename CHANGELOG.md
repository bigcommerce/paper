# Changelog

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
