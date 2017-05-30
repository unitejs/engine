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
const uniteConfiguration_1 = require("../configuration/models/unite/uniteConfiguration");
const uniteLanguage_1 = require("../configuration/models/unite/uniteLanguage");
const enumEx_1 = require("../core/enumEx");
const createOutputDirectory_1 = require("../pipelineSteps/createOutputDirectory");
const generateHtmlTemplate_1 = require("../pipelineSteps/generateHtmlTemplate");
const generatePackageJson_1 = require("../pipelineSteps/generatePackageJson");
const generateUniteConfiguration_1 = require("../pipelineSteps/generateUniteConfiguration");
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
            const uniteConfiguration = new uniteConfiguration_1.UniteConfiguration();
            uniteConfiguration.name = packageName;
            uniteConfiguration.language = language;
            uniteConfiguration.outputDirectory = outputDirectory;
            const pipelineSteps = [];
            pipelineSteps.push(new createOutputDirectory_1.CreateOutputDirectory());
            pipelineSteps.push(new generatePackageJson_1.GeneratePackageJson());
            pipelineSteps.push(new generateHtmlTemplate_1.GenerateHtmlTemplate());
            pipelineSteps.push(new generateUniteConfiguration_1.GenerateUniteConfiguration());
            for (const pipelineStep of pipelineSteps) {
                const ret = yield pipelineStep.process(this._logger, this._display, this._fileSystem, uniteConfiguration);
                if (ret !== 0) {
                    return ret;
                }
            }
            return 0;
        });
    }
}
exports.Engine = Engine;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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
