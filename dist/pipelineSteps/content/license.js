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
 * Pipeline step to generate LICENSE.
 */
const parameterValidation_1 = require("unitejs-framework/dist/helpers/parameterValidation");
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class License extends pipelineStepBase_1.PipelineStepBase {
    mainCondition(uniteConfiguration, engineVariables) {
        return !super.condition(uniteConfiguration.license, "None");
    }
    initialise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mainCondition) {
                try {
                    const licenseData = yield fileSystem.fileReadJson(engineVariables.engineAssetsFolder, License.FILENAME_SPDX);
                    if (!parameterValidation_1.ParameterValidation.checkOneOf(logger, "license", uniteConfiguration.license, Object.keys(licenseData), "does not match any of the possible SPDX license values (see https://spdx.org/licenses/).")) {
                        return 1;
                    }
                    else {
                        this._spdxLicense = licenseData[uniteConfiguration.license];
                    }
                }
                catch (e) {
                    logger.error(`There was a problem reading the ${License.FILENAME_SPDX} file`, e);
                    return 1;
                }
            }
            return 0;
        });
    }
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleText").call(this, logger, fileSystem, engineVariables.wwwRootFolder, License.FILENAME, true, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
                const yearString = new Date().getFullYear()
                    .toString();
                return this._spdxLicense.licenseText.replace(/<year>/gi, yearString);
            }));
        });
    }
}
License.FILENAME = "LICENSE";
License.FILENAME_SPDX = "spdx-full.json";
exports.License = License;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvbGljZW5zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw0RkFBeUY7QUFPekYsb0VBQWlFO0FBRWpFLGFBQXFCLFNBQVEsbUNBQWdCO0lBTWxDLGFBQWEsQ0FBQyxrQkFBc0MsRUFBRSxlQUFnQztRQUN6RixNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRVksVUFBVSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7O1lBQzlKLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQztvQkFDRCxNQUFNLFdBQVcsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLENBQVEsZUFBZSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDcEgsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBbUIsQ0FBQyxVQUFVLENBQVMsTUFBTSxFQUNOLFNBQVMsRUFDVCxrQkFBa0IsQ0FBQyxPQUFPLEVBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQ3hCLDBGQUEwRixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0SSxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNiLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2hFLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLE9BQU8sQ0FBQyxhQUFhLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDakYsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDYixDQUFDO1lBQ0wsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsTUFBZSxFQUFFLFVBQXVCLEVBQUUsa0JBQXNDLEVBQUUsZUFBZ0MsRUFBRSxhQUFzQjs7O1lBQzVKLE1BQU0sQ0FBQyx3QkFBb0IsWUFBQyxNQUFNLEVBQ04sVUFBVSxFQUNWLGVBQWUsQ0FBQyxhQUFhLEVBQzdCLE9BQU8sQ0FBQyxRQUFRLEVBQ2hCLElBQUksRUFDSixhQUFhLEVBQ2IsR0FBUSxFQUFFO2dCQUNsQyxNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtxQkFDYixRQUFRLEVBQUUsQ0FBQztnQkFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFBLEVBQUU7UUFDUCxDQUFDO0tBQUE7O0FBM0N1QixnQkFBUSxHQUFXLFNBQVMsQ0FBQztBQUM3QixxQkFBYSxHQUFXLGdCQUFnQixDQUFDO0FBRnJFLDBCQTZDQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvbGljZW5zZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBMSUNFTlNFLlxuICovXG5pbXBvcnQgeyBQYXJhbWV0ZXJWYWxpZGF0aW9uIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaGVscGVycy9wYXJhbWV0ZXJWYWxpZGF0aW9uXCI7XG5pbXBvcnQgeyBJRmlsZVN5c3RlbSB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUZpbGVTeXN0ZW1cIjtcbmltcG9ydCB7IElMb2dnZXIgfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lMb2dnZXJcIjtcbmltcG9ydCB7IElTcGR4IH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3NwZHgvSVNwZHhcIjtcbmltcG9ydCB7IElTcGR4TGljZW5zZSB9IGZyb20gXCIuLi8uLi9jb25maWd1cmF0aW9uL21vZGVscy9zcGR4L0lTcGR4TGljZW5zZVwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIExpY2Vuc2UgZXh0ZW5kcyBQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBGSUxFTkFNRTogc3RyaW5nID0gXCJMSUNFTlNFXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRklMRU5BTUVfU1BEWDogc3RyaW5nID0gXCJzcGR4LWZ1bGwuanNvblwiO1xuXG4gICAgcHJpdmF0ZSBfc3BkeExpY2Vuc2U6IElTcGR4TGljZW5zZTtcblxuICAgIHB1YmxpYyBtYWluQ29uZGl0aW9uKHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gIXN1cGVyLmNvbmRpdGlvbih1bml0ZUNvbmZpZ3VyYXRpb24ubGljZW5zZSwgXCJOb25lXCIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBpbml0aWFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGlmIChtYWluQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpY2Vuc2VEYXRhID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZEpzb248SVNwZHg+KGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIExpY2Vuc2UuRklMRU5BTUVfU1BEWCk7XG4gICAgICAgICAgICAgICAgaWYgKCFQYXJhbWV0ZXJWYWxpZGF0aW9uLmNoZWNrT25lT2Y8c3RyaW5nPihsb2dnZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImxpY2Vuc2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRlQ29uZmlndXJhdGlvbi5saWNlbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMobGljZW5zZURhdGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkb2VzIG5vdCBtYXRjaCBhbnkgb2YgdGhlIHBvc3NpYmxlIFNQRFggbGljZW5zZSB2YWx1ZXMgKHNlZSBodHRwczovL3NwZHgub3JnL2xpY2Vuc2VzLykuXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NwZHhMaWNlbnNlID0gbGljZW5zZURhdGFbdW5pdGVDb25maWd1cmF0aW9uLmxpY2Vuc2VdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoYFRoZXJlIHdhcyBhIHByb2JsZW0gcmVhZGluZyB0aGUgJHtMaWNlbnNlLkZJTEVOQU1FX1NQRFh9IGZpbGVgLCBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBmaW5hbGlzZShsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMsIG1haW5Db25kaXRpb246IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuZmlsZVRvZ2dsZVRleHQobG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVN5c3RlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTGljZW5zZS5GSUxFTkFNRSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB5ZWFyU3RyaW5nID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NwZHhMaWNlbnNlLmxpY2Vuc2VUZXh0LnJlcGxhY2UoLzx5ZWFyPi9naSwgeWVhclN0cmluZyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
