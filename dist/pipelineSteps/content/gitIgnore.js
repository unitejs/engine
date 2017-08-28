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
 * Pipeline step to generate .gitignore.
 */
const objectHelper_1 = require("unitejs-framework/dist/helpers/objectHelper");
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class GitIgnore extends enginePipelineStepBase_1.EnginePipelineStepBase {
    initialise(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Initialising ${GitIgnore.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
            if (!engineVariables.force) {
                try {
                    const exists = yield fileSystem.fileExists(engineVariables.wwwRootFolder, GitIgnore.FILENAME);
                    if (exists) {
                        this._ignore = yield fileSystem.fileReadLines(engineVariables.wwwRootFolder, GitIgnore.FILENAME);
                    }
                }
                catch (err) {
                    logger.error(`Reading existing ${GitIgnore.FILENAME} failed`, err);
                    return 1;
                }
            }
            this.configDefaults(engineVariables);
            return 0;
        });
    }
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, GitIgnore.FILENAME);
                if (hasGeneratedMarker === "FileNotExist" || hasGeneratedMarker === "HasMarker" || engineVariables.force) {
                    logger.info(`Generating ${GitIgnore.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                    this._ignore.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
                    yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, GitIgnore.FILENAME, this._ignore);
                }
                else {
                    logger.info(`Skipping ${GitIgnore.FILENAME} as it has no generated marker`);
                }
                return 0;
            }
            catch (err) {
                logger.error(`Generating ${GitIgnore.FILENAME} failed`, err);
                return 1;
            }
        });
    }
    configDefaults(engineVariables) {
        const defaultIgnore = [];
        this._ignore = objectHelper_1.ObjectHelper.merge(defaultIgnore, this._ignore);
        const markerLine = super.wrapGeneratedMarker("# ", "");
        const idx = this._ignore.indexOf(markerLine);
        if (idx >= 0) {
            this._ignore.splice(idx, 1);
        }
        for (let i = this._ignore.length - 1; i >= 0; i--) {
            if (this._ignore[i].trim().length === 0) {
                this._ignore.splice(i, 1);
            }
        }
        engineVariables.setConfiguration("GitIgnore", this._ignore);
    }
}
GitIgnore.FILENAME = ".gitignore";
exports.GitIgnore = GitIgnore;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvZ2l0SWdub3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDhFQUEyRTtBQUkzRSxnRkFBNkU7QUFHN0UsZUFBdUIsU0FBUSwrQ0FBc0I7SUFLcEMsVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOztZQUN0SSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFFaEcsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDO29CQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDOUYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDckcsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsU0FBUyxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNuRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNiLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUVyQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksSUFBSSxDQUFDO2dCQUNELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxnQ0FBNEIsWUFBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRTdILEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixLQUFLLGNBQWMsSUFBSSxrQkFBa0IsS0FBSyxXQUFXLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3ZHLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBRTlGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDZCQUF5QixZQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztvQkFFdkQsTUFBTSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JHLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLFNBQVMsQ0FBQyxRQUFRLGdDQUFnQyxDQUFDLENBQUM7Z0JBQ2hGLENBQUM7Z0JBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxTQUFTLENBQUMsUUFBUSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBO0lBRU8sY0FBYyxDQUFDLGVBQWdDO1FBQ25ELE1BQU0sYUFBYSxHQUFhLEVBQUUsQ0FBQztRQUVuQyxJQUFJLENBQUMsT0FBTyxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0QsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNoRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUIsQ0FBQztRQUNMLENBQUM7UUFFRCxlQUFlLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRSxDQUFDOztBQTlEYyxrQkFBUSxHQUFXLFlBQVksQ0FBQztBQURuRCw4QkFnRUMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L2dpdElnbm9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSAuZ2l0aWdub3JlLlxuICovXG5pbXBvcnQgeyBPYmplY3RIZWxwZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9oZWxwZXJzL29iamVjdEhlbHBlclwiO1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuXG5leHBvcnQgY2xhc3MgR2l0SWdub3JlIGV4dGVuZHMgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgRklMRU5BTUU6IHN0cmluZyA9IFwiLmdpdGlnbm9yZVwiO1xuXG4gICAgcHJpdmF0ZSBfaWdub3JlOiBzdHJpbmdbXTtcblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxvZ2dlci5pbmZvKGBJbml0aWFsaXNpbmcgJHtHaXRJZ25vcmUuRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyIH0pO1xuXG4gICAgICAgIGlmICghZW5naW5lVmFyaWFibGVzLmZvcmNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0cyA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZUV4aXN0cyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgR2l0SWdub3JlLkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lnbm9yZSA9IGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVJlYWRMaW5lcyhlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgR2l0SWdub3JlLkZJTEVOQU1FKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFJlYWRpbmcgZXhpc3RpbmcgJHtHaXRJZ25vcmUuRklMRU5BTUV9IGZhaWxlZGAsIGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlcyk7XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIHByb2Nlc3MobG9nZ2VyOiBJTG9nZ2VyLCBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbSwgdW5pdGVDb25maWd1cmF0aW9uOiBVbml0ZUNvbmZpZ3VyYXRpb24sIGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0dlbmVyYXRlZE1hcmtlciA9IGF3YWl0IHN1cGVyLmZpbGVIYXNHZW5lcmF0ZWRNYXJrZXIoZmlsZVN5c3RlbSwgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEdpdElnbm9yZS5GSUxFTkFNRSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNHZW5lcmF0ZWRNYXJrZXIgPT09IFwiRmlsZU5vdEV4aXN0XCIgfHwgaGFzR2VuZXJhdGVkTWFya2VyID09PSBcIkhhc01hcmtlclwiIHx8IGVuZ2luZVZhcmlhYmxlcy5mb3JjZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBHZW5lcmF0aW5nICR7R2l0SWdub3JlLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2lnbm9yZS5wdXNoKHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIjIFwiLCBcIlwiKSk7XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBmaWxlU3lzdGVtLmZpbGVXcml0ZUxpbmVzKGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBHaXRJZ25vcmUuRklMRU5BTUUsIHRoaXMuX2lnbm9yZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBTa2lwcGluZyAke0dpdElnbm9yZS5GSUxFTkFNRX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7R2l0SWdub3JlLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbmZpZ0RlZmF1bHRzKGVuZ2luZVZhcmlhYmxlczogRW5naW5lVmFyaWFibGVzKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRJZ25vcmU6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgdGhpcy5faWdub3JlID0gT2JqZWN0SGVscGVyLm1lcmdlKGRlZmF1bHRJZ25vcmUsIHRoaXMuX2lnbm9yZSk7XG5cbiAgICAgICAgY29uc3QgbWFya2VyTGluZSA9IHN1cGVyLndyYXBHZW5lcmF0ZWRNYXJrZXIoXCIjIFwiLCBcIlwiKTtcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5faWdub3JlLmluZGV4T2YobWFya2VyTGluZSk7XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgdGhpcy5faWdub3JlLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9pZ25vcmUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pZ25vcmVbaV0udHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lnbm9yZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbmdpbmVWYXJpYWJsZXMuc2V0Q29uZmlndXJhdGlvbihcIkdpdElnbm9yZVwiLCB0aGlzLl9pZ25vcmUpO1xuICAgIH1cbn1cbiJdfQ==
