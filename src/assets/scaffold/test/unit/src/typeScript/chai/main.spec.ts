/**
 * Tests for Main.
 */
import * as Chai from "chai";
import { entryPoint } from "../../../dist/main";

describe("Main", () => {
    it("should contain entryPoint", async(done) => {
        Chai.should().exist(entryPoint);
        done();
    });
});