/**
 * Tests for App.
 */
import * as ChaiModule from "chai";
const Chai = (<any>ChaiModule).default || ChaiModule;
import { App } from "../../../src/app";

describe("App", () => {
    it("can be created", (done) => {
        const app = new App();
        Chai.should().exist(app);
        done();
    });
});