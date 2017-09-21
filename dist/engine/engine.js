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
                this._engineRootFolder = this._fileSystem.pathCombine(__dirname, "../../");
                this._enginePackageJson = yield this._fileSystem.fileReadJson(this._engineRootFolder, "package.json");
                return 0;
            }
            catch (err) {
                this._logger.error("Loading dependencies failed", err, { core: this._engineRootFolder, dependenciesFile: "package.json" });
                return 1;
            }
        });
    }
    version() {
        return this._enginePackageJson ? this._enginePackageJson.version : "unknown";
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
                engineCommand.create(this._logger, this._fileSystem, this._engineRootFolder, this._enginePackageJson);
                args.outputDirectory = this.cleanupOutputDirectory(args.outputDirectory);
                return engineCommand.run(args);
            }
            catch (err) {
                this._logger.error("Error loading command module", undefined, { command: commandName, args });
                return 1;
            }
        });
    }
    cleanupOutputDirectory(outputDirectory) {
        let outputDir;
        if (outputDirectory === undefined || outputDirectory === null || outputDirectory.length === 0) {
            // no output directory specified so use current
            outputDir = this._fileSystem.pathAbsolute("./");
        }
        else {
            outputDir = this._fileSystem.pathAbsolute(outputDirectory);
        }
        // check to see if this folder is called www, if it is then we should traverse up one folder
        // to where the unite.json is
        const dirName = this._fileSystem.pathGetFilename(outputDir);
        if (dirName === "www") {
            outputDir = this._fileSystem.pathCombine(outputDir, "../");
        }
        return outputDir;
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFVQTtJQU1JLFlBQW1CLE1BQWUsRUFBRSxVQUF1QjtRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksVUFBVTs7WUFDbkIsSUFBSSxDQUFDO2dCQUNELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTNFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUF1QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBRTVILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU0sT0FBTztRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7SUFDakYsQ0FBQztJQUVZLE9BQU8sQ0FBaUMsV0FBbUIsRUFBRSxJQUFPOztZQUM3RSxJQUFJLENBQUM7Z0JBQ0Qsc0VBQXNFO2dCQUN0RSxvQ0FBb0M7Z0JBQ3BDLHFDQUFxQztnQkFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQzdGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLFdBQVcsWUFBWSxDQUFDLENBQUM7Z0JBQ3pGLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakMsbUNBQW1DO2dCQUNuQyxvQ0FBb0M7Z0JBRXBDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXpDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLGFBQWEsR0FBc0IsSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBRXBFLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDdEcsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUN6RSxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQzlGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sc0JBQXNCLENBQUMsZUFBMEM7UUFDckUsSUFBSSxTQUFTLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxlQUFlLEtBQUssU0FBUyxJQUFJLGVBQWUsS0FBSyxJQUFJLElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVGLCtDQUErQztZQUMvQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFFRCw0RkFBNEY7UUFDNUYsNkJBQTZCO1FBQzdCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDckIsQ0FBQztDQUNKO0FBdkVELHdCQXVFQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVuZ2luZVxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJRW5naW5lIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZVwiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFBhcmFtc1wiO1xuXG5leHBvcnQgY2xhc3MgRW5naW5lIGltcGxlbWVudHMgSUVuZ2luZSB7XG4gICAgcHJpdmF0ZSBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByaXZhdGUgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByaXZhdGUgX2VuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwcml2YXRlIF9lbmdpbmVQYWNrYWdlSnNvbjogUGFja2FnZUNvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSkge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVQYWNrYWdlSnNvbiA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFBhY2thZ2VDb25maWd1cmF0aW9uPih0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcInBhY2thZ2UuanNvblwiKTtcblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiTG9hZGluZyBkZXBlbmRlbmNpZXMgZmFpbGVkXCIsIGVyciwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdmVyc2lvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5naW5lUGFja2FnZUpzb24gPyB0aGlzLl9lbmdpbmVQYWNrYWdlSnNvbi52ZXJzaW9uIDogXCJ1bmtub3duXCI7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbW1hbmQ8VCBleHRlbmRzIElFbmdpbmVDb21tYW5kUGFyYW1zPihjb21tYW5kTmFtZTogc3RyaW5nLCBhcmdzOiBUKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdlIGRpc2FibGUgdGhlIGxpbnRpbmcgYXMgd2UgYXJlIHRyeWluZyB0byBkeW5hbWljYWxseSBsb2FkIG1vZHVsZXNcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6bm9uLWxpdGVyYWwtcmVxdWlyZVxuICAgICAgICAgICAgY29uc3QgY29tbWFuZEZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJkaXN0L2NvbW1hbmRzL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGaWxlID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShjb21tYW5kRm9sZGVyLCBgJHtjb21tYW5kTmFtZX1Db21tYW5kLmpzYCk7XG4gICAgICAgICAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGxvYWRGaWxlKTtcbiAgICAgICAgICAgIC8vIHRzbGludDplbmFibGU6bm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vbi1saXRlcmFsLXJlcXVpcmVcblxuICAgICAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gT2JqZWN0LmtleXMobW9kdWxlKVswXTtcblxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKG1vZHVsZVtjbGFzc05hbWVdLnByb3RvdHlwZSk7XG4gICAgICAgICAgICBjb25zdCBlbmdpbmVDb21tYW5kOiBJRW5naW5lQ29tbWFuZDxUPiA9IG5ldyBpbnN0YW5jZS5jb25zdHJ1Y3RvcigpO1xuXG4gICAgICAgICAgICBlbmdpbmVDb21tYW5kLmNyZWF0ZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIHRoaXMuX2VuZ2luZVBhY2thZ2VKc29uKTtcbiAgICAgICAgICAgIGFyZ3Mub3V0cHV0RGlyZWN0b3J5ID0gdGhpcy5jbGVhbnVwT3V0cHV0RGlyZWN0b3J5KGFyZ3Mub3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgICAgIHJldHVybiBlbmdpbmVDb21tYW5kLnJ1bihhcmdzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJFcnJvciBsb2FkaW5nIGNvbW1hbmQgbW9kdWxlXCIsIHVuZGVmaW5lZCwgeyBjb21tYW5kOiBjb21tYW5kTmFtZSwgYXJncyB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhbnVwT3V0cHV0RGlyZWN0b3J5KG91dHB1dERpcmVjdG9yeTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgICAgIGxldCBvdXRwdXREaXI7XG4gICAgICAgIGlmIChvdXRwdXREaXJlY3RvcnkgPT09IHVuZGVmaW5lZCB8fCBvdXRwdXREaXJlY3RvcnkgPT09IG51bGwgfHwgb3V0cHV0RGlyZWN0b3J5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gbm8gb3V0cHV0IGRpcmVjdG9yeSBzcGVjaWZpZWQgc28gdXNlIGN1cnJlbnRcbiAgICAgICAgICAgIG91dHB1dERpciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aEFic29sdXRlKFwiLi9cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRwdXREaXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhBYnNvbHV0ZShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIHRoaXMgZm9sZGVyIGlzIGNhbGxlZCB3d3csIGlmIGl0IGlzIHRoZW4gd2Ugc2hvdWxkIHRyYXZlcnNlIHVwIG9uZSBmb2xkZXJcbiAgICAgICAgLy8gdG8gd2hlcmUgdGhlIHVuaXRlLmpzb24gaXNcbiAgICAgICAgY29uc3QgZGlyTmFtZSA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aEdldEZpbGVuYW1lKG91dHB1dERpcik7XG4gICAgICAgIGlmIChkaXJOYW1lID09PSBcInd3d1wiKSB7XG4gICAgICAgICAgICBvdXRwdXREaXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKG91dHB1dERpciwgXCIuLi9cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0RGlyO1xuICAgIH1cbn1cbiJdfQ==
