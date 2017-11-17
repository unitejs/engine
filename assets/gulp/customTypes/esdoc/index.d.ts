declare module "esdoc" {
    function esdoc(): void;

    namespace esdoc {
        function generate(config: Config, cb: (result: any, config: Config) => void): void;
        interface Config {
            source?: string;
            destination?: string;
            plugins?: { name: string; options: { [id: string]: any } }[];
        }
    }

    export default esdoc;
}