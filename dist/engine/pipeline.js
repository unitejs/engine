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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTTNFLCtDQUE0QztBQUM1Qyx1REFBb0Q7QUFFcEQ7SUFTSSxZQUFZLE1BQWUsRUFBRSxVQUF1QixFQUFFLGdCQUF3QjtRQUMxRSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU0sR0FBRyxDQUFDLFFBQWdCLEVBQUUsR0FBVztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHlCQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVZLEdBQUcsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLEtBQWdCLEVBQUUsVUFBbUIsSUFBSTs7WUFDaEksTUFBTSxRQUFRLEdBQW9CLEVBQUUsQ0FBQztZQUVyQyxHQUFHLENBQUMsQ0FBQyxNQUFNLFlBQVksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDckMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRXRGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ1QsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7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L3BpcGVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGFzcyBmb3IgcGlwZWxpbmVcbiAqL1xuaW1wb3J0IHsgT2JqZWN0SGVscGVyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9vYmplY3RIZWxwZXJcIjtcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgSVBpcGVsaW5lU3RlcCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0lQaXBlbGluZVN0ZXBcIjtcbmltcG9ydCB7IEVuZ2luZVZhcmlhYmxlcyB9IGZyb20gXCIuL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi9waXBlbGluZUtleVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVMb2NhdG9yIH0gZnJvbSBcIi4vcGlwZWxpbmVMb2NhdG9yXCI7XG5cbmV4cG9ydCBjbGFzcyBQaXBlbGluZSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfbG9nZ2VyOiBJTG9nZ2VyO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX2VuZ2luZVJvb3RGb2xkZXI6IHN0cmluZztcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3N0ZXBzOiBQaXBlbGluZUtleVtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgX21vZHVsZUlkTWFwOiB7IFtpZDogc3RyaW5nXTogc3RyaW5nIH07XG4gICAgcHJpdmF0ZSByZWFkb25seSBfbG9hZGVkU3RlcENhY2hlOiB7IFtpZDogc3RyaW5nXTogSVBpcGVsaW5lU3RlcCB9O1xuXG4gICAgY29uc3RydWN0b3IobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICAgICAgdGhpcy5fZmlsZVN5c3RlbSA9IGZpbGVTeXN0ZW07XG4gICAgICAgIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIgPSBlbmdpbmVSb290Rm9sZGVyO1xuICAgICAgICB0aGlzLl9zdGVwcyA9IFtdO1xuICAgICAgICB0aGlzLl9tb2R1bGVJZE1hcCA9IHt9O1xuICAgICAgICB0aGlzLl9sb2FkZWRTdGVwQ2FjaGUgPSB7fTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkKGNhdGVnb3J5OiBzdHJpbmcsIGtleTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3N0ZXBzLnB1c2gobmV3IFBpcGVsaW5lS2V5KGNhdGVnb3J5LCBrZXkpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcnVuKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgc3RlcHM/OiBzdHJpbmdbXSwgbG9nSW5mbzogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICBjb25zdCBwaXBlbGluZTogSVBpcGVsaW5lU3RlcFtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgdGhpcy5fc3RlcHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IHRoaXMudHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb24sIHBpcGVsaW5lU3RlcCwgdW5kZWZpbmVkLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICAgICAgICBwaXBlbGluZS5wdXNoKHRoaXMuZ2V0U3RlcChwaXBlbGluZVN0ZXApKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwaXBlbGluZUFkZDogSVBpcGVsaW5lU3RlcFtdID0gW107XG4gICAgICAgIGNvbnN0IHBpcGVsaW5lUmVtb3ZlOiBJUGlwZWxpbmVTdGVwW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiBwaXBlbGluZSkge1xuICAgICAgICAgICAgY29uc3QgY29uZGl0aW9uID0gcGlwZWxpbmVTdGVwLm1haW5Db25kaXRpb24odW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMpO1xuICAgICAgICAgICAgaWYgKGNvbmRpdGlvbiB8fCBjb25kaXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lQWRkLnB1c2gocGlwZWxpbmVTdGVwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmVSZW1vdmUucHVzaChwaXBlbGluZVN0ZXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXN0ZXBzIHx8IHN0ZXBzLmluZGV4T2YoXCJpbml0aWFsaXNlXCIpID49IDApIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGNvbmRpdGlvbiB8fCBjb25kaXRpb24gPT09IHVuZGVmaW5lZCkgJiYgbG9nSW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJJbml0aWFsaXNpbmdcIiwgeyBzdGVwOiBPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLmluaXRpYWxpc2UodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgY29uZGl0aW9uIHx8IGNvbmRpdGlvbiA9PT0gdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYEV4Y2VwdGlvbiBpbml0aWFsaXNpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3RlcHMgfHwgc3RlcHMuaW5kZXhPZihcInVuY29uZmlndXJlXCIpID49IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLmNvbmZpZ3VyZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gdW5jb25maWd1cmluZyBwaXBlbGluZSBzdGVwICcke09iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKX0nYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdGVwcyB8fCBzdGVwcy5pbmRleE9mKFwiY29uZmlndXJlXCIpID49IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lQWRkKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiQ29uZmlndXJpbmdcIiwgeyBzdGVwOiBPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLmNvbmZpZ3VyZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYEV4Y2VwdGlvbiBpbnN0YWxsaW5nIHBpcGVsaW5lIHN0ZXAgJyR7T2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApfSdgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0ZXBzIHx8IHN0ZXBzLmluZGV4T2YoXCJ1bmZpbmFsaXNlXCIpID49IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gYXdhaXQgcGlwZWxpbmVTdGVwLmZpbmFsaXNlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYEV4Y2VwdGlvbiB1bmZpbmFsaXNpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3RlcHMgfHwgc3RlcHMuaW5kZXhPZihcImZpbmFsaXNlXCIpID49IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lQWRkKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5pbmZvKFwiRmluYWxpc2luZ1wiLCB7IHN0ZXA6IE9iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuZmluYWxpc2UodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBFeGNlcHRpb24gZmluYWxpc2luZyBwaXBlbGluZSBzdGVwICcke09iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKX0nYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFN0ZXA8VCBleHRlbmRzIElQaXBlbGluZVN0ZXA+KHBpcGVsaW5lS2V5OiBQaXBlbGluZUtleSk6IFQge1xuICAgICAgICBpZiAocGlwZWxpbmVLZXkgIT09IHVuZGVmaW5lZCAmJiBwaXBlbGluZUtleSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgcGlwZWxpbmVLZXkuY2F0ZWdvcnkgIT09IHVuZGVmaW5lZCAmJiBwaXBlbGluZUtleS5jYXRlZ29yeSAhPT0gbnVsbCAmJiBwaXBlbGluZUtleS5jYXRlZ29yeS5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICBwaXBlbGluZUtleS5rZXkgIT09IHVuZGVmaW5lZCAmJiBwaXBlbGluZUtleS5rZXkgIT09IG51bGwgJiYgcGlwZWxpbmVLZXkua2V5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbWJpbmVkS2V5ID0gcGlwZWxpbmVLZXkuY29tYmluZWQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9sb2FkZWRTdGVwQ2FjaGVbY29tYmluZWRLZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXBwZWROYW1lID0gdGhpcy5fbW9kdWxlSWRNYXBbY29tYmluZWRLZXldO1xuICAgICAgICAgICAgICAgIGlmIChtYXBwZWROYW1lICE9PSB1bmRlZmluZWQgJiYgdGhpcy5fbG9hZGVkU3RlcENhY2hlW21hcHBlZE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDxUPnRoaXMuX2xvYWRlZFN0ZXBDYWNoZVttYXBwZWROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiA8VD50aGlzLl9sb2FkZWRTdGVwQ2FjaGVbY29tYmluZWRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgdHJ5TG9hZCh1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgcGlwZWxpbmVLZXk6IFBpcGVsaW5lS2V5LCBjb25maWd1cmF0aW9uVHlwZT86IHN0cmluZywgZGVmaW5lUHJvcGVydHk6IGJvb2xlYW4gPSB0cnVlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIGlmIChwaXBlbGluZUtleSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5ICE9PSBudWxsICYmXG4gICAgICAgICAgICBwaXBlbGluZUtleS5jYXRlZ29yeSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5LmNhdGVnb3J5ICE9PSBudWxsICYmIHBpcGVsaW5lS2V5LmNhdGVnb3J5Lmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgICAgY29uc3QgbW9kdWxlVHlwZUlkID0gcGlwZWxpbmVLZXkuY29tYmluZWQoKTtcbiAgICAgICAgICAgIGxldCBjbGFzc05hbWUgPSB0aGlzLl9tb2R1bGVJZE1hcFttb2R1bGVUeXBlSWRdO1xuXG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWxUeXBlID0gY29uZmlndXJhdGlvblR5cGUgPyBjb25maWd1cmF0aW9uVHlwZSA6IHBpcGVsaW5lS2V5LmNhdGVnb3J5O1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCBQaXBlbGluZUxvY2F0b3IuZ2V0UGlwZWxpbmVDYXRlZ29yeUl0ZW1zKHRoaXMuX2ZpbGVTeXN0ZW0sIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsIHBpcGVsaW5lS2V5LmNhdGVnb3J5KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocGlwZWxpbmVLZXkua2V5ID09PSB1bmRlZmluZWQgfHwgcGlwZWxpbmVLZXkua2V5ID09PSBudWxsIHx8IHBpcGVsaW5lS2V5LmtleS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgLS0ke2FjdHVhbFR5cGV9IHNob3VsZCBub3QgYmUgYmxhbmssIHBvc3NpYmxlIG9wdGlvbnMgY291bGQgYmUgWyR7aXRlbXMuam9pbihcIiwgXCIpfV1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZUlkTG93ZXIgPSBwaXBlbGluZUtleS5rZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbXNbaV0udG9Mb3dlckNhc2UoKSA9PT0gbW9kdWxlSWRMb3dlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGUgPSBhd2FpdCBQaXBlbGluZUxvY2F0b3IubG9hZEl0ZW0odGhpcy5fZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2VuZ2luZVJvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBlbGluZUtleS5jYXRlZ29yeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBPYmplY3Qua2V5cyhtb2R1bGUpWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShtb2R1bGVbY2xhc3NOYW1lXS5wcm90b3R5cGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oYWN0dWFsVHlwZSwgeyBjbGFzc05hbWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodW5pdGVDb25maWd1cmF0aW9uLCBhY3R1YWxUeXBlLCB7IHZhbHVlOiBjbGFzc05hbWUgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2R1bGVDbGFzc05hbWUgPSBuZXcgUGlwZWxpbmVLZXkocGlwZWxpbmVLZXkuY2F0ZWdvcnksIGNsYXNzTmFtZSkuY29tYmluZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9hZGVkU3RlcENhY2hlW21vZHVsZUNsYXNzTmFtZV0gPSBuZXcgaW5zdGFuY2UuY29uc3RydWN0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kdWxlSWRNYXBbbW9kdWxlVHlwZUlkXSA9IG1vZHVsZUNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQaXBlbGluZSBTdGVwICcke3BpcGVsaW5lS2V5LmtleX0nIGZvciBhcmcgLS0ke2FjdHVhbFR5cGV9IGNvdWxkIG5vdCBiZSBsb2NhdGVkLCBwb3NzaWJsZSBvcHRpb25zIGNvdWxkIGJlIFske2l0ZW1zLmpvaW4oXCIsIFwiKX1dYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGBQaXBlbGluZSBTdGVwICcke3BpcGVsaW5lS2V5LmtleX0nIGZvciBhcmcgLS0ke2FjdHVhbFR5cGV9IGZhaWxlZCB0byBsb2FkYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFBpcGVsaW5lIFN0ZXAgaGFzIGFuIGludmFsaWQga2V5YCwgdW5kZWZpbmVkLCBwaXBlbGluZUtleSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
