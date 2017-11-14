declare module "requirejs" {
    export function optimize(options: {
        baseUrl?: string;
        generateSourceMaps?: boolean;
        logLevel?: number;
        name?: string;
        optimize?: string;
        out?: string;
        paths?: { [id: string]: string };
        packages?: { name: string; location: string; main: string }[];
        map?: { [id: string]: { [id: string]: string}};
        exclude?: string[];
    },
    successCallback: (result: string) => Promise<void>,
    errorCallback: (error: Error) => Promise<void>): void;
}