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
 * Class for pipeline
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const pipelineKey_1 = require("./pipelineKey");
class Pipeline {
    constructor(logger, fileSystem, pipelineStepFolder) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._pipelineStepFolder = pipelineStepFolder;
        this._steps = [];
        this._moduleIdMap = {};
        this._loadedStepCache = {};
    }
    add(category, key) {
        this._steps.push(new pipelineKey_1.PipelineKey(category, key));
    }
    run(uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [];
            for (const pipelineStep of this._steps) {
                const exists = yield this.tryLoad(uniteConfiguration, pipelineStep, undefined, false);
                if (exists) {
                    pipeline.push(this.getStep(pipelineStep));
                }
                else {
                    return 1;
                }
            }
            const pipelineAdd = [];
            const pipelineRemove = [];
            for (const pipelineStep of pipeline) {
                const condition = pipelineStep.mainCondition(uniteConfiguration, engineVariables);
                if (condition || condition === undefined) {
                    pipelineAdd.push(pipelineStep);
                }
                else {
                    pipelineRemove.push(pipelineStep);
                }
                try {
                    this._logger.info("Initialising", { step: objectHelper_1.ObjectHelper.getClassName(pipelineStep) });
                    const ret = yield pipelineStep.initialise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, condition || condition === undefined);
                    if (ret !== 0) {
                        return ret;
                    }
                }
                catch (err) {
                    this._logger.error(`Exception initialising pipeline step '${objectHelper_1.ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
            for (const pipelineStep of pipelineRemove) {
                try {
                    const ret = yield pipelineStep.configure(this._logger, this._fileSystem, uniteConfiguration, engineVariables, false);
                    if (ret !== 0) {
                        return ret;
                    }
                }
                catch (err) {
                    this._logger.error(`Exception uninstalling pipeline step '${objectHelper_1.ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
            for (const pipelineStep of pipelineAdd) {
                try {
                    this._logger.info("Installing", { step: objectHelper_1.ObjectHelper.getClassName(pipelineStep) });
                    const ret = yield pipelineStep.configure(this._logger, this._fileSystem, uniteConfiguration, engineVariables, true);
                    if (ret !== 0) {
                        return ret;
                    }
                }
                catch (err) {
                    this._logger.error(`Exception installing pipeline step '${objectHelper_1.ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
            for (const pipelineStep of pipelineRemove) {
                try {
                    this._logger.info("Finalising", { step: objectHelper_1.ObjectHelper.getClassName(pipelineStep) });
                    const ret = yield pipelineStep.finalise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, false);
                    if (ret !== 0) {
                        return ret;
                    }
                }
                catch (err) {
                    this._logger.error(`Exception finalising pipeline step '${objectHelper_1.ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
            for (const pipelineStep of pipelineAdd) {
                try {
                    this._logger.info("Finalising", { step: objectHelper_1.ObjectHelper.getClassName(pipelineStep) });
                    const ret = yield pipelineStep.finalise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, true);
                    if (ret !== 0) {
                        return ret;
                    }
                }
                catch (err) {
                    this._logger.error(`Exception finalising pipeline step '${objectHelper_1.ObjectHelper.getClassName(pipelineStep)}'`, err);
                    return 1;
                }
            }
            return 0;
        });
    }
    getStep(pipelineKey) {
        if (pipelineKey !== undefined && pipelineKey !== null &&
            pipelineKey.category !== undefined && pipelineKey.category !== null && pipelineKey.category.length > 0 &&
            pipelineKey.key !== undefined && pipelineKey.key !== null && pipelineKey.key.length > 0) {
            const combinedKey = pipelineKey.combined();
            if (this._loadedStepCache[combinedKey] === undefined) {
                const mappedName = this._moduleIdMap[combinedKey];
                if (mappedName !== undefined && this._loadedStepCache[mappedName] !== undefined) {
                    return this._loadedStepCache[mappedName];
                }
            }
            else {
                return this._loadedStepCache[combinedKey];
            }
        }
        return undefined;
    }
    tryLoad(uniteConfiguration, pipelineKey, configurationType, defineProperty = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (pipelineKey !== undefined && pipelineKey !== null &&
                pipelineKey.category !== undefined && pipelineKey.category !== null && pipelineKey.category.length > 0) {
                const moduleTypeId = pipelineKey.combined();
                let className = this._moduleIdMap[moduleTypeId];
                if (className === undefined) {
                    const moduleTypeFolder = this._fileSystem.pathCombine(this._pipelineStepFolder, pipelineKey.category);
                    const actualType = configurationType ? configurationType : pipelineKey.category;
                    try {
                        let files = yield this._fileSystem.directoryGetFiles(moduleTypeFolder);
                        files = files.filter(file => file.endsWith(".js")).map(file => file.replace(".js", ""));
                        if (pipelineKey.key === undefined || pipelineKey.key === null || pipelineKey.key.length === 0) {
                            this._logger.error(`--${actualType} should not be blank, possible options could be [${files.join(", ")}]`);
                            return false;
                        }
                        else {
                            const moduleIdLower = pipelineKey.key.toLowerCase();
                            for (let i = 0; i < files.length; i++) {
                                if (files[i].toLowerCase() === moduleIdLower) {
                                    // We disable the linting as we are trying to dynamically load modules
                                    // tslint:disable:no-require-imports
                                    // tslint:disable:non-literal-require
                                    const loadFile = this._fileSystem.pathCombine(moduleTypeFolder, files[i]);
                                    const module = require(loadFile);
                                    // tslint:enable:no-require-imports
                                    // tslint:enable:non-literal-require
                                    className = Object.keys(module)[0];
                                    const instance = Object.create(module[className].prototype);
                                    if (defineProperty) {
                                        this._logger.info(actualType, { className });
                                        Object.defineProperty(uniteConfiguration, actualType, { value: className });
                                    }
                                    const moduleClassName = new pipelineKey_1.PipelineKey(pipelineKey.category, className).combined();
                                    this._loadedStepCache[moduleClassName] = new instance.constructor();
                                    this._moduleIdMap[moduleTypeId] = moduleClassName;
                                    return true;
                                }
                            }
                            this._logger.error(`Pipeline Step '${pipelineKey.key}' for arg --${actualType} could not be located, possible options could be [${files.join(", ")}]`);
                            return false;
                        }
                    }
                    catch (err) {
                        this._logger.error(`Pipeline Step '${pipelineKey.key}' for arg --${actualType} failed to load`, err);
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
            else {
                this._logger.error(`Pipeline Step has an invalid key`, undefined, pipelineKey);
                return false;
            }
        });
    }
}
exports.Pipeline = Pipeline;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTTNFLCtDQUE0QztBQUU1QztJQVNJLFlBQVksTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQTBCO1FBQzVFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQztRQUM5QyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxHQUFXO1FBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRVksR0FBRyxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDOztZQUNyRixNQUFNLFFBQVEsR0FBb0IsRUFBRSxDQUFDO1lBRXJDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFdEYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDVCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixN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QyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUN2SixNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUNqQixDQUFDO29CQUNMLENBQUM7b0JBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsV0FBVyxDQUFDLEdBQUcsZUFBZSxVQUFVLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNyRyxNQUFNLENBQUMsS0FBSyxDQUFDO29CQUNqQixDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQy9FLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztRQUNMLENBQUM7S0FBQTtDQUNKO0FBOUxELDRCQThMQyIsImZpbGUiOiJlbmdpbmUvcGlwZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENsYXNzIGZvciBwaXBlbGluZVxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJUGlwZWxpbmVTdGVwIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBpcGVsaW5lU3RlcFwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuL3BpcGVsaW5lS2V5XCI7XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZSB7XG4gICAgcHJpdmF0ZSBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByaXZhdGUgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByaXZhdGUgX3BpcGVsaW5lU3RlcEZvbGRlcjogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBfc3RlcHM6IFBpcGVsaW5lS2V5W107XG4gICAgcHJpdmF0ZSBfbW9kdWxlSWRNYXA6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBwcml2YXRlIF9sb2FkZWRTdGVwQ2FjaGU6IHsgW2lkOiBzdHJpbmddOiBJUGlwZWxpbmVTdGVwIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBwaXBlbGluZVN0ZXBGb2xkZXI6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgICAgICB0aGlzLl9waXBlbGluZVN0ZXBGb2xkZXIgPSBwaXBlbGluZVN0ZXBGb2xkZXI7XG4gICAgICAgIHRoaXMuX3N0ZXBzID0gW107XG4gICAgICAgIHRoaXMuX21vZHVsZUlkTWFwID0ge307XG4gICAgICAgIHRoaXMuX2xvYWRlZFN0ZXBDYWNoZSA9IHt9O1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGQoY2F0ZWdvcnk6IHN0cmluZywga2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fc3RlcHMucHVzaChuZXcgUGlwZWxpbmVLZXkoY2F0ZWdvcnksIGtleSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBydW4odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgcGlwZWxpbmU6IElQaXBlbGluZVN0ZXBbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHRoaXMuX3N0ZXBzKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBwaXBlbGluZVN0ZXAsIHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmUucHVzaCh0aGlzLmdldFN0ZXAocGlwZWxpbmVTdGVwKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVBZGQ6IElQaXBlbGluZVN0ZXBbXSA9IFtdO1xuICAgICAgICBjb25zdCBwaXBlbGluZVJlbW92ZTogSVBpcGVsaW5lU3RlcFtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHBpcGVsaW5lU3RlcC5tYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmIChjb25kaXRpb24gfHwgY29uZGl0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwaXBlbGluZUFkZC5wdXNoKHBpcGVsaW5lU3RlcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lUmVtb3ZlLnB1c2gocGlwZWxpbmVTdGVwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIkluaXRpYWxpc2luZ1wiLCB7IHN0ZXA6IE9iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKSB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuaW5pdGlhbGlzZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBjb25kaXRpb24gfHwgY29uZGl0aW9uID09PSB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYEV4Y2VwdGlvbiBpbml0aWFsaXNpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZVJlbW92ZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuY29uZmlndXJlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gdW5pbnN0YWxsaW5nIHBpcGVsaW5lIHN0ZXAgJyR7T2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApfSdgLCBlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmVBZGQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJJbnN0YWxsaW5nXCIsIHsgc3RlcDogT2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5jb25maWd1cmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgRXhjZXB0aW9uIGluc3RhbGxpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZVJlbW92ZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIkZpbmFsaXNpbmdcIiwgeyBzdGVwOiBPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCkgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLmZpbmFsaXNlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gZmluYWxpc2luZyBwaXBlbGluZSBzdGVwICcke09iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKX0nYCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lQWRkKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiRmluYWxpc2luZ1wiLCB7IHN0ZXA6IE9iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKSB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuZmluYWxpc2UodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgRXhjZXB0aW9uIGZpbmFsaXNpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U3RlcDxUIGV4dGVuZHMgSVBpcGVsaW5lU3RlcD4ocGlwZWxpbmVLZXk6IFBpcGVsaW5lS2V5KTogVCB7XG4gICAgICAgIGlmIChwaXBlbGluZUtleSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5ICE9PSBudWxsICYmXG4gICAgICAgICAgICBwaXBlbGluZUtleS5jYXRlZ29yeSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5LmNhdGVnb3J5ICE9PSBudWxsICYmIHBpcGVsaW5lS2V5LmNhdGVnb3J5Lmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgIHBpcGVsaW5lS2V5LmtleSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5LmtleSAhPT0gbnVsbCAmJiBwaXBlbGluZUtleS5rZXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgY29tYmluZWRLZXkgPSBwaXBlbGluZUtleS5jb21iaW5lZCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xvYWRlZFN0ZXBDYWNoZVtjb21iaW5lZEtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHBlZE5hbWUgPSB0aGlzLl9tb2R1bGVJZE1hcFtjb21iaW5lZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKG1hcHBlZE5hbWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLl9sb2FkZWRTdGVwQ2FjaGVbbWFwcGVkTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fbG9hZGVkU3RlcENhY2hlW21hcHBlZE5hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxUPnRoaXMuX2xvYWRlZFN0ZXBDYWNoZVtjb21iaW5lZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyB0cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBwaXBlbGluZUtleTogUGlwZWxpbmVLZXksIGNvbmZpZ3VyYXRpb25UeXBlPzogc3RyaW5nLCBkZWZpbmVQcm9wZXJ0eTogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKHBpcGVsaW5lS2V5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHBpcGVsaW5lS2V5LmNhdGVnb3J5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkgIT09IG51bGwgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICBjb25zdCBtb2R1bGVUeXBlSWQgPSBwaXBlbGluZUtleS5jb21iaW5lZCgpO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuX21vZHVsZUlkTWFwW21vZHVsZVR5cGVJZF07XG5cbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZVR5cGVGb2xkZXIgPSB0aGlzLl9maWxlU3lzdGVtLnBhdGhDb21iaW5lKHRoaXMuX3BpcGVsaW5lU3RlcEZvbGRlciwgcGlwZWxpbmVLZXkuY2F0ZWdvcnkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbFR5cGUgPSBjb25maWd1cmF0aW9uVHlwZSA/IGNvbmZpZ3VyYXRpb25UeXBlIDogcGlwZWxpbmVLZXkuY2F0ZWdvcnk7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZXMgPSBhd2FpdCB0aGlzLl9maWxlU3lzdGVtLmRpcmVjdG9yeUdldEZpbGVzKG1vZHVsZVR5cGVGb2xkZXIpO1xuICAgICAgICAgICAgICAgICAgICBmaWxlcyA9IGZpbGVzLmZpbHRlcihmaWxlID0+IGZpbGUuZW5kc1dpdGgoXCIuanNcIikpLm1hcChmaWxlID0+IGZpbGUucmVwbGFjZShcIi5qc1wiLCBcIlwiKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBpcGVsaW5lS2V5LmtleSA9PT0gdW5kZWZpbmVkIHx8IHBpcGVsaW5lS2V5LmtleSA9PT0gbnVsbCB8fCBwaXBlbGluZUtleS5rZXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYC0tJHthY3R1YWxUeXBlfSBzaG91bGQgbm90IGJlIGJsYW5rLCBwb3NzaWJsZSBvcHRpb25zIGNvdWxkIGJlIFske2ZpbGVzLmpvaW4oXCIsIFwiKX1dYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVJZExvd2VyID0gcGlwZWxpbmVLZXkua2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGVzW2ldLnRvTG93ZXJDYXNlKCkgPT09IG1vZHVsZUlkTG93ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZGlzYWJsZSB0aGUgbGludGluZyBhcyB3ZSBhcmUgdHJ5aW5nIHRvIGR5bmFtaWNhbGx5IGxvYWQgbW9kdWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6bm9uLWxpdGVyYWwtcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkRmlsZSA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUobW9kdWxlVHlwZUZvbGRlciwgZmlsZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGUgPSByZXF1aXJlKGxvYWRGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmVuYWJsZTpuby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmVuYWJsZTpub24tbGl0ZXJhbC1yZXF1aXJlXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gT2JqZWN0LmtleXMobW9kdWxlKVswXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUobW9kdWxlW2NsYXNzTmFtZV0ucHJvdG90eXBlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVmaW5lUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKGFjdHVhbFR5cGUsIHsgY2xhc3NOYW1lIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHVuaXRlQ29uZmlndXJhdGlvbiwgYWN0dWFsVHlwZSwgeyB2YWx1ZTogY2xhc3NOYW1lIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlQ2xhc3NOYW1lID0gbmV3IFBpcGVsaW5lS2V5KHBpcGVsaW5lS2V5LmNhdGVnb3J5LCBjbGFzc05hbWUpLmNvbWJpbmVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRlZFN0ZXBDYWNoZVttb2R1bGVDbGFzc05hbWVdID0gbmV3IGluc3RhbmNlLmNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZHVsZUlkTWFwW21vZHVsZVR5cGVJZF0gPSBtb2R1bGVDbGFzc05hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUGlwZWxpbmUgU3RlcCAnJHtwaXBlbGluZUtleS5rZXl9JyBmb3IgYXJnIC0tJHthY3R1YWxUeXBlfSBjb3VsZCBub3QgYmUgbG9jYXRlZCwgcG9zc2libGUgb3B0aW9ucyBjb3VsZCBiZSBbJHtmaWxlcy5qb2luKFwiLCBcIil9XWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUGlwZWxpbmUgU3RlcCAnJHtwaXBlbGluZUtleS5rZXl9JyBmb3IgYXJnIC0tJHthY3R1YWxUeXBlfSBmYWlsZWQgdG8gbG9hZGAsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQaXBlbGluZSBTdGVwIGhhcyBhbiBpbnZhbGlkIGtleWAsIHVuZGVmaW5lZCwgcGlwZWxpbmVLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
