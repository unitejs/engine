/**
 * Gulp utils for template.
 */
const os = require('os');
const gulp = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');

function copyTemplate(templateFile, indexFile, moduleConfigFilename, uniteConfig, clientModulesFolder) {
    let appName = "";
    let staticIncludes = [];
    let bodyAttributes = "";
    let moduleConfig = "";
    let bootstrap = [];

    appName = uniteConfig.title;

    if (uniteConfig.staticClientModules) {
        uniteConfig.staticClientModules.forEach(staticClientModule => {
            staticIncludes.push('<script src="./' + clientModulesFolder + '/' + staticClientModule + '"></script>');
        });
    }

    const appPackageKeys = Object.keys(uniteConfig.clientPackages).filter(function (key) {
        return uniteConfig.clientPackages[key].includeMode === "app" || uniteConfig.clientPackages[key].includeMode === "both";
    });

    if (appPackageKeys.length > 0) {
        moduleConfig += '<script src="./dist/vendor-bundle.js"></script>' + os.EOL + '        ';
    }
    moduleConfig += '<script src="./dist/app-bundle.js"></script>';

    return gulp.src(templateFile)
        .pipe(replace('{APP_NAME}', appName))
        .pipe(replace('{STATIC_INCLUDE}', staticIncludes.join(os.EOL + "        ")))
        .pipe(replace('{BODY_ATTRIBUTES}', bodyAttributes))
        .pipe(replace('{MODULE_CONFIG}', moduleConfig))
        .pipe(replace('{BOOTSTRAP}', bootstrap.join(os.EOL + "        ")))
        .pipe(rename(indexFile))
        .pipe(gulp.dest("."));
}

module.exports = {
    copyTemplate: copyTemplate
};