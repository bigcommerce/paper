# Changelog

## 3.0.0-rc.2 (2018-01-31)
- Major refactor, moving rendering functionality into paper-handlebars [#130](https://github.com/bigcommerce/paper/pull/130) to
allow for alternate template engines.
- Remove access to siteSettings and themeSettings, use accessors instead [#131](https://github.com/bigcommerce/paper/pull/131) to

v3.0 Contains several breaking changes:
- Removed the direct access of `contentServiceContext` for setting page content. From now on, use `setContent()`
  and `getContent()`.
- Removed direct access of `siteSettings` and `themeSettings`. From now on, use `getSiteSettings()`, `setSiteSettings()`,
  `getThemeSettings()`, and `setThemeSettings()` if you need to get/set these values after calling the constructor.
- Removed `getTemplateProcessor()`. This is an internal concern of `paper-handlebars` and is used by `loadTemplates`.
- Removed `loadTemplatesSync()`. This was only used by helper tests and is no longer needed.
- Removed `handlebars` instance variable. Hopefully nobody is accessing that directly. Any helpers that were accessing
  it have been updated in `paper-handlebars` to use the global context they are given rather than accessing Paper
  directly at all.
- The `translator` attribute has been moved to `paper-handlebars` and is no longer accessible directly on Paper.
- The `decorators` attribute has been moved to `paper-handlebars` and is no longer accessible directly on Paper.
- The `settings` attribute has been renamed to `siteSettings`. This should only be accessed by `paper-handlebars`.
- The `cdnify()` function has been moved into a helper library in `paper-handlebars`.
- The `inject` attribute has been removed. This is storage used by two of the helpers, and the implementation has
  moved to `paper-handlebars`.

## 2.0.7 (2017-10-17)
- Always render region wrapper even if no content is present [#128](https://github.com/bigcommerce/paper/pull/128)

## 2.0.6 (2017-09-20)
- Fix a bug in the `replace` helper [#127](https://github.com/bigcommerce/paper/pull/127)

## 2.0.5 (2017-09-15)
- Added support to use operators in the `unless` helper [#126](https://github.com/bigcommerce/paper/pull/126)
- Fix a bug in the `replace` helper [#125](https://github.com/bigcommerce/paper/pull/125)

## 2.0.4 (2017-08-21)
- Lodash deprecated method replaced [#121](https://github.com/bigcommerce/paper/pull/121)
- Added a test to `first` helper [#120](https://github.com/bigcommerce/paper/pull/120)

## 2.0.3 (2017-06-21)
- Add `region` helper to render content blocks [#118](https://github.com/bigcommerce/paper/pull/118)

## 2.0.2 (2017-04-20)
- Bug fix in the `stylesheet` helper [#116](https://github.com/bigcommerce/paper/pull/116)

## 2.0.1 (2017-04-12)
- Adds the `{{thumbnailImage}}` helper and removes the non-existent `{{thumbnail}}` helper [#114](https://github.com/bigcommerce/paper/pull/114)

## 2.0.0 (2017-04-11)
- Remove configId from cdn/assets urls for preventing busting the cached assets when configId changes [#112](https://github.com/bigcommerce/paper/pull/112)
- Update docs to describe the interface required by paper for assembler and callbacks [#111](https://github.com/bigcommerce/paper/pull/111)
- Adds and exposes the helpers we've selected from the handlebars-helpers library [#110](https://github.com/bigcommerce/paper/pull/110)

## 1.2.0 (2017-02-23)
- Add a helper that can truncate text. [#106](https://github.com/bigcommerce/paper/pull/106), [#108](https://github.com/bigcommerce/paper/pull/108)
- Add a helper that can render language strings as a JSON object. [#103](https://github.com/bigcommerce/paper/pull/103)
- Fix an issue where language strings may not be formatted properly (i.e.: pluralization and gender) when they are cascaded. [#103](https://github.com/bigcommerce/paper/pull/103)
