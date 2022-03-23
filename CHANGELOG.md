# Changelog

## Pending
## 3.0.4 (2022-03-23)
- bump paper-handlerbars [#275](https://github.com/bigcommerce/paper/pull/275)

## 3.0.4 (2022-03-18)
- bump paper-handlerbars [#273](https://github.com/bigcommerce/paper/pull/273)
- STRF-9705 MessageFormat errors mark as warning [#272](https://github.com/bigcommerce/paper/pull/272)

## 3.0.3 (2022-03-02)
- STRF-9658 logger accepts strings instead of objects [#270](https://github.com/bigcommerce/paper/pull/270)

# 3.0.2 (2022-02-23)
- Bumps paper-handlebars to 4.5.3 [#269](https://github.com/bigcommerce/paper/pull/269)

## 3.0.1 (2022-02-17)
- Bumps paper-handlebars to 4.5.2 [#266](https://github.com/bigcommerce/paper/pull/266)
## 3.0.0 (2022-02-08)
* Deprecating 2x branch as it's not used and maintained anymore


## 3.0.0-rc.54 (2022-01-31)
* Revert some unused code that should have been removed as part of previous reversions [#260](https://github.com/bigcommerce/paper/pull/260)
* Cleanup filterByKey [#261](https://github.com/bigcommerce/paper/pull/261)
* Improve performance of Translator constructor through internal refactor of Transformer [#262](https://github.com/bigcommerce/paper/pull/262)

## 3.0.0-rc.53 (2021-12-20)
- STRF-9553 Fallback languages in the chain [#258](https://github.com/bigcommerce/paper/pull/258)

## 3.0.0-rc.52 (2021-12-8)
- Bumps paper-handlebars to 4.5.1 [#255](https://github.com/bigcommerce/paper/pull/255)

## 3.0.0-rc.51 (2021-10-22)
- Bumps paper-handlebars to 4.5.0 [#255](https://github.com/bigcommerce/paper/pull/255)

## 3.0.0-rc.50 (2021-10-04)
- Reverted messageformat library to 0.2.2 [#253](https://github.com/bigcommerce/paper/pull/253)
- 
## 3.0.0-rc.49 (2021-09-16)
- Bumps paper-handlebars to 4.4.9 [#252](https://github.com/bigcommerce/paper/pull/252)

## 3.0.0-rc.48 (2021-07-20)
- Upgrade deprecated messageformat library to @messageformat/core [#246](https://github.com/bigcommerce/paper/pull/246)

## 3.0.0-rc.47 (2021-07-20)
- Bump paper-handlebars to latest version, includes changes to support region translations [#245](https://github.com/bigcommerce/paper/pull/245)

## 3.0.0-rc.46 (2021-06-17)
- Do not break render operation if some translation key is not possible to precompile because of wrongly formatted value [#243](https://github.com/bigcommerce/paper/pull/243)

## 3.0.0-rc.45 (2021-06-10)
- Introduced disablePluralKeyChecks option for disabling plural keys 
[checks](http://messageformat.github.io/messageformat/v2/MessageFormat#disablePluralKeyChecks__anchor) on messageformat library [#241](https://github.com/bigcommerce/paper/pull/241)

## 3.0.0-rc.44 (2021-05-18)
- Bump messageformat library to latest version [#239](https://github.com/bigcommerce/paper/pull/239)

## 3.0.0-rc.43 (2021-05-18)
- Created an endpoint for precaching lang helper function [#235](https://github.com/bigcommerce/paper/pull/235)

## 3.0.0-rc.42 (2021-05-11)
- Improved filtering language object by key for langJSON helper, that was struggling with perfomance on GraalVM [#236](https://github.com/bigcommerce/paper/pull/236)

## 3.0.0-rc.41 (2021-05-07)
- Improved filtering language object by key for langJSON helper, that was struggling with perfomance on GraalVM [#234](https://github.com/bigcommerce/paper/pull/234)

## 3.0.0-rc.40 (2021-03-30)
- paper.loadTranslations now supports additional parameter to omit transforming translations [#231](https://github.com/bigcommerce/paper/pull/231)

## 3.0.0-rc.39 (2021-03-15)
- Bumps paper-handlebars to 4.4.7 [#230](https://github.com/bigcommerce/paper/pull/230)

## 3.0.0-rc.38 (2021-03-15)
- Added public interface for handlebars to add templates and preprocess them [#228](https://github.com/bigcommerce/paper/pull/228)
- Bumps paper-handlebars to 4.4.6 [#229](https://github.com/bigcommerce/paper/pull/229)

## 3.0.0-rc.37 (2021-02-12)
- Bumps paper-handlebars to 4.4.4 [#226](https://github.com/bigcommerce/paper/pull/226)

## 3.0.0-rc.36 (2020-12-15)
- Bumps paper-handlebars to 4.4.3 [#223](https://github.com/bigcommerce/paper/pull/223)

## 3.0.0-rc.35 (2020-11-17)
- Bumps paper-handlebars to 4.4.2 [#219](https://github.com/bigcommerce/paper/pull/219)

## 3.0.0-rc.34 (2020-11-16)
- Rollback paper-handlebars to 4.4.1 [#216](https://github.com/bigcommerce/paper/pull/216)

## 3.0.0-rc.33 (2020-09-21)
- Bumps paper-handlebars to 4.5.0-rc.2 [#214](https://github.com/bigcommerce/paper/pull/214)

## 3.0.0-rc.32 (2020-09-04)
- Refactor Translator and drop unneeded dependency. Bumps paper-handlebars to 4.5.0-rc.1 [#208](https://github.com/bigcommerce/paper/pull/208)

## 3.0.0-rc.31 (2020-08-28)
- Bump paper-handlebars version to 4.4.1 [#204](https://github.com/bigcommerce/paper/pull/204)

## 3.0.0-rc.30 (2020-08-25)
- Bump paper-handlebars version to 4.4.0 [#202](https://github.com/bigcommerce/paper/pull/202)

## 3.0.0-rc.29 (2020-06-05)
- Bump paper-handlebars version to 4.3.2 [#199](https://github.com/bigcommerce/paper/pull/199)

## 3.0.0-rc.28 (2020-02-21)
- Bump paper-handlebars version to 4.3.1 [#195](https://github.com/bigcommerce/paper/pull/195)

## 3.0.0-rc.27 (2020-01-29)
- Bump paper-handlebars version to 4.3.0 [#193](https://github.com/bigcommerce/paper/pull/193)

## 3.0.0-rc.26 (2019-10-16)
- Fix Stencil language translation in Safari [#186](https://github.com/bigcommerce/paper/pull/186)

## 3.0.0-rc.25 (2019-10-15)
- Bump paper-handlebars version to 4.2.3 [#183](https://github.com/bigcommerce/paper/pull/183)
- Refactor logging. You can now pass an optional console-like logger object which will be used for internal logging as well as Handlebars logging. [#183](https://github.com/bigcommerce/paper/pull/183)

## 3.0.0-rc.24 (2019-10-09)
- Bump paper version [#182](https://github.com/bigcommerce/paper/pull/182)
- Fix renderTheme function so that it may work with Stencil CLI [#181](https://github.com/bigcommerce/paper/pull/181)

## 3.0.0-rc.22 (2019-10-02)
- Bump paper-handlebars version [#180](https://github.com/bigcommerce/paper/pull/180)
- Bump paper-handlebars version to 4.2.2 [#179](https://github.com/bigcommerce/paper/pull/179)

## 3.0.0-rc.20 (2019-08-06)
- Bump paper-handlebars to 4.2.1 [#177](https://github.com/bigcommerce/paper/pull/177)

## 3.0.0-rc.19 (2019-07-31)
- Bump paper-handlebars to 4.2.0 [#175](https://github.com/bigcommerce/paper/pull/175)

## 3.0.0-rc.18 (2019-07-29)
- Bump paper-handlebars to 4.1.2 [#172](https://github.com/bigcommerce/paper/pull/172)

## 3.0.0-rc.17 (2019-07-12)
- Bump paper-handlebars to 4.1.1 [#171](https://github.com/bigcommerce/paper/pull/171)

## 3.0.0-rc.16 (2019-07-10)
- Bump paper-handlebars to 4.1.0 [#166](https://github.com/bigcommerce/paper/pull/166)

## 3.0.0-rc.15 (2019-06-30)
- Bump paper-handlebars to 4.0.9 [#165](https://github.com/bigcommerce/paper/pull/165)

## 3.0.0-rc.14 (2019-06-30)
- Bump paper-handlebars to 4.0.8 [#163](https://github.com/bigcommerce/paper/pull/163) to update Handlebars

## 3.0.0-rc.13 (2019-05-24)
- Bump paper-handlebars to 4.0.6 [#157](https://github.com/bigcommerce/paper/pull/157) to add display support for Google fonts

## 3.0.0-rc.12 (2019-03-29)
- Added an option to pass in logger and override the default logger of the app [#153](https://github.com/bigcommerce/paper/pull/153)

## 3.0.0-rc.11 (2019-02-14)
- Bump paper-handlebars to 4.0.4 [#150](https://github.com/bigcommerce/paper/pull/150) to fix
  regex performance to match precompiled templates.

## 3.0.0-rc.10 (2019-02-04)
- Bump paper-handlebars to 4.0.4 [#149](https://github.com/bigcommerce/paper/pull/149) to fix
  cdn url.

## 3.0.0-rc.9 (2018-12-18)
- Bump paper-handlebars to 4.0.3 [#143](https://github.com/bigcommerce/paper/pull/143) to fix
  resourceHints to always use https for font providers.

## 3.0.0-rc.8 (2018-12-7)
- Bump paper-handlebars to 4.0.2 [#142](https://github.com/bigcommerce/paper/pull/142) to fix
  `region` helper, should render regardless of empty content.

## 3.0.0-rc.7 (2018-10-30)
- Bump paper-handlebars to 4.0.1 [#140](https://github.com/bigcommerce/paper/pull/140) to fix
  `cdnify` and avoid double slash in the generated url.

## 3.0.0-rc.6 (2018-10-04)
Breaking change:
- Use paper-handlebars 4.0.0, which uses Promises for `render` and `renderString`.
- Change `loadTheme`, `loadTemplates`, `loadTranslations`, `render`, `renderString`,
  and `renderTheme` to be based on Promises rather than callbacks.

## 3.0.0-rc.5 (2018-08-23)
- Bump paper-handlebars to 3.0.3 [#136](https://github.com/bigcommerce/paper/pull/136) which adds support for
  `gtnum` operator in `if` helper.

## 3.0.0-rc.4 (2018-05-31)
- Bump paper-handlebars to 3.0.2 [#135](https://github.com/bigcommerce/paper/pull/135) which adds the
  `resourceHints` helper.

## 3.0.0-rc.3 (2018-01-31)
- Bump paper-handlebars to 3.0.1 [#132](https://github.com/bigcommerce/paper/pull/132) which has fixes for
  cdn and stylesheet helpers.

## 3.0.0-rc.2 (2018-01-31)
- Remove access to siteSettings and themeSettings, use accessors instead [#131](https://github.com/bigcommerce/paper/pull/131)

## 3.0.0-rc.1 (2018-01-24)
- Major refactor, moving rendering functionality into paper-handlebars [#130](https://github.com/bigcommerce/paper/pull/130) to
allow for alternate template engines.

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

## 2.0.9 (2018-08-14)
- Add `gtnum` support to `if` helper [#138](https://github.com/bigcommerce/paper/pull/138)

## 2.0.8 (2018-05-09)
- Add resourceHints helper [#133](https://github.com/bigcommerce/paper/pull/133)

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
