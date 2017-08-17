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
                .catch((err) => {
                throw new Error(`No package information found: ${err}`);
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
            return packageUtils_1.PackageUtils.exec(this._logger, this._fileSystem, "yarn", workingDirectory, args)
                .catch((err) => {
                throw new Error(`Unable to add package: ${err}`);
            });
        });
    }
    remove(workingDirectory, packageName, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info("Removing package...");
            const args = ["remove", packageName];
            if (isDev) {
                args.push("--dev");
            }
            return packageUtils_1.PackageUtils.exec(this._logger, this._fileSystem, "yarn", workingDirectory, args)
                .catch((err) => {
                throw new Error(`Unable to remove package: ${err}`);
            });
        });
    }
}
exports.YarnPackageManager = YarnPackageManager;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrYWdlTWFuYWdlcnMveWFyblBhY2thZ2VNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxpREFBOEM7QUFFOUM7SUFJSSxZQUFZLE1BQWUsRUFBRSxVQUF1QjtRQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksSUFBSSxDQUFDLFdBQW1COztZQUNqQyxtRUFBbUU7WUFDbkUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUVoRCxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLDJCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQztpQkFDM0UsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUN0QyxLQUFLLENBQUMsQ0FBQyxHQUFHO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7SUFFWSxHQUFHLENBQUMsZ0JBQXdCLEVBQUUsV0FBbUIsRUFBRSxPQUFlLEVBQUUsS0FBYzs7WUFDM0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUV2QyxNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLFdBQVcsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBRUQsTUFBTSxDQUFDLDJCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO2lCQUNuRixLQUFLLENBQUMsQ0FBQyxHQUFHO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7SUFFWSxNQUFNLENBQUMsZ0JBQXdCLEVBQUUsV0FBbUIsRUFBRSxLQUFjOztZQUM3RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBRXpDLE1BQU0sSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBRUQsTUFBTSxDQUFDLDJCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO2lCQUNuRixLQUFLLENBQUMsQ0FBQyxHQUFHO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7Q0FDSjtBQWpERCxnREFpREMiLCJmaWxlIjoicGFja2FnZU1hbmFnZXJzL3lhcm5QYWNrYWdlTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogWWFybiBQYWNrYWdlIE1hbmFnZXIgY2xhc3MuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgUGFja2FnZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvcGFja2FnZXMvcGFja2FnZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElQYWNrYWdlTWFuYWdlciB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lQYWNrYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgUGFja2FnZVV0aWxzIH0gZnJvbSBcIi4vcGFja2FnZVV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBZYXJuUGFja2FnZU1hbmFnZXIgaW1wbGVtZW50cyBJUGFja2FnZU1hbmFnZXIge1xuICAgIHByaXZhdGUgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcml2YXRlIF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0pIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB0aGlzLl9maWxlU3lzdGVtID0gZmlsZVN5c3RlbTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5mbyhwYWNrYWdlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxQYWNrYWdlQ29uZmlndXJhdGlvbj4ge1xuICAgICAgICAvLyBXZSBzdGlsbCB1c2UgTlBNIGZvciB0aGlzIGFzIHlhcm4gZG9lc24ndCBoYXZlIHRoaXMgZmFjaWxpdHkgeWV0XG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiTG9va2luZyB1cCBwYWNrYWdlIGluZm8uLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcInZpZXdcIiwgcGFja2FnZU5hbWUsIFwiLS1qc29uXCIsIFwibmFtZVwiLCBcInZlcnNpb25cIiwgXCJtYWluXCJdO1xuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIFwibnBtXCIsIHVuZGVmaW5lZCwgYXJncylcbiAgICAgICAgICAgIC50aGVuKHZpZXdEYXRhID0+IEpTT04ucGFyc2Uodmlld0RhdGEpKVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHBhY2thZ2UgaW5mb3JtYXRpb24gZm91bmQ6ICR7ZXJyfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGFkZCh3b3JraW5nRGlyZWN0b3J5OiBzdHJpbmcsIHBhY2thZ2VOYW1lOiBzdHJpbmcsIHZlcnNpb246IHN0cmluZywgaXNEZXY6IGJvb2xlYW4pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIkFkZGluZyBwYWNrYWdlLi4uXCIpO1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXCJhZGRcIiwgYCR7cGFja2FnZU5hbWV9QCR7dmVyc2lvbn1gXTtcbiAgICAgICAgaWYgKGlzRGV2KSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goXCItLWRldlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIFwieWFyblwiLCB3b3JraW5nRGlyZWN0b3J5LCBhcmdzKVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBhZGQgcGFja2FnZTogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVtb3ZlKHdvcmtpbmdEaXJlY3Rvcnk6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZywgaXNEZXY6IGJvb2xlYW4pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIlJlbW92aW5nIHBhY2thZ2UuLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcInJlbW92ZVwiLCBwYWNrYWdlTmFtZV07XG4gICAgICAgIGlmIChpc0Rldikge1xuICAgICAgICAgICAgYXJncy5wdXNoKFwiLS1kZXZcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUGFja2FnZVV0aWxzLmV4ZWModGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBcInlhcm5cIiwgd29ya2luZ0RpcmVjdG9yeSwgYXJncylcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmVtb3ZlIHBhY2thZ2U6ICR7ZXJyfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIl19
