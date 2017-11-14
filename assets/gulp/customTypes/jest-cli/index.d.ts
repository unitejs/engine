/// <reference types="jest"/>

declare module "jest-cli" {

    namespace jestCli {
        function runCLI(options: Options | jest.GlobalConfig, configs: string[], cb: (result: Results) => void): void;

        interface Options {
            collectCoverageFrom: string[];
        }
        type Results = jest.AggregatedResult;
    }

    export = jestCli;

}