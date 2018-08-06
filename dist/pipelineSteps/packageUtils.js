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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCx1Q0FBdUM7QUFJdkMsTUFBYSxZQUFZO0lBR2QsTUFBTSxDQUFPLElBQUksQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxXQUFtQixFQUFFLGdCQUF3QixFQUFFLElBQWM7O1lBQzVILE9BQU8sSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQzNDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztnQkFDbkIsTUFBTSxPQUFPLEdBQXFCLEVBQUUsQ0FBQztnQkFDckMsSUFBSSxnQkFBZ0IsS0FBSyxJQUFJLElBQUksZ0JBQWdCLEtBQUssU0FBUyxFQUFFO29CQUM3RCxPQUFPLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDM0Q7Z0JBQ0QsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLFdBQVcsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFekcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQ3BDLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2xFLFNBQVMsSUFBSSxRQUFRLENBQUM7b0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxDQUFDO2dCQUVILFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO29CQUNwQyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2QixDQUFDLENBQUMsQ0FBQztnQkFFSCxZQUFZLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLENBQUMsQ0FBQyxDQUFDO2dCQUVILFlBQVksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBQ2xDLElBQUksUUFBUSxLQUFLLENBQUMsRUFBRTt3QkFDaEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUN0Qjt5QkFBTTt3QkFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7cUJBQ3BCO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7O0FBbENhLHNCQUFTLEdBQVksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFEckUsb0NBb0NDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGFja2FnZVV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQYWNrYWdlIFV0aWxzIGNsYXNzLlxuICovXG5pbXBvcnQgKiBhcyBjaGlsZCBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBQYWNrYWdlVXRpbHMge1xuICAgIHB1YmxpYyBzdGF0aWMgaXNXaW5kb3dzOiBib29sZWFuID0gL153aW4vLnRlc3QocHJvY2Vzcy5wbGF0Zm9ybSk7XG5cbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGV4ZWMobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgcGFja2FnZU5hbWU6IHN0cmluZywgd29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBmaW5hbERhdGEgPSBcIlwiO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uczogeyBjd2Q/OiBzdHJpbmcgfSA9IHt9O1xuICAgICAgICAgICAgaWYgKHdvcmtpbmdEaXJlY3RvcnkgIT09IG51bGwgJiYgd29ya2luZ0RpcmVjdG9yeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jd2QgPSBmaWxlU3lzdGVtLnBhdGhBYnNvbHV0ZSh3b3JraW5nRGlyZWN0b3J5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNwYXduUHJvY2VzcyA9IGNoaWxkLnNwYXduKGAke3BhY2thZ2VOYW1lfSR7UGFja2FnZVV0aWxzLmlzV2luZG93cyA/IFwiLmNtZFwiIDogXCJcIn1gLCBhcmdzLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgc3Bhd25Qcm9jZXNzLnN0ZG91dC5vbihcImRhdGFcIiwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmZvRGF0YSA9IChkYXRhID8gZGF0YS50b1N0cmluZygpIDogXCJcIikucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgICAgICAgICAgICAgIGZpbmFsRGF0YSArPSBpbmZvRGF0YTtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhpbmZvRGF0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3Bhd25Qcm9jZXNzLnN0ZGVyci5vbihcImRhdGFcIiwgKGRhdGEpID0+ICB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSAoZGF0YSA/IGRhdGEudG9TdHJpbmcoKSA6IFwiXCIpLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhlcnJvcik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3Bhd25Qcm9jZXNzLm9uKFwiZXJyb3JcIiwgKGVycikgPT4gIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzcGF3blByb2Nlc3Mub24oXCJjbG9zZVwiLCAoZXhpdENvZGUpID0+ICB7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXRDb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmluYWxEYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXhpdENvZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
