/**
 * Gulp tasks for unit testing TypeScript.
 */
const display = require('./util/display');
const uc = require('./util/unite-config');
const gulp = require('gulp');
const path = require('path');
const remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

gulp.task('unit-report', (done) => {
    display.info('Running', 'Coverage Remap');

    const uniteConfig = uc.getUniteConfig();

    return gulp.src(path.join(uniteConfig.directories.reports, 'coverage-final.json'))
		.pipe(remapIstanbul({
			reports: {
				'json': path.join(uniteConfig.directories.reports, 'coverage.json'),
				'html': path.join(uniteConfig.directories.reports, 'coverage'),
                'text-summary': ''
			}
		}));
});
