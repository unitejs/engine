declare module "stream-to-promise" {
    function streamToPromise(stream: NodeJS.ReadWriteStream): Promise<void>;

    namespace streamToPromise {
    }

    export = streamToPromise;
}