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
