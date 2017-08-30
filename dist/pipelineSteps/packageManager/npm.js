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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
const packageUtils_1 = require("../packageUtils");
class Npm extends enginePipelineStepBase_1.EnginePipelineStepBase {
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
    info(logger, fileSystem, packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info("Looking up package info...");
            const args = ["view", packageName, "--json", "name", "version", "main"];
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VNYW5hZ2VyL25wbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RUFBeUU7QUFLekUsZ0ZBQTZFO0FBRzdFLGtEQUErQztBQUUvQyxTQUFpQixTQUFRLCtDQUFzQjtJQUM5QixPQUFPLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUNuSSxNQUFNLHNCQUFzQixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBVyxXQUFXLENBQUMsQ0FBQztZQUN2RixFQUFFLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLHlCQUFXLENBQUMsU0FBUyxDQUFDLHNCQUFzQixFQUFFLGNBQWMsRUFBRSxtQkFBZSxZQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUM3SCxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7S0FBQTtJQUVZLElBQUksQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxXQUFtQjs7WUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBRTFDLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUV4RSxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQztpQkFDL0QsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUN0QyxLQUFLLENBQUMsQ0FBQyxHQUFHO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7SUFFWSxHQUFHLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsZ0JBQXdCLEVBQUUsV0FBbUIsRUFBRSxPQUFlLEVBQUUsS0FBYzs7WUFDckksTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBRWpDLE1BQU0sSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsV0FBVyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFdEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdCLENBQUM7WUFFRCxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO2lCQUN0RSxLQUFLLENBQUMsQ0FBQyxHQUFHO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7SUFFWSxNQUFNLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsZ0JBQXdCLEVBQUUsV0FBbUIsRUFBRSxLQUFjOztZQUN2SCxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFFbkMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFFeEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzVCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFFRCxNQUFNLENBQUMsMkJBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDO2lCQUN0RSxLQUFLLENBQUMsQ0FBQyxHQUFHO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQUE7Q0FDSjtBQXRERCxrQkFzREMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9wYWNrYWdlTWFuYWdlci9ucG0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgZm9yIE5wbS5cbiAqL1xuaW1wb3J0IHsgQXJyYXlIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL2FycmF5SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFBhY2thZ2VDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3BhY2thZ2VzL3BhY2thZ2VDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlVXRpbHMgfSBmcm9tIFwiLi4vcGFja2FnZVV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBOcG0gZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIGltcGxlbWVudHMgSVBhY2thZ2VNYW5hZ2VyIHtcbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBnaXRJZ25vcmVDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248c3RyaW5nW10+KFwiR2l0SWdub3JlXCIpO1xuICAgICAgICBpZiAoZ2l0SWdub3JlQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGdpdElnbm9yZUNvbmZpZ3VyYXRpb24sIFwibm9kZV9tb2R1bGVzXCIsIHN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ucGFja2FnZU1hbmFnZXIsIFwiTnBtXCIpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5mbyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBwYWNrYWdlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxQYWNrYWdlQ29uZmlndXJhdGlvbj4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcIkxvb2tpbmcgdXAgcGFja2FnZSBpbmZvLi4uXCIpO1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXCJ2aWV3XCIsIHBhY2thZ2VOYW1lLCBcIi0tanNvblwiLCBcIm5hbWVcIiwgXCJ2ZXJzaW9uXCIsIFwibWFpblwiXTtcblxuICAgICAgICByZXR1cm4gUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyLCBmaWxlU3lzdGVtLCBcIm5wbVwiLCB1bmRlZmluZWQsIGFyZ3MpXG4gICAgICAgICAgICAudGhlbih2aWV3RGF0YSA9PiBKU09OLnBhcnNlKHZpZXdEYXRhKSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBwYWNrYWdlIGluZm9ybWF0aW9uIGZvdW5kOiAke2Vycn1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBhZGQobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgd29ya2luZ0RpcmVjdG9yeTogc3RyaW5nLCBwYWNrYWdlTmFtZTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmcsIGlzRGV2OiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJBZGRpbmcgcGFja2FnZS4uLlwiKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW1wiaW5zdGFsbFwiLCBgJHtwYWNrYWdlTmFtZX1AJHt2ZXJzaW9ufWBdO1xuXG4gICAgICAgIGlmIChpc0Rldikge1xuICAgICAgICAgICAgYXJncy5wdXNoKFwiLS1zYXZlLWRldlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZS1wcm9kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFBhY2thZ2VVdGlscy5leGVjKGxvZ2dlciwgZmlsZVN5c3RlbSwgXCJucG1cIiwgd29ya2luZ0RpcmVjdG9yeSwgYXJncylcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gYWRkIHBhY2thZ2U6ICR7ZXJyfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJlbW92ZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB3b3JraW5nRGlyZWN0b3J5OiBzdHJpbmcsIHBhY2thZ2VOYW1lOiBzdHJpbmcsIGlzRGV2OiBib29sZWFuKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgbG9nZ2VyLmluZm8oXCJSZW1vdmluZyBwYWNrYWdlLi4uXCIpO1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXCJ1bmluc3RhbGxcIiwgcGFja2FnZU5hbWVdO1xuXG4gICAgICAgIGlmIChpc0Rldikge1xuICAgICAgICAgICAgYXJncy5wdXNoKFwiLS1zYXZlLWRldlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChcIi0tc2F2ZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXIsIGZpbGVTeXN0ZW0sIFwibnBtXCIsIHdvcmtpbmdEaXJlY3RvcnksIGFyZ3MpXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHJlbW92ZSBwYWNrYWdlOiAke2Vycn1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
