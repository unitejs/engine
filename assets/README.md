# Generated App

The main contents of the application are in the www folder, it is created this way to allow for platform and packaged versions folders in the root.

The following global pre-requisities are needed

``` shell
npm -g install gulp [or] yarn global add gulp
```

Once gulp is installed you can install the npm packages for the app by running the gulp commands from the www folder.

``` shell
npm install [or] yarn install
```

## Gulp Tasks

The following gulp commands are available for the app.

* build
* theme-build
* unit [optional - available if you have configured a unit test runner]
* e2e-install [optional - available if you have configured an e2e test runner]
* e2e [optional - available if you have configured an e2e test runner]
* serve
* version
* doc-build [optional - available if you have configured a documenter]
* platform-cordova-dev [optional - requires cordova platform]
* platform-cordova-theme [optional - requires cordova platform]
* platform-docker-package [optional - requires docker platform]
* platform-electron-dev [optional - requires electron platform]
* platform-electron-package [optional - requires electron platform]
* platform-web-package [optional - requires web platform]

### build

This will transpile and build the app ready to run.

``` shell
gulp build
```

You can specify a buildConfiguration (see the buildConfiguration command for details on how to add one) with the following syntax:

``` shell
gulp build --buildConfiguration=prod
```

If you don't want to keep running the build command you can add the watch switch, this will monitor for changes in source/views/styling and build whatever is required. This will perform an initial complete build to make sure it is error free, but will only run some of the sub tasks for changes. You should run a full build again before performing other tasks:

``` shell
gulp build --watch
```

### theme-build

You will need to run this task at least once to generate the necessary favicon images and meta tags. See [Theme Assets](#themeassets) for more details.

``` shell
gulp theme-build
```

### unit

This will run unit tests for the app and generate unit and coverage reports in the test/reports folder. This task is only available if you specified a unit test runner, framework and engine during configuration.

``` shell
gulp unit
```

You can run just a subset of tests by providing a source name as follows:

``` shell
gulp unit --grep=app
```

Or run in a browser (this will only work if the unit test runner is Karma) using:

``` shell
gulp unit --browser=[chrome/chromeheadless/edge/firefox/ie/phantomjs/safari]
```

If you don't want to keep running the full unit command you can add the watch switch, this will monitor for changes in source/views/styling and build whatever is required.

``` shell
gulp unit --watch
```

### e2e-install

This will install all the necessary components required for the e2e tests, it need only be run once. This task is only available if you specified an e2e test runner and framework during configuration.

``` shell
gulp e2e-install
```

The Selenium runtime will always be installed, but you can limit the browser driver to only a specific set by supplying a comma separated list as follows.

``` shell
gulp e2e-install --drivers=chrome,firefox
```

The drivers can be any of the following chrome/edge/firefox/ie.

You can specify a specfic version of a driver using the @ syntax.

``` shell
gulp e2e-install --drivers=chrome@2.33,firefox
```

### e2e

This will run e2e tests for the app and generate reports in the test/reports folder. This task is only available if you specified an e2e test runner and framework during configuration.

``` shell
gulp e2e
```

You can run just a subset of tests by providing a source name as follows:

``` shell
gulp e2e --grep=app
```

You can specify that the tests are run over https or on a different port using the switches:

``` shell
gulp e2e --secure --port=5000
```

You can also run the tests on a different browser from the default chrome by using:

``` shell
gulp e2e --browser=[chrome/edge/firefox/ie/]
```

### serve

This will serve the app for you to view in a browser.

``` shell
gulp serve
```

You can specify that the content is served over https or on a different port using the switches:

``` shell
gulp serve --secure --port=5000
```

This command will also watch for changes in the files being served, rebuild them and then reload the browser.

### version

This will allow you to show or update the package version.

``` shell
gulp version
```

Running this task with no parameters will show the current version, alternatively use the following parameters to update the version:

* --part=[major, minor, patch] - the part of the version you want to modify
* --mode=[set, inc] - set the part to a specific value or increment the current value
* --value=someValue - required if you use the set mode

``` shell
gulp version --part=patch --mode=inc
gulp version --part=minor --mode=set --value=1
```

### doc-build

This task will generate documentation from the comments in the source code from your ./www/src folder.

``` shell
gulp doc-build
```

The output is created in ./docs/ folder in the root of your project.

### platform-cordova-dev

This task will create a cordova development setup in the ./platform/cordova folder. It defaults to adding the cordova platforms android, ios and windows. You can run this task multiple times without losing any changes you have made to the cordova projects, in fact **you must** run this again if your web app changes so that it copies accross the new content into the ./platform/cordova/www folder.

The meta data used to generate the configurations is all picked up from ./www/assetsSrc/unite-theme.json such as title, description, organization, namespace, author. The version is read from your ./www/package.json

There are no packaging tasks available for cordova as the build processes are platform specific. Once you have generated the projects you can use all the regular cordova commands, see [Cordova Project](https://cordova.apache.org/docs/en/latest/) for more details.

``` shell
gulp platform-cordova-dev
```

You can override the default platforms and save them as follows:

``` shell
gulp platform-cordova-dev --platforms=android,windows --save
```

You will also need to match the configuration used by the build, you can do this with the buildConfiguration argument.

``` shell
gulp platform-cordova-dev --buildConfiguration=prod
```

### platform-cordova-theme

This task will generate all the necessary icons and splash screens for your chosen platforms using the ./www/assetsSrc/ logos and your theme colors from ./www/assetsSrc/theme/unite-theme.json.

``` shell
gulp platform-cordova-theme
```

You can generate the icons for a specific platform as follows:

``` shell
gulp platform-cordova-theme --platforms=ios
```

### platform-docker-package

This task will package your web app into the docker image that you choose, if you don't supply any parameters it will default to nginx. The output of the task will be written to ./packaged/{version}\_docker\_{image}.tar

``` shell
gulp platform-docker-package
```

You will also need to match the configuration used by the build, you can do this with the buildConfiguration argument.

``` shell
gulp platform-docker-package --buildConfiguration=prod
```

Optionally specify the docker base image and where you want the web content within that image. If you also specify the --save options the values will be saved as the default for future runs of all the platform-docker-* tasks.

``` shell
gulp platform-docker-package --image=httpd --www=/usr/local/apache2/htdocs/ --save
```

Alternatively you can set the defaults as values in the unite.json platforms section:

``` json
"platforms": {
    "Docker": {
        "image": "httpd",
        "www": "/usr/local/apache2/htdocs/"
    }
}
```

If you want to add additional files to the docker image just place them in ./www/assetSrc/docker/{image}/ folder and the structure will be copied recursively to the root of the image.

**Examples**

To replace the default nginx configuration add the following file to ./www/assetSrc/docker/nginx/etc/nginx/nginx.conf

To replace the default httpd configuration add the following file to ./www/assetSrc/docker/httpd/usr/local/apache2/conf/httpd.conf

### platform-electron-dev

This task will create development versions of the electron runtime that will wrap your www folder and allow you to develop in-situ.

``` shell
gulp platform-electron-dev
```

Optionally specify the platform architectures and runtime version to override the defaults. If you also specify the --save options the values will be saved as the default for future runs of all the platform-electron-* tasks.

``` shell
gulp platform-electron-dev --platformArch=win32/ia32,win32/x64 --runtimeVersion=1.7.9 --save
```

The platform development versions will be created in the ./platform/electron/{platform}-{architecture} folder, where the platforms and architectures are either read from your unite.json or automatically determined from you system.

### platform-electron-package

This task will gather all the necessary components of the application and create a folder in the top level packaged directory named {version}/electron.

``` shell
gulp platform-electron-package
```

You will also need to match the configuration used by the build, you can do this with the buildConfiguration argument.

``` shell
gulp platform-electron-package --buildConfiguration=prod
```

Optionally specify the platform architectures and runtime version to override the defaults. If you also specify the --save options the values will be saved as the default for future runs of all the platform-electron-* tasks.

``` shell
gulp platform-electron-package --platformArch=win32/ia32,win32/x64 --runtimeVersion=1.7.9 --save
```

This folder will then be used to create a set of platform/architecture electron packages in folders named {version}/electron_{platform}_{architecture} and a corresponding zip file in the packaged root folder.

To see which file are included in a packaged version see the [Platform Packaged Files](#platformpackagedfiles) section.

For configuring options for this task see the [Platform Electron](#platformelectron) section.

### platform-web-package

This task will gather all the necessary components of the application and create a folder in the top level packaged directory named {version}/web.

``` shell
gulp platform-web-package
```

You will also need to match the configuration used by the build, you can do this with the buildConfiguration argument.

``` shell
gulp platform-web-package --buildConfiguration=prod
```

This folder contains a complete set of web deployable files for the application. A zip file named packaged/{version}_web.zip will also be created in the packaged directory.

To see which file are included in a packaged version see the [Platform Packaged Files](#platformpackagedfiles) section.

For configuring options for this task see the [Platform Web](#platformweb) section.

---

## <a name="themeassets"></a>Theme Assets

During the app generation 3 files will have been created, if you change any of them then you should run the theme-build task again.

* assetsSource/theme/logo-tile.svg
* assetsSource/theme/logo-transparent.svg
* assetsSource/theme/unite-theme.json

In addition there are 2 more files for the default loader which you can modify, these are absorbed into your index.html during build.

* assetsSource/theme/loader.css
* assetsSource/theme/loader.html

The logo-tile.svg image should have a design that works well on a tile, e.g. a white icon with transparent background (the background color can be specified as part of the unite-theme.json configuration).

The logo-transparent.svg image should be a normal colored icon also on a transparent background, mostly used for the .ico image.

The fields in the unite-theme.json should be self explanatory in terms of what they generate in the index.html page. The themeHeaders will get overwritten when you run theme-build again so any custom headers you want should go in the customHeaders property. The backgroundColor is used for tile backgrounds and the themeColor is used to color the safari pinned icon mask, as well as during asset generation from your svg icons.

Some of the fields are used to generate the ./assets/favicon/manifest.json which is used by some browsers when the web site is pinned, others are used during platform generation e.g. PWAs, Cordova.

Information tags passed as args into the unite configure command are stored in unite-theme.json and are mapped to other properties i.e. title, shortName, description, keywords, organization, copyright, webSite, author, authorEmail, authorWebSite, namespace.

``` json
{
    "title": "UniteJS",
    "metaDescription": "UniteJS Web Site", // description
    "metaKeywords": [ // keywords
        "UniteJS",
        "CLI"
    ],
    "customHeaders": [
        "<meta property=\"twitter:site\" content=\"@unitejs\">"
    ],
    "themeHeaders": [
        ... Generated by theme-build task
    ],
    "backgroundColor": "#339933",
    "themeColor": "#339933",
    "shortName": "UJS",
    "organization": "2018 Obany Ltd",
    "copyright": "2018 Obany Ltd",
    "webSite": "http://unitejs.com",
    "metaAuthor": "Unite JS", // author
    "metaAuthorEmail": "fake@unitejs.com", //authorEmail
    "metaAuthorWebSite": "http://unitejs.com", // authorWebSite
    "namespace": "unitejs.com"
}
```

## <a name="platformpackagedfiles"></a>Platform Packaged Files

The files included within each package are calculated from the list below:

* index.html
* service-worker.js (if pwa is enabled)
* dist/**/*
* css/**/*
* assets/**/*
* assetsSrc/root/**/* - These files will be recursively copied to the root of the packaged version
* client packages code that is script included in index.html
* client packages assets defined in unite.json clientPackages section

## Platforms Options

If you manually edit your unite.json, you can add additional options for the platform settings.

### <a name="platformweb"></a>Web

There are currently no other options for this platform.

### <a name="platformelectron"></a>Electron

For more information about the options see the [Electron Documentation](https://github.com/electron-userland/electron-packager#readme)

You can choose to use a specific version of the Electron runtime, if not specified it defaults to the most recent stable version see [Electron Releases](https://github.com/electron/electron/releases).

You can specify one or more of the platform architecture combinations, if you don't specify any platforms the packager will try and identify your current platform/architecture and create a package accordingly.

Any others keys in the Electron settings will be converted into -- params and passed to the packager, this allows for other options like those specific to the darwin/mas or win32 targets [Electron Usage](https://github.com/electron-userland/electron-packager/blob/master/usage.txt) to be used.

``` json
"platforms": {
    "Electron": {
        "runtimeVersion": "1.7.5",
        "platformArch" : [
            "win32/ia32",
            "win32/x64",
            "darwin/x64",
            "mas/x64",
            "linux/ia32",
            "linux/x64",
            "linux/armv7l"
        ]
        ...
    }
}
```

## Build Configuration Variables

With each configuration that is created a .json file is created in the ./configuration folder with the same name. The values that you store in the config files are then available in the window.unite.config namespace at runtime depending on the type of build you create. Also in the configuration folder is a common.json file which you can use to store any values common to all configurations. 

The TypeScript definitions for this object are in this repo [UniteJS Types](https://github.com/unitejs/types) and can be referenced in TypeScript using:

``` typescript
/// <reference types="unitejs-types" />
```

Example configuration files:

configuration/common.json

``` json
{
    "myCommonVariable": "myValue"
}
```

configuration/dev.json

``` json
{
    "myApiKey": "--dev-key--"
}
```

configuration/prod.json

``` json
{
    "myApiKey": "--prod-key--"
}
```

At runtime a dev build would allow you to access the variables as follows:

``` javascript
console.log(window.unite.config["myCommonVariable"]); // myValue
console.log(window.unite.config["myApiKey"]); // --dev-key--
```

At runtime a prod build would allow you to access the variables as follows:

``` javascript
console.log(window.unite.config["myCommonVariable"]); // myValue
console.log(window.unite.config["myApiKey"]); // --prod-key--
```

## Runtime Variables

In addition there are some other fields available in the window.unite object which are automatically populated at build time.

``` json
{
    ...
    "configName": "prod", // The configuration name used to build this version
    "bundle": true, // The buildConfiguration bundle flag
    "minify": true, // The buildConfiguration minify flag
    "pwa": false, // The buildConfiguration pwa flag
    "packageVersion": "1.3.1", // The package.json version field
    "uniteVersion": "1.6.1", // The UniteJS version used to configure the app
    "buildDateTime": 1509618433502, // A JavaScript timestamp when the build was created
    "buildNumber": "20171102102713" // A build number which is automatically picked up from your CI build system
}
```

## Modifications To Generated Files

If you modify any of the files generated by UniteJS then you should remove the *Generated by UniteJS* comment at the bottom of the file. If you then call any of the UniteJS operations again your changes will be retained. Any files which are generated but can not contain comments because of their format (e.g. .json files) will where possible be combined with any changes you have made.

## Icon Modifications

Of course you don't need to run the theme-build task you could instead generate your own icons and headers using a site such as [RealFaviconGenerator](https://realfavicongenerator.net/) and copy the headers in to the customHeaders property and the icons wherever you like in your site. All credit goes to RealFaviconGenerator for the inspiration of the minimal set of resources need to satisfy modern browsers.

---
*Generated by UniteJS* :zap:
