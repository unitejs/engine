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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTTNFLCtDQUE0QztBQUU1QztJQVNJLFlBQVksTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQTBCO1FBQzVFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQztRQUM5QyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxHQUFXO1FBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRVksR0FBRyxDQUFDLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsS0FBZ0IsRUFBRSxVQUFtQixJQUFJOztZQUNoSSxNQUFNLFFBQVEsR0FBb0IsRUFBRSxDQUFDO1lBRXJDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFFdEYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDVCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztn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LE1BQU0sQ0FBQyxLQUFLLENBQUM7b0JBQ2pCLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQixDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDL0UsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUE3TUQsNEJBNk1DIiwiZmlsZSI6ImVuZ2luZS9waXBlbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2xhc3MgZm9yIHBpcGVsaW5lXG4gKi9cbmltcG9ydCB7IE9iamVjdEhlbHBlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2hlbHBlcnMvb2JqZWN0SGVscGVyXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IFVuaXRlQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuLi9jb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZUNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IElQaXBlbGluZVN0ZXAgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JUGlwZWxpbmVTdGVwXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lS2V5IH0gZnJvbSBcIi4vcGlwZWxpbmVLZXlcIjtcblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lIHtcbiAgICBwcml2YXRlIF9sb2dnZXI6IElMb2dnZXI7XG4gICAgcHJpdmF0ZSBfZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW07XG4gICAgcHJpdmF0ZSBfcGlwZWxpbmVTdGVwRm9sZGVyOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF9zdGVwczogUGlwZWxpbmVLZXlbXTtcbiAgICBwcml2YXRlIF9tb2R1bGVJZE1hcDogeyBbaWQ6IHN0cmluZ106IHN0cmluZyB9O1xuICAgIHByaXZhdGUgX2xvYWRlZFN0ZXBDYWNoZTogeyBbaWQ6IHN0cmluZ106IElQaXBlbGluZVN0ZXAgfTtcblxuICAgIGNvbnN0cnVjdG9yKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHBpcGVsaW5lU3RlcEZvbGRlcjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IGZpbGVTeXN0ZW07XG4gICAgICAgIHRoaXMuX3BpcGVsaW5lU3RlcEZvbGRlciA9IHBpcGVsaW5lU3RlcEZvbGRlcjtcbiAgICAgICAgdGhpcy5fc3RlcHMgPSBbXTtcbiAgICAgICAgdGhpcy5fbW9kdWxlSWRNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fbG9hZGVkU3RlcENhY2hlID0ge307XG4gICAgfVxuXG4gICAgcHVibGljIGFkZChjYXRlZ29yeTogc3RyaW5nLCBrZXk6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLl9zdGVwcy5wdXNoKG5ldyBQaXBlbGluZUtleShjYXRlZ29yeSwga2V5KSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHJ1bih1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIHN0ZXBzPzogc3RyaW5nW10sIGxvZ0luZm86IGJvb2xlYW4gPSB0cnVlKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgcGlwZWxpbmU6IElQaXBlbGluZVN0ZXBbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHRoaXMuX3N0ZXBzKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdHMgPSBhd2FpdCB0aGlzLnRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uLCBwaXBlbGluZVN0ZXAsIHVuZGVmaW5lZCwgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmUucHVzaCh0aGlzLmdldFN0ZXAocGlwZWxpbmVTdGVwKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGlwZWxpbmVBZGQ6IElQaXBlbGluZVN0ZXBbXSA9IFtdO1xuICAgICAgICBjb25zdCBwaXBlbGluZVJlbW92ZTogSVBpcGVsaW5lU3RlcFtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHBpcGVsaW5lU3RlcC5tYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmIChjb25kaXRpb24gfHwgY29uZGl0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBwaXBlbGluZUFkZC5wdXNoKHBpcGVsaW5lU3RlcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lUmVtb3ZlLnB1c2gocGlwZWxpbmVTdGVwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFzdGVwcyB8fCBzdGVwcy5pbmRleE9mKFwiaW5pdGlhbGlzZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChjb25kaXRpb24gfHwgY29uZGl0aW9uID09PSB1bmRlZmluZWQpICYmIGxvZ0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiSW5pdGlhbGlzaW5nXCIsIHsgc3RlcDogT2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5pbml0aWFsaXNlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGNvbmRpdGlvbiB8fCBjb25kaXRpb24gPT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gaW5pdGlhbGlzaW5nIHBpcGVsaW5lIHN0ZXAgJyR7T2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApfSdgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0ZXBzIHx8IHN0ZXBzLmluZGV4T2YoXCJ1bmNvbmZpZ3VyZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZVJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5jb25maWd1cmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgRXhjZXB0aW9uIHVuY29uZmlndXJpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3RlcHMgfHwgc3RlcHMuaW5kZXhPZihcImNvbmZpZ3VyZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZUFkZCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIkNvbmZpZ3VyaW5nXCIsIHsgc3RlcDogT2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5jb25maWd1cmUodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gaW5zdGFsbGluZyBwaXBlbGluZSBzdGVwICcke09iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKX0nYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdGVwcyB8fCBzdGVwcy5pbmRleE9mKFwidW5maW5hbGlzZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZVJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5maW5hbGlzZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gdW5maW5hbGlzaW5nIHBpcGVsaW5lIHN0ZXAgJyR7T2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApfSdgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0ZXBzIHx8IHN0ZXBzLmluZGV4T2YoXCJmaW5hbGlzZVwiKSA+PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZUFkZCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2dJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIkZpbmFsaXNpbmdcIiwgeyBzdGVwOiBPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLmZpbmFsaXNlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgRXhjZXB0aW9uIGZpbmFsaXNpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTdGVwPFQgZXh0ZW5kcyBJUGlwZWxpbmVTdGVwPihwaXBlbGluZUtleTogUGlwZWxpbmVLZXkpOiBUIHtcbiAgICAgICAgaWYgKHBpcGVsaW5lS2V5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHBpcGVsaW5lS2V5LmNhdGVnb3J5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkgIT09IG51bGwgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgcGlwZWxpbmVLZXkua2V5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkua2V5ICE9PSBudWxsICYmIHBpcGVsaW5lS2V5LmtleS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBjb21iaW5lZEtleSA9IHBpcGVsaW5lS2V5LmNvbWJpbmVkKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fbG9hZGVkU3RlcENhY2hlW2NvbWJpbmVkS2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwcGVkTmFtZSA9IHRoaXMuX21vZHVsZUlkTWFwW2NvbWJpbmVkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAobWFwcGVkTmFtZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX2xvYWRlZFN0ZXBDYWNoZVttYXBwZWROYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8VD50aGlzLl9sb2FkZWRTdGVwQ2FjaGVbbWFwcGVkTmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fbG9hZGVkU3RlcENhY2hlW2NvbWJpbmVkS2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHRyeUxvYWQodW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIHBpcGVsaW5lS2V5OiBQaXBlbGluZUtleSwgY29uZmlndXJhdGlvblR5cGU/OiBzdHJpbmcsIGRlZmluZVByb3BlcnR5OiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBpZiAocGlwZWxpbmVLZXkgIT09IHVuZGVmaW5lZCAmJiBwaXBlbGluZUtleSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgcGlwZWxpbmVLZXkuY2F0ZWdvcnkgIT09IHVuZGVmaW5lZCAmJiBwaXBlbGluZUtleS5jYXRlZ29yeSAhPT0gbnVsbCAmJiBwaXBlbGluZUtleS5jYXRlZ29yeS5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG1vZHVsZVR5cGVJZCA9IHBpcGVsaW5lS2V5LmNvbWJpbmVkKCk7XG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gdGhpcy5fbW9kdWxlSWRNYXBbbW9kdWxlVHlwZUlkXTtcblxuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlVHlwZUZvbGRlciA9IHRoaXMuX2ZpbGVTeXN0ZW0ucGF0aENvbWJpbmUodGhpcy5fcGlwZWxpbmVTdGVwRm9sZGVyLCBwaXBlbGluZUtleS5jYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsVHlwZSA9IGNvbmZpZ3VyYXRpb25UeXBlID8gY29uZmlndXJhdGlvblR5cGUgOiBwaXBlbGluZUtleS5jYXRlZ29yeTtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxlcyA9IGF3YWl0IHRoaXMuX2ZpbGVTeXN0ZW0uZGlyZWN0b3J5R2V0RmlsZXMobW9kdWxlVHlwZUZvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgIGZpbGVzID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS5lbmRzV2l0aChcIi5qc1wiKSkubWFwKGZpbGUgPT4gZmlsZS5yZXBsYWNlKFwiLmpzXCIsIFwiXCIpKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocGlwZWxpbmVLZXkua2V5ID09PSB1bmRlZmluZWQgfHwgcGlwZWxpbmVLZXkua2V5ID09PSBudWxsIHx8IHBpcGVsaW5lS2V5LmtleS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgLS0ke2FjdHVhbFR5cGV9IHNob3VsZCBub3QgYmUgYmxhbmssIHBvc3NpYmxlIG9wdGlvbnMgY291bGQgYmUgWyR7ZmlsZXMuam9pbihcIiwgXCIpfV1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZUlkTG93ZXIgPSBwaXBlbGluZUtleS5rZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZXNbaV0udG9Mb3dlckNhc2UoKSA9PT0gbW9kdWxlSWRMb3dlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBkaXNhYmxlIHRoZSBsaW50aW5nIGFzIHdlIGFyZSB0cnlpbmcgdG8gZHluYW1pY2FsbHkgbG9hZCBtb2R1bGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTpub24tbGl0ZXJhbC1yZXF1aXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRGaWxlID0gdGhpcy5fZmlsZVN5c3RlbS5wYXRoQ29tYmluZShtb2R1bGVUeXBlRm9sZGVyLCBmaWxlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IHJlcXVpcmUobG9hZEZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vLXJlcXVpcmUtaW1wb3J0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZW5hYmxlOm5vbi1saXRlcmFsLXJlcXVpcmVcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBPYmplY3Qua2V5cyhtb2R1bGUpWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGVbY2xhc3NOYW1lXS5wcm90b3R5cGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oYWN0dWFsVHlwZSwgeyBjbGFzc05hbWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodW5pdGVDb25maWd1cmF0aW9uLCBhY3R1YWxUeXBlLCB7IHZhbHVlOiBjbGFzc05hbWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVDbGFzc05hbWUgPSBuZXcgUGlwZWxpbmVLZXkocGlwZWxpbmVLZXkuY2F0ZWdvcnksIGNsYXNzTmFtZSkuY29tYmluZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9hZGVkU3RlcENhY2hlW21vZHVsZUNsYXNzTmFtZV0gPSBuZXcgaW5zdGFuY2UuY29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kdWxlSWRNYXBbbW9kdWxlVHlwZUlkXSA9IG1vZHVsZUNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQaXBlbGluZSBTdGVwICcke3BpcGVsaW5lS2V5LmtleX0nIGZvciBhcmcgLS0ke2FjdHVhbFR5cGV9IGNvdWxkIG5vdCBiZSBsb2NhdGVkLCBwb3NzaWJsZSBvcHRpb25zIGNvdWxkIGJlIFske2ZpbGVzLmpvaW4oXCIsIFwiKX1dYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQaXBlbGluZSBTdGVwICcke3BpcGVsaW5lS2V5LmtleX0nIGZvciBhcmcgLS0ke2FjdHVhbFR5cGV9IGZhaWxlZCB0byBsb2FkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFBpcGVsaW5lIFN0ZXAgaGFzIGFuIGludmFsaWQga2V5YCwgdW5kZWZpbmVkLCBwaXBlbGluZUtleSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
