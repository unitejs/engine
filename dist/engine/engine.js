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
 * Main engine
 */
const packageConfiguration_1 = require("../configuration/models/packages/packageConfiguration");
const uniteLanguage_1 = require("../configuration/models/unite/uniteLanguage");
const enumEx_1 = require("../core/enumEx");
const engineValidation_1 = require("./engineValidation");
class Engine {
    constructor(logger, display, fileSystem) {
        this._logger = logger;
        this._display = display;
        this._fileSystem = fileSystem;
    }
    init(packageName, language, outputDirectory) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!engineValidation_1.EngineValidation.checkPackageName(this._display, "packageName", packageName)) {
                return 1;
            }
            if (!engineValidation_1.EngineValidation.checkOneOf(this._display, "language", language, enumEx_1.EnumEx.getNames(uniteLanguage_1.UniteLanguage))) {
                return 1;
            }
            outputDirectory = this._fileSystem.directoryPathFormat(outputDirectory);
            if (!engineValidation_1.EngineValidation.notEmpty(this._display, "outputDirectory", outputDirectory)) {
                return 1;
            }
            this._logger.info("Engine::init", { packageName, language, outputDirectory });
            try {
                this._display.log("Creating Directory: " + outputDirectory);
                yield this._fileSystem.directoryCreate(outputDirectory);
            }
            catch (err) {
                this._logger.exception("Creating Directory", err, { outputDirectory });
                return 1;
            }
            try {
                this._display.log("Writing package.json in: " + outputDirectory);
                const packageJson = new packageConfiguration_1.PackageConfiguration();
                packageJson.name = packageName;
                packageJson.version = "0.0.1";
                yield this._fileSystem.fileWrite(outputDirectory, "package.json", JSON.stringify(packageJson, null, "\t"));
            }
            catch (err) {
                this._logger.exception("Writing package.json", err, { outputDirectory });
                return 1;
            }
            return 0;
        });
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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
