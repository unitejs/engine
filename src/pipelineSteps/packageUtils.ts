/**
 * Package Utils class.
 */
import * as child from "child_process";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";

export class PackageUtils {
    public static async exec(logger: ILogger, fileSystem: IFileSystem, packageName: string, workingDirectory: string, args: string[]): Promise<string> {
        const isWin = /^win/.test(process.platform);

        return new Promise<string>((resolve, reject) => {
            let finalData = "";
            const options: { cwd?: string } = {};
            if (workingDirectory !== null && workingDirectory !== undefined) {
                options.cwd = fileSystem.pathAbsolute(workingDirectory);
            }
            const spawnProcess = child.spawn(`${packageName}${isWin ? ".cmd" : ""}`, args, options);

            spawnProcess.stdout.on("data", (data) => {
                const infoData = (data ? data.toString() : "").replace(/\n/g, "");
                finalData += infoData;
                logger.info(infoData);
            });

            spawnProcess.stderr.on("data", (data) =>  {
                const error = (data ? data.toString() : "").replace(/\n/g, "");
                logger.info(error);
            });

            spawnProcess.on("error", (err) =>  {
                reject(err);
            });

            spawnProcess.on("close", (exitCode) =>  {
                if (exitCode === 0) {
                    resolve(finalData);
                } else {
                    reject(exitCode);
                }
            });
        });
    }
}
