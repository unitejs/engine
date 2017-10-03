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
/**
 * Tests for WebdriverIoCapabilities.
 */
const Chai = require("chai");
const webdriverIoCapabilities_1 = require("../../../../../../dist/configuration/models/webdriverIo/webdriverIoCapabilities");
describe("WebdriverIoCapabilities", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new webdriverIoCapabilities_1.WebdriverIoCapabilities();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvd2ViZHJpdmVyaW8vd2ViZHJpdmVySW9DYXBhYmlsaXRpZXMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0dBRUc7QUFDSCw2QkFBNkI7QUFDN0IsNEhBQXlIO0FBRXpILFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDckMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEdBQVEsRUFBRTtRQUMzQixNQUFNLEdBQUcsR0FBRyxJQUFJLGlEQUF1QixFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUEsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY29uZmlndXJhdGlvbi9tb2RlbHMvd2ViZHJpdmVyaW8vd2ViZHJpdmVySW9DYXBhYmlsaXRpZXMuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFdlYmRyaXZlcklvQ2FwYWJpbGl0aWVzLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgeyBXZWJkcml2ZXJJb0NhcGFiaWxpdGllcyB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvd2ViZHJpdmVySW8vd2ViZHJpdmVySW9DYXBhYmlsaXRpZXNcIjtcblxuZGVzY3JpYmUoXCJXZWJkcml2ZXJJb0NhcGFiaWxpdGllc1wiLCAoKSA9PiB7XG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCBhc3luYygpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gbmV3IFdlYmRyaXZlcklvQ2FwYWJpbGl0aWVzKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcbn0pO1xuIl19
