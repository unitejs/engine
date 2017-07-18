"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExceptionBase_1 = require("../interfaces/ExceptionBase");
const jsonHelper_1 = require("./jsonHelper");
const stringHelper_1 = require("./stringHelper");
/**
 * Handle errors as gracefully as possible
 */
class ErrorHandler {
    static format(err) {
        if (err === null || err === undefined) {
            return "unknown error";
        }
        else if (err instanceof ExceptionBase_1.ExceptionBase) {
            return err.toString();
        }
        else if (err instanceof Error) {
            return err.message;
        }
        else {
            if (stringHelper_1.StringHelper.isString(err)) {
                return err;
            }
            else {
                return jsonHelper_1.JsonHelper.stringify(err, "\t");
            }
        }
    }
}
exports.ErrorHandler = ErrorHandler;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlL2Vycm9ySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtEQUE0RDtBQUM1RCw2Q0FBMEM7QUFDMUMsaURBQThDO0FBQzlDOztHQUVHO0FBQ0g7SUFDVyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQVE7UUFDekIsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsZUFBZSxDQUFDO1FBQzNCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxZQUFZLDZCQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBRSxHQUFxQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFFLEdBQWEsQ0FBQyxPQUFPLENBQUM7UUFDbEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFDLENBQUMsMkJBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2YsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDM0MsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFoQkQsb0NBZ0JDIiwiZmlsZSI6ImNvcmUvZXJyb3JIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
