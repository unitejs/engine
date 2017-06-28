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
                if (uniteConfiguration.moduleLoader === "RequireJS" || uniteConfiguration.moduleLoader === "SystemJS") {
                    this.buildAppModuleConfig(uniteConfiguration, engineVariables, lines);
                }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvc2NhZmZvbGQvbW9kdWxlc0NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUEsc0RBQW1EO0FBQ25ELGdGQUE2RTtBQU03RSxtQkFBMkIsU0FBUSwrQ0FBc0I7SUFDeEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0M7OztZQUN0SixJQUFJLENBQUM7Z0JBQ0QsYUFBUyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUNsRyxNQUFNLFVBQVUsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pFLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ3RHLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBRUQsSUFBSSxDQUFDO2dCQUNELGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFFaEgsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO2dCQUUzQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEtBQUssV0FBVyxJQUFJLGtCQUFrQixDQUFDLFlBQVksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNwRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMxRSxDQUFDO2dCQUVELE1BQU0sVUFBVSxDQUFDLGNBQWMs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
