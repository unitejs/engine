var readJSON = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function (e) {
        if (xhr.status === 200) {
            cb(JSON.parse(xhr.responseText));
        }
        else {
            console.error("readJSON error", url, xhr.statusText);
        }
    };
    xhr.onerror = function (e) {
        console.error("readJSON error", url, xhr.statusText);
    };
    xhr.send(null);
};

/* Stop the tests from running while we manually load the modules */
window.__karma__.loaded = function() {};

var TEST_REGEXP = /(spec)\.js$/i;
var allTestFiles = [];

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file.replace(/^\/base\/|\.js$/g, ''));
    }
});

readJSON("/base/unite.json", function(uniteConfiguration) {
    var paths = uniteConfiguration.testPaths;
    var packages = [];

    require.config({
        baseUrl: '/base/',
        paths: paths,
        packages: packages
    });

    require(allTestFiles, function() {
        /* Now we have loaded all the modules we can start the tests */
        window.__karma__.start();
    });
});
