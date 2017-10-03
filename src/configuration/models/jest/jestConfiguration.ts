/**
 * Model of Jest jest.config.json file.
 * see https://facebook.github.io/jest/docs/en/configuration.html
 */
import { JestConfigurationCoverageThreshold } from "./jestConfigurationCoverageThreshold";

export class JestConfiguration {
    public automock: boolean;
    public browser: boolean;
    public bail: boolean;
    public cacheDirectory: string;
    public collectCoverage: boolean;
    public collectCoverageFrom: string[];
    public coverageDirectory: string;
    public coveragePathIgnorePatterns: string[];
    public coverageReporters: string[];
    public coverageThreshold: { [id: string]: JestConfigurationCoverageThreshold};
    public globals: { [id: string]: any};
    public mapCoverage: boolean;
    public moduleFileExtensions: string[];
    public moduleDirectories: string[];
    public moduleNameMapper: { [id: string]: string};
    public modulePathIgnorePatterns: string[];
    public modulePaths: string[];
    public notify: boolean;
    public preset: string;
    public projects: string[];
    public clearMocks: boolean;
    public reporters: (string | any[])[];
    public resetMocks: boolean;
    public resetModules: boolean;
    public resolver: string;
    public rootDir: string;
    public roots: string[];
    public setupFiles: string[];
    public setupTestFrameworkScriptFile: string;
    public snapshotSerializers: string[];
    public testEnvironment: string;
    public testMatch: string[];
    public testPathIgnorePatterns: string[];
    public testRegex: string;
    public testResultsProcessor: string;
    public testRunner: string;
    public testURL: string;
    public timers: string;
    public transforms: { [id: string]: any};
    public transformIgnorePatterns: string[];
    public unmockedModulePathPatterns: string[];
    public verbose: boolean;
    public watchPathIgnorePatterns: string[];
}
