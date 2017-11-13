declare module "stream-to-promise" {
    function streamToPromise(stream: NodeJS.ReadWriteStream): Promise<void>;

    export default streamToPromise;
}