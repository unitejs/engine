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
                const assetFolder = this._fileSystem.pathCombine(this._engineRootFolder, "assets");
                this._engineDependencies = yield this._fileSystem.fileReadJson(assetFolder, "peerPackages.json");
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
                const module = yield Promise.resolve().then(function () { return require(loadFile); });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFTQSxpREFBOEM7QUFFOUM7SUFPSSxZQUFZLE1BQWUsRUFBRSxVQUF1QjtRQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksVUFBVTs7WUFDbkIsSUFBSSxDQUFDO2dCQUNELE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFckUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLFNBQVMsRUFBRSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDeEcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTNFLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBdUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUM1SCxJQUFJLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztnQkFFaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBMkIsV0FBVyxFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBRTNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU0sT0FBTztRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDakUsQ0FBQztJQUVZLE9BQU8sQ0FBaUMsV0FBbUIsRUFBRSxJQUFPOztZQUM3RSxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQzdGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLFdBQVcsWUFBWSxDQUFDLENBQUM7Z0JBQ3pGLE1BQU0sTUFBTSxHQUFHLDBEQUFhLFFBQVEsS0FBQyxDQUFDO2dCQUV0QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxhQUFhLEdBQXNCLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUVwRSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDNUgsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLDJCQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ25HLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDOUYsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTNERCx3QkEyREMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbmdpbmVcbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSUVuZ2luZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRQYXJhbXNcIjtcbmltcG9ydCB7IENvbmZpZ0hlbHBlciB9IGZyb20gXCIuL2NvbmZpZ0hlbHBlclwiO1xuXG5leHBvcnQgY2xhc3MgRW5naW5lIGltcGxlbWVudHMgSUVuZ2luZSB7XG4gICAgcHJpdmF0ZSBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByaXZhdGUgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByaXZhdGUgX2VuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwcml2YXRlIF9lbmdpbmVWZXJzaW9uOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IGZpbGVTeXN0ZW07XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVWZXJzaW9uUGFydHMgPSBwcm9jZXNzLnZlcnNpb24ucmVwbGFjZShcInZcIiwgXCJcIikuc3BsaXQoXCIuXCIpO1xuXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQobm9kZVZlcnNpb25QYXJ0c1swXSwgMTApIDwgOCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIk5vZGUgVmVyc2lvbiA4IG9yIGhpZ2hlciBpcyByZXF1aXJlZFwiLCB1bmRlZmluZWQsIHsgbm9kZVZlcnNpb246IHByb2Nlc3MudmVyc2lvbiB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZW5naW5lUm9vdEZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uL1wiKTtcblxuICAgICAgICAgICAgY29uc3QgZW5naW5lUGFja2FnZUpzb24gPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxQYWNrYWdlQ29uZmlndXJhdGlvbj4odGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJwYWNrYWdlLmpzb25cIik7XG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVWZXJzaW9uID0gZW5naW5lUGFja2FnZUpzb24udmVyc2lvbjtcblxuICAgICAgICAgICAgY29uc3QgYXNzZXRGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwiYXNzZXRzXCIpO1xuICAgICAgICAgICAgdGhpcy5fZW5naW5lRGVwZW5kZW5jaWVzID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248eyBbaWQ6IHN0cmluZ106IHN0cmluZyB9Pihhc3NldEZvbGRlciwgXCJwZWVyUGFja2FnZXMuanNvblwiKTtcblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiTG9hZGluZyBkZXBlbmRlbmNpZXMgZmFpbGVkXCIsIGVyciwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdmVyc2lvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5naW5lVmVyc2lvbiA/IHRoaXMuX2VuZ2luZVZlcnNpb24gOiBcInVua25vd25cIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgY29tbWFuZDxUIGV4dGVuZHMgSUVuZ2luZUNvbW1hbmRQYXJhbXM+KGNvbW1hbmROYW1lOiBzdHJpbmcsIGFyZ3M6IFQpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29tbWFuZEZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJkaXN0L2NvbW1hbmRzL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGaWxlID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShjb21tYW5kRm9sZGVyLCBgJHtjb21tYW5kTmFtZX1Db21tYW5kLmpzYCk7XG4gICAgICAgICAgICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQobG9hZEZpbGUpO1xuXG4gICAgICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBPYmplY3Qua2V5cyhtb2R1bGUpWzBdO1xuXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUobW9kdWxlW2NsYXNzTmFtZV0ucHJvdG90eXBlKTtcbiAgICAgICAgICAgIGNvbnN0IGVuZ2luZUNvbW1hbmQ6IElFbmdpbmVDb21tYW5kPFQ+ID0gbmV3IGluc3RhbmNlLmNvbnN0cnVjdG9yKCk7XG5cbiAgICAgICAgICAgIGVuZ2luZUNvbW1hbmQuY3JlYXRlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgdGhpcy5fZW5naW5lVmVyc2lvbiwgdGhpcy5fZW5naW5lRGVwZW5kZW5jaWVzKTtcbiAgICAgICAgICAgIGFyZ3Mub3V0cHV0RGlyZWN0b3J5ID0gYXdhaXQgQ29uZmlnSGVscGVyLmZpbmRDb25maWdGb2xkZXIodGhpcy5fZmlsZVN5c3RlbSwgYXJncy5vdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICAgICAgcmV0dXJuIGVuZ2luZUNvbW1hbmQucnVuKGFyZ3MpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkVycm9yIGxvYWRpbmcgY29tbWFuZCBtb2R1bGVcIiwgdW5kZWZpbmVkLCB7IGNvbW1hbmQ6IGNvbW1hbmROYW1lLCBhcmdzIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
