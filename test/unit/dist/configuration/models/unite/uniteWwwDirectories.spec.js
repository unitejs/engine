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
 * Tests for UniteWwwDirectories.
 */
const Chai = require("chai");
const uniteWwwDirectories_1 = require("../../../../../../dist/configuration/models/unite/uniteWwwDirectories");
describe("UniteWwwDirectories", () => {
    it("can be created", () => __awaiter(this, void 0, void 0, function* () {
        const obj = new uniteWwwDirectories_1.UniteWwwDirectories();
        Chai.should().exist(obj);
    }));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVXd3dEaXJlY3Rvcmllcy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QiwrR0FBNEc7QUFFNUcsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBUSxFQUFFO1FBQzNCLE1BQU0sR0FBRyxHQUFHLElBQUkseUNBQW1CLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJjb25maWd1cmF0aW9uL21vZGVscy91bml0ZS91bml0ZVd3d0RpcmVjdG9yaWVzLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBVbml0ZVd3d0RpcmVjdG9yaWVzLlxuICovXG5pbXBvcnQgKiBhcyBDaGFpIGZyb20gXCJjaGFpXCI7XG5pbXBvcnQgeyBVbml0ZVd3d0RpcmVjdG9yaWVzIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uLy4uL2Rpc3QvY29uZmlndXJhdGlvbi9tb2RlbHMvdW5pdGUvdW5pdGVXd3dEaXJlY3Rvcmllc1wiO1xuXG5kZXNjcmliZShcIlVuaXRlV3d3RGlyZWN0b3JpZXNcIiwgKCkgPT4ge1xuICAgIGl0KFwiY2FuIGJlIGNyZWF0ZWRcIiwgYXN5bmMoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBVbml0ZVd3d0RpcmVjdG9yaWVzKCk7XG4gICAgICAgIENoYWkuc2hvdWxkKCkuZXhpc3Qob2JqKTtcbiAgICB9KTtcbn0pO1xuIl19
