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
const tsLintConfiguration_1 = require("../../configuration/models/tslint/tsLintConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class TsLint extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["tslint"], uniteConfiguration.linter === "TSLint");
            if (uniteConfiguration.linter === "TSLint") {
                try {
                    if (uniteConfiguration.sourceLanguage !== "TypeScript") {
                        throw new Error("You can only use TSLint when the source language is TypeScript");
                    }
                    _super("log").call(this, logger, display, `Generating ${TsLint.FILENAME}`);
                    let existing;
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.rootFolder, TsLint.FILENAME);
                        if (exists) {
                            existing = yield fileSystem.fileReadJson(engineVariables.rootFolder, TsLint.FILENAME);
                        }
                    }
                    catch (err) {
                        _super("error").call(this, logger, display, `Reading existing ${TsLint.FILENAME} failed`, err);
                        return 1;
                    }
                    const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                    yield fileSystem.fileWriteJson(engineVariables.rootFolder, TsLint.FILENAME, config);
                    return 0;
                }
                catch (err) {
                    _super("error").call(this, logger, display, `Generating ${TsLint.FILENAME} failed`, err);
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, display, fileSystem, engineVariables.rootFolder, TsLint.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, existing) {
        const config = new tsLintConfiguration_1.TsLintConfiguration();
        config.extends = "tslint:recommended";
        config.rulesDirectory = [];
        config.rules = {};
        if (existing) {
            config.extends = existing.extends || config.extends;
            config.rulesDirectory = existing.rulesDirectory || config.rulesDirectory;
            config.rules = existing.rules || config.rules;
        }
        if (!config.rules["object-literal-sort-keys"]) {
            config.rules["object-literal-sort-keys"] = false;
        }
        if (!config.rules["trailing-comma"]) {
            config.rules["trailing-comma"] = [
                true,
                {
                    multiline: {
                        objects: "never"
                    }
                }
            ];
        }
        if (!config.rules["no-reference"]) {
            config.rules["no-reference"] = false;
        }
        return config;
    }
}
TsLint.FILENAME = "tslint.json";
exports.TsLint = TsLint;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xpbnQvdHNMaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSwrRkFBNEY7QUFFNUYsZ0ZBQTZFO0FBRzdFLFlBQW9CLFNBQVEsK0NBQXNCO0lBR2pDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDdEosZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBRXhGLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUM7b0JBQ0QsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7d0JBQ3JELE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztvQkFDdEYsQ0FBQztvQkFDRCxhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFFNUQsSUFBSSxRQUFRLENBQUM7b0JBQ2IsSUFBSSxDQUFDO3dCQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDeEYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDVCxRQUFRLEdBQUcsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUFzQixlQUFlLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDL0csQ0FBQztvQkFDTCxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ1gsZUFBVyxZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsb0JBQW9CLE1BQU0sQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUU7d0JBQ2hGLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2IsQ0FBQztvQkFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQzlGLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBRXBGLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNYLGVBQVcsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsTUFBTSxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsRUFBRTtvQkFDMUUsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxNQUFNLG9CQUFnQixZQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVHLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLFFBQXlDO1FBQy9KLE1BQU0sTUFBTSxHQUFHLElBQUkseUNBQW1CLEVBQUUsQ0FBQztRQUV6QyxNQUFNLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWxCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNwRCxNQUFNLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQztZQUN6RSxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNsRCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDckQsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUc7Z0JBQzdCLElBQUk7Z0JBQ0o7b0JBQ0ksU0FBUyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxPQUFPO3FCQUNuQjtpQkFDSjthQUNKLENBQUM7UUFDTixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN6QyxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDOztBQXJFYyxlQUFRLEdBQVcsYUFBYSxDQUFDO0FBRHBELHdCQXVFQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2xpbnQvdHNMaW50LmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
