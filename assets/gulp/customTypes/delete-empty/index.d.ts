declare module "delete-empty" {
    function deleteEmpty(dir: string, options: deleteEmpty.Options, cb: (err: Error, deleted: string[]) => void): void;

    namespace deleteEmpty {
        function sync(patterns: string | string[], options?: Options): string[];

        interface Options {
            verbose?: boolean;
        }
    }

    export = deleteEmpty;
}