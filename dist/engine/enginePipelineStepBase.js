"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../core/errorHandler");
class EnginePipelineStepBase {
    log(logger, display, message, args) {
        const objKeys = Object.keys(args);
        display.log(message + ": " + (objKeys.length === 0 ? "" : (objKeys.length === 1 ? args[objKeys[0]] : JSON.stringify(args))));
        logger.log(message, args);
    }
    error(logger, display, message, err, args) {
        display.error(message + ": " + errorHandler_1.ErrorHandler.format(err));
        logger.exception(message, err, args);
    }
}
exports.EnginePipelineStepBase = EnginePipelineStepBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS9lbmdpbmVQaXBlbGluZVN0ZXBCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsdURBQW9EO0FBT3BEO0lBR1csR0FBRyxDQUFDLE1BQWUsRUFBRSxPQUFpQixFQUFFLE9BQWUsRUFBRSxJQUEwQjtRQUN0RixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdILE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxLQUFLLENBQUMsTUFBZSxFQUFFLE9BQWlCLEVBQUUsT0FBZSxFQUFFLEdBQVEsRUFBRSxJQUEwQjtRQUNsRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsMkJBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNKO0FBYkQsd0RBYUMiLCJmaWxlIjoiZW5naW5lL2VuZ2luZVBpcGVsaW5lU3RlcEJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
