# Changelog

## 1.8.0

* Major dependency update
* Angular v8
* Babel v7
* Electron v3.0.5
* Eslint v5
* Jest v23
* Jsdom v12
* Karma v3
* Mocha v5
* Polymer v3
* Rxjs v6
* Webpack v4
* Removed all gulp-util usage

## 1.7.12

* UnitTestFramework and UnitTestEngine disabled if using profile and then disabling UnitTestRunner
* E2ETestFramework disabled if using profile and then disabling E2ETestRunner
* Changed preact requireJS/systemJS transpilation to use .mjs module
* Added explicit reference to @types/webcomponents.js for polymer

## 1.7.11

* Updated Vue TypeScript config to have esModuleInterop = true
* Removed jest mapCoverage option

## 1.7.10

* Updated dependencies
* Added additional TypeScript libs to transpile module tasks

## 1.7.9

* Change e2e-transpile and unit-transpile tasks to include all files that are not *.spec
* Change e2e-clean and unit-clean tasks clean all transpiled files not just *.spec
* Change client package includeMode and scriptInclude mode defaults calculated in tasks
* Fixed package.json could contain entries in dependency and devDependency
* Change reversed order of transform-decorators-legacy and transform-class-properties babel plugins

## 1.7.8

* Added conditions to unite package client configurations
* Added isDevDependency flag to client packages

## 1.7.7

* Fixed sibling node_modules location

## 1.7.6

* Moved peerPackages.json to packages repo
* Added driver version args to e2e-install

## 1.7.5

* Added package command to provide access to unitejs-packages
* Added routing to Vanilla application
* Added Vanilla generate component
* Updated react and preact generate and child code with substituted message in template
* Updated angular child template to be span not div
* Change general consistency improvements in all app framework templates
* Fixed missing iron-pages and iron-selector from polymer project
* Fixed vue template errors not being displayed during build process
* Fixed webpack bundling now uses more specific alias for wildcard libraries

## 1.7.4

* Unified application framework protractor plugins
* Unified application framework webdriver plugins

## 1.7.3

* Fixed framework path in ESDoc

## 1.7.2

* Added EsDoc
* Added JsDoc
* Added TypeDoc
* Added documentation to framework sources files and generated elements
* Change profile command line switch now overrides any current configuration
* Change application framework template files are now strict code
* Change Plain App renamed to Vanilla

## 1.7.1

* Added StyleLint
* Added SassLint
* Added LessHint
* Fixed case sensivity of None option for configure args unitTestRunner, e2eTestRunner, linter

## 1.7.0

* Change Gulp tasks written in TypeScript and transpiled to JavaScript
* Change Browserify no longer minifies already minified vendor packages
* Change Improved speed of gulp tasks by only including those required by task
* Change Loading spinner separated into theme css and html files, default is now pure css no svg
* Change index.html has additional minification applied for inline css and js
* Fixed Protractor Jasmine E2E tests now exit correctly when there are errors
* Fixed Webdriver manager e2e-install correctly disables unused drivers
* Fixed Author field in cordova config.xml
* Fixed constructor for react components in generated tests

## 1.6.8

* Fixed title in generated readme.md

## 1.6.6

* Change Webdriver e2e tasks now use more specific drivers and options when running
* Fixed title is picked up correctly from old versions of unite.json
* Fixed json helper now correctly parses params

## 1.6.5

* Added cordova support
* Added additional optional meta data for configure command (description, shortName, organization, keywords,
* namespace, webSite, copyright, author, authorEmail, authorWebSite)

## 1.6.4

* Change title property moved from unite.json to unite-theme.json
* Change updated completion messages for platforms with more information about required pre-requisites

## 1.6.3

* Fixed PlainApp so that it is has a child element styled like other frameworks, so e2e works

## 1.6.2

* Change Angular updated to v5
* Change Angular v5 no longer needs reflect-metadata so removed
* Change Angular changed core-js/client/shim.js to core-js/client/shim.min.js for minified builds
* Added hasOverrides flag for client packages so a unite configure will not overwrite and custom changes
* Fixed removing a client package didn't remove it from dependencies if it already existed
* Fixed added missing dependency for through2

## 1.6.1

* Added Progressive Web App support including service worker, caching and manifest as a buildConfiguration option
* Added additional fields to unite-theme.json for shortName for use un PWA manifest, defaults to title
* Added default progress spinner to index page colored with theme color, automatically removed when #root is populated
* Added additional fields to unite-theme.json for appLoader and appLoader style
* Added noscript block to index templates
* Added buildNumber and buildDateTime to runtime window.unite.json variable
* Added googleAnalyticsId in a buildConfiguration will inject GA script and initialise
* Change script includes are deferred to later in index page instead of blocking
* Change css loading is deferred to later in index page instead of blocking

## 1.6.0

* Added Polymer support
* Added support for transpilation of client packages during build
* Change Preact now uses module transpilation so can support AMD and SystemJS
* Change wildcard client packages can now have more targeted includes (mainLib)
* Change improved loader replacement regex
* Change Browserify and Webpack only auto inject styles if they used systemjs-plugin-css in unbundled mode
* Fixed undefined global module entry in app-module-config
* Fixed order of transform-class-properties, transform-decorators-legacy is important for babel

## 1.5.1

* Change Decreased size of dependencies

## 1.5.0

* Added --platformArch, --runtimeVersion, --save option to platform-electron-package
* Added --save option to platform-docker-package
* Added karma edge launcher
* Change Generate command now displays the files it has written
* Change License None does not add package json entry
* Change Updated npm install / yarn install message
* Change Refactored some engine functionality to make it accessible to external development
* Change Command line option lists are now seperated with commas not semi-colons (BREAKING)
* Change improved browser switch detection for gulp unit task
* Fixed LICENSE file not deleted if license options changed to None

## 1.4.0

* Added docker support to automatically build your web content into a docker image (defaults to nginx)

## 1.3.1

* Change improved linux electron icon

## 1.3.0

* Fixed missing dependency on jest-cli

## 1.2.9

* Fixed platform-electron-dev now works on darwin based platforms

## 1.2.8

* Fixed platform-electron-dev now works on darwin based platforms

## 1.2.7

* Added task platform-electron-dev which creates an electron build pointing at your www folder
* Change Electron packaged version default to compressing contents with asar option
* Fixed Packaging missed files when clientPackages used wildcards (e.g. rxjs)

## 1.2.6

* Added support for json configuration files based on buildConfiguration merged into window.unite variable
* Added default configuration json files generated on configure command
* Added contents of ./www/assetsSrc/root are copied to the root folder in the packaging tasks
* Added PlainApp profiles
* Added additional README.md to root folder of generated app
* Added license option None
* Change moved license reading logic into pipeline step
* Change vue application framework now uses urls in template configuration and compiles them using gulp-inline-vue-template
* Change fixed vue version as the new 2.5.0 release typescript definitions don't work correctly

## 1.2.5

* Change Electron Packaging defaults to identifying the current platform for its default platform/architecture if none specified in config

## v1.2.4

* Added Vue Support
* Added browserify/webpack include view templates using stringify/raw-loader
* Fixed browserify/webpack bundling correct version of modules and not the automatic modules read from package.json by bundler
* Fixed browserify/webpack NODE_ENV var for production/development

## v1.2.3

* Added Preact support
* Added node version check on initialisation
* Change Split peerDependencies into separate asset peerPackages.json to remove npm/yarn warning about unmet peer dependencies
* Change generated Enum types name no longer postfixed with Enum

## v1.2.2

* Added Jest support for Unit Test Runners
* Added JSDom support for Unit Test Engines
* Updated Reacts profile to use Jest and Yarn
* Added Synthetic import template substitutions based on module type
* Added module id template substitutions based on module type
* Added strip module id defnitions for angular on bundled builds as views and styles are inlined
* Added unit test transpilation to include .mock.js files as well as .spec.js
* Change improved regex replace for src/dist replace
* Change unit-module-config only generated for karma
* Change E2E tests default to running chrome headless as the browser

## v1.2.1

* Change React updated to v16
* Added React components can use external css files
* Added error if trying to run unit tests on a bundled build
* Added E2E Tests for font-size for all platform configuration combinations
* Added es6-shim dependency for PhantomJS
* Added Generate command now aborts if item already exists
* Fixed SystemJS loader not working with html views in some configurations
* Fixed build-css-post-components failing to read source files with correct extension
* Fixed Angular __moduleName || module.id substitution for CommonJS/SystemJS modules

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
* Fixed build-css-post-components copying to wrong location

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
