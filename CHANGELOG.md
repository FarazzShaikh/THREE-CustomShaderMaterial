# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version 2.3.1

### New

- Added support for `MeshDepthMaterial` and `PointsMaterial`.
  - These materials aren't well tested.

## Version 2.3.0

### New

- Now supports **all** material types.
- Now you can set the **diffuse color** of the object as well.
- Added CDN friendly version of library - `build/three-csm.m.cdn.js`.

### Changed

- Renamed `build/three-csm.module.js` to `build/three-csm.m.js`
- Updated docs and readme.

## Version 2.2.1

### Changed

- Added warnings for unsupported features.

## Version 2.2.0

### Changed

- Fixes #3. Big thanks to Steve Trettel (@stevejtrettel)

## Version 2.1.1

### Changed

- Fix for [CVE-2021-23358](https://github.com/advisories/GHSA-cf4h-3jhx-xvhq)

## Version 2.1.0

### Added

- Ability to include custom Fragment Shaders