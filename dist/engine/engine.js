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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSw0REFBeUQ7QUFJekQsaURBQThDO0FBRTlDO0lBT0ksWUFBWSxNQUFlLEVBQUUsVUFBdUI7UUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVZLFVBQVU7O1lBQ25CLElBQUk7Z0JBQ0EsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsT0FBTztxQkFDUCxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztxQkFDaEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUU1QyxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLFNBQVMsRUFBRSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDeEcsT0FBTyxDQUFDLENBQUM7aUJBQ1o7Z0JBRUQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFM0UsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUF1QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQzVILElBQUksQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDO2dCQUVoRCxNQUFNLGlCQUFpQixHQUFHLE1BQU0sNkJBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUVqSSxJQUFJLGlCQUFpQixFQUFFO29CQUNuQixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNwRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBMkIsaUJBQWlCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztpQkFDcEk7cUJBQU07b0JBQ0gsT0FBTyxDQUFDLENBQUM7aUJBQ1o7Z0JBRUQsT0FBTyxDQUFDLENBQUM7YUFDWjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztnQkFDM0gsT0FBTyxDQUFDLENBQUM7YUFDWjtRQUNMLENBQUM7S0FBQTtJQUVNLE9BQU87UUFDVixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNqRSxDQUFDO0lBRVksT0FBTyxDQUFpQyxXQUFtQixFQUFFLElBQU87O1lBQzdFLElBQUk7Z0JBQ0EsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQzdGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLFdBQVcsWUFBWSxDQUFDLENBQUM7Z0JBQ3pGLE1BQU0sTUFBTSxHQUFHLDJDQUFhLFFBQVEsRUFBQyxDQUFDO2dCQUV0QyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUV6QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxhQUFhLEdBQXNCLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUVwRSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDNUgsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLDJCQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ25HLE9BQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNsQztZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDOUYsT0FBTyxDQUFDLENBQUM7YUFDWjtRQUNMLENBQUM7S0FBQTtDQUNKO0FBbkVELHdCQW1FQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVuZ2luZVxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBQYWNrYWdlSGVscGVyIH0gZnJvbSBcIi4uL2hlbHBlcnMvcGFja2FnZUhlbHBlclwiO1xuaW1wb3J0IHsgSUVuZ2luZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRQYXJhbXNcIjtcbmltcG9ydCB7IENvbmZpZ0hlbHBlciB9IGZyb20gXCIuL2NvbmZpZ0hlbHBlclwiO1xuXG5leHBvcnQgY2xhc3MgRW5naW5lIGltcGxlbWVudHMgSUVuZ2luZSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByaXZhdGUgX2VuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwcml2YXRlIF9lbmdpbmVWZXJzaW9uOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IGZpbGVTeXN0ZW07XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpc2UoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVWZXJzaW9uUGFydHMgPSBwcm9jZXNzLnZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoXCJ2XCIsIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIi5cIik7XG5cbiAgICAgICAgICAgIGlmIChwYXJzZUludChub2RlVmVyc2lvblBhcnRzWzBdLCAxMCkgPCA4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiTm9kZSBWZXJzaW9uIDggb3IgaGlnaGVyIGlzIHJlcXVpcmVkXCIsIHVuZGVmaW5lZCwgeyBub2RlVmVyc2lvbjogcHJvY2Vzcy52ZXJzaW9uIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vXCIpO1xuXG4gICAgICAgICAgICBjb25zdCBlbmdpbmVQYWNrYWdlSnNvbiA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFBhY2thZ2VDb25maWd1cmF0aW9uPih0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcInBhY2thZ2UuanNvblwiKTtcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZVZlcnNpb24gPSBlbmdpbmVQYWNrYWdlSnNvbi52ZXJzaW9uO1xuXG4gICAgICAgICAgICBjb25zdCByb290UGFja2FnZUZvbGRlciA9IGF3YWl0IFBhY2thZ2VIZWxwZXIubG9jYXRlKHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2xvZ2dlciwgdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJ1bml0ZWpzLXBhY2thZ2VzXCIpO1xuXG4gICAgICAgICAgICBpZiAocm9vdFBhY2thZ2VGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByb290UGFja2FnZUFzc2V0cyA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUocm9vdFBhY2thZ2VGb2xkZXIsIFwiYXNzZXRzXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2VuZ2luZURlcGVuZGVuY2llcyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfT4ocm9vdFBhY2thZ2VBc3NldHMsIFwicGVlclBhY2thZ2VzLmpzb25cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJMb2FkaW5nIGRlcGVuZGVuY2llcyBmYWlsZWRcIiwgZXJyLCB7IGNvcmU6IHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIGRlcGVuZGVuY2llc0ZpbGU6IFwicGFja2FnZS5qc29uXCIgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB2ZXJzaW9uKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbmdpbmVWZXJzaW9uID8gdGhpcy5fZW5naW5lVmVyc2lvbiA6IFwidW5rbm93blwiO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb21tYW5kPFQgZXh0ZW5kcyBJRW5naW5lQ29tbWFuZFBhcmFtcz4oY29tbWFuZE5hbWU6IHN0cmluZywgYXJnczogVCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjb21tYW5kRm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcImRpc3QvY29tbWFuZHMvXCIpO1xuICAgICAgICAgICAgY29uc3QgbG9hZEZpbGUgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKGNvbW1hbmRGb2xkZXIsIGAke2NvbW1hbmROYW1lfUNvbW1hbmQuanNgKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IGF3YWl0IGltcG9ydChsb2FkRmlsZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IE9iamVjdC5rZXlzKG1vZHVsZSlbMF07XG5cbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGVbY2xhc3NOYW1lXS5wcm90b3R5cGUpO1xuICAgICAgICAgICAgY29uc3QgZW5naW5lQ29tbWFuZDogSUVuZ2luZUNvbW1hbmQ8VD4gPSBuZXcgaW5zdGFuY2UuY29uc3RydWN0b3IoKTtcblxuICAgICAgICAgICAgZW5naW5lQ29tbWFuZC5jcmVhdGUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCB0aGlzLl9lbmdpbmVWZXJzaW9uLCB0aGlzLl9lbmdpbmVEZXBlbmRlbmNpZXMpO1xuICAgICAgICAgICAgYXJncy5vdXRwdXREaXJlY3RvcnkgPSBhd2FpdCBDb25maWdIZWxwZXIuZmluZENvbmZpZ0ZvbGRlcih0aGlzLl9maWxlU3lzdGVtLCBhcmdzLm91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgICAgICByZXR1cm4gZW5naW5lQ29tbWFuZC5ydW4oYXJncyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiRXJyb3IgbG9hZGluZyBjb21tYW5kIG1vZHVsZVwiLCB1bmRlZmluZWQsIHsgY29tbWFuZDogY29tbWFuZE5hbWUsIGFyZ3MgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
