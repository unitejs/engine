/* Stop the tests from running while we manually load the modules */
window.__karma__.loaded = function() {};

var TEST_REGEXP = /(spec)\.js$/i;
var allTestFiles = [];

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file.replace(/^\/base\/|\.js$/g, ''));
    }
});

var paths = {};
var packages = {
    '': {
        defaultExtension: 'js'
    }
};

{REQUIRE_PATHS}
{REQUIRE_PACKAGES}

SystemJS.config({
    baseURL: '/base/',
    paths: paths,
    packages: packages
});

Promise.all(allTestFiles.map(function(module) { return SystemJS.import(module) })).then(function(modules) {
    /* Now we have loaded all the modules async we can start the tests */
    window.__karma__.start();
});


