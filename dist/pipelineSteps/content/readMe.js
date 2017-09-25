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
class ReadMe extends pipelineStepBase_1.PipelineStepBase {
    finalise(logger, fileSystem, uniteConfiguration, engineVariables, mainCondition) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("fileToggleLines").call(this, logger, fileSystem, engineVariables.wwwRootFolder, ReadMe.FILENAME, engineVariables.force, mainCondition, () => __awaiter(this, void 0, void 0, function* () {
                const lines = yield fileSystem.fileReadLines(engineVariables.engineAssetsFolder, ReadMe.FILENAME);
                lines.unshift("");
                lines.unshift(`# ${uniteConfiguration.title}`);
                lines.push("---");
                lines.push(_super("wrapGeneratedMarker").call(this, "*", "* :zap:"));
                return lines;
            }));
        });
    }
}
ReadMe.FILENAME = "README.md";
exports.ReadMe = ReadMe;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZVN0ZXBzL2NvbnRlbnQvcmVhZE1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxvRUFBaUU7QUFFakUsWUFBb0IsU0FBUSxtQ0FBZ0I7SUFHM0IsUUFBUSxDQUFDLE1BQWUsRUFBRSxVQUF1QixFQUFFLGtCQUFzQyxFQUFFLGVBQWdDLEVBQUUsYUFBc0I7OztZQUM1SixNQUFNLENBQUMseUJBQXFCLFlBQUMsTUFBTSxFQUNOLFVBQVUsRUFDVixlQUFlLENBQUMsYUFBYSxFQUM3QixNQUFNLENBQUMsUUFBUSxFQUNmLGVBQWUsQ0FBQyxLQUFLLEVBQ3JCLGFBQWEsRUFDYjtnQkFDekIsTUFBTSxLQUFLLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRWxHLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xCLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUUvQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLDZCQUF5QixZQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQztnQkFFdEQsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDLENBQUEsRUFBRTtRQUNQLENBQUM7S0FBQTs7QUFwQmMsZUFBUSxHQUFXLFdBQVcsQ0FBQztBQURsRCx3QkFzQkMiLCJmaWxlIjoicGlwZWxpbmVTdGVwcy9jb250ZW50L3JlYWRNZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGlwZWxpbmUgc3RlcCB0byBnZW5lcmF0ZSBSRUFETUUubWQuXG4gKi9cbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSBcInVuaXRlanMtZnJhbWV3b3JrL2Rpc3QvaW50ZXJmYWNlcy9JRmlsZVN5c3RlbVwiO1xuaW1wb3J0IHsgSUxvZ2dlciB9IGZyb20gXCJ1bml0ZWpzLWZyYW1ld29yay9kaXN0L2ludGVyZmFjZXMvSUxvZ2dlclwiO1xuaW1wb3J0IHsgVW5pdGVDb25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbmZpZ3VyYXRpb24vbW9kZWxzL3VuaXRlL3VuaXRlQ29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRW5naW5lVmFyaWFibGVzIH0gZnJvbSBcIi4uLy4uL2VuZ2luZS9lbmdpbmVWYXJpYWJsZXNcIjtcbmltcG9ydCB7IFBpcGVsaW5lU3RlcEJhc2UgfSBmcm9tIFwiLi4vLi4vZW5naW5lL3BpcGVsaW5lU3RlcEJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFJlYWRNZSBleHRlbmRzIFBpcGVsaW5lU3RlcEJhc2Uge1xuICAgIHByaXZhdGUgc3RhdGljIEZJTEVOQU1FOiBzdHJpbmcgPSBcIlJFQURNRS5tZFwiO1xuXG4gICAgcHVibGljIGFzeW5jIGZpbmFsaXNlKGxvZ2dlcjogSUxvZ2dlciwgZmlsZVN5c3RlbTogSUZpbGVTeXN0ZW0sIHVuaXRlQ29uZmlndXJhdGlvbjogVW5pdGVDb25maWd1cmF0aW9uLCBlbmdpbmVWYXJpYWJsZXM6IEVuZ2luZVZhcmlhYmxlcywgbWFpbkNvbmRpdGlvbjogYm9vbGVhbik6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiBzdXBlci5maWxlVG9nZ2xlTGluZXMobG9nZ2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lVmFyaWFibGVzLnd3d1Jvb3RGb2xkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhZE1lLkZJTEVOQU1FLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZVZhcmlhYmxlcy5mb3JjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluQ29uZGl0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gYXdhaXQgZmlsZVN5c3RlbS5maWxlUmVhZExpbmVzKGVuZ2luZVZhcmlhYmxlcy5lbmdpbmVBc3NldHNGb2xkZXIsIFJlYWRNZS5GSUxFTkFNRSk7XG5cbiAgICAgICAgICAgIGxpbmVzLnVuc2hpZnQoXCJcIik7XG4gICAgICAgICAgICBsaW5lcy51bnNoaWZ0KGAjICR7dW5pdGVDb25maWd1cmF0aW9uLnRpdGxlfWApO1xuXG4gICAgICAgICAgICBsaW5lcy5wdXNoKFwiLS0tXCIpO1xuICAgICAgICAgICAgbGluZXMucHVzaChzdXBlci53cmFwR2VuZXJhdGVkTWFya2VyKFwiKlwiLCBcIiogOnphcDpcIikpO1xuXG4gICAgICAgICAgICByZXR1cm4gbGluZXM7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
