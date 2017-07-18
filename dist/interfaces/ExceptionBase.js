"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for exceptions.
 */
const objectHelper_1 = require("../core/objectHelper");
class ExceptionBase {
    constructor(context, reference, message, parameters, data) {
        this.context = objectHelper_1.ObjectHelper.getClassName(context);
        this.reference = reference;
        this.message = message;
        this.parameters = parameters;
        if (data instanceof ExceptionBase) {
            this.innerException = data;
        }
        else {
            this.data = data;
        }
        let stack = "";
        if (this.data && this.data.stack) {
            stack = this.data.stack;
        }
        else {
            stack = new Error("").stack;
        }
        if (stack) {
            this.stackTrace = stack.split("\n");
            if (stack.length > 3) {
                this.stackTrace = this.stackTrace.slice(3);
            }
        }
    }
    static exceptionToStringInternal(baseException) {
        const parts = [];
        if (baseException.context && baseException.reference) {
            parts.push(objectHelper_1.ObjectHelper.getClassName(baseException.context) + "::" + baseException.reference);
        }
        if (baseException.message) {
            parts.push(ExceptionBase.substituteParameters(baseException.message, baseException.parameters));
        }
        if (baseException.data) {
            if (baseException.data.message) {
                parts.push(baseException.data.message);
            }
            else {
                parts.push(JSON.stringify(baseException.data));
            }
        }
        if (baseException.stackTrace) {
            baseException.stackTrace.forEach(st => {
                parts.push(st);
            });
        }
        if (baseException.innerException) {
            parts.push("-----------------------------------------------------------------");
            parts.push(this.exceptionToStringInternal(baseException.innerException));
        }
        return parts.join("\r\n\r\n");
    }
    static substituteParameters(message, parameters) {
        return message && parameters ? message.replace(/{(\d+)}/g, (match, idx) => {
            return parameters[idx];
        }) : message;
    }
    toString() {
        return ExceptionBase.exceptionToStringInternal(this);
    }
}
exports.ExceptionBase = ExceptionBase;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbnRlcmZhY2VzL0V4Y2VwdGlvbkJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILHVEQUFvRDtBQUVwRDtJQVVJLFlBQVksT0FBWSxFQUFFLFNBQWlCLEVBQUUsT0FBZSxFQUFFLFVBQWlCLEVBQUUsSUFBUztRQUN0RixJQUFJLENBQUMsT0FBTyxHQUFHLDJCQUFZLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBRTdCLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7UUFFRCxJQUFJLEtBQUssR0FBdUIsRUFBRSxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM1QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2hDLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1IsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXBDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFTyxNQUFNLENBQUMseUJBQXlCLENBQUMsYUFBNEI7UUFDakUsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBRTNCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLElBQUksYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsS0FBSyxDQUFDLElBQUksQ0FBQywyQkFBWSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsRyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNwRyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckIsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0MsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRCxDQUFDO1FBQ0wsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzNCLGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsS0FBSyxDQUFDLElBQUksQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO1lBQ2hGLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU8sTUFBTSxDQUFDLG9CQUFvQixDQUFDLE9BQWUsRUFBRSxVQUFpQjtRQUNsRSxNQUFNLENBQUMsT0FBTyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHO1lBQ2xFLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxRQUFRO1FBQ1gsTUFBTSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBQ0o7QUEvRUQsc0NBK0VDIiwiZmlsZSI6ImludGVyZmFjZXMvRXhjZXB0aW9uQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi9zcmMifQ==
