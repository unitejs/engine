declare module "requirejs" {
    export function optimize(options: {
        baseUrl: string;
        generateSourceMaps: boolean;
        logLevel: number;
        name: string;
        optimize: string;
        out: string;
        paths: { [id: string]: string };
        map: { [id: string]: { [id: string]: string}};
        exclude: string[];
    },
    successCallback: (result: string) => Promise<void>,
    errorCallback: (error: Error) => void): void;
}