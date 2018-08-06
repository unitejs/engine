/**
 * Model of Jest jest.config.json file.
 * see https://facebook.github.io/jest/docs/en/configuration.html
 */
import { JestConfigurationCoverageThreshold } from "./jestConfigurationCoverageThreshold";
export declare class JestConfiguration {
    automock: boolean;
    browser: boolean;
    bail: boolean;
    cacheDirectory: string;
    collectCoverage: boolean;
    collectCoverageFrom: string[];
    coverageDirectory: string;
    coveragePathIgnorePatterns: string[];
    coverageReporters: string[];
    coverageThreshold: {
        [id: string]: JestConfigurationCoverageThreshold;
    };
    globals: {
        [id: string]: any;
    };
    moduleFileExtensions: string[];
    moduleDirectories: string[];
    moduleNameMapper: {
        [id: string]: string;
    };
    modulePathIgnorePatterns: string[];
    modulePaths: string[];
    notify: boolean;
    preset: string;
    projects: string[];
    clearMocks: boolean;
    reporters: (string | any[])[];
    resetMocks: boolean;
    resetModules: boolean;
    resolver: string;
    rootDir: string;
    roots: string[];
    setupFiles: string[];
    setupTestFrameworkScriptFile: string;
    snapshotSerializers: string[];
    testEnvironment: string;
    testMatch: string[];
    testPathIgnorePatterns: string[];
    testRegex: string;
    testResultsProcessor: string;
    testRunner: string;
    testURL: string;
    timers: string;
    transforms: {
        [id: string]: any;
    };
    transformIgnorePatterns: string[];
    unmockedModulePathPatterns: string[];
    verbose: boolean;
    watchPathIgnorePatterns: string[];
}
