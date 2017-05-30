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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyZmFjZXMvRXhjZXB0aW9uQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0gsdURBQW9EO0FBRXBEO0lBVUksWUFBWSxPQUFZLEVBQUUsU0FBaUIsRUFBRSxPQUFlLEVBQUUsVUFBaUIsRUFBRSxJQUFTO1FBQ3RGLElBQUksQ0FBQyxPQUFPLEdBQUcsMkJBQVksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFFN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDL0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztRQUVELElBQUksS0FBSyxHQUF1QixFQUFFLENBQUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDL0IsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzVCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDaEMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDUixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVPLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxhQUE0QjtRQUNqRSxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7UUFFM0IsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sSUFBSSxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLDJCQUFZLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xHLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN4QixLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3BHLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25ELENBQUM7UUFDTCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0IsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDL0IsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLG1FQUFtRSxDQUFDLENBQUM7WUFDaEYsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTyxNQUFNLENBQUMsb0JBQW9CLENBQUMsT0FBZSxFQUFFLFVBQWlCO1FBQ2xFLE1BQU0sQ0FBQyxPQUFPLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUc7WUFDbEUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVNLFFBQVE7UUFDWCxNQUFNLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDSjtBQS9FRCxzQ0ErRUMiLCJmaWxlIjoiaW50ZXJmYWNlcy9FeGNlcHRpb25CYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
