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
                // We disable the linting as we are trying to dynamically load modules
                // tslint:disable:no-require-imports
                // tslint:disable:non-literal-require
                const commandFolder = this._fileSystem.pathCombine(this._engineRootFolder, "dist/commands/");
                const loadFile = this._fileSystem.pathCombine(commandFolder, `${commandName}Command.js`);
                const module = require(loadFile);
                // tslint:enable:no-require-imports
                // tslint:enable:non-literal-require
                const className = Object.keys(module)[0];
                const instance = Object.create(module[className].prototype);
                const engineCommand = new instance.constructor();
                engineCommand.create(this._logger, this._fileSystem, this._engineRootFolder, this._engineVersion, this._engineDependencies);
                args.outputDirectory = yield this.findConfigFolder(args.outputDirectory);
                return engineCommand.run(args);
            }
            catch (err) {
                this._logger.error("Error loading command module", undefined, { command: commandName, args });
                return 1;
            }
        });
    }
    findConfigFolder(outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            let initialDir;
            if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
                // no output directory specified so use current
                initialDir = this._fileSystem.pathAbsolute("./");
            }
            else {
                initialDir = this._fileSystem.pathAbsolute(outputDirectory);
            }
            let outputDir = initialDir;
            // check to see if this folder contains unite.json if it doesn't then keep recursing up
            // until we find it
            let searchComplete = false;
            let found = false;
            do {
                found = yield this._fileSystem.fileExists(outputDir, "unite.json");
                if (found) {
                    searchComplete = true;
                }
                else {
                    const newOutputDir = this._fileSystem.pathCombine(outputDir, "../");
                    // recursing up didn't move so we have reached the end of our search
                    if (newOutputDir === outputDir) {
                        searchComplete = true;
                    }
                    else {
                        outputDir = newOutputDir;
                    }
                }
            } while (!searchComplete);
            // not found at all so set outputDir back to initialDir in case this is a new creation
            if (!found) {
                outputDir = initialDir;
            }
            return outputDir;
        });
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFVQTtJQU9JLFlBQW1CLE1BQWUsRUFBRSxVQUF1QjtRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksVUFBVTs7WUFDbkIsSUFBSSxDQUFDO2dCQUNELE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFckUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLFNBQVMsRUFBRSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztvQkFDeEcsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTNFLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBdUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUM1SCxJQUFJLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztnQkFFaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNuRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBMkIsV0FBVyxFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBRTNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU0sT0FBTztRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDakUsQ0FBQztJQUVZLE9BQU8sQ0FBaUMsV0FBbUIsRUFBRSxJQUFPOztZQUM3RSxJQUFJLENBQUM7Z0JBQ0Qsc0VBQXNFO2dCQUN0RSxvQ0FBb0M7Z0JBQ3BDLHFDQUFxQztnQkFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQzdGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLFdBQVcsWUFBWSxDQUFDLENBQUM7Z0JBQ3pGLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakMsbUNBQW1DO2dCQUNuQyxvQ0FBb0M7Z0JBRXBDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXpDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLGFBQWEsR0FBc0IsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBRXBFLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUM1SCxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDekUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLEVBQUUsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUM5RixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTtJQUVhLGdCQUFnQixDQUFDLGVBQTBDOztZQUNyRSxJQUFJLFVBQVUsQ0FBQztZQUNmLEVBQUUsQ0FBQyxDQUFDLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLElBQUksSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVGLCtDQUErQztnQkFDL0MsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDaEUsQ0FBQztZQUVELElBQUksU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUUzQix1RkFBdUY7WUFDdkYsbUJBQW1CO1lBQ25CLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztZQUMzQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbEIsR0FBRyxDQUFDO2dCQUNBLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFbkUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDUixjQUFjLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFFcEUsb0VBQW9FO29CQUNwRSxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDN0IsY0FBYyxHQUFHLElBQUksQ0FBQztvQkFDMUIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixTQUFTLEdBQUcsWUFBWSxDQUFDO29CQUM3QixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDLFFBQ00sQ0FBQyxjQUFjLEVBQUU7WUFFeEIsc0ZBQXNGO1lBQ3RGLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBQzNCLENBQUM7WUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3JCLENBQUM7S0FBQTtDQUNKO0FBekdELHdCQXlHQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVuZ2luZVxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJRW5naW5lIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZVwiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFBhcmFtc1wiO1xuXG5leHBvcnQgY2xhc3MgRW5naW5lIGltcGxlbWVudHMgSUVuZ2luZSB7XG4gICAgcHJpdmF0ZSBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByaXZhdGUgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByaXZhdGUgX2VuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwcml2YXRlIF9lbmdpbmVWZXJzaW9uOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZW5naW5lRGVwZW5kZW5jaWVzOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSkge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBub2RlVmVyc2lvblBhcnRzID0gcHJvY2Vzcy52ZXJzaW9uLnJlcGxhY2UoXCJ2XCIsIFwiXCIpLnNwbGl0KFwiLlwiKTtcblxuICAgICAgICAgICAgaWYgKHBhcnNlSW50KG5vZGVWZXJzaW9uUGFydHNbMF0sIDEwKSA8IDgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJOb2RlIFZlcnNpb24gOCBvciBoaWdoZXIgaXMgcmVxdWlyZWRcIiwgdW5kZWZpbmVkLCB7IG5vZGVWZXJzaW9uOiBwcm9jZXNzLnZlcnNpb24gfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKF9fZGlybmFtZSwgXCIuLi8uLi9cIik7XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZ2luZVBhY2thZ2VKc29uID0gYXdhaXQgdGhpcy5fZmlsZVN5c3RlbS5maWxlUmVhZEpzb248UGFja2FnZUNvbmZpZ3VyYXRpb24+KHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwicGFja2FnZS5qc29uXCIpO1xuICAgICAgICAgICAgdGhpcy5fZW5naW5lVmVyc2lvbiA9IGVuZ2luZVBhY2thZ2VKc29uLnZlcnNpb247XG5cbiAgICAgICAgICAgIGNvbnN0IGFzc2V0Rm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZSh0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcImFzc2V0c1wiKTtcbiAgICAgICAgICAgIHRoaXMuX2VuZ2luZURlcGVuZGVuY2llcyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfT4oYXNzZXRGb2xkZXIsIFwicGVlclBhY2thZ2VzLmpzb25cIik7XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkxvYWRpbmcgZGVwZW5kZW5jaWVzIGZhaWxlZFwiLCBlcnIsIHsgY29yZTogdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgZGVwZW5kZW5jaWVzRmlsZTogXCJwYWNrYWdlLmpzb25cIiB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHZlcnNpb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuZ2luZVZlcnNpb24gPyB0aGlzLl9lbmdpbmVWZXJzaW9uIDogXCJ1bmtub3duXCI7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbW1hbmQ8VCBleHRlbmRzIElFbmdpbmVDb21tYW5kUGFyYW1zPihjb21tYW5kTmFtZTogc3RyaW5nLCBhcmdzOiBUKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdlIGRpc2FibGUgdGhlIGxpbnRpbmcgYXMgd2UgYXJlIHRyeWluZyB0byBkeW5hbWljYWxseSBsb2FkIG1vZHVsZXNcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6bm9uLWxpdGVyYWwtcmVxdWlyZVxuICAgICAgICAgICAgY29uc3QgY29tbWFuZEZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJkaXN0L2NvbW1hbmRzL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGaWxlID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShjb21tYW5kRm9sZGVyLCBgJHtjb21tYW5kTmFtZX1Db21tYW5kLmpzYCk7XG4gICAgICAgICAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGxvYWRGaWxlKTtcbiAgICAgICAgICAgIC8vIHRzbGludDplbmFibGU6bm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vbi1saXRlcmFsLXJlcXVpcmVcblxuICAgICAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gT2JqZWN0LmtleXMobW9kdWxlKVswXTtcblxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKG1vZHVsZVtjbGFzc05hbWVdLnByb3RvdHlwZSk7XG4gICAgICAgICAgICBjb25zdCBlbmdpbmVDb21tYW5kOiBJRW5naW5lQ29tbWFuZDxUPiA9IG5ldyBpbnN0YW5jZS5jb25zdHJ1Y3RvcigpO1xuXG4gICAgICAgICAgICBlbmdpbmVDb21tYW5kLmNyZWF0ZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIHRoaXMuX2VuZ2luZVZlcnNpb24sIHRoaXMuX2VuZ2luZURlcGVuZGVuY2llcyk7XG4gICAgICAgICAgICBhcmdzLm91dHB1dERpcmVjdG9yeSA9IGF3YWl0IHRoaXMuZmluZENvbmZpZ0ZvbGRlcihhcmdzLm91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgICAgICByZXR1cm4gZW5naW5lQ29tbWFuZC5ydW4oYXJncyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiRXJyb3IgbG9hZGluZyBjb21tYW5kIG1vZHVsZVwiLCB1bmRlZmluZWQsIHsgY29tbWFuZDogY29tbWFuZE5hbWUsIGFyZ3MgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZmluZENvbmZpZ0ZvbGRlcihvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBsZXQgaW5pdGlhbERpcjtcbiAgICAgICAgaWYgKG91dHB1dERpcmVjdG9yeSA9PT0gdW5kZWZpbmVkIHx8IG91dHB1dERpcmVjdG9yeSA9PT0gbnVsbCB8fCBvdXRwdXREaXJlY3RvcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBubyBvdXRwdXQgZGlyZWN0b3J5IHNwZWNpZmllZCBzbyB1c2UgY3VycmVudFxuICAgICAgICAgICAgaW5pdGlhbERpciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aEFic29sdXRlKFwiLi9cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbml0aWFsRGlyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQWJzb2x1dGUob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvdXRwdXREaXIgPSBpbml0aWFsRGlyO1xuXG4gICAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiB0aGlzIGZvbGRlciBjb250YWlucyB1bml0ZS5qc29uIGlmIGl0IGRvZXNuJ3QgdGhlbiBrZWVwIHJlY3Vyc2luZyB1cFxuICAgICAgICAvLyB1bnRpbCB3ZSBmaW5kIGl0XG4gICAgICAgIGxldCBzZWFyY2hDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgZm91bmQgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHMob3V0cHV0RGlyLCBcInVuaXRlLmpzb25cIik7XG5cbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIHNlYXJjaENvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3T3V0cHV0RGlyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShvdXRwdXREaXIsIFwiLi4vXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gcmVjdXJzaW5nIHVwIGRpZG4ndCBtb3ZlIHNvIHdlIGhhdmUgcmVhY2hlZCB0aGUgZW5kIG9mIG91ciBzZWFyY2hcbiAgICAgICAgICAgICAgICBpZiAobmV3T3V0cHV0RGlyID09PSBvdXRwdXREaXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dERpciA9IG5ld091dHB1dERpcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKCFzZWFyY2hDb21wbGV0ZSk7XG5cbiAgICAgICAgLy8gbm90IGZvdW5kIGF0IGFsbCBzbyBzZXQgb3V0cHV0RGlyIGJhY2sgdG8gaW5pdGlhbERpciBpbiBjYXNlIHRoaXMgaXMgYSBuZXcgY3JlYXRpb25cbiAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgb3V0cHV0RGlyID0gaW5pdGlhbERpcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXREaXI7XG4gICAgfVxufVxuIl19
