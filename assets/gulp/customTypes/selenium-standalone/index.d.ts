declare module 'selenium-standalone' {
    namespace selenium {
        interface SeleniumInstance {
            kill(): void;
        }

        export interface StartOptions {
            drivers?: {
                [browserName: string]: any;
            };
        }

        function start(options: StartOptions, cb: (error?: any, instance?: selenium.SeleniumInstance) => void): void;
    }

    export = selenium;
}