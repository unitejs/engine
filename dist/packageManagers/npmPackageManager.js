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
                .catch((err) => {
                throw new Error(`No package information found: ${err}`);
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
                throw new Error(`Unable to add package: ${err}`);
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
                throw new Error(`Unable to remove package: ${err}`);
            });
        });
    }
}
exports.NpmPackageManager = NpmPackageManager;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYWNrYWdlTWFuYWdlcnMvbnBtUGFja2FnZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLGlEQUE4QztBQUU5QztJQUlJLFlBQVksTUFBZSxFQUFFLFVBQXVCO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFWSxJQUFJLENBQUMsV0FBbUI7O1lBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFFaEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXhFLE1BQU0sQ0FBQywyQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUM7aUJBQzNFLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDdEMsS0FBSyxDQUFDLENBQUMsR0FBRztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0lBRVksR0FBRyxDQUFDLGdCQUF3QixFQUFFLFdBQW1CLEVBQUUsT0FBZSxFQUFFLEtBQWM7O1lBQzNGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFFdkMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxXQUFXLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQztZQUV0RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUVELE1BQU0sQ0FBQywyQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQztpQkFDbEYsS0FBSyxDQUFDLENBQUMsR0FBRztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0lBRVksTUFBTSxDQUFDLGdCQUF3QixFQUFFLFdBQW1CLEVBQUUsS0FBYzs7WUFDN0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUV6QyxNQUFNLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUV4QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUVELE1BQU0sQ0FBQywyQkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQztpQkFDbEYsS0FBSyxDQUFDLENBQUMsR0FBRztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0NBQ0o7QUF0REQsOENBc0RDIiwiZmlsZSI6InBhY2thZ2VNYW5hZ2Vycy9ucG1QYWNrYWdlTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTlBNIFBhY2thZ2UgTWFuYWdlciBjbGFzcy5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlVXRpbHMgfSBmcm9tIFwiLi9wYWNrYWdlVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIE5wbVBhY2thZ2VNYW5hZ2VyIGltcGxlbWVudHMgSVBhY2thZ2VNYW5hZ2VyIHtcbiAgICBwcml2YXRlIF9sb2dnZXI6IElMb2dnZXI7XG4gICAgcHJpdmF0ZSBfZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW07XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IGZpbGVTeXN0ZW07XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluZm8ocGFja2FnZU5hbWU6IHN0cmluZyk6IFByb21pc2U8UGFja2FnZUNvbmZpZ3VyYXRpb24+IHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJMb29raW5nIHVwIHBhY2thZ2UgaW5mby4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1widmlld1wiLCBwYWNrYWdlTmFtZSwgXCItLWpzb25cIiwgXCJuYW1lXCIsIFwidmVyc2lvblwiLCBcIm1haW5cIl07XG5cbiAgICAgICAgcmV0dXJuIFBhY2thZ2VVdGlscy5leGVjKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgXCJucG1cIiwgdW5kZWZpbmVkLCBhcmdzKVxuICAgICAgICAgICAgLnRoZW4odmlld0RhdGEgPT4gSlNPTi5wYXJzZSh2aWV3RGF0YSkpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gcGFja2FnZSBpbmZvcm1hdGlvbiBmb3VuZDogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgYWRkKHdvcmtpbmdEaXJlY3Rvcnk6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nLCBpc0RldjogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiQWRkaW5nIHBhY2thZ2UuLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcImluc3RhbGxcIiwgYCR7cGFja2FnZU5hbWV9QCR7dmVyc2lvbn1gXTtcblxuICAgICAgICBpZiAoaXNEZXYpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZS1kZXZcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goXCItLXNhdmUtcHJvZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIFwibnBtXCIsIHdvcmtpbmdEaXJlY3RvcnksIGFyZ3MpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGFkZCBwYWNrYWdlOiAke2Vycn1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZW1vdmUod29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBwYWNrYWdlTmFtZTogc3RyaW5nLCBpc0RldjogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiUmVtb3ZpbmcgcGFja2FnZS4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1widW5pbnN0YWxsXCIsIHBhY2thZ2VOYW1lXTtcblxuICAgICAgICBpZiAoaXNEZXYpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZS1kZXZcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goXCItLXNhdmVcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUGFja2FnZVV0aWxzLmV4ZWModGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCBcIm5wbVwiLCB3b3JraW5nRGlyZWN0b3J5LCBhcmdzKVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZW1vdmUgcGFja2FnZTogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
