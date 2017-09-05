"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for PipelineKey.
 */
const Chai = require("chai");
const pipelineKey_1 = require("../../../../dist/engine/pipelineKey");
describe("PipelineKey", () => {
    it("can be created", () => {
        const obj = new pipelineKey_1.PipelineKey("1", "2");
        Chai.should().exist(obj);
        Chai.expect(obj.category).to.be.equal("1");
        Chai.expect(obj.key).to.be.equal("2");
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvdW5pdC9zcmMvZW5naW5lL3BpcGVsaW5lS2V5LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILDZCQUE2QjtBQUM3QixxRUFBa0U7QUFFbEUsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUNwQixFQUFFLENBQUMsZ0JBQWdCLEVBQUU7UUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSx5QkFBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZW5naW5lL3BpcGVsaW5lS2V5LnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRlc3RzIGZvciBQaXBlbGluZUtleS5cbiAqL1xuaW1wb3J0ICogYXMgQ2hhaSBmcm9tIFwiY2hhaVwiO1xuaW1wb3J0IHsgUGlwZWxpbmVLZXkgfSBmcm9tIFwiLi4vLi4vLi4vLi4vZGlzdC9lbmdpbmUvcGlwZWxpbmVLZXlcIjtcblxuZGVzY3JpYmUoXCJQaXBlbGluZUtleVwiLCAoKSA9PiB7XG4gICAgaXQoXCJjYW4gYmUgY3JlYXRlZFwiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IG5ldyBQaXBlbGluZUtleShcIjFcIiwgXCIyXCIpO1xuICAgICAgICBDaGFpLnNob3VsZCgpLmV4aXN0KG9iaik7XG4gICAgICAgIENoYWkuZXhwZWN0KG9iai5jYXRlZ29yeSkudG8uYmUuZXF1YWwoXCIxXCIpO1xuICAgICAgICBDaGFpLmV4cGVjdChvYmoua2V5KS50by5iZS5lcXVhbChcIjJcIik7XG4gICAgfSk7XG59KTtcbiJdfQ==
