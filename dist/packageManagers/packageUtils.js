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
 * Yarn Package Manager class.
 */
const child = require("child_process");
class PackageUtils {
    static exec(logger, fileSystem, packageName, workingDirectory, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const isWin = /^win/.test(process.platform);
            return new Promise((resolve, reject) => {
                let finalData = "";
                const options = {};
                if (workingDirectory !== null && workingDirectory !== undefined) {
                    options.cwd = fileSystem.pathAbsolute(workingDirectory);
                }
                const spawnProcess = child.spawn(`${packageName}${isWin ? ".cmd" : ""}`, args, options);
                spawnProcess.stdout.on("data", (data) => {
                    data = (data ? data.toString() : "").replace(/\n/g, "");
                    finalData += data;
                    logger.info(data);
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
                        reject();
                    }
                });
            });
        });
    }
}
exports.PackageUtils = PackageUtils;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrYWdlTWFuYWdlcnMvcGFja2FnZVV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHVDQUF1QztBQUl2QztJQUNXLE1BQU0sQ0FBTyxJQUFJLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsV0FBbUIsRUFBRSxnQkFBd0IsRUFBRSxJQUFjOztZQUM1SCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU1QyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtnQkFDdkMsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUNuQixNQUFNLE9BQU8sR0FBcUIsRUFBRSxDQUFDO2dCQUNyQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLElBQUksZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDOUQsT0FBTyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQzVELENBQUM7Z0JBQ0QsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLFdBQVcsR0FBRyxLQUFLLEdBQUcsTUFBTSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFeEYsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSTtvQkFDaEMsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN4RCxTQUFTLElBQUksSUFBSSxDQUFDO29CQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QixDQUFDLENBQUMsQ0FBQztnQkFFSCxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJO29CQUNoQyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHO29CQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxDQUFDO2dCQUVILFlBQVksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUTtvQkFDOUIsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDdkIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixNQUFNLEVBQUUsQ0FBQztvQkFDYixDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7Q0FDSjtBQXBDRCxvQ0FvQ0MiLCJmaWxlIjoicGFja2FnZU1hbmFnZXJzL3BhY2thZ2VVdGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogWWFybiBQYWNrYWdlIE1hbmFnZXIgY2xhc3MuXG4gKi9cbmltcG9ydCAqIGFzIGNoaWxkIGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VVdGlscyB7XG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBleGVjKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHBhY2thZ2VOYW1lOiBzdHJpbmcsIHdvcmtpbmdEaXJlY3Rvcnk6IHN0cmluZywgYXJnczogc3RyaW5nW10pOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCBpc1dpbiA9IC9ed2luLy50ZXN0KHByb2Nlc3MucGxhdGZvcm0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBmaW5hbERhdGEgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uczogeyBjd2Q/OiBzdHJpbmcgfSA9IHt9O1xuICAgICAgICAgICAgaWYgKHdvcmtpbmdEaXJlY3RvcnkgIT09IG51bGwgJiYgd29ya2luZ0RpcmVjdG9yeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jd2QgPSBmaWxlU3lzdGVtLnBhdGhBYnNvbHV0ZSh3b3JraW5nRGlyZWN0b3J5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNwYXduUHJvY2VzcyA9IGNoaWxkLnNwYXduKGAke3BhY2thZ2VOYW1lfSR7aXNXaW4gPyBcIi5jbWRcIiA6IFwiXCJ9YCwgYXJncywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHNwYXduUHJvY2Vzcy5zdGRvdXQub24oXCJkYXRhXCIsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IChkYXRhID8gZGF0YS50b1N0cmluZygpIDogXCJcIikucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgICAgICAgICAgICAgIGZpbmFsRGF0YSArPSBkYXRhO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNwYXduUHJvY2Vzcy5zdGRlcnIub24oXCJkYXRhXCIsIChkYXRhKSA9PiAge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gKGRhdGEgPyBkYXRhLnRvU3RyaW5nKCkgOiBcIlwiKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNwYXduUHJvY2Vzcy5vbihcImVycm9yXCIsIChlcnIpID0+ICB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3Bhd25Qcm9jZXNzLm9uKFwiY2xvc2VcIiwgKGV4aXRDb2RlKSA9PiAge1xuICAgICAgICAgICAgICAgIGlmIChleGl0Q29kZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZpbmFsRGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
