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
class EnginePipelineStepBase {
    log(logger, display, message, args) {
        display.log(message, args);
        logger.log(message, args);
    }
    error(logger, display, message, err, args) {
        display.error(message, err, args);
        logger.error(message, args);
    }
    copyFile(logger, display, fileSystem, sourceFolder, sourceFilename, destFolder, destFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(logger, display, "Copying " + sourceFilename, { from: sourceFolder, to: destFolder });
            const lines = yield fileSystem.fileReadLines(sourceFolder, sourceFilename);
            yield fileSystem.fileWriteLines(destFolder, destFilename, lines);
        });
    }
}
exports.EnginePipelineStepBase = EnginePipelineStepBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFVQTtJQUdXLEdBQUcsQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxPQUFlLEVBQUUsSUFBMkI7UUFDdkYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLEtBQUssQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxPQUFlLEVBQUUsR0FBUSxFQUFFLElBQTJCO1FBQ25HLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQzNELFlBQW9CLEVBQUUsY0FBc0IsRUFBRSxVQUFrQixFQUFFLFlBQW9COztZQUN4RyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxHQUFHLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFFL0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUMzRSxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRSxDQUFDO0tBQUE7Q0FDSjtBQXBCRCx3REFvQkMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
