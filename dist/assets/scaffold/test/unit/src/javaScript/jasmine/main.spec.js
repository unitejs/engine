/**
 * Tests for Main.
 */
import * as Jasmin from "jasmine";
import { entryPoint } from "../../../src/main";

describe("Main", () => {
    it("should contain entryPoint", (done) => {
        Chai.should().exist(entryPoint);
        done();
    });
});