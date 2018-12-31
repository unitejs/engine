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
 * Pipeline step for Yarn.
 */
const arrayHelper_1 = require("unitejs-framework/dist/helpers/arrayHelper");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
const packageUtils_1 = require("../packageUtils");
class Yarn extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return super.condition(uniteConfiguration.packageManager, "Yarn");
    }
    configure(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            const gitIgnoreConfiguration = engineVariables.getConfiguration("GitIgnore");
            if (gitIgnoreConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(gitIgnoreConfiguration, "node_modules", mainCondition);
            }
            const typeScriptConfiguration = engineVariables.getConfiguration("TypeScript");
            if (typeScriptConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(typeScriptConfiguration.exclude, "node_modules", mainCondition);
            }
            const javaScriptConfiguration = engineVariables.getConfiguration("JavaScript");
            if (javaScriptConfiguration) {
                arrayHelper_1.ArrayHelper.addRemove(javaScriptConfiguration.exclude, "node_modules", mainCondition);
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
    getInstallCommand(packageName, isGlobal) {
        const parts = [];
        parts.push("yarn");
        if (isGlobal) {
            parts.push("global");
        }
        if (packageName && packageName.length > 0) {
            parts.push("add");
            parts.push(packageName);
        }
        else {
            parts.push("install");
        }
        return parts.join(" ");
    }
}
exports.Yarn = Yarn;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3BhY2thZ2VNYW5hZ2VyL3lhcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNEVBQXlFO0FBUXpFLG9FQUFpRTtBQUVqRSxrREFBK0M7QUFFL0MsTUFBYSxJQUFLLFNBQVEsbUNBQWdCO0lBQy9CLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFWSxTQUFTLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7WUFDN0osTUFBTSxzQkFBc0IsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQVcsV0FBVyxDQUFDLENBQUM7WUFDdkYsSUFBSSxzQkFBc0IsRUFBRTtnQkFDeEIseUJBQVcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2FBQ2hGO1lBRUQsTUFBTSx1QkFBdUIsR0FBRyxlQUFlLENBQUMsZ0JBQWdCLENBQTBCLFlBQVksQ0FBQyxDQUFDO1lBQ3hHLElBQUksdUJBQXVCLEVBQUU7Z0JBQ3pCLHlCQUFXLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7YUFDekY7WUFFRCxNQUFNLHVCQUF1QixHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBMEIsWUFBWSxDQUFDLENBQUM7WUFDeEcsSUFBSSx1QkFBdUIsRUFBRTtnQkFDekIseUJBQVcsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQzthQUN6RjtZQUVELE9BQU8sQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksSUFBSSxDQUFDLE1BQWUs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QUMsU0FBUyxDQUFDLENBQUM7U0FDekI7UUFFRCxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBakZELG9CQWlGQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3BhY2thZ2VNYW5hZ2VyL3lhcm4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFBpcGVsaW5lIHN0ZXAgZm9yIFlhcm4uXG4gKi9cbmltcG9ydCB7IEFycmF5SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9hcnJheUhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9wYWNrYWdlcy9wYWNrYWdlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVHlwZVNjcmlwdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdHlwZVNjcmlwdC90eXBlU2NyaXB0Q29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSmF2YVNjcmlwdENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdnNjb2RlL2phdmFTY3JpcHRDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgSVBhY2thZ2VNYW5hZ2VyIH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvSVBhY2thZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgeyBQYWNrYWdlVXRpbHMgfSBmcm9tIFwiLi4vcGFja2FnZVV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBZYXJuIGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSBpbXBsZW1lbnRzIElQYWNrYWdlTWFuYWdlciB7XG4gICAgcHVibGljIG1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKSA6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciwgXCJZYXJuXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjb25maWd1cmUobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBtYWluQ29uZGl0aW9uOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgZ2l0SWdub3JlQ29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPHN0cmluZ1tdPihcIkdpdElnbm9yZVwiKTtcbiAgICAgICAgaWYgKGdpdElnbm9yZUNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgIEFycmF5SGVscGVyLmFkZFJlbW92ZShnaXRJZ25vcmVDb25maWd1cmF0aW9uLCBcIm5vZGVfbW9kdWxlc1wiLCBtYWluQ29uZGl0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGVTY3JpcHRDb25maWd1cmF0aW9uID0gZW5naW5lVmFyaWFibGVzLmdldENvbmZpZ3VyYXRpb248VHlwZVNjcmlwdENvbmZpZ3VyYXRpb24+KFwiVHlwZVNjcmlwdFwiKTtcbiAgICAgICAgaWYgKHR5cGVTY3JpcHRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgICAgICBBcnJheUhlbHBlci5hZGRSZW1vdmUodHlwZVNjcmlwdENvbmZpZ3VyYXRpb24uZXhjbHVkZSwgXCJub2RlX21vZHVsZXNcIiwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBqYXZhU2NyaXB0Q29uZmlndXJhdGlvbiA9IGVuZ2luZVZhcmlhYmxlcy5nZXRDb25maWd1cmF0aW9uPEphdmFTY3JpcHRDb25maWd1cmF0aW9uPihcIkphdmFTY3JpcHRcIik7XG4gICAgICAgIGlmIChqYXZhU2NyaXB0Q29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgQXJyYXlIZWxwZXIuYWRkUmVtb3ZlKGphdmFTY3JpcHRDb25maWd1cmF0aW9uLmV4Y2x1ZGUsIFwibm9kZV9tb2R1bGVzXCIsIG1haW5Db25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluZm8obG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgcGFja2FnZU5hbWU6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nKTogUHJvbWlzZTxQYWNrYWdlQ29uZmlndXJhdGlvbj4ge1xuICAgICAgICAvLyBXZSBzdGlsbCB1c2UgTlBNIGZvciB0aGlzIGFzIHlhcm4gZG9lc24ndCBoYXZlIHRoaXMgZmFjaWxpdHkgeWV0XG4gICAgICAgIGxvZ2dlci5pbmZvKFwiTG9va2luZyB1cCBwYWNrYWdlIGluZm8uLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcInZpZXdcIiwgYCR7cGFja2FnZU5hbWV9JHt2ZXJzaW9uICE9PSBudWxsICYmIHZlcnNpb24gIT09IHVuZGVmaW5lZCA/IGBAJHt2ZXJzaW9ufWAgOiBcIlwifWAsIFwiLS1qc29uXCIsIFwibmFtZVwiLCBcInZlcnNpb25cIiwgXCJtYWluXCJdO1xuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXIsIGZpbGVTeXN0ZW0sIFwibnBtXCIsIHVuZGVmaW5lZCwgYXJncylcbiAgICAgICAgICAgIC50aGVuKHZpZXdEYXRhID0+IEpTT04ucGFyc2Uodmlld0RhdGEpKVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHBhY2thZ2UgaW5mb3JtYXRpb24gZm91bmQ6ICR7ZXJyfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGFkZChsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB3b3JraW5nRGlyZWN0b3J5OiBzdHJpbmcsIHBhY2thZ2VOYW1lOiBzdHJpbmcsIHZlcnNpb246IHN0cmluZywgaXNEZXY6IGJvb2xlYW4pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcIkFkZGluZyBwYWNrYWdlLi4uXCIpO1xuXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbXCJhZGRcIiwgYCR7cGFja2FnZU5hbWV9QCR7dmVyc2lvbn1gXTtcbiAgICAgICAgaWYgKGlzRGV2KSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goXCItLWRldlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQYWNrYWdlVXRpbHMuZXhlYyhsb2dnZXIsIGZpbGVTeXN0ZW0sIFwieWFyblwiLCB3b3JraW5nRGlyZWN0b3J5LCBhcmdzKVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBhZGQgcGFja2FnZTogJHtlcnJ9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcmVtb3ZlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHdvcmtpbmdEaXJlY3Rvcnk6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZywgaXNEZXY6IGJvb2xlYW4pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBsb2dnZXIuaW5mbyhcIlJlbW92aW5nIHBhY2thZ2UuLi5cIik7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IFtcInJlbW92ZVwiLCBwYWNrYWdlTmFtZV07XG4gICAgICAgIGlmIChpc0Rldikge1xuICAgICAgICAgICAgYXJncy5wdXNoKFwiLS1kZXZcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUGFja2FnZVV0aWxzLmV4ZWMobG9nZ2VyLCBmaWxlU3lzdGVtLCBcInlhcm5cIiwgd29ya2luZ0RpcmVjdG9yeSwgYXJncylcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmVtb3ZlIHBhY2thZ2U6ICR7ZXJyfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEluc3RhbGxDb21tYW5kKHBhY2thZ2VOYW1lOiBzdHJpbmcsIGlzR2xvYmFsOiBib29sZWFuKSA6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gW107XG5cbiAgICAgICAgcGFydHMucHVzaChcInlhcm5cIik7XG4gICAgICAgIGlmIChpc0dsb2JhbCkge1xuICAgICAgICAgICAgcGFydHMucHVzaChcImdsb2JhbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFja2FnZU5hbWUgJiYgcGFja2FnZU5hbWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcGFydHMucHVzaChcImFkZFwiKTtcbiAgICAgICAgICAgIHBhcnRzLnB1c2gocGFja2FnZU5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFydHMucHVzaChcImluc3RhbGxcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIiBcIik7XG4gICAgfVxufVxuIl19
