/**
 * Gulp tasks for wrapping Browserify modules.
 */
const display = require('./util/display');
const gulp = require('gulp');
const path = require('path');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourceMaps = require('gulp-sourcemaps');
const uc = require('./util/unite-config');
const packageJson = require('../../package.json');
const merge = require('merge2');

gulp.task('build-bundle', function () {
    display.info('Running', "Browserify");

    const uniteConfig = uc.getUniteConfig();

    const bVendor = browserify({
        debug: true
    });

    const bApp = browserify({
        entries: './' + path.join(uniteConfig.directories.dist, "entryPoint.js"),
        debug: true
    });

    const vendorKeys = Object.keys(packageJson.dependencies);
    if (vendorKeys && vendorKeys.length > 0) {
        vendorKeys.forEach(function(vendor) {
            bVendor.require(vendor);
            bApp.exclude(vendor);
        });
    }

    return merge([ 
        bApp.bundle()
            .pipe(source('app-bundle.js'))
            .pipe(buffer())
            .pipe(sourceMaps.init({ loadMaps: true }))
            .pipe(sourceMaps.mapSources(function(sourcePath, file) {
                return sourcePath.replace(/dist\//, './');
            }))
            .pipe(sourceMaps.write({includeContent: true}))
            .pipe(gulp.dest(uniteConfig.directories.dist)),
        bVendor.bundle()
            .pipe(source('vendor-bundle.js'))
            .pipe(buffer())
            .pipe(sourceMaps.init({ loadMaps: true }))
            .pipe(sourceMaps.write({includeContent: true}))
            .pipe(gulp.dest(uniteConfig.directories.dist))
    ]);
});

