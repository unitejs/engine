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
                const nodeVersionParts = process.version
                    .replace("v", "")
                    .split(".");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSw0REFBeUQ7QUFJekQsaURBQThDO0FBRTlDO0lBT0ksWUFBWSxNQUFlLEVBQUUsVUFBdUI7UUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVZLFVBQVU7O1lBQ25CLElBQUksQ0FBQztnQkFDRCxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPO3FCQUNQLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDO3FCQUNoQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTVDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsRUFBRSxTQUFTLEVBQUUsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7b0JBQ3hHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFFRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUUzRSxNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQXVCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDNUgsSUFBSSxDQUFDLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7Z0JBRWhELE1BQU0saUJBQWlCLEdBQUcsTUFBTSw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBRWpJLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztvQkFDcEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDcEYsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQTJCLGlCQUFpQixFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3JJLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU0sT0FBTztRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDakUsQ0FBQztJQUVZLE9BQU8sQ0FBaUMsV0FBbUIsRUFBRSxJQUFPOztZQUM3RSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQzdGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLFdBQVcsWUFBWSxDQUFDLENBQUM7Z0JBQ3pGLE1BQU0sTUFBTSxHQUFHLDJDQUFhLFFBQVEsRUFBQyxDQUFDO2dCQUV0QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxhQUFhLEdBQXNCLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUVwRSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDNUgsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLDJCQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ25HLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDOUYsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQW5FRCx3QkFtRUMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbmdpbmVcbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgUGFja2FnZUhlbHBlciB9IGZyb20gXCIuLi9oZWxwZXJzL3BhY2thZ2VIZWxwZXJcIjtcbmltcG9ydCB7IElFbmdpbmUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lXCI7XG5pbXBvcnQgeyBJRW5naW5lQ29tbWFuZCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVDb21tYW5kXCI7XG5pbXBvcnQgeyBJRW5naW5lQ29tbWFuZFBhcmFtcyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVDb21tYW5kUGFyYW1zXCI7XG5pbXBvcnQgeyBDb25maWdIZWxwZXIgfSBmcm9tIFwiLi9jb25maWdIZWxwZXJcIjtcblxuZXhwb3J0IGNsYXNzIEVuZ2luZSBpbXBsZW1lbnRzIElFbmdpbmUge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcbiAgICBwcml2YXRlIF9lbmdpbmVSb290Rm9sZGVyOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZW5naW5lVmVyc2lvbjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2VuZ2luZURlcGVuZGVuY2llczogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gICAgY29uc3RydWN0b3IobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSkge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBub2RlVmVyc2lvblBhcnRzID0gcHJvY2Vzcy52ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKFwidlwiLCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIuXCIpO1xuXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQobm9kZVZlcnNpb25QYXJ0c1swXSwgMTApIDwgOCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIk5vZGUgVmVyc2lvbiA4IG9yIGhpZ2hlciBpcyByZXF1aXJlZFwiLCB1bmRlZmluZWQsIHsgbm9kZVZlcnNpb246IHByb2Nlc3MudmVyc2lvbiB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZW5naW5lUm9vdEZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uL1wiKTtcblxuICAgICAgICAgICAgY29uc3QgZW5naW5lUGFja2FnZUpzb24gPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxQYWNrYWdlQ29uZmlndXJhdGlvbj4odGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJwYWNrYWdlLmpzb25cIik7XG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVWZXJzaW9uID0gZW5naW5lUGFja2FnZUpzb24udmVyc2lvbjtcblxuICAgICAgICAgICAgY29uc3Qgcm9vdFBhY2thZ2VGb2xkZXIgPSBhd2FpdCBQYWNrYWdlSGVscGVyLmxvY2F0ZSh0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9sb2dnZXIsIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwidW5pdGVqcy1wYWNrYWdlc1wiKTtcblxuICAgICAgICAgICAgaWYgKHJvb3RQYWNrYWdlRm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm9vdFBhY2thZ2VBc3NldHMgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHJvb3RQYWNrYWdlRm9sZGVyLCBcImFzc2V0c1wiKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmdpbmVEZXBlbmRlbmNpZXMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjx7IFtpZDogc3RyaW5nXTogc3RyaW5nIH0+KHJvb3RQYWNrYWdlQXNzZXRzLCBcInBlZXJQYWNrYWdlcy5qc29uXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiTG9hZGluZyBkZXBlbmRlbmNpZXMgZmFpbGVkXCIsIGVyciwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdmVyc2lvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5naW5lVmVyc2lvbiA/IHRoaXMuX2VuZ2luZVZlcnNpb24gOiBcInVua25vd25cIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29tbWFuZDxUIGV4dGVuZHMgSUVuZ2luZUNvbW1hbmRQYXJhbXM+KGNvbW1hbmROYW1lOiBzdHJpbmcsIGFyZ3M6IFQpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29tbWFuZEZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJkaXN0L2NvbW1hbmRzL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGaWxlID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShjb21tYW5kRm9sZGVyLCBgJHtjb21tYW5kTmFtZX1Db21tYW5kLmpzYCk7XG4gICAgICAgICAgICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQobG9hZEZpbGUpO1xuXG4gICAgICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBPYmplY3Qua2V5cyhtb2R1bGUpWzBdO1xuXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUobW9kdWxlW2NsYXNzTmFtZV0ucHJvdG90eXBlKTtcbiAgICAgICAgICAgIGNvbnN0IGVuZ2luZUNvbW1hbmQ6IElFbmdpbmVDb21tYW5kPFQ+ID0gbmV3IGluc3RhbmNlLmNvbnN0cnVjdG9yKCk7XG5cbiAgICAgICAgICAgIGVuZ2luZUNvbW1hbmQuY3JlYXRlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgdGhpcy5fZW5naW5lVmVyc2lvbiwgdGhpcy5fZW5naW5lRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIGFyZ3Mub3V0cHV0RGlyZWN0b3J5ID0gYXdhaXQgQ29uZmlnSGVscGVyLmZpbmRDb25maWdGb2xkZXIodGhpcy5fZmlsZVN5c3RlbSwgYXJncy5vdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICAgICAgcmV0dXJuIGVuZ2luZUNvbW1hbmQucnVuKGFyZ3MpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkVycm9yIGxvYWRpbmcgY29tbWFuZCBtb2R1bGVcIiwgdW5kZWZpbmVkLCB7IGNvbW1hbmQ6IGNvbW1hbmROYW1lLCBhcmdzIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
