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
    process(logger, display, fileSystem, uniteConfiguration, engineVariables) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasGeneratedMarker = yield _super("fileHasGeneratedMarker").call(this, fileSystem, engineVariables.rootFolder, GitIgnore.FILENAME);
                if (hasGeneratedMarker) {
                    _super("log").call(this, logger, display, `Writing ${GitIgnore.FILENAME}`);
                    engineVariables.gitIgnore.push("node_modules");
                    engineVariables.gitIgnore.push(_super("wrapGeneratedMarker").call(this, "# ", ""));
                    yield fileSystem.fileWriteLines(engineVariables.rootFolder, GitIgnore.FILENAME, engineVariables.gitIgnore);
                }
                else {
                    _super("log").call(this, logger, display, `Skipping ${GitIgnore.FILENAME} as it has no generated marker`);
                }
                return 0;
            }
            catch (err) {
                _super("error").call(this, logger, display, `Writing ${GitIgnore.FILENAME} failed`, err);
                return 1;
            }
        });
    }
}
GitIgnore.FILENAME = ".gitignore";
exports.GitIgnore = GitIgnore;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpcGVsaW5lU3RlcHMvY29udGVudC9naXRJZ25vcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLGdGQUE2RTtBQU03RSxlQUF1QixTQUFRLCtDQUFzQjtJQUdwQyxPQUFPLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsVUFBdUIsRUFBRSxrQkFBc0MsRUFBRSxlQUFnQzs7O1lBQ3RKLElBQUksQ0FBQztnQkFDRCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sZ0NBQTRCLFlBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUUxSCxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLGFBQVMsWUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFO29CQUU1RCxlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDL0MsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsNkJBQXlCLFlBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDO29CQUVwRSxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDL0csQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixhQUFTLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxZQUFZLFNBQVMsQ0FBQyxRQUFRLGdDQUFnQyxFQUFFO2dCQUMvRixDQUFDO2dCQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDWCxlQUFXLFlBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLFNBQVMsQ0FBQyxRQUFRLFNBQVMsRUFBRSxHQUFHLEVBQUU7Z0JBQzFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBQ0wsQ0FBQztLQUFBOztBQXRCYyxrQkFBUSxHQUFXLFlBQVksQ0FBQztBQURuRCw4QkF3QkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L2dpdElnbm9yZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
