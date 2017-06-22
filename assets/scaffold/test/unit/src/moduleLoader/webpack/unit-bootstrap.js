/* Stop the tests from running while we manually load the modules */
window.__karma__.loaded = () => { };

var TEST_REGEXP = /(spec)\.js$/i;
var allTestFiles = [];

Object.keys(window.__karma__.files).forEach((file) => {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file.replace(/^\/base\/|\.js$/g, ''));
    }
});

require.config({
    baseUrl: '/base/',
    paths: unitModuleConfig.paths,
    packages: unitModuleConfig.packages
});

require(unitModuleConfig.preload, () => {
    require(allTestFiles, () => {
        /* Now we have loaded all the modules we can start the tests */
        window.__karma__.start();
    });
});

/* Generated by UniteJS */