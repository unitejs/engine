/**
 * Gulp utils for display.
 */
const gutil = require('gulp-util');

function log(text) {
    gutil.log(text);
}

function info(caption, text) {
    gutil.log('[' + gutil.colors.cyan(caption) + ']', text);
}

function error(text) {
    gutil.log(gutil.colors.red(text));
}

function success(text) {
    gutil.log(gutil.colors.blue(text));
}

module.exports = {
    log: log,
    info: info,
    error: error,
    success: success
};