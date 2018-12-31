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
const pipelineStepBase_1 = require("../../engine/pipelineStepBase");
class OutputDirectory extends pipelineStepBase_1.PipelineStepBase {
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = Object.create(null, {
            folderToggle: { get: () => super.folderToggle }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield _super.folderToggle.call(this, logger, fileSystem, engineVariables.rootFolder, engineVariables.force, mainCondition);
            if (ret === 0) {
                ret = yield _super.folderToggle.call(this, logger, fileSystem, engineVariables.wwwRootFolder, engineVariables.force, mainCondition);
                if (ret === 0) {
                    ret = yield _super.folderToggle.call(this, logger, fileSystem, engineVariables.packagedRootFolder, engineVariables.force, mainCondition);
                }
            }
            return ret;
        });
    }
}
exports.OutputDirectory = OutputDirectory;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL3NjYWZmb2xkL291dHB1dERpcmVjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBT0Esb0VBQWlFO0FBRWpFLE1BQWEsZUFBZ0IsU0FBUSxtQ0FBZ0I7SUFDcEMsUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7Ozs7O1lBQzVKLElBQUksR0FBRyxHQUFHLE1BQU0sT0FBTSxZQUFZLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFFekgsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO2dCQUNYLEdBQUcsR0FBRyxNQUFNLE9BQU0sWUFBWSxZQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUV4SCxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7b0JBQ1gsR0FBRyxHQUFHLE1BQU0sT0FBTSxZQUFZLFlBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsa0JBQWtCLEVBQUUsZUFBZSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztpQkFDaEk7YUFDSjtZQUVELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0NBQ0o7QUFkRCwwQ0FjQyIsImZpbGUiOiJwaXBlbGluZVN0ZXBzL3NjYWZmb2xkL291dHB1dERpcmVjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBjcmVhdGUgb3V0cHV0IGRpcmVjdG9yeS5cbiAqL1xuaW1wb3J0IHsgSUZpbGVTeXN0ZW0gfSBmcm9tIFwidW5pdGVqcy1mcmFtZXdvcmsvZGlzdC9pbnRlcmZhY2VzL0lGaWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBJTG9nZ2VyIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JTG9nZ2VyXCI7XG5pbXBvcnQgeyBVbml0ZUNvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi4vLi4vY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVDb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBFbmdpbmVWYXJpYWJsZXMgfSBmcm9tIFwiLi4vLi4vZW5naW5lL2VuZ2luZVZhcmlhYmxlc1wiO1xuaW1wb3J0IHsgUGlwZWxpbmVTdGVwQmFzZSB9IGZyb20gXCIuLi8uLi9lbmdpbmUvcGlwZWxpbmVTdGVwQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgT3V0cHV0RGlyZWN0b3J5IGV4dGVuZHMgUGlwZWxpbmVTdGVwQmFzZSB7XG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBzdXBlci5mb2xkZXJUb2dnbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMucm9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICBpZiAocmV0ID09PSAwKSB7XG4gICAgICAgICAgICByZXQgPSBhd2FpdCBzdXBlci5mb2xkZXJUb2dnbGUobG9nZ2VyLCBmaWxlU3lzdGVtLCBlbmdpbmVWYXJpYWJsZXMud3d3Um9vdEZvbGRlciwgZW5naW5lVmFyaWFibGVzLmZvcmNlLCBtYWluQ29uZGl0aW9uKTtcblxuICAgICAgICAgICAgaWYgKHJldCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldCA9IGF3YWl0IHN1cGVyLmZvbGRlclRvZ2dsZShsb2dnZXIsIGZpbGVTeXN0ZW0sIGVuZ2luZVZhcmlhYmxlcy5wYWNrYWdlZFJvb3RGb2xkZXIsIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSwgbWFpbkNvbmRpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbn1cbiJdfQ==
