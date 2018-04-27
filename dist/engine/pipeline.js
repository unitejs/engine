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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbmdpbmUvcGlwZWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsOEVBQTJFO0FBTTNFLCtDQUE0QztBQUM1Qyx1REFBb0Q7QUFFcEQ7SUFTSSxZQUFZLE1BQWUsRUFBRSxVQUF1QixFQUFFLGdCQUF3QjtRQUMxRSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU0sR0FBRyxDQUFDLFFBQWdCLEVBQUUsR0FBVztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHlCQUFXLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVZLEdBQUcsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQyxFQUFFLEtBQWdCLEVBQUUsVUFBbUIsSUFBSTs7WUFDaEksTUFBTSxRQUFRLEdBQW9CLEVBQUUsQ0FBQztZQUVyQyxLQUFLLE1BQU0sWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3BDLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUV0RixJQUFJLE1BQU0sRUFBRTtvQkFDUixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFDN0M7cUJBQU07b0JBQ0gsT0FBTyxDQUFDLENBQUM7aUJBQ1o7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R0FBRyxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQ0FDcEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxlQUFlLENBQUM7b0NBQ2xELE9BQU8sSUFBSSxDQUFDO2lDQUNmOzZCQUNKOzRCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixXQUFXLENBQUMsR0FBRyxlQUFlLFVBQVUscURBQXFELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUN2SixPQUFPLEtBQUssQ0FBQzt5QkFDaEI7cUJBQ0o7b0JBQUMsT0FBTyxHQUFHLEVBQUU7d0JBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLFdBQVcsQ0FBQyxHQUFHLGVBQWUsVUFBVSxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDckcsT0FBTyxLQUFLLENBQUM7cUJBQ2hCO2lCQUNKO3FCQUFNO29CQUNILE9BQU8sSUFBSSxDQUFDO2lCQUNmO2FBQ0o7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUMvRSxPQUFPLEtBQUssQ0FBQzthQUNoQjtRQUNMLENBQUM7S0FBQTtDQUNKO0FBeE1ELDRCQXdNQyIsImZpbGUiOiJlbmdpbmUvcGlwZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENsYXNzIGZvciBwaXBlbGluZVxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBJUGlwZWxpbmVTdGVwIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSVBpcGVsaW5lU3RlcFwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4vZW5naW5lVmFyaWFibGVzXCI7XG5pbXBvcnQgeyBQaXBlbGluZUtleSB9IGZyb20gXCIuL3BpcGVsaW5lS2V5XCI7XG5pbXBvcnQgeyBQaXBlbGluZUxvY2F0b3IgfSBmcm9tIFwiLi9waXBlbGluZUxvY2F0b3JcIjtcblxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9sb2dnZXI6IElMb2dnZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW07XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZW5naW5lUm9vdEZvbGRlcjogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBfc3RlcHM6IFBpcGVsaW5lS2V5W107XG4gICAgcHJpdmF0ZSByZWFkb25seSBfbW9kdWxlSWRNYXA6IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9sb2FkZWRTdGVwQ2FjaGU6IHsgW2lkOiBzdHJpbmddOiBJUGlwZWxpbmVTdGVwIH07XG5cbiAgICBjb25zdHJ1Y3Rvcihsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCBlbmdpbmVSb290Rm9sZGVyOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICB0aGlzLl9maWxlU3lzdGVtID0gZmlsZVN5c3RlbTtcbiAgICAgICAgdGhpcy5fZW5naW5lUm9vdEZvbGRlciA9IGVuZ2luZVJvb3RGb2xkZXI7XG4gICAgICAgIHRoaXMuX3N0ZXBzID0gW107XG4gICAgICAgIHRoaXMuX21vZHVsZUlkTWFwID0ge307XG4gICAgICAgIHRoaXMuX2xvYWRlZFN0ZXBDYWNoZSA9IHt9O1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGQoY2F0ZWdvcnk6IHN0cmluZywga2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fc3RlcHMucHVzaChuZXcgUGlwZWxpbmVLZXkoY2F0ZWdvcnksIGtleSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBydW4odW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzLCBzdGVwcz86IHN0cmluZ1tdLCBsb2dJbmZvOiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHBpcGVsaW5lOiBJUGlwZWxpbmVTdGVwW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBpcGVsaW5lU3RlcCBvZiB0aGlzLl9zdGVwcykge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzID0gYXdhaXQgdGhpcy50cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbiwgcGlwZWxpbmVTdGVwLCB1bmRlZmluZWQsIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICAgICAgICAgIHBpcGVsaW5lLnB1c2godGhpcy5nZXRTdGVwKHBpcGVsaW5lU3RlcCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lQWRkOiBJUGlwZWxpbmVTdGVwW10gPSBbXTtcbiAgICAgICAgY29uc3QgcGlwZWxpbmVSZW1vdmU6IElQaXBlbGluZVN0ZXBbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcGlwZWxpbmVTdGVwIG9mIHBpcGVsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSBwaXBlbGluZVN0ZXAubWFpbkNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcyk7XG4gICAgICAgICAgICBpZiAoY29uZGl0aW9uIHx8IGNvbmRpdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcGlwZWxpbmVBZGQucHVzaChwaXBlbGluZVN0ZXApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwaXBlbGluZVJlbW92ZS5wdXNoKHBpcGVsaW5lU3RlcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghc3RlcHMgfHwgc3RlcHMuaW5kZXhPZihcImluaXRpYWxpc2VcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoY29uZGl0aW9uIHx8IGNvbmRpdGlvbiA9PT0gdW5kZWZpbmVkKSAmJiBsb2dJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhcIkluaXRpYWxpc2luZ1wiLCB7IHN0ZXA6IE9iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuaW5pdGlhbGlzZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCBjb25kaXRpb24gfHwgY29uZGl0aW9uID09PSB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgRXhjZXB0aW9uIGluaXRpYWxpc2luZyBwaXBlbGluZSBzdGVwICcke09iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKX0nYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdGVwcyB8fCBzdGVwcy5pbmRleE9mKFwidW5jb25maWd1cmVcIikgPj0gMCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmVSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuY29uZmlndXJlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYEV4Y2VwdGlvbiB1bmNvbmZpZ3VyaW5nIHBpcGVsaW5lIHN0ZXAgJyR7T2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApfSdgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0ZXBzIHx8IHN0ZXBzLmluZGV4T2YoXCJjb25maWd1cmVcIikgPj0gMCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmVBZGQpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9nSW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJDb25maWd1cmluZ1wiLCB7IHN0ZXA6IE9iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuY29uZmlndXJlKHRoaXMuX2xvZ2dlciwgdGhpcy5fZmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgRXhjZXB0aW9uIGluc3RhbGxpbmcgcGlwZWxpbmUgc3RlcCAnJHtPYmplY3RIZWxwZXIuZ2V0Q2xhc3NOYW1lKHBpcGVsaW5lU3RlcCl9J2AsIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3RlcHMgfHwgc3RlcHMuaW5kZXhPZihcInVuZmluYWxpc2VcIikgPj0gMCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmVSZW1vdmUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBwaXBlbGluZVN0ZXAuZmluYWxpc2UodGhpcy5fbG9nZ2VyLCB0aGlzLl9maWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlcywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgRXhjZXB0aW9uIHVuZmluYWxpc2luZyBwaXBlbGluZSBzdGVwICcke09iamVjdEhlbHBlci5nZXRDbGFzc05hbWUocGlwZWxpbmVTdGVwKX0nYCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzdGVwcyB8fCBzdGVwcy5pbmRleE9mKFwiZmluYWxpc2VcIikgPj0gMCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwaXBlbGluZVN0ZXAgb2YgcGlwZWxpbmVBZGQpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9nSW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmluZm8oXCJGaW5hbGlzaW5nXCIsIHsgc3RlcDogT2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IHBpcGVsaW5lU3RlcC5maW5hbGlzZSh0aGlzLl9sb2dnZXIsIHRoaXMuX2ZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYEV4Y2VwdGlvbiBmaW5hbGlzaW5nIHBpcGVsaW5lIHN0ZXAgJyR7T2JqZWN0SGVscGVyLmdldENsYXNzTmFtZShwaXBlbGluZVN0ZXApfSdgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U3RlcDxUIGV4dGVuZHMgSVBpcGVsaW5lU3RlcD4ocGlwZWxpbmVLZXk6IFBpcGVsaW5lS2V5KTogVCB7XG4gICAgICAgIGlmIChwaXBlbGluZUtleSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5ICE9PSBudWxsICYmXG4gICAgICAgICAgICBwaXBlbGluZUtleS5jYXRlZ29yeSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5LmNhdGVnb3J5ICE9PSBudWxsICYmIHBpcGVsaW5lS2V5LmNhdGVnb3J5Lmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgIHBpcGVsaW5lS2V5LmtleSAhPT0gdW5kZWZpbmVkICYmIHBpcGVsaW5lS2V5LmtleSAhPT0gbnVsbCAmJiBwaXBlbGluZUtleS5rZXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgY29tYmluZWRLZXkgPSBwaXBlbGluZUtleS5jb21iaW5lZCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xvYWRlZFN0ZXBDYWNoZVtjb21iaW5lZEtleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHBlZE5hbWUgPSB0aGlzLl9tb2R1bGVJZE1hcFtjb21iaW5lZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKG1hcHBlZE5hbWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLl9sb2FkZWRTdGVwQ2FjaGVbbWFwcGVkTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gPFQ+dGhpcy5fbG9hZGVkU3RlcENhY2hlW21hcHBlZE5hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxUPnRoaXMuX2xvYWRlZFN0ZXBDYWNoZVtjb21iaW5lZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyB0cnlMb2FkKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBwaXBlbGluZUtleTogUGlwZWxpbmVLZXksIGNvbmZpZ3VyYXRpb25UeXBlPzogc3RyaW5nLCBkZWZpbmVQcm9wZXJ0eTogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKHBpcGVsaW5lS2V5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkgIT09IG51bGwgJiZcbiAgICAgICAgICAgIHBpcGVsaW5lS2V5LmNhdGVnb3J5ICE9PSB1bmRlZmluZWQgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkgIT09IG51bGwgJiYgcGlwZWxpbmVLZXkuY2F0ZWdvcnkubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICBjb25zdCBtb2R1bGVUeXBlSWQgPSBwaXBlbGluZUtleS5jb21iaW5lZCgpO1xuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9IHRoaXMuX21vZHVsZUlkTWFwW21vZHVsZVR5cGVJZF07XG5cbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbFR5cGUgPSBjb25maWd1cmF0aW9uVHlwZSA/IGNvbmZpZ3VyYXRpb25UeXBlIDogcGlwZWxpbmVLZXkuY2F0ZWdvcnk7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IFBpcGVsaW5lTG9jYXRvci5nZXRQaXBlbGluZUNhdGVnb3J5SXRlbXModGhpcy5fZmlsZVN5c3RlbSwgdGhpcy5fZW5naW5lUm9vdEZvbGRlciwgcGlwZWxpbmVLZXkuY2F0ZWdvcnkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwaXBlbGluZUtleS5rZXkgPT09IHVuZGVmaW5lZCB8fCBwaXBlbGluZUtleS5rZXkgPT09IG51bGwgfHwgcGlwZWxpbmVLZXkua2V5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9nZ2VyLmVycm9yKGAtLSR7YWN0dWFsVHlwZX0gc2hvdWxkIG5vdCBiZSBibGFuaywgcG9zc2libGUgb3B0aW9ucyBjb3VsZCBiZSBbJHtpdGVtcy5qb2luKFwiLCBcIil9XWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kdWxlSWRMb3dlciA9IHBpcGVsaW5lS2V5LmtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtc1tpXS50b0xvd2VyQ2FzZSgpID09PSBtb2R1bGVJZExvd2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IGF3YWl0IFBpcGVsaW5lTG9jYXRvci5sb2FkSXRlbSh0aGlzLl9maWxlU3lzdGVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZW5naW5lUm9vdEZvbGRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lS2V5LmNhdGVnb3J5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IE9iamVjdC5rZXlzKG1vZHVsZSlbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKG1vZHVsZVtjbGFzc05hbWVdLnByb3RvdHlwZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmluZVByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuaW5mbyhhY3R1YWxUeXBlLCB7IGNsYXNzTmFtZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh1bml0ZUNvbmZpZ3VyYXRpb24sIGFjdHVhbFR5cGUsIHsgdmFsdWU6IGNsYXNzTmFtZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZHVsZUNsYXNzTmFtZSA9IG5ldyBQaXBlbGluZUtleShwaXBlbGluZUtleS5jYXRlZ29yeSwgY2xhc3NOYW1lKS5jb21iaW5lZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2FkZWRTdGVwQ2FjaGVbbW9kdWxlQ2xhc3NOYW1lXSA9IG5ldyBpbnN0YW5jZS5jb25zdHJ1Y3RvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2R1bGVJZE1hcFttb2R1bGVUeXBlSWRdID0gbW9kdWxlQ2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFBpcGVsaW5lIFN0ZXAgJyR7cGlwZWxpbmVLZXkua2V5fScgZm9yIGFyZyAtLSR7YWN0dWFsVHlwZX0gY291bGQgbm90IGJlIGxvY2F0ZWQsIHBvc3NpYmxlIG9wdGlvbnMgY291bGQgYmUgWyR7aXRlbXMuam9pbihcIiwgXCIpfV1gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2dnZXIuZXJyb3IoYFBpcGVsaW5lIFN0ZXAgJyR7cGlwZWxpbmVLZXkua2V5fScgZm9yIGFyZyAtLSR7YWN0dWFsVHlwZX0gZmFpbGVkIHRvIGxvYWRgLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZ2dlci5lcnJvcihgUGlwZWxpbmUgU3RlcCBoYXMgYW4gaW52YWxpZCBrZXlgLCB1bmRlZmluZWQsIHBpcGVsaW5lS2V5KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
