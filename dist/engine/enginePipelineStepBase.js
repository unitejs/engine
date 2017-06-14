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
const errorHandler_1 = require("../core/errorHandler");
class EnginePipelineStepBase {
    log(logger, display, message, args) {
        display.log(message, this.arrayToReadable(args));
        logger.log(message, args);
    }
    error(logger, display, message, err, args) {
        if (err) {
            display.error(message + ": " + errorHandler_1.ErrorHandler.format(err));
            logger.exception(message, err, args);
        }
        else {
            display.error(message + ": " + this.arrayToReadable(args));
            logger.error(message, args);
        }
    }
    copyFile(logger, display, fileSystem, sourceFolder, sourceFilename, destFolder, destFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(logger, display, "Copying " + sourceFilename, { from: sourceFolder, to: destFolder });
            const lines = yield fileSystem.fileReadLines(sourceFolder, sourceFilename);
            yield fileSystem.fileWriteLines(destFolder, destFilename, lines);
        });
    }
    arrayToReadable(args) {
        if (!args) {
            return "";
        }
        else {
            const objKeys = Object.keys(args);
            return (objKeys.length === 0 ? "" : (objKeys.length === 1 ? args[objKeys[0]] : JSON.stringify(args)));
        }
    }
}
exports.EnginePipelineStepBase = EnginePipelineStepBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSx1REFBb0Q7QUFPcEQ7SUFHVyxHQUFHLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsT0FBZSxFQUFFLElBQTJCO1FBQ3ZGLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sS0FBSyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLE9BQWUsRUFBRSxHQUFRLEVBQUUsSUFBMkI7UUFDbkcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRywyQkFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDTCxDQUFDO0lBRVksUUFBUSxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLFVBQXVCLEVBQzNELFlBQW9CLEVBQUUsY0FBc0IsRUFBRSxVQUFrQixFQUFFLFlBQW9COztZQUN4RyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxHQUFHLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFFL0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUMzRSxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRSxDQUFDO0tBQUE7SUFFTyxlQUFlLENBQUMsSUFBMkI7UUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNkLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFHLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFsQ0Qsd0RBa0NDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
