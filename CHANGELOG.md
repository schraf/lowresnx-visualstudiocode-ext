# Change Log

All notable changes to the "lowres-nx" extension will be documented in this file.

## 0.0.1
- Initial release

## 0.0.2
- Added support for symbol lookup and outline panel. Works with functions, globals, labels, and roms.
- Added highlighting of function names.

## 0.0.3
- Added support to REM style comments (@rilden)
- Added floating number point support (@rilden)
- Enforced that comments need to start on a new line (@rilden)
- Added a CI workflow

## 0.0.4
- Fix auto-indentation for single line if statements (@rilden)
- Fix comments regular expression for REM lines to not require a blank space (@rilden)

## 0.0.5
- Added icon
- Fixed issue where multiple global arrays defined on a single line were not working with symbols.

## 0.0.6
- Adding run command to start LowRes NX from command palette
- Adding some extension settings for new run command
