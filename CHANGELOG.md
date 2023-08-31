## 1.2.0 (2023-08-31)

### Features

- Added a new debug option - `consoleOutput`
  - This determines whether the console will output in a `log` or `table` format (defaults to `log`)

### Dev

- Added a new `Jest` test for the new `consoleOutput` debug option
- Updated `package.json`
- Updated `README.md`

## 1.1.0 (2023-08-31)

### Dev

- Had to skip this version as a result of needing to unpublish this version of the package from NPM

## 1.0.2 (2023-08-30)

### Fixes

- Created a `dist` folder with an ESM output (forgot to do this - _facepalm_)

### Dev

- Created/updated many repository configuration files (e.g. `Jest`, `Prettier`, `tsconfig` etc.)
- Updated `package.json`

## 1.0.1 (2023-08-29)

### Features

- Small tweak to `useEffectDebugger` hook

### Dev

- Updated `README.md`
- Updated `package.json`

## 1.0.0 (2023-08-28)

### Features

- Created `useEffectDebugger` hook with two debug options:
  - `consoleName`
  - `depNames`
