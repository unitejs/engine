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
const packageHelper_1 = require("../helpers/packageHelper");
const configHelper_1 = require("./configHelper");
class Engine {
    constructor(logger, fileSystem) {
        this._logger = logger;
        this._fileSystem = fileSystem;
    }
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodeVersionParts = process.version.replace("v", "").split(".");
                if (parseInt(nodeVersionParts[0], 10) < 8) {
                    this._logger.error("Node Version 8 or higher is required", undefined, { nodeVersion: process.version });
                    return 1;
                }
                this._engineRootFolder = this._fileSystem.pathCombine(__dirname, "../../");
                const enginePackageJson = yield this._fileSystem.fileReadJson(this._engineRootFolder, "package.json");
                this._engineVersion = enginePackageJson.version;
                const rootPackageFolder = yield packageHelper_1.PackageHelper.locate(this._fileSystem, this._logger, this._engineRootFolder, "unitejs-packages");
                if (rootPackageFolder) {
                    const rootPackageAssets = this._fileSystem.pathCombine(rootPackageFolder, "assets");
                    this._engineDependencies = yield this._fileSystem.fileReadJson(rootPackageAssets, "peerPackages.json");
                }
                else {
                    return 1;
                }
                return 0;
            }
            catch (err) {
                this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
                return 1;
            }
        });
    }
    version() {
        return this._engineVersion ? this._engineVersion : "unknown";
    }
    command(commandName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commandFolder = this._fileSystem.pathCombine(this._engineRootFolder, "dist/commands/");
                const loadFile = this._fileSystem.pathCombine(commandFolder, `${commandName}Command.js`);
                const module = yield Promise.resolve().then(() => require(loadFile));
                const className = Object.keys(module)[0];
                const instance = Object.create(module[className].prototype);
                const engineCommand = new instance.constructor();
                engineCommand.create(this._logger, this._fileSystem, this._engineRootFolder, this._engineVersion, this._engineDependencies);
                args.outputDirectory = yield configHelper_1.ConfigHelper.findConfigFolder(this._fileSystem, args.outputDirectory);
                return engineCommand.run(args);
            }
            catch (err) {
                this._logger.error("Error loading command module", undefined, { command: commandName, args });
                return 1;
            }
        });
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSw0REFBeUQ7QUFJekQsaURBQThDO0FBRTlDO0lBT0ksWUFBWSxNQUFlLEVBQUUsVUFBdUI7UUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVZLFVBQVU7O1lBQ25CLElBQUksQ0FBQztnQkFDRCxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXJFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsRUFBRSxTQUFTLEVBQUUsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7b0JBQ3hHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUUzRSxNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQXVCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDNUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7Z0JBRWhELE1BQU0saUJBQWlCLEdBQUcsTUFBTSw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBRWpJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDcEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDcEYsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQTJCLGlCQUFpQixFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3JJLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU0sT0FBTztRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDakUsQ0FBQztJQUVZLE9BQU8sQ0FBaUMsV0FBbUIsRUFBRSxJQUFPOztZQUM3RSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQzdGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLFdBQVcsWUFBWSxDQUFDLENBQUM7Z0JBQ3pGLE1BQU0sTUFBTSxHQUFHLDJDQUFhLFFBQVEsRUFBQyxDQUFDO2dCQUV0QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxhQUFhLEdBQXNCLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUVwRSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDNUgsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLDJCQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ25HLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDOUYsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQWpFRCx3QkFpRUMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbmdpbmVcbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUGFja2FnZUhlbHBlciB9IGZyb20gXCIuLi9oZWxwZXJzL3BhY2thZ2VIZWxwZXJcIjtcbmltcG9ydCB7IElFbmdpbmUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lXCI7XG5pbXBvcnQgeyBJRW5naW5lQ29tbWFuZCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVDb21tYW5kXCI7XG5pbXBvcnQgeyBJRW5naW5lQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVDb21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBDb25maWdIZWxwZXIgfSBmcm9tIFwiLi9jb25maWdIZWxwZXJcIjtcblxuZXhwb3J0IGNsYXNzIEVuZ2luZSBpbXBsZW1lbnRzIElFbmdpbmUge1xuICAgIHByaXZhdGUgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcml2YXRlIF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcbiAgICBwcml2YXRlIF9lbmdpbmVSb290Rm9sZGVyOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZW5naW5lVmVyc2lvbjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2VuZ2luZURlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgY29uc3RydWN0b3IobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSkge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBub2RlVmVyc2lvblBhcnRzID0gcHJvY2Vzcy52ZXJzaW9uLnJlcGxhY2UoXCJ2XCIsIFwiXCIpLnNwbGl0KFwiLlwiKTtcblxuICAgICAgICAgICAgaWYgKHBhcnNlSW50KG5vZGVWZXJzaW9uUGFydHNbMF0sIDEwKSA8IDgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJOb2RlIFZlcnNpb24gOCBvciBoaWdoZXIgaXMgcmVxdWlyZWRcIiwgdW5kZWZpbmVkLCB7IG5vZGVWZXJzaW9uOiBwcm9jZXNzLnZlcnNpb24gfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi9cIik7XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZ2luZVBhY2thZ2VKc29uID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248UGFja2FnZUNvbmZpZ3VyYXRpb24+KHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICAgICAgdGhpcy5fZW5naW5lVmVyc2lvbiA9IGVuZ2luZVBhY2thZ2VKc29uLnZlcnNpb247XG5cbiAgICAgICAgICAgIGNvbnN0IHJvb3RQYWNrYWdlRm9sZGVyID0gYXdhaXQgUGFja2FnZUhlbHBlci5sb2NhdGUodGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fbG9nZ2VyLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcInVuaXRlanMtcGFja2FnZXNcIik7XG5cbiAgICAgICAgICAgIGlmIChyb290UGFja2FnZUZvbGRlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvb3RQYWNrYWdlQXNzZXRzID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShyb290UGFja2FnZUZvbGRlciwgXCJhc3NldHNcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW5naW5lRGVwZW5kZW5jaWVzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyBbaWQ6IHN0cmluZ106IHN0cmluZyB9Pihyb290UGFja2FnZUFzc2V0cywgXCJwZWVyUGFja2FnZXMuanNvblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkxvYWRpbmcgZGVwZW5kZW5jaWVzIGZhaWxlZFwiLCBlcnIsIHsgY29yZTogdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgZGVwZW5kZW5jaWVzRmlsZTogXCJwYWNrYWdlLmpzb25cIiB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHZlcnNpb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuZ2luZVZlcnNpb24gPyB0aGlzLl9lbmdpbmVWZXJzaW9uIDogXCJ1bmtub3duXCI7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbW1hbmQ8VCBleHRlbmRzIElFbmdpbmVDb21tYW5kUGFyYW1zPihjb21tYW5kTmFtZTogc3RyaW5nLCBhcmdzOiBUKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwiZGlzdC9jb21tYW5kcy9cIik7XG4gICAgICAgICAgICBjb25zdCBsb2FkRmlsZSA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoY29tbWFuZEZvbGRlciwgYCR7Y29tbWFuZE5hbWV9Q29tbWFuZC5qc2ApO1xuICAgICAgICAgICAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KGxvYWRGaWxlKTtcblxuICAgICAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gT2JqZWN0LmtleXMobW9kdWxlKVswXTtcblxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKG1vZHVsZVtjbGFzc05hbWVdLnByb3RvdHlwZSk7XG4gICAgICAgICAgICBjb25zdCBlbmdpbmVDb21tYW5kOiBJRW5naW5lQ29tbWFuZDxUPiA9IG5ldyBpbnN0YW5jZS5jb25zdHJ1Y3RvcigpO1xuXG4gICAgICAgICAgICBlbmdpbmVDb21tYW5kLmNyZWF0ZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIHRoaXMuX2VuZ2luZVZlcnNpb24sIHRoaXMuX2VuZ2luZURlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBhcmdzLm91dHB1dERpcmVjdG9yeSA9IGF3YWl0IENvbmZpZ0hlbHBlci5maW5kQ29uZmlnRm9sZGVyKHRoaXMuX2ZpbGVTeXN0ZW0sIGFyZ3Mub3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgICAgIHJldHVybiBlbmdpbmVDb21tYW5kLnJ1bihhcmdzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJFcnJvciBsb2FkaW5nIGNvbW1hbmQgbW9kdWxlXCIsIHVuZGVmaW5lZCwgeyBjb21tYW5kOiBjb21tYW5kTmFtZSwgYXJncyB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
