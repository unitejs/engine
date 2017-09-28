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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFVQTtJQU1JLFlBQW1CLE1BQWUsRUFBRSxVQUF1QjtRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksVUFBVTs7WUFDbkIsSUFBSSxDQUFDO2dCQUNELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTNFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUF1QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBRTVILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU0sT0FBTztRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNqRixDQUFDO0lBRVksT0FBTyxDQUFpQyxXQUFtQixFQUFFLElBQU87O1lBQzdFLElBQUksQ0FBQztnQkFDRCxzRUFBc0U7Z0JBQ3RFLG9DQUFvQztnQkFDcEMscUNBQXFDO2dCQUNyQyxNQUFNLGFBQWEsR0FB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QUFjLEVBQUU7WUFFeEIsc0ZBQXNGO1lBQ3RGLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBQzNCLENBQUM7WUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3JCLENBQUM7S0FBQTtDQUNKO0FBN0ZELHdCQTZGQyIsImZpbGUiOiJlbmdpbmUvZW5naW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNYWluIGVuZ2luZVxuICovXG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJRW5naW5lIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZVwiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFwiO1xuaW1wb3J0IHsgSUVuZ2luZUNvbW1hbmRQYXJhbXMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JRW5naW5lQ29tbWFuZFBhcmFtc1wiO1xuXG5leHBvcnQgY2xhc3MgRW5naW5lIGltcGxlbWVudHMgSUVuZ2luZSB7XG4gICAgcHJpdmF0ZSBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByaXZhdGUgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByaXZhdGUgX2VuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcbiAgICBwcml2YXRlIF9lbmdpbmVQYWNrYWdlSnNvbjogUGFja2FnZUNvbmZpZ3VyYXRpb247XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSkge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShfX2Rpcm5hbWUsIFwiLi4vLi4vXCIpO1xuXG4gICAgICAgICAgICB0aGlzLl9lbmdpbmVQYWNrYWdlSnNvbiA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZVJlYWRKc29uPFBhY2thZ2VDb25maWd1cmF0aW9uPih0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBcInBhY2thZ2UuanNvblwiKTtcblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiTG9hZGluZyBkZXBlbmRlbmNpZXMgZmFpbGVkXCIsIGVyciwgeyBjb3JlOiB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBkZXBlbmRlbmNpZXNGaWxlOiBcInBhY2thZ2UuanNvblwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdmVyc2lvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5naW5lUGFja2FnZUpzb24gPyB0aGlzLl9lbmdpbmVQYWNrYWdlSnNvbi52ZXJzaW9uIDogXCJ1bmtub3duXCI7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNvbW1hbmQ8VCBleHRlbmRzIElFbmdpbmVDb21tYW5kUGFyYW1zPihjb21tYW5kTmFtZTogc3RyaW5nLCBhcmdzOiBUKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdlIGRpc2FibGUgdGhlIGxpbnRpbmcgYXMgd2UgYXJlIHRyeWluZyB0byBkeW5hbWljYWxseSBsb2FkIG1vZHVsZXNcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6bm9uLWxpdGVyYWwtcmVxdWlyZVxuICAgICAgICAgICAgY29uc3QgY29tbWFuZEZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJkaXN0L2NvbW1hbmRzL1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGaWxlID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShjb21tYW5kRm9sZGVyLCBgJHtjb21tYW5kTmFtZX1Db21tYW5kLmpzYCk7XG4gICAgICAgICAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGxvYWRGaWxlKTtcbiAgICAgICAgICAgIC8vIHRzbGludDplbmFibGU6bm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vbi1saXRlcmFsLXJlcXVpcmVcblxuICAgICAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gT2JqZWN0LmtleXMobW9kdWxlKVswXTtcblxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKG1vZHVsZVtjbGFzc05hbWVdLnByb3RvdHlwZSk7XG4gICAgICAgICAgICBjb25zdCBlbmdpbmVDb21tYW5kOiBJRW5naW5lQ29tbWFuZDxUPiA9IG5ldyBpbnN0YW5jZS5jb25zdHJ1Y3RvcigpO1xuXG4gICAgICAgICAgICBlbmdpbmVDb21tYW5kLmNyZWF0ZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIHRoaXMuX2VuZ2luZVBhY2thZ2VKc29uKTtcbiAgICAgICAgICAgIGFyZ3Mub3V0cHV0RGlyZWN0b3J5ID0gYXdhaXQgdGhpcy5maW5kQ29uZmlnRm9sZGVyKGFyZ3Mub3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgICAgIHJldHVybiBlbmdpbmVDb21tYW5kLnJ1bihhcmdzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoXCJFcnJvciBsb2FkaW5nIGNvbW1hbmQgbW9kdWxlXCIsIHVuZGVmaW5lZCwgeyBjb21tYW5kOiBjb21tYW5kTmFtZSwgYXJncyB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBmaW5kQ29uZmlnRm9sZGVyKG91dHB1dERpcmVjdG9yeTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGxldCBpbml0aWFsRGlyO1xuICAgICAgICBpZiAob3V0cHV0RGlyZWN0b3J5ID09PSB1bmRlZmluZWQgfHwgb3V0cHV0RGlyZWN0b3J5ID09PSBudWxsIHx8IG91dHB1dERpcmVjdG9yeS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vIG5vIG91dHB1dCBkaXJlY3Rvcnkgc3BlY2lmaWVkIHNvIHVzZSBjdXJyZW50XG4gICAgICAgICAgICBpbml0aWFsRGlyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQWJzb2x1dGUoXCIuL1wiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluaXRpYWxEaXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhBYnNvbHV0ZShvdXRwdXREaXJlY3RvcnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG91dHB1dERpciA9IGluaXRpYWxEaXI7XG5cbiAgICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIHRoaXMgZm9sZGVyIGNvbnRhaW5zIHVuaXRlLmpzb24gaWYgaXQgZG9lc24ndCB0aGVuIGtlZXAgcmVjdXJzaW5nIHVwXG4gICAgICAgIC8vIHVudGlsIHdlIGZpbmQgaXRcbiAgICAgICAgbGV0IHNlYXJjaENvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBmb3VuZCA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhvdXRwdXREaXIsIFwidW5pdGUuanNvblwiKTtcblxuICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdPdXRwdXREaXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKG91dHB1dERpciwgXCIuLi9cIik7XG5cbiAgICAgICAgICAgICAgICAvLyByZWN1cnNpbmcgdXAgZGlkbid0IG1vdmUgc28gd2UgaGF2ZSByZWFjaGVkIHRoZSBlbmQgb2Ygb3VyIHNlYXJjaFxuICAgICAgICAgICAgICAgIGlmIChuZXdPdXRwdXREaXIgPT09IG91dHB1dERpcikge1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0RGlyID0gbmV3T3V0cHV0RGlyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoIXNlYXJjaENvbXBsZXRlKTtcblxuICAgICAgICAvLyBub3QgZm91bmQgYXQgYWxsIHNvIHNldCBvdXRwdXREaXIgYmFjayB0byBpbml0aWFsRGlyIGluIGNhc2UgdGhpcyBpcyBhIG5ldyBjcmVhdGlvblxuICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICBvdXRwdXREaXIgPSBpbml0aWFsRGlyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dERpcjtcbiAgICB9XG59XG4iXX0=
