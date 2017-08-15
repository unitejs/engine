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
 * Tests for WebdriverIoConfiguration.
 */
const Chai = require("chai");
const webdriverIoConfiguration_1 = require("../../../../../../dist/configuration/models/webdriverIo/webdriverIoConfiguration");
describe("WebdriverIoConfiguration", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new webdriverIoConfiguration_1.WebdriverIoConfiguration();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvd2ViZHJpdmVyaW8vd2ViZHJpdmVySW9Db25maWd1cmF0aW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztHQUVHO0FBQ0gsNkJBQTZCO0FBQzdCLCtIQUE0SDtBQUU1SCxRQUFRLENBQUMsMEJBQTBCLEVBQUU7SUFDakMsRUFBRSxDQUFDLGdCQUFnQixFQUFFO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLElBQUksbURBQXdCLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJjb25maWd1cmF0aW9uL21vZGVscy93ZWJkcml2ZXJpby93ZWJkcml2ZXJJb0NvbmZpZ3VyYXRpb24uc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVzdHMgZm9yIFdlYmRyaXZlcklvQ29uZmlndXJhdGlvbi5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0IHsgV2ViZHJpdmVySW9Db25maWd1cmF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uLy4uL2Rpc3QvY29uZmlndXJhdGlvbi9tb2RlbHMvd2ViZHJpdmVySW8vd2ViZHJpdmVySW9Db25maWd1cmF0aW9uXCI7XG5cbmRlc2NyaWJlKFwiV2ViZHJpdmVySW9Db25maWd1cmF0aW9uXCIsICgpID0+IHtcbiAgICBpdChcImNhbiBiZSBjcmVhdGVkXCIsIGFzeW5jKCkgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSBuZXcgV2ViZHJpdmVySW9Db25maWd1cmF0aW9uKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcbn0pO1xuIl19
