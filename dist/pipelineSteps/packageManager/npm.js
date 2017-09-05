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
/**
 * Pipeline step for Npm.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const pipelineKey_1 = require("../../engine/pipelineKey");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
const packageUtils_1 = require("../packageUtils");
class Npm extends pipelineStepBase_1.PipelineStepBase {
    influences() {
        return [
            new pipelineKey_1.PipelineKey("unite", "uniteConfigurationJson"),
            new pipelineKey_1.PipelineKey("content", "gitIgnore")
        ];
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const gitIgnoreConfiguration = engineVariables.getConfiguration("GitIgnore");
            if (gitIgnoreConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(gitIgnoreConfiguration, "node_modules", _super("condition").call(this, uniteConfiguration.packageManager, "Npm"));
            }
            return 0;
        });
    }
    info(logger, fileSystem, packageName, version) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const args = ["install", `${packageName}@${version}`];
            if (isDev) {
                args.push("--save-dev");
            }
            else {
                args.push("--save-prod");
            }
            return packageUtils_1.PackageUtils.exec(logger, fileSystem, "npm", workingDirectory, args)
                .catch((err) => {
                throw new Error(`Unable to add package: ${err}`);
            });
        });
    }
    remove(logger, fileSystem, workingDirectory, packageName, isDev) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Removing package...");
            const args = ["uninstall", packageName];
            if (isDev) {
                args.push("--save-dev");
            }
            else {
                args.push("--save");
            }
            return packageUtils_1.PackageUtils.exec(logger, fileSystem, "npm", workingDirectory, args)
                .catch((err) => {
                throw new Error(`Unable to remove package: ${err}`);
            });
        });
    }
}
exports.Npm = Npm;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VNYW5hZ2VyL25wbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RUFBeUU7QUFNekUsMERBQXVEO0FBQ3ZELG9FQUFpRTtBQUVqRSxrREFBK0M7QUFFL0MsU0FBaUIsU0FBUSxtQ0FBZ0I7SUFDOUIsVUFBVTtRQUNiLE1BQU0sQ0FBQztZQUNILElBQUkseUJBQVcsQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUM7WUFDbEQsSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUM7U0FDMUMsQ0FBQztJQUNOLENBQUM7SUFFWSxPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxNQUFNLHNCQUFzQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBVyxXQUFXLENBQUMsQ0FBQztZQUN2RixFQUFFLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLHlCQUFXLENBQUMsU0FBUyxDQUFDLHNCQUFzQixFQUFFLGNBQWMsRUFBRSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUM3SCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLElBQUksQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxXQUFtQixFQUFFLE9BQWU7O1lBQzVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUUxQyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLFdBQVcsR0FBRyxPQUFPLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxTQUFTLEdBQUcsSUFBSSxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUU5SSxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQztpQkFDL0QsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUN0QyxLQUFLLENBQUMsQ0FBQyxHQUFHO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7SUFFWSxHQUFHLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsZ0JBQXdCLEVBQUUsV0FBbUIsRUFBRSxPQUFlLEVBQUUsS0FBYzs7WUFDckksTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBRWpDLE1BQU0sSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsV0FBVyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFdEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO2lCQUN0RSxLQUFLLENBQUMsQ0FBQyxHQUFHO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7SUFFWSxNQUFNLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsZ0JBQXdCLEVBQUUsV0FBbUIsRUFBRSxLQUFjOztZQUN2SCxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFFbkMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFeEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFFRCxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO2lCQUN0RSxLQUFLLENBQUMsQ0FBQyxHQUFHO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7Q0FDSjtBQTdERCxrQkE2REMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9wYWNrYWdlTWFuYWdlci9ucG0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgZm9yIE5wbS5cbiAqL1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2FycmF5SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9waXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBJUGFja2FnZU1hbmFnZXIgfSBmcm9tIFwiLi4vLi4vaW50ZXJmYWNlcy9JUGFja2FnZU1hbmFnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VVdGlscyB9IGZyb20gXCIuLi9wYWNrYWdlVXRpbHNcIjtcblxuZXhwb3J0IGNsYXNzIE5wbSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2UgaW1wbGVtZW50cyBJUGFja2FnZU1hbmFnZXIge1xuICAgIHB1YmxpYyBpbmZsdWVuY2VzKCk6IFBpcGVsaW5lS2V5W10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwidW5pdGVcIiwgXCJ1bml0ZUNvbmZpZ3VyYXRpb25Kc29uXCIpLFxuICAgICAgICAgICAgbmV3IFBpcGVsaW5lS2V5KFwiY29udGVudFwiLCBcImdpdElnbm9yZVwiKVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGdpdElnbm9yZUNvbmZpZ3VyYXRpb24gPSBlbmdpbmVWYXJpYWJsZXMuZ2V0Q29uZmlndXJhdGlvbjxzdHJpbmdbXT4oXCJHaXRJZ25vcmVcIik7XG4gICAgICAgIGlmIChnaXRJZ25vcmVDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUoZ2l0SWdub3JlQ29uZmlndXJhdGlvbiwgXCJub2RlX21vZHVsZXNcIiwgc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciwgXCJOcG1cIikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbmZvKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHBhY2thZ2VOYW1lOiBzdHJpbmcsIHZlcnNpb246IHN0cmluZyk6IFByb21pc2U8UGFja2FnZUNvbmZpZ3VyYXRpb24+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJMb29raW5nIHVwIHBhY2thZ2UgaW5mby4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1widmlld1wiLCBgJHtwYWNrYWdlTmFtZX0ke3ZlcnNpb24gIT09IG51bGwgJiYgdmVyc2lvbiAhPT0gdW5kZWZpbmVkID8gYEAke3ZlcnNpb259YCA6IFwiXCJ9YCwgXCItLWpzb25cIiwgXCJuYW1lXCIsIFwidmVyc2lvblwiLCBcIm1haW5cIl07XG5cbiAgICAgICAgcmV0dXJuIFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlciwgZmlsZVN5c3RlbSwgXCJucG1cIiwgdW5kZWZpbmVkLCBhcmdzKVxuICAgICAgICAgICAgLnRoZW4odmlld0RhdGEgPT4gSlNPTi5wYXJzZSh2aWV3RGF0YSkpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gcGFja2FnZSBpbmZvcm1hdGlvbiBmb3VuZDogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgYWRkKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHdvcmtpbmdEaXJlY3Rvcnk6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nLCBpc0RldjogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiQWRkaW5nIHBhY2thZ2UuLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcImluc3RhbGxcIiwgYCR7cGFja2FnZU5hbWV9QCR7dmVyc2lvbn1gXTtcblxuICAgICAgICBpZiAoaXNEZXYpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZS1kZXZcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goXCItLXNhdmUtcHJvZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXIsIGZpbGVTeXN0ZW0sIFwibnBtXCIsIHdvcmtpbmdEaXJlY3RvcnksIGFyZ3MpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGFkZCBwYWNrYWdlOiAke2Vycn1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyByZW1vdmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgd29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBwYWNrYWdlTmFtZTogc3RyaW5nLCBpc0RldjogYm9vbGVhbik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiUmVtb3ZpbmcgcGFja2FnZS4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1widW5pbnN0YWxsXCIsIHBhY2thZ2VOYW1lXTtcblxuICAgICAgICBpZiAoaXNEZXYpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZS1kZXZcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goXCItLXNhdmVcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyLCBmaWxlU3lzdGVtLCBcIm5wbVwiLCB3b3JraW5nRGlyZWN0b3J5LCBhcmdzKVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZW1vdmUgcGFja2FnZTogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
