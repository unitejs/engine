/**
 * Tests for YarnPackageManager.
 */
import * as Chai from "chai";
import * as Sinon from "sinon";
import { IFileSystem } from "unitejs-framework/dist/interfaces/IFileSystem";
import { ILogger } from "unitejs-framework/dist/interfaces/ILogger";
import { YarnPackageManager } from "../../../../dist/packageManagers/yarnPackageManager";
import { FileSystemMock } from "../fileSystem.mock";

describe("YarnPackageManager", () => {
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
        const obj = new YarnPackageManager(loggerStub, fileSystemStub);
        Chai.should().exist(obj);
    });
});
