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
                        reject(exitCode);
                    }
                });
            });
        });
    }
}
exports.PackageUtils = PackageUtils;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrYWdlTWFuYWdlcnMvcGFja2FnZVV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHVDQUF1QztBQUl2QztJQUNXLE1BQU0sQ0FBTyxJQUFJLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsV0FBbUIsRUFBRSxnQkFBd0IsRUFBRSxJQUFjOztZQUM1SCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU1QyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtnQkFDdkMsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUNuQixNQUFNLE9BQU8sR0FBcUIsRUFBRSxDQUFDO2dCQUNyQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLElBQUksZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDOUQsT0FBTyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQzVELENBQUM7Z0JBQ0QsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLFdBQVcsR0FBRyxLQUFLLEdBQUcsTUFBTSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFeEYsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSTtvQkFDaEMsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUN4RCxTQUFTLElBQUksSUFBSSxDQUFDO29CQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QixDQUFDLENBQUMsQ0FBQztnQkFFSCxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJO29CQUNoQyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHO29CQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxDQUFDO2dCQUVILFlBQVksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUTtvQkFDOUIsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDdkIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3JCLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtDQUNKO0FBcENELG9DQW9DQyIsImZpbGUiOiJwYWNrYWdlTWFuYWdlcnMvcGFja2FnZVV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBZYXJuIFBhY2thZ2UgTWFuYWdlciBjbGFzcy5cbiAqL1xuaW1wb3J0ICogYXMgY2hpbGQgZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuXG5leHBvcnQgY2xhc3MgUGFja2FnZVV0aWxzIHtcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGV4ZWMobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgcGFja2FnZU5hbWU6IHN0cmluZywgd29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGNvbnN0IGlzV2luID0gL153aW4vLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZpbmFsRGF0YSA9IFwiXCI7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zOiB7IGN3ZD86IHN0cmluZyB9ID0ge307XG4gICAgICAgICAgICBpZiAod29ya2luZ0RpcmVjdG9yeSAhPT0gbnVsbCAmJiB3b3JraW5nRGlyZWN0b3J5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmN3ZCA9IGZpbGVTeXN0ZW0ucGF0aEFic29sdXRlKHdvcmtpbmdEaXJlY3RvcnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc3Bhd25Qcm9jZXNzID0gY2hpbGQuc3Bhd24oYCR7cGFja2FnZU5hbWV9JHtpc1dpbiA/IFwiLmNtZFwiIDogXCJcIn1gLCBhcmdzLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgc3Bhd25Qcm9jZXNzLnN0ZG91dC5vbihcImRhdGFcIiwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhID0gKGRhdGEgPyBkYXRhLnRvU3RyaW5nKCkgOiBcIlwiKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG4gICAgICAgICAgICAgICAgZmluYWxEYXRhICs9IGRhdGE7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oZGF0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3Bhd25Qcm9jZXNzLnN0ZGVyci5vbihcImRhdGFcIiwgKGRhdGEpID0+ICB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSAoZGF0YSA/IGRhdGEudG9TdHJpbmcoKSA6IFwiXCIpLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhlcnJvcik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3Bhd25Qcm9jZXNzLm9uKFwiZXJyb3JcIiwgKGVycikgPT4gIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzcGF3blByb2Nlc3Mub24oXCJjbG9zZVwiLCAoZXhpdENvZGUpID0+ICB7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXRDb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmluYWxEYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXhpdENvZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
