"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Package Utils class.
 */
const child = require("child_process");
class PackageUtils {
    static exec(logger, fileSystem, packageName, workingDirectory, args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let finalData = "";
                const options = {};
                if (workingDirectory !== null && workingDirectory !== undefined) {
                    options.cwd = fileSystem.pathAbsolute(workingDirectory);
                }
                const spawnProcess = child.spawn(`${packageName}${PackageUtils.isWindows ? ".cmd" : ""}`, args, options);
                spawnProcess.stdout.on("data", (data) => {
                    const infoData = (data ? data.toString() : "").replace(/\n/g, "");
                    finalData += infoData;
                    logger.info(infoData);
                });
                spawnProcess.stderr.on("data", (data) => {
                    const error = (data ? data.toString() : "").replace(/\n/g, "");
                    logger.info(error);
                });
                spawnProcess.on("error", (err) => {
                    reject(err);
                });
                spawnProcess.on("close", (exitCode) => {
                    if (exitCode === 0) {
                        resolve(finalData);
                    }
                    else {
                        reject(exitCode);
                    }
                });
            });
        });
    }
}
PackageUtils.isWindows = /^win/.test(process.platform);
exports.PackageUtils = PackageUtils;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCx1Q0FBdUM7QUFJdkM7SUFHVyxNQUFNLENBQU8sSUFBSSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLFdBQW1CLEVBQUUsZ0JBQXdCLEVBQUUsSUFBYzs7WUFDNUgsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUMzQyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sT0FBTyxHQUFxQixFQUFFLENBQUM7Z0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixLQUFLLElBQUksSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUM5RCxPQUFPLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDNUQsQ0FBQztnQkFDRCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsV0FBVyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUV6RyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQkFDcEMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDbEUsU0FBUyxJQUFJLFFBQVEsQ0FBQztvQkFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQ3BDLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQy9ELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUMsQ0FBQyxDQUFDO2dCQUVILFlBQVksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDbEMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDdkIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3JCLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTs7QUFsQ2Esc0JBQVMsR0FBWSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQURyRSxvQ0FvQ0MiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9wYWNrYWdlVXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBhY2thZ2UgVXRpbHMgY2xhc3MuXG4gKi9cbmltcG9ydCAqIGFzIGNoaWxkIGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VVdGlscyB7XG4gICAgcHVibGljIHN0YXRpYyBpc1dpbmRvd3M6IGJvb2xlYW4gPSAvXndpbi8udGVzdChwcm9jZXNzLnBsYXRmb3JtKTtcblxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZXhlYyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBwYWNrYWdlTmFtZTogc3RyaW5nLCB3b3JraW5nRGlyZWN0b3J5OiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZpbmFsRGF0YSA9IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zOiB7IGN3ZD86IHN0cmluZyB9ID0ge307XG4gICAgICAgICAgICBpZiAod29ya2luZ0RpcmVjdG9yeSAhPT0gbnVsbCAmJiB3b3JraW5nRGlyZWN0b3J5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmN3ZCA9IGZpbGVTeXN0ZW0ucGF0aEFic29sdXRlKHdvcmtpbmdEaXJlY3RvcnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc3Bhd25Qcm9jZXNzID0gY2hpbGQuc3Bhd24oYCR7cGFja2FnZU5hbWV9JHtQYWNrYWdlVXRpbHMuaXNXaW5kb3dzID8gXCIuY21kXCIgOiBcIlwifWAsIGFyZ3MsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICBzcGF3blByb2Nlc3Muc3Rkb3V0Lm9uKFwiZGF0YVwiLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZm9EYXRhID0gKGRhdGEgPyBkYXRhLnRvU3RyaW5nKCkgOiBcIlwiKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG4gICAgICAgICAgICAgICAgZmluYWxEYXRhICs9IGluZm9EYXRhO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGluZm9EYXRhKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzcGF3blByb2Nlc3Muc3RkZXJyLm9uKFwiZGF0YVwiLCAoZGF0YSkgPT4gIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IChkYXRhID8gZGF0YS50b1N0cmluZygpIDogXCJcIikucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzcGF3blByb2Nlc3Mub24oXCJlcnJvclwiLCAoZXJyKSA9PiAge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNwYXduUHJvY2Vzcy5vbihcImNsb3NlXCIsIChleGl0Q29kZSkgPT4gIHtcbiAgICAgICAgICAgICAgICBpZiAoZXhpdENvZGUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmaW5hbERhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChleGl0Q29kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
