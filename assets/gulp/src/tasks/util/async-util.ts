/**
 * Gulp utils for async utils.
 */
import * as archiver from "archiver";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import * as display from "./display";

export async function stream (gulpStream: NodeJS.ReadWriteStream) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
        gulpStream.on("error", reject);
        gulpStream.on("end", resolve);
    });
}

export async function fileExists (filename: string) : Promise<boolean> {
    try {
        const stat = await util.promisify(fs.stat)(filename);
        return stat.isFile();
    } catch (err) {
        if (err.code !== "ENOENT") {
            display.error(`Error accessing '${filename}`, err);
            process.exit(1);
        }
        return false;
    }
}

export async function directoryExists (filename: string) : Promise<boolean> {
    try {
        const stat = await util.promisify(fs.stat)(filename);
        return stat.isDirectory();
    } catch (err) {
        if (err.code !== "ENOENT") {
            display.error(`Error accessing '${filename}`, err);
            process.exit(1);
        }
        return false;
    }
}

export async function zipFolder (sourceFolder: string, destFile: string) : Promise<void> {
    return new Promise<void>(async (resolve) => {
        const fullPath = path.resolve(sourceFolder);

        const output = fs.createWriteStream(destFile);
        const archive = archiver("zip");

        output.on("close", () => {
            resolve();
        });

        archive.on("warning", (err) => {
            if (err.code === "ENOENT") {
                display.warning(err);
            } else {
                display.error(err);
                process.exit(1);
            }
        });

        archive.on("error", (err) => {
            display.error("Zipping folder", err);
            process.exit(1);
        });

        archive.on("entry", (entryData) => {
            display.info("Adding", entryData.name);
        });

        archive.pipe(output);

        archive.directory(fullPath, "");

        return archive.finalize();
    });
}

// Generated by UniteJS
