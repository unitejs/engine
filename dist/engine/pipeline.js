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
const pipelineLocator_1 = require("./pipelineLocator");
class Pipeline {
    constructor(logger, fileSystem, engineRootFolder) {
        this._logger = logger;
        this._fileSystem = fileSystem;
        this._engineRootFolder = engineRootFolder;
        this._steps = [];
        this._moduleIdMap = {};
        this._loadedStepCache = {};
    }
    add(category, key) {
        this._steps.push(new pipelineKey_1.PipelineKey(category, key));
    }
    run(uniteConfiguration, engineVariables, steps, logInfo = true) {
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
                if (!steps || steps.indexOf("initialise") >= 0) {
                    try {
                        if ((condition || condition === undefined) && logInfo) {
                            this._logger.info("Initialising", { step: objectHelper_1.ObjectHelper.getClassName(pipelineStep) });
                        }
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
            }
            if (!steps || steps.indexOf("unconfigure") >= 0) {
                for (const pipelineStep of pipelineRemove) {
                    try {
                        const ret = yield pipelineStep.configure(this._logger, this._fileSystem, uniteConfiguration, engineVariables, false);
                        if (ret !== 0) {
                            return ret;
                        }
                    }
                    catch (err) {
                        this._logger.error(`Exception unconfiguring pipeline step '${objectHelper_1.ObjectHelper.getClassName(pipelineStep)}'`, err);
                        return 1;
                    }
                }
            }
            if (!steps || steps.indexOf("configure") >= 0) {
                for (const pipelineStep of pipelineAdd) {
                    try {
                        if (logInfo) {
                            this._logger.info("Configuring", { step: objectHelper_1.ObjectHelper.getClassName(pipelineStep) });
                        }
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
            }
            if (!steps || steps.indexOf("unfinalise") >= 0) {
                for (const pipelineStep of pipelineRemove) {
                    try {
                        const ret = yield pipelineStep.finalise(this._logger, this._fileSystem, uniteConfiguration, engineVariables, false);
                        if (ret !== 0) {
                            return ret;
                        }
                    }
                    catch (err) {
                        this._logger.error(`Exception unfinalising pipeline step '${objectHelper_1.ObjectHelper.getClassName(pipelineStep)}'`, err);
                        return 1;
                    }
                }
            }
            if (!steps || steps.indexOf("finalise") >= 0) {
                for (const pipelineStep of pipelineAdd) {
                    try {
                        if (logInfo) {
                            this._logger.info("Finalising", { step: objectHelper_1.ObjectHelper.getClassName(pipelineStep) });
                        }
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
                    const actualType = configurationType ? configurationType : pipelineKey.category;
                    try {
                        const items = yield pipelineLocator_1.PipelineLocator.getPipelineCategoryItems(this._fileSystem, this._engineRootFolder, pipelineKey.category);
                        if (pipelineKey.key === undefined || pipelineKey.key === null || pipelineKey.key.length === 0) {
                            this._logger.error(`--${actualType} should not be blank, possible options could be [${items.join(", ")}]`);
                            return false;
                        }
                        else {
                            const moduleIdLower = pipelineKey.key.toLowerCase();
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].toLowerCase() === moduleIdLower) {
                                    const module = yield pipelineLocator_1.PipelineLocator.loadItem(this._fileSystem, this._engineRootFolder, pipelineKey.category, items[i]);
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
                            this._logger.error(`Pipeline Step '${pipelineKey.key}' for arg --${actualType} could not be located, possible options could be [${items.join(", ")}]`);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTTNFLCtDQUE0QztBQUM1Qyx1REFBb0Q7QUFFcEQsTUFBYSxRQUFRO0lBU2pCLFlBQVksTUFBZSxFQUFFLFVBQXVCLEVBQUUsZ0JBQXdCO1FBQzFFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxHQUFXO1FBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRVksR0FBRyxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsS0FBZ0IsRUFBRSxVQUFtQixJQUFJOztZQUNoSSxNQUFNLFFBQVEsR0FBb0IsRUFBRSxDQUFDO1lBRXJDLEtBQUssTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDcEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRXRGLElBQUksTUFBTSxFQUFFO29CQUNSLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUM3QztxQkFBTTtvQkFDSCxPQUFPLENBQUMs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LGVBQWUsQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO29DQUNwRSxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxHQUFHLGVBQWUsQ0FBQztvQ0FDbEQsT0FBTyxJQUFJLENBQUM7aUNBQ2Y7NkJBQ0o7NEJBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLFdBQVcsQ0FBQyxHQUFHLGVBQWUsVUFBVSxxREFBcUQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ3ZKLE9BQU8sS0FBSyxDQUFDO3lCQUNoQjtxQkFDSjtvQkFBQyxPQUFPLEdBQUcsRUFBRTt3QkFDVixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsV0FBVyxDQUFDLEdBQUcsZUFBZSxVQUFVLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNyRyxPQUFPLEtBQUssQ0FBQztxQkFDaEI7aUJBQ0o7cUJBQU07b0JBQ0gsT0FBTyxJQUFJLENBQUM7aUJBQ2Y7YUFDSjtpQkFBTTtnQkFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQy9FLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUF4TUQsNEJBd01DIiwiZmlsZSI6ImVuZ2luZS9waXBlbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xhc3MgZm9yIHBpcGVsaW5lXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElQaXBlbGluZVN0ZXAgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JUGlwZWxpbmVTdGVwXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4vcGlwZWxpbmVLZXlcIjtcbmltcG9ydCB7IFBpcGVsaW5lTG9jYXRvciB9IGZyb20gXCIuL3BpcGVsaW5lTG9jYXRvclwiO1xuXG5leHBvcnQgY2xhc3MgUGlwZWxpbmUge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xvZ2dlcjogSUxvZ2dlcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9maWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9lbmdpbmVSb290Rm9sZGVyOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IF9zdGVwczogUGlwZWxpbmVLZXlbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9tb2R1bGVJZE1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xvYWRlZFN0ZXBDYWNoZTogeyBbaWQ6IHN0cmluZ106IElQaXBlbGluZVN0ZXAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIGVuZ2luZVJvb3RGb2xkZXI6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgIHRoaXMuX2ZpbGVTeXN0ZW0gPSBmaWxlU3lzdGVtO1xuICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyID0gZW5naW5lUm9vdEZvbGRlcjtcbiAgICAgICAgdGhpcy5fc3RlcHMgPSBbXTtcbiAgICAgICAgdGhpcy5fbW9kdWxlSWRNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fbG9hZGVkU3RlcENhY2hlID0ge307XG4gICAgfVxuXG4gICAgcHVibGljIGFkZChjYXRlZ29yeTogc3RyaW5nLCBrZXk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLl9zdGVwcy5wdXNoKG5ldyBQaXBlbGluZUtleShjYXRlZ29yeSwga2V5KSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIHN0ZXBzPzogc3RyaW5nW10sIGxvZ0luZm86IGJvb2xlYW4gPSB0cnVlKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgcGlwZWxpbmU6IElQaXBlbGluZVN0ZXBbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHRoaXMuX3N0ZXBzKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBwaXBlbGluZVN0ZXAsIHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmUucHVzaCh0aGlzLmdldFN0ZXAocGlwZWxpbmVTdGVwKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVBZGQ6IElQaXBlbGluZVN0ZXBbXSA9IFtdO1xuICAgICAgICBjb25zdCBwaXBlbGluZVJlbW92ZTogSVBpcGVsaW5lU3RlcFtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHBpcGVsaW5lU3RlcC5tYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmIChjb25kaXRpb24gfHwgY29uZGl0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwaXBlbGluZUFkZC5wdXNoKHBpcGVsaW5lU3RlcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lUmVtb3ZlLnB1c2gocGlwZWxpbmVTdGVwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzdGVwcyB8fCBzdGVwcy5pbmRleE9mKFwiaW5pdGlhbGlzZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChjb25kaXRpb24gfHwgY29uZGl0aW9uID09PSB1bmRlZmluZWQpICYmIGxvZ0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiSW5pdGlhbGlzaW5nXCIsIHsgc3RlcDogT2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5pbml0aWFsaXNlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGNvbmRpdGlvbiB8fCBjb25kaXRpb24gPT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gaW5pdGlhbGlzaW5nIHBpcGVsaW5lIHN0ZXAgJyR7T2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApfSdgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0ZXBzIHx8IHN0ZXBzLmluZGV4T2YoXCJ1bmNvbmZpZ3VyZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZVJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5jb25maWd1cmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgRXhjZXB0aW9uIHVuY29uZmlndXJpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3RlcHMgfHwgc3RlcHMuaW5kZXhPZihcImNvbmZpZ3VyZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZUFkZCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIkNvbmZpZ3VyaW5nXCIsIHsgc3RlcDogT2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5jb25maWd1cmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gaW5zdGFsbGluZyBwaXBlbGluZSBzdGVwICcke09iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKX0nYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdGVwcyB8fCBzdGVwcy5pbmRleE9mKFwidW5maW5hbGlzZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZVJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5maW5hbGlzZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gdW5maW5hbGlzaW5nIHBpcGVsaW5lIHN0ZXAgJyR7T2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApfSdgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0ZXBzIHx8IHN0ZXBzLmluZGV4T2YoXCJmaW5hbGlzZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZUFkZCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIkZpbmFsaXNpbmdcIiwgeyBzdGVwOiBPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLmZpbmFsaXNlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgRXhjZXB0aW9uIGZpbmFsaXNpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTdGVwPFQgZXh0ZW5kcyBJUGlwZWxpbmVTdGVwPihwaXBlbGluZUtleTogUGlwZWxpbmVLZXkpOiBUIHtcbiAgICAgICAgaWYgKHBpcGVsaW5lS2V5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHBpcGVsaW5lS2V5LmNhdGVnb3J5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkgIT09IG51bGwgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgcGlwZWxpbmVLZXkua2V5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkua2V5ICE9PSBudWxsICYmIHBpcGVsaW5lS2V5LmtleS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBjb21iaW5lZEtleSA9IHBpcGVsaW5lS2V5LmNvbWJpbmVkKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fbG9hZGVkU3RlcENhY2hlW2NvbWJpbmVkS2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwcGVkTmFtZSA9IHRoaXMuX21vZHVsZUlkTWFwW2NvbWJpbmVkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAobWFwcGVkTmFtZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX2xvYWRlZFN0ZXBDYWNoZVttYXBwZWROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8VD50aGlzLl9sb2FkZWRTdGVwQ2FjaGVbbWFwcGVkTmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fbG9hZGVkU3RlcENhY2hlW2NvbWJpbmVkS2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIHBpcGVsaW5lS2V5OiBQaXBlbGluZUtleSwgY29uZmlndXJhdGlvblR5cGU/OiBzdHJpbmcsIGRlZmluZVByb3BlcnR5OiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBpZiAocGlwZWxpbmVLZXkgIT09IHVuZGVmaW5lZCAmJiBwaXBlbGluZUtleSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgcGlwZWxpbmVLZXkuY2F0ZWdvcnkgIT09IHVuZGVmaW5lZCAmJiBwaXBlbGluZUtleS5jYXRlZ29yeSAhPT0gbnVsbCAmJiBwaXBlbGluZUtleS5jYXRlZ29yeS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1vZHVsZVR5cGVJZCA9IHBpcGVsaW5lS2V5LmNvbWJpbmVkKCk7XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gdGhpcy5fbW9kdWxlSWRNYXBbbW9kdWxlVHlwZUlkXTtcblxuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsVHlwZSA9IGNvbmZpZ3VyYXRpb25UeXBlID8gY29uZmlndXJhdGlvblR5cGUgOiBwaXBlbGluZUtleS5jYXRlZ29yeTtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgUGlwZWxpbmVMb2NhdG9yLmdldFBpcGVsaW5lQ2F0ZWdvcnlJdGVtcyh0aGlzLl9maWxlU3lzdGVtLCB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLCBwaXBlbGluZUtleS5jYXRlZ29yeSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBpcGVsaW5lS2V5LmtleSA9PT0gdW5kZWZpbmVkIHx8IHBpcGVsaW5lS2V5LmtleSA9PT0gbnVsbCB8fCBwaXBlbGluZUtleS5rZXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYC0tJHthY3R1YWxUeXBlfSBzaG91bGQgbm90IGJlIGJsYW5rLCBwb3NzaWJsZSBvcHRpb25zIGNvdWxkIGJlIFske2l0ZW1zLmpvaW4oXCIsIFwiKX1dYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVJZExvd2VyID0gcGlwZWxpbmVLZXkua2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2ldLnRvTG93ZXJDYXNlKCkgPT09IG1vZHVsZUlkTG93ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlID0gYXdhaXQgUGlwZWxpbmVMb2NhdG9yLmxvYWRJdGVtKHRoaXMuX2ZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbmdpbmVSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwZWxpbmVLZXkuY2F0ZWdvcnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gT2JqZWN0LmtleXMobW9kdWxlKVswXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUobW9kdWxlW2NsYXNzTmFtZV0ucHJvdG90eXBlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVmaW5lUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKGFjdHVhbFR5cGUsIHsgY2xhc3NOYW1lIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHVuaXRlQ29uZmlndXJhdGlvbiwgYWN0dWFsVHlwZSwgeyB2YWx1ZTogY2xhc3NOYW1lIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlQ2xhc3NOYW1lID0gbmV3IFBpcGVsaW5lS2V5KHBpcGVsaW5lS2V5LmNhdGVnb3J5LCBjbGFzc05hbWUpLmNvbWJpbmVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRlZFN0ZXBDYWNoZVttb2R1bGVDbGFzc05hbWVdID0gbmV3IGluc3RhbmNlLmNvbnN0cnVjdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZHVsZUlkTWFwW21vZHVsZVR5cGVJZF0gPSBtb2R1bGVDbGFzc05hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUGlwZWxpbmUgU3RlcCAnJHtwaXBlbGluZUtleS5rZXl9JyBmb3IgYXJnIC0tJHthY3R1YWxUeXBlfSBjb3VsZCBub3QgYmUgbG9jYXRlZCwgcG9zc2libGUgb3B0aW9ucyBjb3VsZCBiZSBbJHtpdGVtcy5qb2luKFwiLCBcIil9XWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUGlwZWxpbmUgU3RlcCAnJHtwaXBlbGluZUtleS5rZXl9JyBmb3IgYXJnIC0tJHthY3R1YWxUeXBlfSBmYWlsZWQgdG8gbG9hZGAsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQaXBlbGluZSBTdGVwIGhhcyBhbiBpbnZhbGlkIGtleWAsIHVuZGVmaW5lZCwgcGlwZWxpbmVLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
