# Changelog

## v1.2.0

* Added generate command
* Added Angular generate class, component, directive, enum, guard, interface, module, pipe, service
* Added Aurelia generate attribute, binding-behavior, class, component, element, enum, interface, pipeline-step, value-converter
* Added React generate class, component, enum, interface
* Added PlainApp generate class, enum, interface
* Refactored engine commands to make it easier to extend
* Added jsconfig.json is now generated for JavaScript=sourceLanguage and ides contains VSCode
* Added ides property to UniteConfiguration
* Added exclude node_modules to jsconfig.json and tsconfig.json
* Added experimental decorators flag for react
* Populated include and exclude properties in tsconfig.json and jsconfig.json
* ESLint does not terminate on warnings
* TSLint does not terminate on warnings
* Async gulp stream wrapping switched to use stream-to-promise for some streams (eslint)

## v1.1.0

* Improved error handling in gulp tasks
* Added watches on source when running gulp serve task
* Added watches on views when running gulp serve task
* Added watches on styles when running gulp serve task
* Added --watch option for unit tests to multirun and watch for changes
* Source, view, style file extensions can be configuered by application frameworks
* Fixed transpile tasks not returning async
* Changed Aurelia JavaScript linter to babel-eslint
* Changed Aurelia JavaScript transpiler to include "transform-decorators-legacy plugin
* SystemJS bundling now also handles commonjs and amd modules
* Angular now supports templateUrl and styleUrls in components
* Change pipeline step to have more phases and remove influences for ordering
* Fixed SystemJS unite-bootstrap preloadModules
* Fixed running configure from directory with no parameters successfully updates
* Change pipeline steps enumerated from directories instead of fixed list
* Change folder deletion looks for files without generated markers
* Improved pipeline exception handling
* CSS Build for components moved earlier in the build task, so they can be inlined in transpilation
* Change use babel-preset-env instead of babel-preset-es2015

## v1.0.1

* Fixed script includes in index.html now uses isModuleLoader flag for ordering

## v1.0.0

* Release
* Fixed Ordering of karma include files can now be specified to help polyfills and module loaders

## v0.9.9

* Fixed missing bluebird when running karma with phantomjs

## v0.9.8

* Fixed missing assets folder when creating theme

## v0.9.7

* CLI version now shows engine as well
* Added noScript option for clientPackages to exclude any main/mainMinified
* HTML Template Script includes are generated at build time not configure
* Remove unit-ui gulp task added --browser args to gulp unit
* Added Firefox, Safari, IE launchers for Karma
* Karma read current config and modify not overwrite
* Karma generates include files at unit test time not configure
* Removed karma pipeline step during clientConfiguration commands
* Pipeline built using influences so dependenies are always ordered correctly

## v0.9.6

* Fixed existing clientPackages removed from karma.config on clientPackage add/remove
* Added missing validation for clientPackage scriptIncludeMode argument
* Added missing parameter display for clientPackage add

## v0.9.5

* Fixed client package add with supplied version retrieves correct main
* Fixed platform packaging missing files included as scripts
* Fixed gulp display logging didn't display false args
* Added Aurelia app adds experimental decorators to TypeScript compiler options
* Added lang=en to htmlTemplate
* Added meta viewport to htmlTemplate

## v0.9.4

* Fixed client package add with no version fails

## v0.9.3

* Added UnitTestEngine which can be PhantomJS or ChromeHeadless
* Added e2e tasks support --browser=[chrome/firefox/ie/edge]
* Added e2e tasks support --secure to launch as https
* Added e2e tasks support --port to launch on different port
* Added serve tasks support --secure to launch as https
* Added serve tasks support --port to launch on different port
* Removed serve-secure task
* Pipeline steps are dynamically loaded
* Option validation performed by looking for module, now case insensitive
* Some pipeline steps renamed for clarity
* Package managers merged with their pipeline steps
* Client Package separator changed to ";" for consistency

## v0.9.2

* Added Angular as an App Framework
* Changed requirejs/text module to requirejs-text
* Improved module config to only add text/css loaders when necessary
* Client packages can now be wildcards e.g. rxjs
* Added map capabilities to client packages
* Added loader capabilities to client packages
* Added testing additional components to client packages
* Script Include Mode now allow for "none", "bundled", "notBundled", "both" instead of boolean
* Gulp pipeline step removes tasks if options change
* Karma includes and additional testing libs from client packages
* Added default ESLint parser to espree
* Fixed merging configuration could produce duplicate entries in arrays of objects
* Added force parameter to engine to ignore any existing config files

## v0.9.1

* Fixed missing gulpfile.js from assets in npm package

## v0.9.0

* Finalise API
* Unit Tests and Fixes
* Generate App - Unit Test Reports show full coverage not summary
* Generate App - Unit Tests now show coverage for all files not just those with tests using karma-coverage-allsources
* Generate App - Added Unit Test also outputs lcov
* Generate App - Unit Tests can be run with grep command to include only specific tests
* Generate App - E2E Tests can be run with grep command to include only specific tests
* Generate App - Moved reports folder into test
* Renamed AssetsSource to AssetSrc for consistency
* Karma testing includes clientPackage assets
* LICENSE file has year substituted in

## v0.8.1

* Housekeeping and CI Integration

## v0.8.0

* Added platform packager web
* Added platform packager electron with icon support for win32/darwin/linux
* Added version gulp tasks
* Added assets for client packages, used in platform packaged versions
* unite.json directories configuration changes to have www sub property
* node_modules path rationalised in config
* npm package manager called directly instead of through interop
* E2E plugins created
* Fixed safari_pinned_tab color in meta headers
* Fixed saving theme headers into unite-theme.json

## v0.7.1

* Rationalised logging/display interfaces
* Renamed repo to engine
* Moved unite.json up one level

## v0.7.0

* Main command is now "configure" not "init" as it can be run repeatedly
* Main app now created in www sub directory in preparation for platform wrappers
* Gulp tasks rewritten using async/await
* Pipeline steps have prerequisites step to halt configuration earlier
* Documentation updated
* Added package.json engine node minimum version 8 for util.promisify

## v0.6.2

* Bugfix

## v0.6.1

* Added html theme with favicon generation

## v0.6.0

* Refactored into framework and cli-core libraries

## v0.5.1

* Added React app framework
* Aurelia Framework bootstrap layout updated
* All HTML layouts moved to root element instead of direct in body
* babelrc now reads existing config
* improved debrit removal for eslint config
* Fixed missing test dependencies for client packages e.g. chai
* Fixed missing test client packages in karma runner
* Added support for production build versions of vendor libraries
* Added isPackage, main and mainMinified options to clientPackage add operation
* Fixed clientPackages sections in help
* Improved async performance of PlainApp e2e tests

## v0.5.0

* Added Application Framework support
* Added Aurelia Framework with RequireJS,SystemJS Bundling support
* HTML Minification for bundling
* Bundling improvements for html, css
* Removed cajon usage and use systemjs for unbundled and unit testing to load cjs modules

## v0.4.1

* Help improvements and tidy up

## v0.4.0

* Added buildConfigurations which allows bundling, minification, sourcemaps and build variables
* Removed unused staticClientModules from unite.json
* Separated module loader and bundling
* Separated bundled and not bundled index pages
* Config files only deleted if they have the creation marker
* Added bundling support for SystemJS and RequireJS

## v0.3.0

* Added E2E Test Runner with Protractor or Webdriver running Selenium
* Added E2E Test Framework with Jasmine/Mocha-Chai
* Changed js based config json to be code syntax (single quotes, properties not quoted)
* Fixed Jasmine Unit Tests missing jasmine-core
* Fixed Unit Bootstrap ES6 Syntax

## v0.2.1

* Added generated marker to gitignore file
* Refactored pipeline steps
* generated package.json retains custom added data
* init can be called multiple times even if a user has changed files as long as they remove generated markers

## v0.2.0

* Added css preprocessor support css,less,sass,stylus integration
* Added css postprocessor support none,postcss
* File copies now always check for "Generated By UniteJS" marker before overwriting
* Fixed missing template.js include in build task
* Improved error handling on transpile and lint tasks

## v0.1.2

* HTML template generated by Unite not during build tasks
* SystemJS and RequireJS now use same entryPoint as Webpack and Browserify
* Transpile tasks now abort on error
* Lint tasks now abort on error

## v0.1.1

* Package Manager can be specified for any command and is remembered for future use
* Added license command line option [SPDX](https://spdx.org/licenses/) to generate LICENSE
* Removed uniteDependencies.json and added to package.json peerDependencies
* Generates README.MD file
* Fixed bug in SystemJS HTML
* Added .eslintignore generation
* Linting keeps changes to configuration files made by user

## v0.1.0

* Added linting option

## v0.0.11

* Added gulp serve

## v0.0.10

* Fix script line endings

## v0.0.9

* Cross platform fixes

## v0.0.8

* Cross platform fixes

## v0.0.7

* Fixed casing for asset folders
* Fixed dist folder not existing for module config
* Pipeline steps refactored

## v0.0.6

* Karma.conf is now static instead of dynamic so it can be run standalone
* Remap istanbul merged into karma.conf instead of separate gulp task
* module configurations can now distinguish between app and test modules
* Fixed package manager add used wrong working directory

## v0.0.5

* Added browserify support
* Added yarn support for clientPackages
* Sourcemap src location is now consitent for all loaders
* Webpack and Browserify Unit Tests use cajon loader instead of loading packs
* Fixed coverage report for Webpack and Browserify
* Fixed bug with missing preloadModules for SystemJS and RequireJS

## v0.0.4

* Output directory can be omitted which will use current directory
* If a unite.json exists in the output directory it will read the options from that and override based on command line
* Added clientPackage command for adding/removing client side modules
* Fixed unit test with coverage for SystemJS Modules
