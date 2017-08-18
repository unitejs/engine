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
const enginePipelineStepBase_1 = require("../../engine/enginePipelineStepBase");
class License extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info(`Generating ${License.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                const yearString = new Date().getFullYear().toString();
                const replaced = engineVariables.license.licenseText.replace(/<year>/gi, yearString);
                yield fileSystem.fileWriteText(engineVariables.wwwRootFolder, License.FILENAME, replaced);
                return 0;
            }
            catch (err) {
                logger.error(`Generating ${License.FILENAME} failed`, err);
                return 1;
            }
        });
    }
}
License.FILENAME = "LICENSE";
exports.License = License;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvbGljZW5zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsZ0ZBQTZFO0FBRzdFLGFBQXFCLFNBQVEsK0NBQXNCO0lBR2xDLE9BQU8sQ0FBQyxNQUFlLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7WUFDbkksSUFBSSxDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBQyxDQUFDLENBQUM7Z0JBRTNGLE1BQU0sVUFBVSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3ZELE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBRXJGLE1BQU0sVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTFGLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsT0FBTyxDQUFDLFFBQVEsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7S0FBQTs7QUFoQmMsZ0JBQVEsR0FBVyxTQUFTLENBQUM7QUFEaEQsMEJBa0JDIiwiZmlsZSI6InBpcGVsaW5lU3RlcHMvY29udGVudC9saWNlbnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIExJQ0VOU0UuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIExpY2Vuc2UgZXh0ZW5kcyBFbmdpbmVQaXBlbGluZVN0ZXBCYXNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBGSUxFTkFNRTogc3RyaW5nID0gXCJMSUNFTlNFXCI7XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzcyhsb2dnZXI6IElMb2dnZXIsIGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtLCB1bml0ZUNvbmZpZ3VyYXRpb246IFVuaXRlQ29uZmlndXJhdGlvbiwgZW5naW5lVmFyaWFibGVzOiBFbmdpbmVWYXJpYWJsZXMpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtMaWNlbnNlLkZJTEVOQU1FfWAsIHsgd3d3Rm9sZGVyOiBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlcn0pO1xuXG4gICAgICAgICAgICBjb25zdCB5ZWFyU3RyaW5nID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBjb25zdCByZXBsYWNlZCA9IGVuZ2luZVZhcmlhYmxlcy5saWNlbnNlLmxpY2Vuc2VUZXh0LnJlcGxhY2UoLzx5ZWFyPi9naSwgeWVhclN0cmluZyk7XG5cbiAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlVGV4dChlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgTGljZW5zZS5GSUxFTkFNRSwgcmVwbGFjZWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoYEdlbmVyYXRpbmcgJHtMaWNlbnNlLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
