/**
 * Gulp tasks for protractor e2e testing.
 */
const display = require("./util/display");
const exec = require("./util/exec");
const gulp = require("gulp");
const browserSync = require("browser-sync");

let browserSyncInstance = null;

gulp.task("e2e-run-test", (done) => {
    display.info("Running", "Protractor");

    exec.npmRun("protractor", ["protractor.conf.js"], (success) => {
        browserSyncInstance.exit();
        if (success) {
            done();
        } else {
            process.exit(1);
        }
    });
});

gulp.task("e2e-serve", (done) => {
    display.info("Running", "BrowserSync");

    browserSyncInstance = browserSync.create();
    browserSyncInstance.init({
        "https": false,
        "notify": false,
        "online": true,
        "open": false,
        "port": 9000,
        "server": {"baseDir": ["."]}
    });

    done();

});

/* Generated by UniteJS */
