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
require.config({
    baseUrl: '/base/',
    paths: paths,
    packages: packages
});

require(allTestFiles, function() {
    window.__karma__.start();
});
