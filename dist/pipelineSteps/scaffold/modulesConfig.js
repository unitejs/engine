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
const jsonHelper_1 = require("../../core/jsonHelper");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class ModulesConfig extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _super("log").call(this, logger, display, "Creating Dist Directory", { distFolder: engineVariables.distFolder });
                yield fileSystem.directoryCreate(engineVariables.distFolder);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Creating Dist failed", err, { distFolder: engineVariables.distFolder });
                return 1;
            }
            try {
                _super("log").call(this, logger, display, "Generating app-modules-config.json in", { distFolder: engineVariables.distFolder });
                const lines = [];
                this.buildAppModuleConfig(uniteConfiguration, engineVariables, lines);
                yield fileSystem.fileWriteLines(engineVariables.distFolder, "app-module-config.js", lines);
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating app-modules-config.js failed", err, { distFolder: engineVariables.distFolder });
                return 1;
            }
            try {
                if (uniteConfiguration.unitTestRunner === "Karma") {
                    _super("log").call(this, logger, display, "Generating unit-modules-config.json in", { distFolder: engineVariables.unitTestFolder });
                    const lines = [];
                    this.buildUnitModuleConfig(uniteConfiguration, engineVariables, lines);
                    yield fileSystem.fileWriteLines(engineVariables.unitTestFolder, "unit-module-config.js", lines);
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, "Generating unit-modules-config.js failed", err, { distFolder: engineVariables.unitTestFolder });
                return 1;
            }
        });
    }
    buildAppModuleConfig(uniteConfiguration, engineVariables, lines) {
        const moduleConfig = { paths: {}, packages: {}, preload: [] };
        const keys = Object.keys(uniteConfiguration.clientPackages);
        for (let i = 0; i < keys.length; i++) {
            const pkg = uniteConfiguration.clientPackages[keys[i]];
            if (pkg.includeMode === "app" || pkg.includeMode === "both") {
                moduleConfig.paths[keys[i]] = engineVariables.packageFolder + keys[i] + "/" + pkg.main.replace(/(\.js)$/, "").replace(/\.\//, "");
                if (pkg.preload) {
                    moduleConfig.preload.push(keys[i]);
                }
            }
        }
        lines.push("appModuleConfig = " + jsonHelper_1.JsonHelper.codify(moduleConfig) + ";");
    }
    buildUnitModuleConfig(uniteConfiguration, engineVariables, lines) {
        const moduleConfig = { paths: {}, packages: {}, preload: [] };
        const keys = Object.keys(uniteConfiguration.clientPackages);
        for (let i = 0; i < keys.length; i++) {
            const pkg = uniteConfiguration.clientPackages[keys[i]];
            if (pkg.includeMode === "test" || pkg.includeMode === "both") {
                moduleConfig.paths[keys[i]] = engineVariables.packageFolder + keys[i] + "/" + pkg.main.replace(/(\.js)$/, "").replace(/\.\//, "");
                if (pkg.preload) {
                    moduleConfig.preload.push(keys[i]);
                }
            }
        }
        lines.push("unitModuleConfig = " + jsonHelper_1.JsonHelper.codify(moduleConfig) + ";");
    }
}
exports.ModulesConfig = ModulesConfig;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL21vZHVsZXNDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLHNEQUFtRDtBQUNuRCxnRkFBNkU7QUFNN0UsbUJBQTJCLFNBQVEsK0NBQXNCO0lBQ3hDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDbEcsTUFBTSxVQUFVLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNqRSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUN0RyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUVELElBQUksQ0FBQztnQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBRWhILE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztnQkFFM0IsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFdEUsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFL0YsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENB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QUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNuQyxNQUFNLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsS0FBSyxNQUFNLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDbEksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2QsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsdUJBQVUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDOUUsQ0FBQztDQUNKO0FBM0VELHNDQTJFQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3NjYWZmb2xkL21vZHVsZXNDb25maWcuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
