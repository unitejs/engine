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
exports.PackageUtils = PackageUtils;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrYWdlTWFuYWdlcnMvcGFja2FnZVV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILHVDQUF1QztBQUl2QztJQUNXLE1BQU0sQ0FBTyxJQUFJLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsV0FBbUIsRUFBRSxnQkFBd0IsRUFBRSxJQUFjOztZQUM1SCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUU1QyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtnQkFDdkMsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUNuQixNQUFNLE9BQU8sR0FBcUIsRUFBRSxDQUFDO2dCQUNyQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLElBQUksZ0JBQWdCLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDOUQsT0FBTyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQzVELENBQUM7Z0JBQ0QsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLFdBQVcsR0FBRyxLQUFLLEdBQUcsTUFBTSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFeEYsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSTtvQkFDaEMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2xFLFNBQVMsSUFBSSxRQUFRLENBQUM7b0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxDQUFDO2dCQUVILFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUk7b0JBQ2hDLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2QixDQUFDLENBQUMsQ0FBQztnQkFFSCxZQUFZLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUc7b0JBQ3pCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRO29CQUM5QixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN2QixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDckIsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0NBQ0o7QUFwQ0Qsb0NBb0NDIiwiZmlsZSI6InBhY2thZ2VNYW5hZ2Vycy9wYWNrYWdlVXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFlhcm4gUGFja2FnZSBNYW5hZ2VyIGNsYXNzLlxuICovXG5pbXBvcnQgKiBhcyBjaGlsZCBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBQYWNrYWdlVXRpbHMge1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgZXhlYyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBwYWNrYWdlTmFtZTogc3RyaW5nLCB3b3JraW5nRGlyZWN0b3J5OiBzdHJpbmcsIGFyZ3M6IHN0cmluZ1tdKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgaXNXaW4gPSAvXndpbi8udGVzdChwcm9jZXNzLnBsYXRmb3JtKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgZmluYWxEYXRhID0gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnM6IHsgY3dkPzogc3RyaW5nIH0gPSB7fTtcbiAgICAgICAgICAgIGlmICh3b3JraW5nRGlyZWN0b3J5ICE9PSBudWxsICYmIHdvcmtpbmdEaXJlY3RvcnkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuY3dkID0gZmlsZVN5c3RlbS5wYXRoQWJzb2x1dGUod29ya2luZ0RpcmVjdG9yeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzcGF3blByb2Nlc3MgPSBjaGlsZC5zcGF3bihgJHtwYWNrYWdlTmFtZX0ke2lzV2luID8gXCIuY21kXCIgOiBcIlwifWAsIGFyZ3MsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICBzcGF3blByb2Nlc3Muc3Rkb3V0Lm9uKFwiZGF0YVwiLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZm9EYXRhID0gKGRhdGEgPyBkYXRhLnRvU3RyaW5nKCkgOiBcIlwiKS5yZXBsYWNlKC9cXG4vZywgXCJcIik7XG4gICAgICAgICAgICAgICAgZmluYWxEYXRhICs9IGluZm9EYXRhO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGluZm9EYXRhKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzcGF3blByb2Nlc3Muc3RkZXJyLm9uKFwiZGF0YVwiLCAoZGF0YSkgPT4gIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IChkYXRhID8gZGF0YS50b1N0cmluZygpIDogXCJcIikucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzcGF3blByb2Nlc3Mub24oXCJlcnJvclwiLCAoZXJyKSA9PiAge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNwYXduUHJvY2Vzcy5vbihcImNsb3NlXCIsIChleGl0Q29kZSkgPT4gIHtcbiAgICAgICAgICAgICAgICBpZiAoZXhpdENvZGUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmaW5hbERhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChleGl0Q29kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
