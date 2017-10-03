/**
 * Model of Jest jest.config.json file coverage threshold.
 * see https://facebook.github.io/jest/docs/en/configuration.html
 */
export class JestConfigurationCoverageThreshold {
    public branches: number;
    public functions: number;
    public lines: number;
    public statements: number;
}
