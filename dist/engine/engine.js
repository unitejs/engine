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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFVQTtJQU1JLFlBQW1CLE1BQWUsRUFBRSxVQUF1QjtRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRVksVUFBVTs7WUFDbkIsSUFBSSxDQUFDO2dCQUNELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTNFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUF1QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBRTVILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7Z0JBQzNILE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU0sT0FBTztRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7SUFDakYsQ0FBQztJQUVZLE9BQU8sQ0FBaUMsV0FBbUIsRUFBRSxJQUFPOztZQUM3RSxJQUFJLENBQUM7Z0JBQ0Qsc0VBQXNFO2dCQUN0RSxvQ0FBb0M7Z0JBQ3BDLHFDQUFxQztnQkFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FB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RjtZQUN0RixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUMzQixDQUFDO1lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixDQUFDO0tBQUE7Q0FDSjtBQTdGRCx3QkE2RkMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBlbmdpbmVcbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSUVuZ2luZSB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lFbmdpbmVcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRcIjtcbmltcG9ydCB7IElFbmdpbmVDb21tYW5kUGFyYW1zIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSUVuZ2luZUNvbW1hbmRQYXJhbXNcIjtcblxuZXhwb3J0IGNsYXNzIEVuZ2luZSBpbXBsZW1lbnRzIElFbmdpbmUge1xuICAgIHByaXZhdGUgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcml2YXRlIF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcbiAgICBwcml2YXRlIF9lbmdpbmVSb290Rm9sZGVyOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZW5naW5lUGFja2FnZUpzb246IFBhY2thZ2VDb25maWd1cmF0aW9uO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0pIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB0aGlzLl9maWxlU3lzdGVtID0gZmlsZVN5c3RlbTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdGlhbGlzZSgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fZW5naW5lUm9vdEZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoX19kaXJuYW1lLCBcIi4uLy4uL1wiKTtcblxuICAgICAgICAgICAgdGhpcy5fZW5naW5lUGFja2FnZUpzb24gPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVSZWFkSnNvbjxQYWNrYWdlQ29uZmlndXJhdGlvbj4odGhpcy5fZW5naW5lUm9vdEZvbGRlciwgXCJwYWNrYWdlLmpzb25cIik7XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihcIkxvYWRpbmcgZGVwZW5kZW5jaWVzIGZhaWxlZFwiLCBlcnIsIHsgY29yZTogdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgZGVwZW5kZW5jaWVzRmlsZTogXCJwYWNrYWdlLmpzb25cIiB9KTtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHZlcnNpb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuZ2luZVBhY2thZ2VKc29uID8gdGhpcy5fZW5naW5lUGFja2FnZUpzb24udmVyc2lvbiA6IFwidW5rbm93blwiO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb21tYW5kPFQgZXh0ZW5kcyBJRW5naW5lQ29tbWFuZFBhcmFtcz4oY29tbWFuZE5hbWU6IHN0cmluZywgYXJnczogVCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXZSBkaXNhYmxlIHRoZSBsaW50aW5nIGFzIHdlIGFyZSB0cnlpbmcgdG8gZHluYW1pY2FsbHkgbG9hZCBtb2R1bGVzXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm5vbi1saXRlcmFsLXJlcXVpcmVcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIFwiZGlzdC9jb21tYW5kcy9cIik7XG4gICAgICAgICAgICBjb25zdCBsb2FkRmlsZSA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUoY29tbWFuZEZvbGRlciwgYCR7Y29tbWFuZE5hbWV9Q29tbWFuZC5qc2ApO1xuICAgICAgICAgICAgY29uc3QgbW9kdWxlID0gcmVxdWlyZShsb2FkRmlsZSk7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICAgICAgLy8gdHNsaW50OmVuYWJsZTpub24tbGl0ZXJhbC1yZXF1aXJlXG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IE9iamVjdC5rZXlzKG1vZHVsZSlbMF07XG5cbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGVbY2xhc3NOYW1lXS5wcm90b3R5cGUpO1xuICAgICAgICAgICAgY29uc3QgZW5naW5lQ29tbWFuZDogSUVuZ2luZUNvbW1hbmQ8VD4gPSBuZXcgaW5zdGFuY2UuY29uc3RydWN0b3IoKTtcblxuICAgICAgICAgICAgZW5naW5lQ29tbWFuZC5jcmVhdGUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCB0aGlzLl9lbmdpbmVQYWNrYWdlSnNvbik7XG4gICAgICAgICAgICBhcmdzLm91dHB1dERpcmVjdG9yeSA9IGF3YWl0IHRoaXMuZmluZENvbmZpZ0ZvbGRlcihhcmdzLm91dHB1dERpcmVjdG9yeSk7XG4gICAgICAgICAgICByZXR1cm4gZW5naW5lQ29tbWFuZC5ydW4oYXJncyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKFwiRXJyb3IgbG9hZGluZyBjb21tYW5kIG1vZHVsZVwiLCB1bmRlZmluZWQsIHsgY29tbWFuZDogY29tbWFuZE5hbWUsIGFyZ3MgfSk7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZmluZENvbmZpZ0ZvbGRlcihvdXRwdXREaXJlY3Rvcnk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBsZXQgaW5pdGlhbERpcjtcbiAgICAgICAgaWYgKG91dHB1dERpcmVjdG9yeSA9PT0gdW5kZWZpbmVkIHx8IG91dHB1dERpcmVjdG9yeSA9PT0gbnVsbCB8fCBvdXRwdXREaXJlY3RvcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBubyBvdXRwdXQgZGlyZWN0b3J5IHNwZWNpZmllZCBzbyB1c2UgY3VycmVudFxuICAgICAgICAgICAgaW5pdGlhbERpciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aEFic29sdXRlKFwiLi9cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbml0aWFsRGlyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQWJzb2x1dGUob3V0cHV0RGlyZWN0b3J5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBvdXRwdXREaXIgPSBpbml0aWFsRGlyO1xuXG4gICAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiB0aGlzIGZvbGRlciBjb250YWlucyB1bml0ZS5qc29uIGlmIGl0IGRvZXNuJ3QgdGhlbiBrZWVwIHJlY3Vyc2luZyB1cFxuICAgICAgICAvLyB1bnRpbCB3ZSBmaW5kIGl0XG4gICAgICAgIGxldCBzZWFyY2hDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgZm91bmQgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmZpbGVFeGlzdHMob3V0cHV0RGlyLCBcInVuaXRlLmpzb25cIik7XG5cbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIHNlYXJjaENvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3T3V0cHV0RGlyID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShvdXRwdXREaXIsIFwiLi4vXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gcmVjdXJzaW5nIHVwIGRpZG4ndCBtb3ZlIHNvIHdlIGhhdmUgcmVhY2hlZCB0aGUgZW5kIG9mIG91ciBzZWFyY2hcbiAgICAgICAgICAgICAgICBpZiAobmV3T3V0cHV0RGlyID09PSBvdXRwdXREaXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dERpciA9IG5ld091dHB1dERpcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKCFzZWFyY2hDb21wbGV0ZSk7XG5cbiAgICAgICAgLy8gbm90IGZvdW5kIGF0IGFsbCBzbyBzZXQgb3V0cHV0RGlyIGJhY2sgdG8gaW5pdGlhbERpciBpbiBjYXNlIHRoaXMgaXMgYSBuZXcgY3JlYXRpb25cbiAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgb3V0cHV0RGlyID0gaW5pdGlhbERpcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXREaXI7XG4gICAgfVxufVxuIl19
