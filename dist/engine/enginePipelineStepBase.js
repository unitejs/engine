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
        display.log(message + ": " + this.arrayToReadable(args));
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
    copyFile(logger, display, fileSystem, sourceFolder, sourceFilename, destFolder, destFilename, replacer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log(logger, display, "Copying " + sourceFilename, { from: sourceFolder, to: destFolder });
            let lines = yield fileSystem.fileReadLines(sourceFolder, sourceFilename);
            if (replacer) {
                lines = lines.map(replacer);
            }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFJQSx1REFBb0Q7QUFPcEQ7SUFHVyxHQUFHLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsT0FBZSxFQUFFLElBQTJCO1FBQ3ZGLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLEtBQUssQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxPQUFlLEVBQUUsR0FBUSxFQUFFLElBQTJCO1FBQ25HLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDTixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsMkJBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDO0lBQ0wsQ0FBQztJQUVZLFFBQVEsQ0FBQyxNQUFlLEVBQUUsT0FBaUIsRUFBRSxVQUF1QixFQUMzRCxZQUFvQixFQUFFLGNBQXNCLEVBQUUsVUFBa0IsRUFBRSxZQUFvQixFQUFFLFFBQWlEOztZQUMzSixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxHQUFHLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFFL0YsSUFBSSxLQUFLLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUN6RSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLENBQUM7WUFDRCxNQUFNLFVBQVUsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRSxDQUFDO0tBQUE7SUFFTyxlQUFlLENBQUMsSUFBMkI7UUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNkLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFHLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFyQ0Qsd0RBcUNDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
