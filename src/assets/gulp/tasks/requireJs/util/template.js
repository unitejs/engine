/**
 * Gulp utils for template.
 */
const os = require('os');
const gulp = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');

function copyTemplate(templateFile, indexFile, moduleConfigFilename, uniteConfiguration, clientModulesFolder) {
    let appName = "";
    let staticIncludes = [];
    let bodyAttributes = "";
    let moduleConfig = "";
    let bootstrap = [];

    appName = uniteConfiguration.title;

    if (uniteConfiguration.staticClientModules) {
        uniteConfiguration.staticClientModules.forEach(staticClientModule => {
            staticIncludes.push('<script src="./' + clientModulesFolder + '/' + staticClientModule + '"></script>');
        });
    }

    moduleConfig = '<script src="./' + moduleConfigFilename + '"></script>';

    bootstrap.push("require(preloadModules, function() {");
    bootstrap.push("    require(['dist/main'], function(main) {");
    bootstrap.push("        main.entryPoint();");
    bootstrap.push("    });");
    bootstrap.push("});");

    if (bootstrap.length > 0) {
        bootstrap.unshift("<script>");
        bootstrap.push("</script>");
    }

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