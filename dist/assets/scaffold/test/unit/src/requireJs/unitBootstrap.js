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
var packages = [];
{REQUIRE_PATHS}
{REQUIRE_PACKAGES}
require.config({
    baseUrl: '/base/',
    paths: paths,
    packages: packages
});

require(allTestFiles, function() {
    /* Now we have loaded all the modules we can start the tests */
    window.__karma__.start();
});
