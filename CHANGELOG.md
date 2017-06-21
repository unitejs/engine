# v0.1.1
* Package Manager can be specified for any command and is remembered for future use
* Added license command line option (https://spdx.org/licenses/) to generate LICENSE
* Removed uniteDependencies.json and added to package.json peerDependencies
* Generates README.MD file
* Fixed bug in SystemJS HTML
* Added .eslintignore generation
* Linting keeps changes to configuration files made by user

# v0.1.0
* Added linting option

# v0.0.11
* Added gulp serve

# v0.0.10
* Fix script line endings

# v0.0.9
* Cross platform fixes

# v0.0.8
* Cross platform fixes

# v0.0.7
* Fixed casing for asset folders
* Fixed dist folder not existing for module config
* Pipeline steps refactored

# v0.0.6
* Karma.conf is now static instead of dynamic so it can be run standalone
* Remap istanbul merged into karma.conf instead of separate gulp task
* module configurations can now distinguish between app and test modules
* Fixed package manager add used wrong working directory

# v0.0.5
* Added browserify support
* Added yarn support for clientPackages
* Sourcemap src location is now consitent for all loaders
* Webpack and Browserify Unit Tests use cajon loader instead of loading packs
* Fixed coverage report for Webpack and Browserify
* Fixed bug with missing preloadModules for SystemJS and RequireJS

# v0.0.4

* Output directory can be omitted which will use current directory
* If a unite.json exists in the output directory it will read the options from that and override based on command line
* Added clientPackage command for adding/removing client side modules
* Fixed unit test with coverage for SystemJS Modules
