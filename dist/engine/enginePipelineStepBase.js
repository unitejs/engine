"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../core/errorHandler");
class EnginePipelineStepBase {
    log(logger, display, message, args) {
        const objKeys = Object.keys(args);
        display.log(message + ": " + (objKeys.length === 1 ? args[objKeys[0]] : JSON.stringify(args)));
        logger.log(message, args);
    }
    error(logger, display, message, err, args) {
        display.error(message + ": " + errorHandler_1.ErrorHandler.format(err));
        logger.exception(message, err, args);
    }
}
exports.EnginePipelineStepBase = EnginePipelineStepBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsdURBQW9EO0FBTXBEO0lBR1csR0FBRyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLE9BQWUsRUFBRSxJQUEwQjtRQUN0RixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRixNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU0sS0FBSyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLE9BQWUsRUFBRSxHQUFRLEVBQUUsSUFBMEI7UUFDbEcsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLDJCQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FDSjtBQWJELHdEQWFDIiwiZmlsZSI6ImVuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
