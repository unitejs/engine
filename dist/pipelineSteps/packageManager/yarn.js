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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
const packageUtils_1 = require("../packageUtils");
class Yarn extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            if (_super("condition").call(this, uniteConfiguration.packageManager, "Yarn")) {
                const gitIgnoreConfiguration = engineVariables.getConfiguration("GitIgnore");
                if (gitIgnoreConfiguration) {
                    gitIgnoreConfiguration.push("node_modules");
                }
            }
            return 0;
        });
    }
    info(logger, fileSystem, packageName, version) {
        return __awaiter(this, void 0, void 0, function* () {
            // We still use NPM for this as yarn doesn't have this facility yet
            logger.info("Looking up package info...");
            const args = ["view", `${packageName}${version !== null && version !== undefined ? `@${version}` : ""}`, "--json", "name", "version", "main"];
            return packageUtils_1.PackageUtils.exec(logger, fileSystem, "npm", undefined, args)
                .then(viewData => JSON.parse(viewData))
                .catch((err) => {
                throw new Error(`No package information found: ${err}`);
            });
        });
    }
    add(logger, fileSystem, workingDirectory, packageName, version, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Adding package...");
            const args = ["add", `${packageName}@${version}`];
            if (isDev) {
                args.push("--dev");
            }
            return packageUtils_1.PackageUtils.exec(logger, fileSystem, "yarn", workingDirectory, args)
                .catch((err) => {
                throw new Error(`Unable to add package: ${err}`);
            });
        });
    }
    remove(logger, fileSystem, workingDirectory, packageName, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Removing package...");
            const args = ["remove", packageName];
            if (isDev) {
                args.push("--dev");
            }
            return packageUtils_1.PackageUtils.exec(logger, fileSystem, "yarn", workingDirectory, args)
                .catch((err) => {
                throw new Error(`Unable to remove package: ${err}`);
            });
        });
    }
}
exports.Yarn = Yarn;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VNYW5hZ2VyL3lhcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU9BLGdGQUE2RTtBQUc3RSxrREFBK0M7QUFFL0MsVUFBa0IsU0FBUSwrQ0FBc0I7SUFDL0IsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksRUFBRSxDQUFDLENBQUMsbUJBQWUsWUFBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxNQUFNLHNCQUFzQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBVyxXQUFXLENBQUMsQ0FBQztnQkFDdkYsRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO29CQUN6QixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ2hELENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLElBQUksQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxXQUFtQixFQUFFLE9BQWU7O1lBQzVGLG1FQUFtRTtZQUNuRSxNQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7WUFFMUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxXQUFXLEdBQUcsT0FBTyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssU0FBUyxHQUFHLElBQUksT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFOUksTUFBTSxDQUFDLDJCQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUM7aUJBQy9ELElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDdEMsS0FBSyxDQUFDLENBQUMsR0FBRztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0lBRVksR0FBRyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGdCQUF3QixFQUFFLFdBQW1CLEVBQUUsT0FBZSxFQUFFLEtBQWM7O1lBQ3JJLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUVqQyxNQUFNLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLFdBQVcsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ2xELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBRUQsTUFBTSxDQUFDLDJCQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQztpQkFDdkUsS0FBSyxDQUFDLENBQUMsR0FBRztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0lBRVksTUFBTSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGdCQUF3QixFQUFFLFdBQW1CLEVBQUUsS0FBYzs7WUFDdkgsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBRW5DLE1BQU0sSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBRUQsTUFBTSxDQUFDLDJCQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQztpQkFDdkUsS0FBSyxDQUFDLENBQUMsR0FBRztnQkFDUCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0NBQ0o7QUFuREQsb0JBbURDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvcGFja2FnZU1hbmFnZXIveWFybi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCBmb3IgWWFybi5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IElQYWNrYWdlTWFuYWdlciB9IGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL0lQYWNrYWdlTWFuYWdlclwiO1xuaW1wb3J0IHsgUGFja2FnZVV0aWxzIH0gZnJvbSBcIi4uL3BhY2thZ2VVdGlsc1wiO1xuXG5leHBvcnQgY2xhc3MgWWFybiBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2UgaW1wbGVtZW50cyBJUGFja2FnZU1hbmFnZXIge1xuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChzdXBlci5jb25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyLCBcIllhcm5cIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGdpdElnbm9yZUNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxzdHJpbmdbXT4oXCJHaXRJZ25vcmVcIik7XG4gICAgICAgICAgICBpZiAoZ2l0SWdub3JlQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGdpdElnbm9yZUNvbmZpZ3VyYXRpb24ucHVzaChcIm5vZGVfbW9kdWxlc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5mbyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBwYWNrYWdlTmFtZTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcpOiBQcm9taXNlPFBhY2thZ2VDb25maWd1cmF0aW9uPiB7XG4gICAgICAgIC8vIFdlIHN0aWxsIHVzZSBOUE0gZm9yIHRoaXMgYXMgeWFybiBkb2Vzbid0IGhhdmUgdGhpcyBmYWNpbGl0eSB5ZXRcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJMb29raW5nIHVwIHBhY2thZ2UgaW5mby4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1widmlld1wiLCBgJHtwYWNrYWdlTmFtZX0ke3ZlcnNpb24gIT09IG51bGwgJiYgdmVyc2lvbiAhPT0gdW5kZWZpbmVkID8gYEAke3ZlcnNpb259YCA6IFwiXCJ9YCwgXCItLWpzb25cIiwgXCJuYW1lXCIsIFwidmVyc2lvblwiLCBcIm1haW5cIl07XG5cbiAgICAgICAgcmV0dXJuIFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlciwgZmlsZVN5c3RlbSwgXCJucG1cIiwgdW5kZWZpbmVkLCBhcmdzKVxuICAgICAgICAgICAgLnRoZW4odmlld0RhdGEgPT4gSlNPTi5wYXJzZSh2aWV3RGF0YSkpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gcGFja2FnZSBpbmZvcm1hdGlvbiBmb3VuZDogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgYWRkKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHdvcmtpbmdEaXJlY3Rvcnk6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nLCBpc0RldjogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiQWRkaW5nIHBhY2thZ2UuLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcImFkZFwiLCBgJHtwYWNrYWdlTmFtZX1AJHt2ZXJzaW9ufWBdO1xuICAgICAgICBpZiAoaXNEZXYpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tZGV2XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlciwgZmlsZVN5c3RlbSwgXCJ5YXJuXCIsIHdvcmtpbmdEaXJlY3RvcnksIGFyZ3MpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGFkZCBwYWNrYWdlOiAke2Vycn1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZW1vdmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgd29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBwYWNrYWdlTmFtZTogc3RyaW5nLCBpc0RldjogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiUmVtb3ZpbmcgcGFja2FnZS4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1wicmVtb3ZlXCIsIHBhY2thZ2VOYW1lXTtcbiAgICAgICAgaWYgKGlzRGV2KSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goXCItLWRldlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXIsIGZpbGVTeXN0ZW0sIFwieWFyblwiLCB3b3JraW5nRGlyZWN0b3J5LCBhcmdzKVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZW1vdmUgcGFja2FnZTogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
