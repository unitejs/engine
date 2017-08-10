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
const packageUtils_1 = require("./packageUtils");
class NpmPackageManager {
    constructor(logger, fileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
    }
    info(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info("Looking up package info...");
            const args = ["view", packageName, "--json", "name", "version", "main"];
            return packageUtils_1.PackageUtils.exec(this._logger, this._fileSystem, "npm", undefined, args)
                .then(viewData => JSON.parse(viewData))
                .catch(() => {
                throw new Error("No package information found.");
            });
        });
    }
    add(workingDirectory, packageName, version, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info("Adding package...");
            const args = ["install", `${packageName}@${version}`];
            if (isDev) {
                args.push("--save-dev");
            }
            else {
                args.push("--save-prod");
            }
            return packageUtils_1.PackageUtils.exec(this._logger, this._fileSystem, "npm", workingDirectory, args)
                .catch((err) => {
                throw err;
            });
        });
    }
    remove(workingDirectory, packageName, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info("Removing package...");
            const args = ["uninstall", packageName];
            if (isDev) {
                args.push("--save-dev");
            }
            else {
                args.push("--save");
            }
            return packageUtils_1.PackageUtils.exec(this._logger, this._fileSystem, "npm", workingDirectory, args)
                .catch((err) => {
                throw err;
            });
        });
    }
}
exports.NpmPackageManager = NpmPackageManager;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrYWdlTWFuYWdlcnMvbnBtUGFja2FnZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLGlEQUE4QztBQUU5QztJQUlJLFlBQVksTUFBZSxFQUFFLFVBQXVCO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFWSxJQUFJLENBQUMsV0FBbUI7O1lBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFFaEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXhFLE1BQU0sQ0FBQywyQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUM7aUJBQzNFLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDdEMsS0FBSyxDQUFDO2dCQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7S0FBQTtJQUVZLEdBQUcsQ0FBQyxnQkFBd0IsRUFBRSxXQUFtQixFQUFFLE9BQWUsRUFBRSxLQUFjOztZQUMzRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBRXZDLE1BQU0sSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsV0FBVyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFdEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUM7aUJBQ2xGLEtBQUssQ0FBQyxDQUFDLEdBQUc7Z0JBQ1AsTUFBTSxHQUFHLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7S0FBQTtJQUVZLE1BQU0sQ0FBQyxnQkFBd0IsRUFBRSxXQUFtQixFQUFFLEtBQWM7O1lBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFFekMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFeEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFFRCxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUM7aUJBQ2xGLEtBQUssQ0FBQyxDQUFDLEdBQUc7Z0JBQ1AsTUFBTSxHQUFHLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7S0FBQTtDQUNKO0FBdERELDhDQXNEQyIsImZpbGUiOiJwYWNrYWdlTWFuYWdlcnMvbnBtUGFja2FnZU1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE5QTSBQYWNrYWdlIE1hbmFnZXIgY2xhc3MuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElQYWNrYWdlTWFuYWdlciB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lQYWNrYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgUGFja2FnZVV0aWxzIH0gZnJvbSBcIi4vcGFja2FnZVV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBOcG1QYWNrYWdlTWFuYWdlciBpbXBsZW1lbnRzIElQYWNrYWdlTWFuYWdlciB7XG4gICAgcHJpdmF0ZSBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByaXZhdGUgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuXG4gICAgY29uc3RydWN0b3IobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSkge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbmZvKHBhY2thZ2VOYW1lOiBzdHJpbmcpOiBQcm9taXNlPFBhY2thZ2VDb25maWd1cmF0aW9uPiB7XG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiTG9va2luZyB1cCBwYWNrYWdlIGluZm8uLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcInZpZXdcIiwgcGFja2FnZU5hbWUsIFwiLS1qc29uXCIsIFwibmFtZVwiLCBcInZlcnNpb25cIiwgXCJtYWluXCJdO1xuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIFwibnBtXCIsIHVuZGVmaW5lZCwgYXJncylcbiAgICAgICAgICAgIC50aGVuKHZpZXdEYXRhID0+IEpTT04ucGFyc2Uodmlld0RhdGEpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBwYWNrYWdlIGluZm9ybWF0aW9uIGZvdW5kLlwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBhZGQod29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBwYWNrYWdlTmFtZTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcsIGlzRGV2OiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJBZGRpbmcgcGFja2FnZS4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1wiaW5zdGFsbFwiLCBgJHtwYWNrYWdlTmFtZX1AJHt2ZXJzaW9ufWBdO1xuXG4gICAgICAgIGlmIChpc0Rldikge1xuICAgICAgICAgICAgYXJncy5wdXNoKFwiLS1zYXZlLWRldlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZS1wcm9kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFBhY2thZ2VVdGlscy5leGVjKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgXCJucG1cIiwgd29ya2luZ0RpcmVjdG9yeSwgYXJncylcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJlbW92ZSh3b3JraW5nRGlyZWN0b3J5OiBzdHJpbmcsIHBhY2thZ2VOYW1lOiBzdHJpbmcsIGlzRGV2OiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJSZW1vdmluZyBwYWNrYWdlLi4uXCIpO1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXCJ1bmluc3RhbGxcIiwgcGFja2FnZU5hbWVdO1xuXG4gICAgICAgIGlmIChpc0Rldikge1xuICAgICAgICAgICAgYXJncy5wdXNoKFwiLS1zYXZlLWRldlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIFwibnBtXCIsIHdvcmtpbmdEaXJlY3RvcnksIGFyZ3MpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
