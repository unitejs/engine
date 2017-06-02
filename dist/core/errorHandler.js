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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvZXJyb3JIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0RBQTREO0FBQzVELDZDQUEwQztBQUMxQyxpREFBOEM7QUFDOUM7O0dBRUc7QUFDSDtJQUNXLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBUTtRQUN6QixFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFDM0IsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFlBQVksNkJBQWEsQ0FBQyxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFFLEdBQXFCLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0MsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUUsR0FBYSxDQUFDLE9BQU8sQ0FBQztRQUNsQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixFQUFFLENBQUMsQ0FBQywyQkFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDZixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLHVCQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQWhCRCxvQ0FnQkMiLCJmaWxlIjoiY29yZS9lcnJvckhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiLi4vc3JjIn0=
