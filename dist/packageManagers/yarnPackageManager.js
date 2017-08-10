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
class YarnPackageManager {
    constructor(logger, fileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
    }
    info(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            // We still use NPM for this as yarn doesn't have this facility yet
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
            const args = ["add", `${packageName}@${version}`];
            if (isDev) {
                args.push("--dev");
            }
            return packageUtils_1.PackageUtils.exec(this._logger, this._fileSystem, "yarn", workingDirectory, args);
        });
    }
    remove(workingDirectory, packageName, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info("Removing package...");
            const args = ["remove", packageName];
            if (isDev) {
                args.push("--dev");
            }
            return packageUtils_1.PackageUtils.exec(this._logger, this._fileSystem, "yarn", workingDirectory, args);
        });
    }
}
exports.YarnPackageManager = YarnPackageManager;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrYWdlTWFuYWdlcnMveWFyblBhY2thZ2VNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxpREFBOEM7QUFFOUM7SUFJSSxZQUFZLE1BQWUsRUFBRSxVQUF1QjtRQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksSUFBSSxDQUFDLFdBQW1COztZQUNqQyxtRUFBbUU7WUFDbkUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUVoRCxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLDJCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQztpQkFDM0UsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUN0QyxLQUFLLENBQUM7Z0JBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0lBRVksR0FBRyxDQUFDLGdCQUF3QixFQUFFLFdBQW1CLEVBQUUsT0FBZSxFQUFFLEtBQWM7O1lBQzNGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFFdkMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxXQUFXLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNsRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsQ0FBQztZQUVELE1BQU0sQ0FBQywyQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdGLENBQUM7S0FBQTtJQUVZLE1BQU0sQ0FBQyxnQkFBd0IsRUFBRSxXQUFtQixFQUFFLEtBQWM7O1lBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFFekMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFFRCxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3RixDQUFDO0tBQUE7Q0FDSjtBQTNDRCxnREEyQ0MiLCJmaWxlIjoicGFja2FnZU1hbmFnZXJzL3lhcm5QYWNrYWdlTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogWWFybiBQYWNrYWdlIE1hbmFnZXIgY2xhc3MuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElQYWNrYWdlTWFuYWdlciB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lQYWNrYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgUGFja2FnZVV0aWxzIH0gZnJvbSBcIi4vcGFja2FnZVV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBZYXJuUGFja2FnZU1hbmFnZXIgaW1wbGVtZW50cyBJUGFja2FnZU1hbmFnZXIge1xuICAgIHByaXZhdGUgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcml2YXRlIF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0pIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB0aGlzLl9maWxlU3lzdGVtID0gZmlsZVN5c3RlbTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5mbyhwYWNrYWdlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxQYWNrYWdlQ29uZmlndXJhdGlvbj4ge1xuICAgICAgICAvLyBXZSBzdGlsbCB1c2UgTlBNIGZvciB0aGlzIGFzIHlhcm4gZG9lc24ndCBoYXZlIHRoaXMgZmFjaWxpdHkgeWV0XG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiTG9va2luZyB1cCBwYWNrYWdlIGluZm8uLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcInZpZXdcIiwgcGFja2FnZU5hbWUsIFwiLS1qc29uXCIsIFwibmFtZVwiLCBcInZlcnNpb25cIiwgXCJtYWluXCJdO1xuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIFwibnBtXCIsIHVuZGVmaW5lZCwgYXJncylcbiAgICAgICAgICAgIC50aGVuKHZpZXdEYXRhID0+IEpTT04ucGFyc2Uodmlld0RhdGEpKVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBwYWNrYWdlIGluZm9ybWF0aW9uIGZvdW5kLlwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBhZGQod29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBwYWNrYWdlTmFtZTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcsIGlzRGV2OiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJBZGRpbmcgcGFja2FnZS4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1wiYWRkXCIsIGAke3BhY2thZ2VOYW1lfUAke3ZlcnNpb259YF07XG4gICAgICAgIGlmIChpc0Rldikge1xuICAgICAgICAgICAgYXJncy5wdXNoKFwiLS1kZXZcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUGFja2FnZVV0aWxzLmV4ZWModGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBcInlhcm5cIiwgd29ya2luZ0RpcmVjdG9yeSwgYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJlbW92ZSh3b3JraW5nRGlyZWN0b3J5OiBzdHJpbmcsIHBhY2thZ2VOYW1lOiBzdHJpbmcsIGlzRGV2OiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJSZW1vdmluZyBwYWNrYWdlLi4uXCIpO1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXCJyZW1vdmVcIiwgcGFja2FnZU5hbWVdO1xuICAgICAgICBpZiAoaXNEZXYpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tZGV2XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFBhY2thZ2VVdGlscy5leGVjKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgXCJ5YXJuXCIsIHdvcmtpbmdEaXJlY3RvcnksIGFyZ3MpO1xuICAgIH1cbn1cbiJdfQ==
