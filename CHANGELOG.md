CHANGELOG
=========

v4.0.1 (2023-08-22)
-------------------

 - Fix `current` type bug in custom templates against newer versions of grafana
 - Slim down published NPM package


v4.0.0 (2023-08-20)
-------------------

 - **Breaking change:** `publish` now returns a promise with either a `node-fetch` `Response` or an `SError` from the `error` package
 - **Breaking change:** thrown errors are from the upgraded `error@10` `SError` type instead of the `error@7` `TypedError` package
 - Dependency updates
