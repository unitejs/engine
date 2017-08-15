/**
 * Tests for NpmPackageManager.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { NpmPackageManager } from "../../../../dist/packageManagers/npmPackageManager";
import { FileSystemMock } from "../fileSystem.mock";

describe("NpmPackageManager", () => {
    let sandbox: Sinon.SinonSandbox;
    let loggerStub: ILogger;
    let fileSystemStub: IFileSystem;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        loggerStub = <ILogger>{};

        fileSystemStub = new FileSystemMock();
    });

    afterEach(async () => {
        sandbox.restore();
    });

    it("can be created", async() => {
        const obj = new NpmPackageManager(loggerStub, fileSystemStub);
        Chai.should().exist(obj);
    });
});
