/* Stop the tests from running while we manually load the modules */
window.__karma__.loaded = function () { };

var TEST_REGEXP = /(spec)\.js$/i;
var allTestFiles = [];

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file.replace(/^\/base\/|\.js$/g, ''));
    }
});

var packages = unitModuleConfig.packages;
packages[''] = { defaultExtension: 'js' };

SystemJS.config({
    baseURL: '/base/',
    paths: unitModuleConfig.paths,
    packages: packages,
    meta: { /* Must set the module format to system, otherwise when coverage processes the module it won't be recognised */
        'dist/*': {
            format: 'system'
        }
    }
});

Promise.all(unitModuleConfig.preload).then(function () {
    Promise.all(allTestFiles.map(function (module) { return SystemJS.import(module) })).then(function (modules) {
        /* Now we have loaded all the modules we can start the tests */
        window.__karma__.start();
    });
});