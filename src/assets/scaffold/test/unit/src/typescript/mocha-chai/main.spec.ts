/**
 * Tests for Main.
 */
import * as ChaiModule from "chai";
const Chai = (<any>ChaiModule).default || ChaiModule;
import { entryPoint } from "../../../src/main";

describe("Main", () => {
    it("should contain entryPoint", (done) => {
        Chai.should().exist(entryPoint);
        done();
    });
});