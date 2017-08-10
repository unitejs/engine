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
class GitIgnore extends enginePipelineStepBase_1.EnginePipelineStepBase {
    process(logger, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.wwwRootFolder, GitIgnore.FILENAME);
                if (hasGeneratedMarker) {
                    logger.info(`Generating ${GitIgnore.FILENAME}`, { wwwFolder: engineVariables.wwwRootFolder });
                    if (uniteConfiguration.packageManager === "Npm" || uniteConfiguration.packageManager === "Yarn") {
                        engineVariables.gitIgnore.push("node_modules");
                    }
                    engineVariables.gitIgnore.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
                    yield fileSystem.fileWriteLines(engineVariables.wwwRootFolder, GitIgnore.FILENAME, engineVariables.gitIgnore);
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
}
GitIgnore.FILENAME = ".gitignore";
exports.GitIgnore = GitIgnore;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvZ2l0SWdub3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxnRkFBNkU7QUFHN0UsZUFBdUIsU0FBUSwrQ0FBc0I7SUFHcEMsT0FBTyxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDOzs7WUFDbkksSUFBSSxDQUFDO2dCQUNELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxnQ0FBNEIsWUFBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRTdILEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztvQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFDLENBQUMsQ0FBQztvQkFFN0YsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLEtBQUssSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDOUYsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ25ELENBQUM7b0JBQ0QsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsNkJBQXlCLFlBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO29CQUVwRSxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbEgsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksU0FBUyxDQUFDLFFBQVEsZ0NBQWdDLENBQUMsQ0FBQztnQkFDaEYsQ0FBQztnQkFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLFNBQVMsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDTCxDQUFDO0tBQUE7O0FBeEJjLGtCQUFRLEdBQVcsWUFBWSxDQUFDO0FBRG5ELDhCQTBCQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL2NvbnRlbnQvZ2l0SWdub3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQaXBlbGluZSBzdGVwIHRvIGdlbmVyYXRlIC5naXRpZ25vcmUuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvZW5naW5lUGlwZWxpbmVTdGVwQmFzZVwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcblxuZXhwb3J0IGNsYXNzIEdpdElnbm9yZSBleHRlbmRzIEVuZ2luZVBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcIi5naXRpZ25vcmVcIjtcblxuICAgIHB1YmxpYyBhc3luYyBwcm9jZXNzKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcyk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBoYXNHZW5lcmF0ZWRNYXJrZXIgPSBhd2FpdCBzdXBlci5maWxlSGFzR2VuZXJhdGVkTWFya2VyKGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyLCBHaXRJZ25vcmUuRklMRU5BTUUpO1xuXG4gICAgICAgICAgICBpZiAoaGFzR2VuZXJhdGVkTWFya2VyKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmluZm8oYEdlbmVyYXRpbmcgJHtHaXRJZ25vcmUuRklMRU5BTUV9YCwgeyB3d3dGb2xkZXI6IGVuZ2luZVZhcmlhYmxlcy53d3dSb290Rm9sZGVyfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodW5pdGVDb25maWd1cmF0aW9uLnBhY2thZ2VNYW5hZ2VyID09PSBcIk5wbVwiIHx8IHVuaXRlQ29uZmlndXJhdGlvbi5wYWNrYWdlTWFuYWdlciA9PT0gXCJZYXJuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLmdpdElnbm9yZS5wdXNoKFwibm9kZV9tb2R1bGVzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbmdpbmVWYXJpYWJsZXMuZ2l0SWdub3JlLnB1c2goc3VwZXIud3JhcEdlbmVyYXRlZE1hcmtlcihcIiMgXCIsIFwiXCIpKTtcblxuICAgICAgICAgICAgICAgIGF3YWl0IGZpbGVTeXN0ZW0uZmlsZVdyaXRlTGluZXMoZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsIEdpdElnbm9yZS5GSUxFTkFNRSwgZW5naW5lVmFyaWFibGVzLmdpdElnbm9yZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKGBTa2lwcGluZyAke0dpdElnbm9yZS5GSUxFTkFNRX0gYXMgaXQgaGFzIG5vIGdlbmVyYXRlZCBtYXJrZXJgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBHZW5lcmF0aW5nICR7R2l0SWdub3JlLkZJTEVOQU1FfSBmYWlsZWRgLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
