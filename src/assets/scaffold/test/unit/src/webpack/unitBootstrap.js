var testsContext = require.context("./dist/", true, /.spec.js$/);
testsContext.keys().forEach(testsContext);
