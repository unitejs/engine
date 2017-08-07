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
const babelConfiguration_1 = require("../../configuration/models/babel/babelConfiguration");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class Babel extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            engineVariables.toggleDevDependency(["babel-core", "babel-preset-es2015"], uniteConfiguration.sourceLanguage === "JavaScript");
            if (uniteConfiguration.sourceLanguage === "JavaScript") {
                try {
                    logger.info(`Generating ${Babel.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                    let existing;
                    try {
                        const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, Babel.FILENAME);
                        if (exists) {
                            existing = yield fileSystem.fileReadJson(engineVariables.wwwRootFolder, Babel.FILENAME);
                        }
                    }
                    catch (err) {
                        logger.error(`Reading existing ${Babel.FILENAME} failed`, err);
                        return 1;
                    }
                    const config = this.generateConfig(fileSystem, uniteConfiguration, engineVariables, existing);
                    yield fileSystem.fileWriteJson(engineVariables.wwwRootFolder, Babel.FILENAME, config);
                    return 0;
                }
                catch (err) {
                    logger.error(`Generating ${Babel.FILENAME} failed`, err, { wwwFolder: engineVariables.wwwRootFolder });
                    return 1;
                }
            }
            else {
                return yield _super("deleteFile").call(this, logger, fileSystem, engineVariables.wwwRootFolder, Babel.FILENAME);
            }
        });
    }
    generateConfig(fileSystem, uniteConfiguration, engineVariables, existing) {
        const config = new babelConfiguration_1.BabelConfiguration();
        config.presets = [];
        if (existing) {
            Object.assign(config, existing);
        }
        let modules = "";
        if (uniteConfiguration.moduleType === "AMD") {
            modules = "amd";
        }
        else if (uniteConfiguration.moduleType === "SystemJS") {
            modules = "systemjs";
        }
        else {
            modules = "commonjs";
        }
        let foundDefault = false;
        config.presets.forEach(preset => {
            if (Array.isArray(preset) && preset.length > 0) {
                if (preset[0] === "es2015") {
                    foundDefault = true;
                }
            }
        });
        if (!foundDefault) {
            config.presets.push(["es2015", { modules }]);
        }
        for (const key in engineVariables.transpilePresets) {
            const idx = config.presets.indexOf(key);
            if (engineVariables.transpilePresets[key]) {
                if (idx < 0) {
                    config.presets.push(key);
                }
            }
            else {
                if (idx >= 0) {
                    config.presets.splice(idx, 1);
                }
            }
        }
        return config;
    }
}
Babel.FILENAME = ".babelrc";
exports.Babel = Babel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2xhbmd1YWdlL2JhYmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFLQSw0RkFBeUY7QUFFekYsZ0ZBQTZFO0FBRzdFLFdBQW1CLFNBQVEsK0NBQXNCO0lBR2hDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ25JLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFlBQVksRUFBRSxxQkFBcUIsQ0FBQyxFQUFFLGtCQUFrQixDQUFDLGNBQWMsS0FBSyxZQUFZLENBQUMsQ0FBQztZQUUvSCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBRTFGLElBQUksUUFBUSxDQUFDO29CQUNiLElBQUksQ0FBQzt3QkFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzFGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ1QsUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBcUIsZUFBZSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ2hILENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEtBQUssQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDL0QsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDYixDQUFDO29CQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDOUYsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFFdEYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEtBQUssQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBQ3ZHLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxvQkFBZ0IsWUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JHLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxjQUFjLENBQUMsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLFFBQXdDO1FBQzlKLE1BQU0sTUFBTSxHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUN4QyxNQUFNLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVwQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMxQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdEQsT0FBTyxHQUFHLFVBQVUsQ0FBQztRQUN6QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLEdBQUcsVUFBVSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDekIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTTtZQUN6QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakQsQ0FBQztRQUVELEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzdCLENBQUM7WUFDTCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7O0FBN0VjLGNBQVEsR0FBVyxVQUFVLENBQUM7QUFEakQsc0JBK0VDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvbGFuZ3VhZ2UvYmFiZWwuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
