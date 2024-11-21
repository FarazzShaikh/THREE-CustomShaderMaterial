# Changelog

## 6.2.0

- Add `CustomShaderMaterial.clone()` method
- Update regex used to extract main function's body from user's shader code.

## 6.0.0

Rewritten from scratch, now with no dependencies, optimized performance and better type inference.

- Add `csm_Iridescence`
- Add `csm_Transmission`
- Add `csm_Thickness`
- Add `csm_UnlitFac`
  - Mix factor between lit (`csm_DiffuseColor`) and unlit (`csm_FragColor`) shading.
- **[BREAKING]**: Removed official support for extending third-party materials and materials that already use `onBeforeCompile`.
  - This is due to the complexity of the implementation and the lack of a good way to handle it.
  - You can still extend materials, they may or may not work as expected.

## 5.5.0

- **[BREAKING]**: Your shader code is now scoped!
  - Now you will not have token redefinition errors within your shader when using tokens already used by Three. For example `mvPosition`.
  - Please note that attributes, uniforms and varying cannot be scoped and will still cause errors if redefined. For example `vUv`
  - Shader code should not be broken. However, `patchMaps` might be, depending on your implementation. Please open an issue and I may help you fix it.
- **[BREAKING]**: Made generic type T required for vanilla `CustomShaderMaterial<T>` class.

  - This facilitates better type inference for the base material props in vanilla contexts. React remains unchanged.

- Add `csm_Clearcoat`
  - Clearcoat factor
- Add `csm_ClearcoatRoughness`
  - Clearcoat roughness factor
- Add `csm_ClearcoatNormal`

  - Perturbation to the fragment normal used for clearcoat shading

- Refactor out string manipulations using `glsl-tokenizer`, `glsl-token-functions` and `glsl-token-string` making recompilation more performant and less error-prone.

## 5.3.4

- Fix for Three r0.150.2

## 5.3.0

- Add `csm_bump`

## 5.2.0

- Now extend already extended materials
  - Extend/chain CSM instances
  - Extend any other material that uses `onBeforeCompile` internally

## 5.1.0

### Features

- Now prevent exact match function in `patchMaps` by passing `"*"` as the search keyword.

### Fixes

- Fixed uniforms now injected with a ShaderMaterial as `baseMaterial`

## 5.0.0

### Features

#### Improved types

CSM will now infer options/prop types based on the base material

```tsx
<CustomShaderMaterial
    baseMaterial={MeshBasicMaterial}
    transmission={0} // ❌ TypeError; transmission does not exist on MeshBasicMaterial
/>

<CustomShaderMaterial
    baseMaterial={MeshPhysicalMaterial}
    transmission={0} // ✅ Valid
/>
```

#### Added `csm_AO`

Now override AO within your shader. Available in Physical and Standard material

```glsl
csm_AO = 0.0; // PBR Ambient Occlusion
```

#### Misc

- FIxed transmission with `MeshPhysicalMaterial` as base
- Restructure repo and examples

## 5.0.0-next.3

- Fix transmission for MeshPhysicalMaterial base

## 5.0.0-next.2

### Major Changes

- 01ec3c5: Add csm_AO

## 5.0.0-next.1

### Minor Changes

- Improve types

## 5.0.0-next.0

### Major Changes

- Restructure repo

## Version 3.5.0

### Added `csm_Roughness` and `csm_Metalness`

```glsl
csm_Roughness = 0.0; // PBR Roughness
csm_Metalness = 1.0; // PBR Metalness
```

### Misc

- Updated deps
- Fixed `.clone()` (#20)

## Version 3.4.0

### Added support to extend already initialized materials

Vanilla:

```js
const material = new Material();
new CustomShaderMaterial({ baseMaterial: material });
```

React:

```jsx
const material = useMemo(() => new Material(), [])
<CustomShaderMaterial baseMaterial={material} />
```

### Add support for custom patch maps

Vanilla:

```js
new CustomShaderMaterial({ patchMap: {...} })
```

React:

```jsx
<CustomShaderMaterial patchMap={{...}} />
```

### Upgraded shader parsing

- Shaders are indentation-sensitive no more.
- Supports full set of standard GLSL syntax.

## Version 3.3.3 **[Breaking]**

### Changes

- Swapped plain params for object-params

  ```js
  // Old
  const material = new CustomShaderMaterial(
    baseMaterial,
    fragmentShader,
    vertexShader,
    uniforms
  );
  material.update(fragmentShader, vertexShader, uniforms);

  // New
  const material = new CustomShaderMaterial({
    baseMaterial,
    fragmentShader,
    vertexShader,
    uniforms,
    cacheKey,
  });
  material.update({ fragmentShader, vertexShader, uniforms, cacheKey });
  ```

- Added smarter cache key
  - Custom cache key is now a hash: `hash([fragmentShader, vertexShader, uniforms])`
  - Custom cache key function can be supplied with constructor or update function. `cacheKey : () => string`

## Version 3.2.10

### Changes

- Now supports `csm_Emissive`
  - Override emissive color from fragment shader
- Updated types to include `PointsMaterial` (#15)

## Version 3.1.0 **[Breaking]**

### Changes

- Move vanilla lib to `three-custom-shader-material/vanilla`
  - `import CustomShaderMaterial from "three-custom-shader-material/vanilla"

## Version 3.0.0 **[Breaking]**

### Changes

- Rewritten from scratch
- Ported to `react-three-fiber`

## Version 2.4.3

### Changes

- Update deps.

## Version 2.4.2

### Changes

- Added `gl_PointSize` override.

## Version 2.4.1

### Changes

- Updated Readme
- Moved some `dependencies` to `devDependencies`

## Version 2.4.0

### Changes

- Output variables `newPos`, `newNormal` and `newColor` depricated in favor of `csm_Position`, `csm_Normal` and `csm_DiffuseColor`
  - This is a non-breaking change as the old ones still work for compatibility.
- Output variables from custom shader are now optional
  - `csm_Position`, `csm_Normal` and `csm_DiffuseColor` now default to their orignal values (`position`, `objectNormal` and `vColor`) if not set in custom shader.

### Enhancements

- Rewritten in TypeScript
- Minified to reduce filesize

## Version 2.3.1

### New

- Added support for `MeshDepthMaterial` and `PointsMaterial`.
  - These materials aren't well tested.

## Version 2.3.0

### New

- Now supports **all** material types.
- Now you can set the **diffuse color** of the object as well.
- Added CDN-friendly version of the library - `build/three-csm.m.cdn.js`.

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
