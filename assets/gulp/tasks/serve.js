/**
 * Gulp tasks for serving site.
 */
const gulp = require('gulp');
const browserSync = require('browser-sync');

gulp.task('serve', (cb) => {
    browserSync({
        open: false,
		online: true,
        port: 9000,
        https: false,
		online: true,
        server: {
            baseDir: ['.']
        }
    }, cb);
});

gulp.task('serve-secure', (cb) => {
    browserSync({
        open: false,
		online: true,
        port: 9000,
        https: true,
		online: true,
        server: {
            baseDir: ['.']
        }
    }, cb);
});
