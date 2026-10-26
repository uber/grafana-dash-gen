CHANGELOG
=========

v4.1.1 (2026-02-09)
-------------------

 - Remove query parameter value from Custom entity (#132)
 - Update CI containers for Node 24 (#133)
 - Update dependencies (#134)


v4.1.0 (2026-02-09)
-------------------

 - Fix crash when referencing non-existent target ref ID (#128)
 - Add Typescript types (#122, #123)
 - Refactors to use modern JS syntax (#121)
 - Add label support for query entity (#131)
 - CI fixes/cleanup (#120, #119, #118)


v4.0.2 (2025-08-27)
-------------------

 - Remove grafana refresh (#113)
 - Fix build
 - Update dependencies


v4.0.1 (2023-08-22)
-------------------

 - Fix `current` type bug in custom templates against newer versions of grafana
 - Slim down published NPM package


v4.0.0 (2023-08-20)
-------------------

 - **Breaking change:** `publish` now returns a promise with either a `node-fetch` `Response` or an `SError` from the `error` package
 - **Breaking change:** thrown errors are from the upgraded `error@10` `SError` type instead of the `error@7` `TypedError` package
 - Dependency updates


v3.3.6 (2023-05-29)
-------------------

 - Test against Node 18
 - Update tape to ^5.0.0 and eslint to ^8.0.0, and switch from tap-spec to tap-arc
 - Fix console.log() example in README
 - Dependency updates (json5, qs, minimatch, ansi-regex, json-schema, jsprim)


v3.3.5 (2022-05-05)
-------------------

 - Use Refresh in Templates.Custom (#87)


v3.3.4 (2022-05-03)
-------------------

 - Fix ALL variable bug (#86)


v3.3.3 (2022-04-20)
-------------------

 - Default to All value if includeAll (#85)


v3.3.2 (2022-04-18)
-------------------

 - Remove validation for external dashboard links (#84)


v3.3.1 (2022-04-18)
-------------------

 - Export external-link (#83)


v3.3.0 (2022-04-18)
-------------------

 - Add ability to define external links on dashboards (#81)
 - Fix initialization of ExternalLinks (#82)


v3.2.2 (2021-08-15)
-------------------

 - Move CI from Travis to GitHub Actions (#76)
 - Dependency updates


v3.2.1 (2020-09-24)
-------------------

 - Fix TypeError for query templating
 - Update lodash to 4.17.19


v3.2.0 (2020-07-01)
-------------------

 - Add support for alerts on graph panels, including alert conditions, evaluators, start time/duration, and alerts on ref targets (#60)
 - Add ref ID to each target
 - Update supported Node versions to active/maintained releases (#63)
 - Dependency updates (#62)


v3.1.0 (2020-03-07)
-------------------

 - Make dashboard editable state configurable
 - Add repository field to package.json
 - Dependency updates and switch from istanbul to nyc; remove lint-trap


v3.0.0 (2019-07-09)
-------------------

 - **Breaking change:** Publishing is now promise based (uses request-promise-native) instead of callback based (#55)
 - Pass headers correctly when publishing dashboards (#55)
 - Update request and nock dependencies; update Travis config to Node LTS (#55)


v2.6.0 (2019-06-05)
-------------------

 - Add support for passing custom headers
 - Print response headers on publish failure
 - Fix example in README


v2.5.0 (2019-06-04)
-------------------

 - Add dashboard list panel type (#50)
 - Allow overriding `allValue` in Query templating (#48)
 - Allow options overriding in Text panel (#36)
 - Add support for using m3ql in templating (#34)
 - Add table panel support (#33)


v2.4.1 (2016-07-14)
-------------------

 - Add support for tables (#32)


v2.4.0 (2016-04-14)
-------------------

 - Allow configuring time on grafana.Dashboard (#30)


v2.3.0 (2016-04-12)
-------------------

 - Add ability to hide a target via `hide()` and a graph `hide` field (#29)
 - Support query-based template variables and make the first template option the current one (#27)
 - Fix license (#25)
 - Use tape instead of cached-tapie for tests and fix the cover script


v2.2.0 (2016-01-06)
-------------------

 - Allow overriding of any graph and annotation properties (#3)
 - Overwrite default template state with custom options (#24)
 - Remove dependencies on underscore and defaults-deep


v2.1.1 (2016-01-04)
-------------------

 - Add text panel and expose text in panels (#15)
 - Add datasource support (#16)
 - Allow template specification of text and value from options, and fix template query to use value instead of text
 - Allow a custom timeout to be configured (#18)
 - Make fill overridable, with test coverage (#22, #23)


v2.0.0 (2015-11-12)
-------------------

 - **Breaking change:** Initial support for Grafana 2 (updating existing dashboards is not fully handled yet)
 - **Breaking change:** Remove `perSecond` helper method (#10)
 - Improve example.js (#13)


v1.0.3 (2015-10-12)
-------------------

 - Add contribution and copyright files (#8)


v1.0.2 (2015-09-25)
-------------------

 - Add weightedAverage function to target (#7)
 - Add logging/console helpers
 - Update README (JS syntax highlighting, consistent example URLs) and add Travis CI
 - Grafana 2 support was added (#6) but then reverted within this release


v1.0.1 (2015-08-25)
-------------------

 - Add test-related note to README


v1.0.0 (2015-08-25)
-------------------

 - Add test coverage for dashboard, config, target, row, publish, graph and singlestat panels, custom templates, and graphite annotation (#2, #4)
 - Add initial errors module with a typed error for unfulfilled requirement errors
 - Move panel test fixtures into a subdirectory


v0.0.8 (2015-05-15)
-------------------

 - Fix typos


v0.0.7 (2015-05-14)
-------------------

 - Support overriding dashboard slugs (#1)


v0.0.6 (2015-04-16)
-------------------

 - Update default annotation color


v0.0.5 (2015-04-16)
-------------------

 - Add ability to set alias colors and hide legend on graphs


v0.0.4 (2015-04-16)
-------------------

 - Fix rtapi refresh


v0.0.3 (2015-04-16)
-------------------

 - Fix version number


v0.0.2 (2015-04-16)
-------------------

 - Enable dashboard refresh by default


v0.0.1 (2015-04-14)
-------------------

 - Initial release
