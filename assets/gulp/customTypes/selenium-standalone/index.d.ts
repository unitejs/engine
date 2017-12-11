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

declare module 'selenium-standalone/lib/install' {
    namespace install {
        interface InstallOptions {
            drivers?: {
                [browserName: string]: {
                    version?: string
                };
            },
            logger?: (message: string) => void
        }
    }

    function install(options: install.InstallOptions, cb: (error?: any) => void): void;
    
    export = install;
}